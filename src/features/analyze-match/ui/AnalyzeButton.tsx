"use client";

import { useLocale, useTranslations } from "next-intl";

import { useAnalysisActions, useAnalysisStore } from "@/src/entities/analysis";
import { activateAnalysisSession } from "@/src/entities/analysis";
import { handleAIAnalysis } from "@/src/features/analyze-match";
import { Button, FullScreenLoader } from "@/src/shared/ui";

export const AnalyzeButton = () => {
  const isReady = useAnalysisStore((state) => state.getIsReady());
  const resumeText = useAnalysisStore((state) => state.resumeText);
  const vacancyText = useAnalysisStore((state) => state.vacancyText);
  const isLoading = useAnalysisStore((state) => state.isLoading);

  const { setError, setIsLoading } = useAnalysisActions();

  const t = useTranslations("WorkSpacePage");
  const locale = useLocale();

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    activateAnalysisSession();
    try {
      const result = await handleAIAnalysis({ resumeText, vacancyText, locale });

      if (result && !result.success) {
        setError(result?.error || t("errorAnalyzeMessage"));
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
    } catch (error) {
      const networkErrorMsg = error instanceof Error ? error.message : t("errorAnalyzeMessage");
      setError(networkErrorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <FullScreenLoader />}
      <Button onClick={handleAnalyze} disabled={!isReady}>
        {t("analyzeButtonLabel")}
      </Button>
    </>
  );
};
