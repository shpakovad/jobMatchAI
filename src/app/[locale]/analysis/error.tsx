"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { Button, ErrorPage } from "@/src/shared/ui";

interface AnalysisErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const AnalysisError = ({ error, reset }: AnalysisErrorProps) => {
  const t = useTranslations("AnalysisPage");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorPage message={t("errorOccurredMessage")}>
      <Button onClick={() => reset()} variant="secondary">
        {t("tryAgainLabel")}
      </Button>
    </ErrorPage>
  );
};

export default AnalysisError;
