import { describe, expect, test } from "vitest";

import { analyzePayloadSchema } from "./validation";

const validPayload = {
  resumeText: "Frontend developer with React and TypeScript experience.",
  vacancyText: "Looking for a React engineer.",
};

describe("analyzePayloadSchema", () => {
  test("must accept a valid payload", () => {
    const result = analyzePayloadSchema.parse(validPayload);

    expect(result.resumeText).toContain("React");
    expect(result.vacancyText).toContain("React engineer");
  });

  test("must trim resume and vacancy text", () => {
    const result = analyzePayloadSchema.parse({
      resumeText: "   Experienced React developer   ",
      vacancyText: "  Senior frontend role  ",
    });

    expect(result.resumeText).toBe("Experienced React developer");
    expect(result.vacancyText).toBe("Senior frontend role");
  });

  test("must reject resume text shorter than 10 characters", () => {
    const result = analyzePayloadSchema.safeParse({
      ...validPayload,
      resumeText: "too short",
    });

    expect(result.success).toBe(false);
  });

  test("must reject vacancy text shorter than 5 characters", () => {
    const result = analyzePayloadSchema.safeParse({
      ...validPayload,
      vacancyText: "hi",
    });

    expect(result.success).toBe(false);
  });

  test("must reject empty or whitespace-only required fields", () => {
    expect(
      analyzePayloadSchema.safeParse({
        resumeText: "          ",
        vacancyText: validPayload.vacancyText,
      }).success,
    ).toBe(false);

    expect(
      analyzePayloadSchema.safeParse({
        resumeText: validPayload.resumeText,
        vacancyText: "   ",
      }).success,
    ).toBe(false);
  });
});
