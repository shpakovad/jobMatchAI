import { beforeEach, describe, expect, test, vi } from "vitest";

const { findUniqueMock, generateMatchAnalysisMock, saveAnonymousAnalysisMock } = vi.hoisted(() => ({
  findUniqueMock: vi.fn(),
  generateMatchAnalysisMock: vi.fn(),
  saveAnonymousAnalysisMock: vi.fn(),
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

import { createAnalysisStream } from "./createAnalysisStream";

const payload = {
  resumeText: "Frontend developer with React and TypeScript experience.",
  vacancyText: "Looking for a React engineer.",
  locale: "en" as const,
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
  });

  test("must save the first analysis as attempt 1", async () => {
    findUniqueMock.mockResolvedValue(null);

    const output = await readStream(createAnalysisStream({ payload, guestSessionId: "session-1" }));

    expect(saveAnonymousAnalysisMock).toHaveBeenCalledWith({
      id: "session-1",
      analysis: analysisResult,
      attemptsCount: 1,
      isRussianLang: false,
    });
    expect(output).toContain("Success");
  });

  test("must increment attemptsCount from the existing session record", async () => {
    findUniqueMock.mockResolvedValue({ attemptsCount: 2 });

    await readStream(createAnalysisStream({ payload, guestSessionId: "session-1" }));

    expect(saveAnonymousAnalysisMock).toHaveBeenCalledWith(
      expect.objectContaining({ attemptsCount: 3 }),
    );
  });

  test("must stream an error without saving when the AI call fails", async () => {
    findUniqueMock.mockResolvedValue({ attemptsCount: 0 });
    generateMatchAnalysisMock.mockRejectedValue(new Error("AI failed"));

    const output = await readStream(createAnalysisStream({ payload, guestSessionId: "session-1" }));

    expect(output).toContain("ERROR:AI failed");
    expect(saveAnonymousAnalysisMock).not.toHaveBeenCalled();
  });
});
