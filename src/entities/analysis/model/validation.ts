import { z } from "zod";

export const aiAnalysisSchema = z.object({
  vacancyName: z.string().min(1, "Job title cannot be blank"),
  matchPercentage: z.coerce.number().int().min(0).max(100), // Жесткие математические рамки
  matchedSkills: z.array(z.string()).default([]),
  missingSkills: z.array(z.string()).default([]),
  recommendation: z.string().min(1, "Recommendation cannot be empty"),
  resumeImprovementSuggestions: z.array(z.string()).default([]),
  suggestedResumeBullets: z.array(z.string()).default([]),
  interviewPreparationQuestions: z.array(z.string()).default([]),
});

export type ValidatedAnalysisResult = z.infer<typeof aiAnalysisSchema>;

export const llmAnalysisResponseSchema = z
  .object({
    vacancyName: z.unknown().default("Unknown Position"),
    matchPercentage: z.coerce.number().default(0),
    recommendation: z.string().catch("").default("No recommendation provided"),
    matchedSkills: z.array(z.string()).catch([]).default([]),
    missingSkills: z.array(z.string()).catch([]).default([]),
    resumeImprovementSuggestions: z.array(z.string()).catch([]).default([]),
    suggestedResumeBullets: z.array(z.string()).catch([]).default([]),
    interviewPreparationQuestions: z.array(z.string()).catch([]).default([]),
  })

  .transform((raw): ValidatedAnalysisResult => {
    const cleanVacancyName = String(raw.vacancyName).trim();
    const finalVacancyName =
      !cleanVacancyName || cleanVacancyName === "undefined" || cleanVacancyName === "null"
        ? "Unknown Position"
        : cleanVacancyName;

    const finalPercentage = Math.min(100, Math.max(0, Math.floor(raw.matchPercentage)));

    return {
      vacancyName: finalVacancyName,
      matchPercentage: finalPercentage,
      recommendation: raw.recommendation || "No recommendation provided",
      matchedSkills: raw.matchedSkills,
      missingSkills: raw.missingSkills,
      resumeImprovementSuggestions: raw.resumeImprovementSuggestions,
      suggestedResumeBullets: raw.suggestedResumeBullets,
      interviewPreparationQuestions: raw.interviewPreparationQuestions,
    };
  });
