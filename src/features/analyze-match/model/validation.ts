import { z } from "zod";

export const analyzePayloadSchema = z.object({
  resumeText: z.string().min(10, { message: "Resume text is too short" }).trim(),

  vacancyText: z.string().min(5, { message: "Vacancy text is too short" }).trim(),

  locale: z.enum(["ru", "en"]).default("ru"),
});

export type AnalyzePayload = z.infer<typeof analyzePayloadSchema>;
