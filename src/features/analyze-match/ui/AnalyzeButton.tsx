"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { useAnalysisActions, useAnalysisStore, useIsAnalysisReady } from "@/src/entities/analysis";
import { useRouter } from "@/src/navigation";
import { Button, FullScreenLoader } from "@/src/shared/ui";

export const AnalyzeButton = () => {
  const [currentStep, setCurrentStep] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const resumeText = useAnalysisStore((state) => state.resumeText);
  const vacancyText = useAnalysisStore((state) => state.vacancyText);
  const isLoading = useAnalysisStore((state) => state.isLoading);

  const { setError, setIsLoading } = useAnalysisActions();
  const isReady = useIsAnalysisReady();

  const t = useTranslations("WorkSpacePage");
  const router = useRouter();

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setCurrentStep(t("currentStepLabel"));

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, vacancyText }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || t("errorAnalyzeMessage"));
      }

      if (!response.body) {
        throw new Error(t("errorAnalyzeMessage"));
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let completed = false;

      while (true) {
        if (controller.signal.aborted) {
          await reader.cancel();
          break;
        }

        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const stepMarker of lines) {
          if (!stepMarker) continue;

          if (stepMarker.startsWith("ERROR:")) {
            throw new Error(stepMarker.replace("ERROR:", ""));
          }

          if (stepMarker === "Success" || stepMarker === "Успешно") {
            completed = true;
            router.push("/analysis");
            return;
          }

          setCurrentStep(stepMarker);
        }
      }

      if (!completed) {
        throw new Error(t("errorAnalyzeMessage"));
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      const networkErrorMsg = error instanceof Error ? error.message : t("errorAnalyzeMessage");
      setError(networkErrorMsg);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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
