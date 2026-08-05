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
        matchedSkills: analysis.matchedSkills,
        missingSkills: analysis.missingSkills,
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
