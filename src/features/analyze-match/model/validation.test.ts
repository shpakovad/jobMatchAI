import { describe, expect, test } from "vitest";

import { analyzePayloadSchema } from "./validation";

const validPayload = {
  resumeText: "Frontend developer with React and TypeScript experience.",
  vacancyText: "Looking for a React engineer.",
  locale: "en" as const,
};

describe("analyzePayloadSchema", () => {
  test("must accept a valid payload", () => {
    const result = analyzePayloadSchema.parse(validPayload);

    expect(result.resumeText).toContain("React");
    expect(result.vacancyText).toContain("React engineer");
    expect(result.locale).toBe("en");
  });

  test("must trim resume and vacancy text", () => {
    const result = analyzePayloadSchema.parse({
      resumeText: "   Experienced React developer   ",
      vacancyText: "  Senior frontend role  ",
      locale: "ru",
    });

    expect(result.resumeText).toBe("Experienced React developer");
    expect(result.vacancyText).toBe("Senior frontend role");
  });

  test("must default locale to ru when it is omitted", () => {
    const result = analyzePayloadSchema.parse({
      resumeText: validPayload.resumeText,
      vacancyText: validPayload.vacancyText,
    });

    expect(result.locale).toBe("ru");
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
        locale: "en",
      }).success,
    ).toBe(false);

    expect(
      analyzePayloadSchema.safeParse({
        resumeText: validPayload.resumeText,
        vacancyText: "   ",
        locale: "en",
      }).success,
    ).toBe(false);
  });

  test("must reject an unsupported locale", () => {
    const result = analyzePayloadSchema.safeParse({
      ...validPayload,
      locale: "de",
    });

    expect(result.success).toBe(false);
  });
});
