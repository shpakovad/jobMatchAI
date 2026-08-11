"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { useAnalysisActions, useAnalysisStore, useIsAnalysisReady } from "@/src/entities/analysis";
import { handleAIAnalysis } from "@/src/features/analyze-match";
import { useRouter } from "@/src/navigation";
import { Button, FullScreenLoader } from "@/src/shared/ui";

export const AnalyzeButton = () => {
  const [currentStep, setCurrentStep] = useState<string>("");

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
    setCurrentStep(t("currentStepLabel"));

    try {
      const stream = await handleAIAnalysis({ resumeText, vacancyText, locale });

      const reader = stream.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        if (value) {
          const stepMarker = decoder.decode(value);
          if (stepMarker.startsWith("ERROR:")) {
            throw new Error(stepMarker.replace("ERROR:", ""));
          }
          if (stepMarker === "Success" || stepMarker === "Успешно") {
            router.push("/analysis");
            return;
          }
          setCurrentStep(stepMarker);
        }
      }
    } catch (error) {
      const networkErrorMsg = error instanceof Error ? error.message : t("errorAnalyzeMessage");
      setError(networkErrorMsg);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <FullScreenLoader>
          <div className="flex items-end gap-1 font-medium text-blue-400">
            <span className="relative top-[4px]">{currentStep}</span>
            <span className="h-1 w-1 animate-pulse rounded-full bg-blue-400 [animation-delay:0ms] [animation-duration:1.5s]" />
            <span className="h-1 w-1 animate-pulse rounded-full bg-blue-400 [animation-delay:300ms] [animation-duration:1.5s]" />
            <span className="h-1 w-1 animate-pulse rounded-full bg-blue-400 [animation-delay:600ms] [animation-duration:1.5s]" />
          </div>
        </FullScreenLoader>
      )}
      <Button onClick={handleAnalyze} disabled={!isReady}>
        {t("analyzeButtonLabel")}
      </Button>
    </>
  );
};
