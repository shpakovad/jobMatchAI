import { AnalysisReport } from "@/src/entities/analysis";
import { fetchAnalysisById } from "@/src/entities/analysis/api/analysisApi";
import { WithServerAccessType } from "@/src/entities/session-guard";
import { withServerAccess } from "@/src/entities/session-guard/server";
import { AnalysisStatusGuard } from "@/src/features/analysis-status-guard";

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
