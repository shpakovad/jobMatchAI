"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { UploadResumeCard } from "@/src/features/upload-resume";
import { VacancyInputField } from "@/src/features/vacancy-input-field";
import { AnalyzeButton } from "@/src/features/analyze-match";
import { useAnalysisStore } from "@/src/entities/analysis";
import { ErrorPage, Button } from "@/src/shared/ui";
import { useAnalysisActions } from "@/src/entities/analysis";

export const WorkSpacePage = () => {
  const t = useTranslations("WorkSpacePage");
  const error = useAnalysisStore((state) => state.error);
  const { reset } = useAnalysisActions();

  useEffect(() => {
    return () => reset();
  }, [reset]);

  return error ? (
    <ErrorPage message={error}>
      <Button onClick={reset} variant="secondary">
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
