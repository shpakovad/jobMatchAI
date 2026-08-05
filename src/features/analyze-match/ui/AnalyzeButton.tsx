"use client";

import { useLocale, useTranslations } from "next-intl";

import { useAnalysisActions, useAnalysisStore, useIsAnalysisReady } from "@/src/entities/analysis";
import { activateAnalysisSession } from "@/src/entities/analysis";
import { handleAIAnalysis } from "@/src/features/analyze-match";
import { useRouter } from "@/src/navigation";
import { Button, FullScreenLoader } from "@/src/shared/ui";

export const AnalyzeButton = () => {
  const resumeText = useAnalysisStore((state) => state.resumeText);
  const vacancyText = useAnalysisStore((state) => state.vacancyText);
  const isLoading = useAnalysisStore((state) => state.isLoading);

  const { setError, setIsLoading } = useAnalysisActions();
  const isReady = useIsAnalysisReady();

  const t = useTranslations("WorkSpacePage");
  const locale = useLocale();
  const router = useRouter();

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    activateAnalysisSession();
    try {
      const result = await handleAIAnalysis({ resumeText, vacancyText, locale });

      if (!result.success) {
        setError(result?.error || t("errorAnalyzeMessage"));
        setIsLoading(false);
        return;
      }
      router.push("/analysis");
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
