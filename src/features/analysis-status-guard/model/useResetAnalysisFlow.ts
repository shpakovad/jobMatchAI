import { useAnalysisActions } from "@/src/entities/analysis";
import { deleteGuestSession } from "@/src/features/analysis-status-guard";

export const useResetAnalysisFlow = () => {
  const { reset } = useAnalysisActions();

  const resetAnalysisFlow = async () => {
    await deleteGuestSession();
    reset();
  };

  return { resetAnalysisFlow };
};
