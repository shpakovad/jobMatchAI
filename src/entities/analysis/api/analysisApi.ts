import { aiAnalysisSchema } from "@/src/entities/analysis";
import { db } from "@/src/shared/api/prisma";

export const fetchAnalysisById = async (id: string | undefined) => {
  if (!id) return null;

  try {
    const analysisData = await db.anonymousAnalysis.findUnique({
      where: { id },
    });

    if (!analysisData) return null;

    return aiAnalysisSchema.parse(analysisData);
  } catch (error) {
    console.error(error);
    return null;
  }
};
