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
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}));

vi.mock("@/src/shared/api/prisma", () => ({
  db: {
    anonymousAnalysis: {
      findUnique: findUniqueMock,
    },
  },
}));

vi.mock("@/src/features/analyze-match/server", () => ({
  generateMatchAnalysis: generateMatchAnalysisMock,
  saveAnonymousAnalysis: saveAnonymousAnalysisMock,
}));

vi.mock("@/src/shared/lib/ratelimit/server", () => ({
  incrementIpLimit: incrementIpLimitMock,
}));

import { createAnalysisStream } from "./createAnalysisStream";

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

    expect(output).toContain("step4");
    expect(incrementIpLimitMock).toHaveBeenCalledWith("127.0.0.1");
  });
});
