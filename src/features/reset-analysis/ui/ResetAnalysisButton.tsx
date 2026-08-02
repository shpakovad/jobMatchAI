"use client";

import { Button, ErrorPage } from "@/src/shared/ui";
import { useTranslations } from "next-intl";
import { useAnalysisActions } from "@/src/entities/analysis";
import { deleteGuestSession } from "@/src/features/reset-analysis/model/actions";
import { Link } from "@/src/navigation";

export const ResetAnalysisButton = ({ reason }: { reason: string }) => {
  const t = useTranslations("AnalysisPage");
  const { reset } = useAnalysisActions();

  const errorMessage = reason === "noData" ? t("noDataFoundMessage") : t("noSessionMessage");

  const resetAnalyze = async () => {
    await deleteGuestSession();
    reset();
  };

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
