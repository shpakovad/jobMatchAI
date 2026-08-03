export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { db } from "@/src/shared/api/prisma";
import { AnalysisStatusGuard } from "@/src/features/analysis-status-guard";
import { AnalysisReport } from "@/src/entities/analysis";

export const AnalysisPage = async () => {
  const cookieStore = await cookies();
  const guestSessionId = cookieStore.get("guest_session_id")?.value;

  if (!guestSessionId) {
    return <AnalysisStatusGuard errorReason={"noSession"} isError />;
  }
  console.log("Analysis");
  const analysisData = await db.anonymousAnalysis.findUnique({
    where: { id: guestSessionId },
  });

  if (!analysisData) {
    return <AnalysisStatusGuard errorReason="noData" isError />;
  }

  const data = {
    vacancyName: analysisData.vacancyName,
    matchPercentage: analysisData.matchPercentage,
    matchedSkills: (analysisData.matchedSkills as string[]) || [],
    missingSkills: (analysisData.missingSkills as string[]) || [],
    recommendation: analysisData.recommendation,
  };

  return (
    <>
      <AnalysisReport data={data} />
      <AnalysisStatusGuard />
    </>
  );
};
