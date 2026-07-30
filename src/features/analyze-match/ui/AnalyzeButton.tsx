"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/src/shared/ui/button";
import { useAnalysisStore } from "@/src/entities/analysis";
import { handleAIAnalysis } from "@/src/features/analyze-match";
import { FullScreenLoader } from "@/src/shared/ui/FullScreenLoader";

export const AnalyzeButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const isReady = useAnalysisStore((state) => state.getIsReady());
  const { resumeText, vacancyText, setError } = useAnalysisStore();

  const t = useTranslations("WorkSpacePage");
  const locale = useLocale();

  const handleAnalyze = async () => {
    setIsLoading(true);

    try {
      const result = await handleAIAnalysis({ resumeText, vacancyText, locale });

      if (!result.success) {
        setError(result.error || t("errorAnalyzeMessage"));
        setIsLoading(false);
      }
    } catch (error) {
      const networkErrorMsg = error instanceof Error ? error.message : t("errorAnalyzeMessage");
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
