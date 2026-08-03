"use client";

import { Button, ErrorPage } from "@/src/shared/ui";
import { useTranslations } from "next-intl";
import { useAnalysisActions } from "@/src/entities/analysis";
import { Link } from "@/src/navigation";

interface ResetAnalysisButtonProps {
  errorReason?: string;
  isError?: boolean;
}

export const ResetAnalysisButton = ({ errorReason, isError }: ResetAnalysisButtonProps) => {
  const t = useTranslations("AnalysisPage");
  const { reset } = useAnalysisActions();

  const resetAnalyze = () => {
    reset();
  };

  if (!isError) {
    return (
      <div className="mb-10 flex w-full justify-center">
        <Link href="/workspace">
          <Button onClick={resetAnalyze}>{t("analyzeAnotherVacancyLabel")}</Button>
        </Link>
      </div>
    );
  }

  const errorMessage = errorReason === "noData" ? t("noDataFoundMessage") : t("noSessionMessage");

  return (
    <ErrorPage message={errorMessage}>
      <Link href="/workspace">
        <Button onClick={resetAnalyze} variant="secondary">
          {t("tryAnotherSessionLabel")}
        </Button>
      </Link>
    </ErrorPage>
  );
};
