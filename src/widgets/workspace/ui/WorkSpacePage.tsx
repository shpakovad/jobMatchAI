"use client";

import { useTranslations } from "next-intl";
import { UploadResumeCard } from "@/src/features/upload-resume";
import { VacancyInputField } from "@/src/features/vacancy-input-field";
import { AnalyzeButton } from "@/src/features/analyze-match";
import { useAnalysisStore } from "@/src/entities/analysis";
import { ErrorPage } from "@/src/shared/ui/ErrorPage";
import { Button } from "@/src/shared/ui/button";
import Link from "next/link";
import { useAnalysisActions } from "@/src/entities/analysis";

export const WorkSpacePage = () => {
  const t = useTranslations("WorkSpacePage");
  const error = useAnalysisStore((state) => state.error);
  const { reset } = useAnalysisActions();

  return error ? (
    <ErrorPage message={error}>
      <Link href="/workspace">
        <Button onClick={reset} variant="secondary">
          {t("errorResetActionLabel")}
        </Button>
      </Link>
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
