import { cookies } from "next/headers";
import { db } from "@/src/shared/api/prisma";
import { ResetAnalysisButton } from "@/src/features/reset-analysis";
import { AnalysisReport } from "@/src/entities/analysis";

const Analysis = async () => {
  const cookieStore = await cookies();
  const guestSessionId = cookieStore.get("guest_session_id")?.value;

  if (!guestSessionId) {
    return <ResetAnalysisButton reason={"noSession"} />;
  }

  const analysisData = await db.anonymousAnalysis.findUnique({
    where: { id: guestSessionId },
  });

  if (!analysisData) {
    return <ResetAnalysisButton reason="noData" />;
  }

  const data = {
    vacancyName: analysisData.vacancyName,
    matchPercentage: analysisData.matchPercentage,
    matchedSkills: (analysisData.matchedSkills as string[]) || [],
    missingSkills: (analysisData.missingSkills as string[]) || [],
    recommendation: analysisData.recommendation,
  };

  return <AnalysisReport data={data} />;
};

export default Analysis;
