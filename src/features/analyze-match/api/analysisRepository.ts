"use server";

import { ValidatedAnalysisResult } from "@/src/entities/analysis/model/validation";
import { db } from "@/src/shared/api/prisma";

interface SaveAnalysisParams {
  id: string;
  analysis: ValidatedAnalysisResult;
  isRussianLang: boolean;
}

export const saveAnonymousAnalysis = async ({
  id,
  analysis,
  isRussianLang,
}: SaveAnalysisParams) => {
  const vacancyName =
    analysis.vacancyName && analysis.vacancyName !== "undefined"
      ? String(analysis.vacancyName)
      : isRussianLang
        ? "Неизвестная вакансия"
        : "Unknown vacancy";

  const matchPercentage = Number(analysis.matchPercentage) || 0;

  const recommendation = String(
    analysis.recommendation || (isRussianLang ? "Рекомендация отсутствует" : "No recommendation"),
  );

  const matchedSkills = Array.isArray(analysis.matchedSkills) ? analysis.matchedSkills : [];
  const missingSkills = Array.isArray(analysis.missingSkills) ? analysis.missingSkills : [];
  const resumeImprovementSuggestions = Array.isArray(analysis.resumeImprovementSuggestions)
    ? analysis.resumeImprovementSuggestions
    : [];
  const suggestedResumeBullets = Array.isArray(analysis.suggestedResumeBullets)
    ? analysis.suggestedResumeBullets
    : [];
  const interviewPreparationQuestions = Array.isArray(analysis.interviewPreparationQuestions)
    ? analysis.interviewPreparationQuestions
    : [];

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
