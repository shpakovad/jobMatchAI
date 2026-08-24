import { beforeEach, describe, expect, test, vi } from "vitest";

const {
  findUniqueMock,
  generateMatchAnalysisMock,
  saveAnonymousAnalysisMock,
  incrementIpLimitMock,
} = vi.hoisted(() => ({
  findUniqueMock: vi.fn(),
  generateMatchAnalysisMock: vi.fn(),
  saveAnonymousAnalysisMock: vi.fn(),
  incrementIpLimitMock: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockImplementation(async () => {
    return (key: string) => {
      if (key === "targetLanguageInstruction") return "ru";
      return key;
    };
  }),
}));

vi.mock("@/src/shared/api/prisma", () => ({
  db: {
    anonymousAnalysis: {
      findUnique: findUniqueMock,
    },
  },
}));

vi.mock("../api/geminiService", () => ({
  generateMatchAnalysis: generateMatchAnalysisMock,
}));

vi.mock("../api/analysisRepository", () => ({
  saveAnonymousAnalysis: saveAnonymousAnalysisMock,
}));

vi.mock("../model/quotaService", () => ({
  releaseAttempt: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/src/shared/lib/ratelimit/server", () => ({
  incrementIpLimit: incrementIpLimitMock,
}));

import { createAnalysisStream } from "./createAnalysisStream";

const readStream = async (stream: ReadableStream<Uint8Array>) => {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }
  return result;
};

const payload = {
  resumeText: "Frontend developer with React and TypeScript experience.",
  vacancyText: "Looking for a React engineer.",
};

const analysisResult = {
  vacancyName: "Frontend Developer",
  matchPercentage: 80,
  matchedSkills: ["React"],
  missingSkills: ["Docker"],
  recommendation: "Good match.",
  resumeImprovementSuggestions: [],
  suggestedResumeBullets: [],
  interviewPreparationQuestions: [],
};

describe("createAnalysisStream attempt tracking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    generateMatchAnalysisMock.mockResolvedValue(analysisResult);
    saveAnonymousAnalysisMock.mockResolvedValue(undefined);
    incrementIpLimitMock.mockResolvedValue(undefined);
  });

  test("must save the first analysis as attempt 1", async () => {
    findUniqueMock.mockResolvedValue(null);
    generateMatchAnalysisMock.mockResolvedValue(analysisResult);

    const testSignal = new AbortController().signal;

    const output = await readStream(
      await createAnalysisStream({
        payload,
        guestSessionId: "session-1",
        ip: "127.0.0.1",
        locale: "ru",
        signal: testSignal,
      }),
    );

    expect(saveAnonymousAnalysisMock).toHaveBeenCalledWith({
      id: "session-1",
      analysis: analysisResult,
    });

    expect(generateMatchAnalysisMock).toHaveBeenCalledWith(payload, "ru", expect.any(AbortSignal));
    expect(output).toContain("step4");
  });
});
