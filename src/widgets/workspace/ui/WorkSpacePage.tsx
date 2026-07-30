"use client";

import { useTranslations } from "next-intl";
import { UploadResumeCard } from "@/src/features/upload-resume";
import { VacancyInputField } from "@/src/features/vacancy-input-field";
import { AnalyzeButton } from "@/src/features/analyze-match";
import { useAnalysisStore } from "@/src/entities/analysis";
import { ErrorPage } from "@/src/shared/ui/ErrorPage";

export const WorkSpacePage = () => {
  const t = useTranslations("WorkSpacePage");
  const { error, setError, setResumeText, setVacancyText } = useAnalysisStore();

  const resetError = () => {
    setError(null);
    setResumeText("");
    setVacancyText("");
  };

  return error ? (
    <ErrorPage message={error} resetError={resetError} />
  ) : (
    <div className="flex w-full flex-col items-center justify-center pb-14 pt-14">
      <p className="pb-10 text-primary">{t("title")}</p>
      <UploadResumeCard />
      <VacancyInputField />
      <AnalyzeButton />
    </div>
  );
};
