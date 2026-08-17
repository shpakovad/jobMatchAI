import { db } from "@/src/shared/api/prisma";

const getReturnedDataArray = (data: Array<string> | unknown) =>
  Array.isArray(data) ? (data as string[]) : [];

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
      matchedSkills: getReturnedDataArray(analysisData.matchedSkills),
      missingSkills: getReturnedDataArray(analysisData.missingSkills),
      recommendation: analysisData.recommendation,
      resumeImprovementSuggestions: getReturnedDataArray(analysisData.resumeImprovementSuggestions),
      suggestedResumeBullets: getReturnedDataArray(analysisData.suggestedResumeBullets),
      interviewPreparationQuestions: getReturnedDataArray(
        analysisData.interviewPreparationQuestions,
      ),
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
