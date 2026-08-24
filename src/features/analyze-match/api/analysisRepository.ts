import "server-only";

import { getTranslations } from "next-intl/server";

import { llmAnalysisResponseSchema, ValidatedAnalysisResult } from "@/src/entities/analysis";
import { db } from "@/src/shared/api/prisma";

interface SaveAnalysisParams {
  id: string;
  analysis: ValidatedAnalysisResult;
  attemptsCount?: number;
}

export const saveAnonymousAnalysis = async ({
  id,
  analysis,
  attemptsCount,
}: SaveAnalysisParams) => {
  const parsedReport = llmAnalysisResponseSchema.parse(analysis);

  const t = await getTranslations("Errors.SaveAnonymousAnalysis");

  const {
    matchPercentage,
    matchedSkills,
    missingSkills,
    resumeImprovementSuggestions,
    suggestedResumeBullets,
    interviewPreparationQuestions,
  } = parsedReport;

  const vacancyName = parsedReport.vacancyName || t("vacancyError");

  const recommendation = parsedReport.recommendation || t("recommendationError");

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
    const errorMessage = t("errorText");
    console.error(errorMessage, prismaError);
    throw prismaError;
  }
};
