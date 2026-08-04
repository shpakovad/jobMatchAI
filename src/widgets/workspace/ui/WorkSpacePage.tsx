"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { useAnalysisStore } from "@/src/entities/analysis";
import { useAnalysisActions } from "@/src/entities/analysis";
import { useResetAnalysisFlow } from "@/src/features/analysis-status-guard";
import { AnalyzeButton } from "@/src/features/analyze-match";
import { UploadResumeCard } from "@/src/features/upload-resume";
import { VacancyInputField } from "@/src/features/vacancy-input-field";
import { Button, ErrorPage } from "@/src/shared/ui";

export const WorkSpacePage = () => {
  const t = useTranslations("WorkSpacePage");
  const error = useAnalysisStore((state) => state.error);
  const { reset } = useAnalysisActions();
  const { resetAnalysisFlow } = useResetAnalysisFlow();

  useEffect(() => {
    return () => reset();
  }, [reset]);

  return error ? (
    <ErrorPage message={error}>
      <Button onClick={resetAnalysisFlow} variant="secondary">
        {t("errorResetActionLabel")}
      </Button>
    </ErrorPage>
  ) : (
    <div className="flex w-full flex-col items-center justify-center pb-14 pt-14">
      <p className="pb-10 text-primary">{t("title")}</p>
      <UploadResumeCard />
      <VacancyInputField />
      <AnalyzeButton />
    </div>
  );
};
