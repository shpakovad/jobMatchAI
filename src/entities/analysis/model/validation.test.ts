import { describe, expect, test } from "vitest";

import { aiAnalysisSchema } from "./validation";

describe("aiAnalysisSchema - zod validation", () => {
  test("must successfully pass valid and reference JSON from AI", () => {
    const mockValidJson = {
      vacancyName: "Frontend Developer (Next.js)",
      matchPercentage: 85,
      matchedSkills: ["React", "TypeScript", "Tailwind"],
      missingSkills: ["Vitest", "Docker"],
      recommendation: "Excellent candidate, the stack matches 85%.",
      resumeImprovementSuggestions: ["Add Canvas experient"],
      suggestedResumeBullets: [],
      interviewPreparationQuestions: ["What is SSR"],
    };

    const result = aiAnalysisSchema.parse(mockValidJson);

    expect(result.vacancyName).toBe("Frontend Developer (Next.js)");
    expect(result.matchPercentage).toBe(85);
    expect(result.matchedSkills).toContain("React");
  });

  test("must automatically number the string to a type of number", () => {
    const mockJsonWithParsedString = {
      vacancyName: "React Engineer",
      matchPercentage: "75",
      matchedSkills: [],
      missingSkills: [],
      recommendation: "it's ok",
      resumeImprovementSuggestions: [],
      suggestedResumeBullets: [],
      interviewPreparationQuestions: [],
    };

    const result = aiAnalysisSchema.parse(mockJsonWithParsedString);

    expect(result.matchPercentage).toBe(75);
    expect(typeof result.matchPercentage).toBe("number");
  });

  test("must plot empty defaults if the AI forgot to generate them", () => {
    const mockJsonWithoutArrays = {
      vacancyName: "Node.js Developer",
      matchPercentage: 90,
      recommendation: "Recommend.",
    };

    const result = aiAnalysisSchema.parse(mockJsonWithoutArrays);

    expect(Array.isArray(result.matchedSkills)).toBe(true);
    expect(result.matchedSkills).toEqual([]);
    expect(result.missingSkills).toEqual([]);
  });

  test("must drop validation error if required text fields are blank", () => {
    const brokenJson = {
      vacancyName: "",
      matchPercentage: 50,
      matchedSkills: [],
      missingSkills: [],
      recommendation: "",
      resumeImprovementSuggestions: [],
      suggestedResumeBullets: [],
      interviewPreparationQuestions: [],
    };
    expect(() => aiAnalysisSchema.parse(brokenJson)).toThrow();
  });
});
