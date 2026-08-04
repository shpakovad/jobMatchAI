"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button, FullScreenLoader } from "@/src/shared/ui";
import { useAnalysisActions, useAnalysisStore } from "@/src/entities/analysis";
import { handleAIAnalysis } from "@/src/features/analyze-match";
import { activateAnalysisSession } from "@/src/features/analysis-status-guard/model/session";

export const AnalyzeButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const isReady = useAnalysisStore((state) => state.getIsReady());
  const resumeText = useAnalysisStore((state) => state.resumeText);
  const vacancyText = useAnalysisStore((state) => state.vacancyText);
  const { setError } = useAnalysisActions();

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
      if (networkErrorMsg === "NEXT_REDIRECT") {
        return;
      }
      setError(networkErrorMsg);
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
