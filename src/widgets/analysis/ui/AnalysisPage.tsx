import { AnalysisReport } from "@/src/entities/analysis";
import { fetchAnalysisById } from "@/src/entities/analysis/api/analysisApi";
import { AnalysisStatusGuard } from "@/src/features/analysis-status-guard";
import { withServerAccess } from "@/src/shared/hoc";

export const AnalysisPage = withServerAccess(async ({ sessionId }: { sessionId: string }) => {
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
