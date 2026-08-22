import { z } from "zod";

export const analyzePayloadSchema = z.object({
  resumeText: z.string().trim().min(10, { message: "Resume text is too short" }),

  vacancyText: z.string().trim().min(5, { message: "Vacancy text is too short" }),
  locale: z.string().default("ru"),
});

export const aiAnalysisReportSchema = z.object({
  vacancyName: z
    .unknown()
    .transform((val) => {
      const str = String(val).trim();
      if (!str || str === "undefined" || str === "null") return "";
      return str;
    })
    .default(""),

  matchPercentage: z.coerce.number().default(0),

  recommendation: z.string().catch("").default(""),

  matchedSkills: z.array(z.string()).catch([]).default([]),
  missingSkills: z.array(z.string()).catch([]).default([]),

  resumeImprovementSuggestions: z.array(z.string()).catch([]).default([]),
  suggestedResumeBullets: z.array(z.string()).catch([]).default([]),
  interviewPreparationQuestions: z.array(z.string()).catch([]).default([]),
});

export type AIAnalysisReport = z.infer<typeof aiAnalysisReportSchema>;

export type AnalyzePayload = z.infer<typeof analyzePayloadSchema>;
