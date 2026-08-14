"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { Button, ErrorPage } from "@/src/shared/ui";

interface AccessErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const AccessError = ({ error, reset }: AccessErrorProps) => {
  const t = useTranslations("DemoAccessPage");

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

export default AccessError;
