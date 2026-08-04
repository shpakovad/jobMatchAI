"use server";

import { IAnalyzeResponse } from "@/src/entities/analysis";
import { db } from "@/src/shared/api/prisma";

interface SaveAnalysisParams {
  id: string;
  analysis: IAnalyzeResponse;
  isRussianLang: boolean;
}

export const saveAnonymousAnalysis = async ({
  id,
  analysis,
  isRussianLang,
}: SaveAnalysisParams) => {
  try {
    await db.anonymousAnalysis.create({
      data: {
        id,
        vacancyName:
          analysis.vacancyName && analysis.vacancyName !== "undefined"
            ? String(analysis.vacancyName)
            : isRussianLang
              ? "Неизвестная вакансия"
              : "Unknown vacancy",
        matchPercentage: Number(analysis.matchPercentage) || 0,
        matchedSkills: Array.isArray(analysis.matchedSkills) ? analysis.matchedSkills : [],
        missingSkills: Array.isArray(analysis.missingSkills) ? analysis.missingSkills : [],
        recommendation: String(
          analysis.recommendation ||
            (isRussianLang ? "Рекомендация отсутствует" : "No recommendation"),
        ),
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
