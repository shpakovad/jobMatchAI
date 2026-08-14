import { AnalysisReport } from "@/src/entities/analysis";
import { fetchAnalysisById } from "@/src/entities/analysis/api/analysisApi";
import { withServerAccess } from "@/src/entities/session-guard/server";
import { AnalysisStatusGuard } from "@/src/features/analysis-status-guard";

export const AnalysisPage = withServerAccess(async ({ sessionId }: { sessionId?: string }) => {
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
