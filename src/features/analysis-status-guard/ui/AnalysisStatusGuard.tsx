"use client";

import { Button, ErrorPage } from "@/src/shared/ui";
import { useTranslations } from "next-intl";
import { Link } from "@/src/navigation";
import { useResetAnalysisFlow } from "../model/useResetAnalysisFlow";

interface AnalysisStatusGuardProps {
  errorReason?: string;
  isError?: boolean;
}

export const AnalysisStatusGuard = ({ errorReason, isError }: AnalysisStatusGuardProps) => {
  const t = useTranslations("AnalysisPage");
  const { resetAnalysisFlow } = useResetAnalysisFlow();

  if (!isError) {
    return (
      <div className="mb-10 flex w-full justify-center">
        <Link href="/workspace">
          <Button onClick={resetAnalysisFlow}>{t("analyzeAnotherVacancyLabel")}</Button>
        </Link>
      </div>
    );
  }

  const errorMessage = errorReason === "noData" ? t("noDataFoundMessage") : t("noSessionMessage");

  return (
    <ErrorPage message={errorMessage}>
      <Link href="/workspace">
        <Button onClick={resetAnalysisFlow} variant="secondary">
          {t("tryAnotherSessionLabel")}
        </Button>
      </Link>
    </ErrorPage>
  );
};
