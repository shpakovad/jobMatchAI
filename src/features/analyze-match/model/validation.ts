import { z } from "zod";

export const analyzePayloadSchema = z.object({
  resumeText: z
    .string()
    .trim()
    .min(10, { message: "Resume text is too short" })
    .max(20000, { message: "Resume text exceeds maximum allowed length" }),

  vacancyText: z
    .string()
    .trim()
    .min(5, { message: "Vacancy text is too short" })
    .max(20000, { message: "Vacancy text exceeds maximum allowed length" }),
});

export type AnalyzePayload = z.infer<typeof analyzePayloadSchema>;
