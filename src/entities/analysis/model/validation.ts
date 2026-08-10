import { z } from "zod";

export const aiAnalysisSchema = z.object({
  vacancyName: z.string().min(1, "Job title cannot be blank"),
  matchPercentage: z.preprocess((val) => Number(val), z.number().min(0).max(100)),
  matchedSkills: z.array(z.string()).default([]),
  missingSkills: z.array(z.string()).default([]),
  recommendation: z.string().min(1, "Recommendation cannot be empty"),
  resumeImprovementSuggestions: z.array(z.string()).default([]),
  suggestedResumeBullets: z.array(z.string()).default([]),
  interviewPreparationQuestions: z.array(z.string()).default([]),
});

export type ValidatedAnalysisResult = z.infer<typeof aiAnalysisSchema>;
