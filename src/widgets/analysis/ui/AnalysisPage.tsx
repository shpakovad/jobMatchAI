import { cookies } from "next/headers";

import { AnalysisReport } from "@/src/entities/analysis";
import { fetchAnalysisById } from "@/src/entities/analysis/api/analysisApi";
import { AnalysisStatusGuard } from "@/src/features/analysis-status-guard";

export const AnalysisPage = async () => {
  const cookieStore = await cookies();
  const guestSessionId = cookieStore.get("guest_session_id")?.value;

  if (!guestSessionId) {
    return <AnalysisStatusGuard errorReason={"noSession"} isError />;
  }

  const analysisData = await fetchAnalysisById(guestSessionId);

  if (!analysisData) {
    return <AnalysisStatusGuard errorReason="noData" isError />;
  }

  return (
    <AnalysisStatusGuard>
      <AnalysisReport data={analysisData} />
    </AnalysisStatusGuard>
  );
};
