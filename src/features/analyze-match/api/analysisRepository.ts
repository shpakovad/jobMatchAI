"use server";

import { ValidatedAnalysisResult } from "@/src/entities/analysis";
import { aiAnalysisReportSchema } from "@/src/features/analyze-match";
import { db } from "@/src/shared/api/prisma";

interface SaveAnalysisParams {
  id: string;
  analysis: ValidatedAnalysisResult;
  attemptsCount: number;
  isRussianLang: boolean;
}

export const saveAnonymousAnalysis = async ({
  id,
  analysis,
  attemptsCount,
  isRussianLang,
}: SaveAnalysisParams) => {
  const parsedReport = aiAnalysisReportSchema.parse(analysis);

  const {
    matchPercentage,
    matchedSkills,
    missingSkills,
    resumeImprovementSuggestions,
    suggestedResumeBullets,
    interviewPreparationQuestions,
  } = parsedReport;

  const vacancyName =
    parsedReport.vacancyName || (isRussianLang ? "Неизвестная вакансия" : "Unknown vacancy");

  const recommendation =
    parsedReport.recommendation ||
    (isRussianLang ? "Рекомендация отсутствует" : "No recommendation");

  try {
    await db.anonymousAnalysis.upsert({
      where: { id },

      update: {
        vacancyName,
        matchPercentage,
        matchedSkills,
        missingSkills,
        recommendation,
        resumeImprovementSuggestions,
        suggestedResumeBullets,
        interviewPreparationQuestions,
        attemptsCount,
      },

      create: {
        id,
        vacancyName,
        matchPercentage,
        matchedSkills,
        missingSkills,
        recommendation,
        resumeImprovementSuggestions,
        suggestedResumeBullets,
        interviewPreparationQuestions,
        attemptsCount,
      },
    });
  } catch (prismaError) {
    const errorMessage = isRussianLang
      ? "Критическая ошибка внутри PRISMA:"
      : "Critical PRISMA error:";
    console.error(errorMessage, prismaError);
    throw prismaError;
  }
};
