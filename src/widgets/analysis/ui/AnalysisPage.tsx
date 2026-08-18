import { AnalysisReport } from "@/src/entities/analysis";
import { fetchAnalysisById } from "@/src/entities/analysis/api/analysisApi";
import { AnalysisStatusGuard } from "@/src/features/analysis-status-guard";
import { WithServerAccessType } from "@/src/features/session-guard";
import { withServerAccess } from "@/src/features/session-guard/server";

export const AnalysisPage = withServerAccess(async ({ sessionId }: WithServerAccessType) => {
  const analysisData = await fetchAnalysisById(sessionId);

  if (!analysisData) {
    return <AnalysisStatusGuard isError />;
  }

  return (
    <AnalysisStatusGuard>
      <AnalysisReport data={analysisData} />
    </AnalysisStatusGuard>
  );
});
