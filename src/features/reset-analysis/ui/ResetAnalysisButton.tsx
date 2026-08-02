"use client";

import { Button, ErrorPage } from "@/src/shared/ui";
import { useTranslations } from "next-intl";
import { useAnalysisActions } from "@/src/entities/analysis";
import { deleteGuestSession } from "@/src/features/reset-analysis/model/actions";
import { useRouter } from "@/src/navigation";

export const ResetAnalysisButton = ({ reason }: { reason: string }) => {
  const t = useTranslations("AnalysisPage");
  const { reset } = useAnalysisActions();

  const router = useRouter();

  const errorMessage = reason === "noData" ? t("noDataFoundMessage") : t("noSessionMessage");

  const resetAnalyze = async () => {
    await deleteGuestSession();
    reset();
    router.push("/workspace");
  };

  return (
    <ErrorPage message={errorMessage}>
      <Button onClick={resetAnalyze} variant="secondary">
        {t("tryAnotherSessionLabel")}
      </Button>
    </ErrorPage>
  );
};
