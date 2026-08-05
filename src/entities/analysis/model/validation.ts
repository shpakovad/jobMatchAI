import { z } from "zod";

export const aiAnalysisSchema = z.object({
  vacancyName: z.string().min(1, "Название вакансии не может быть пустым"),
  matchPercentage: z.preprocess((val) => Number(val), z.number().min(0).max(100)),
  matchedSkills: z.array(z.string()).default([]),
  missingSkills: z.array(z.string()).default([]),
  recommendation: z.string().min(1, "Рекомендация не может быть пустой"),
});

export type ValidatedAnalysisResult = z.infer<typeof aiAnalysisSchema>;
