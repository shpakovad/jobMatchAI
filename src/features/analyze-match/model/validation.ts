import { z } from "zod";

export const analyzePayloadSchema = z.object({
  resumeText: z.string().trim().min(10, { message: "Resume text is too short" }),

  vacancyText: z.string().trim().min(5, { message: "Vacancy text is too short" }),
});

export type AnalyzePayload = z.infer<typeof analyzePayloadSchema>;
