import { db } from "@/src/shared/api/prisma";

export const fetchAnalysisById = async (id: string | undefined) => {
  if (!id) return null;

  try {
    const analysisData = await db.anonymousAnalysis.findUnique({
      where: { id },
    });

    if (!analysisData) return null;

    return {
      vacancyName: analysisData.vacancyName,
      matchPercentage: analysisData.matchPercentage,
      matchedSkills: (analysisData.matchedSkills as string[]) || [],
      missingSkills: (analysisData.missingSkills as string[]) || [],
      recommendation: analysisData.recommendation,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
