"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { Button, ErrorPage } from "@/src/shared/ui";

interface WorkSpaceErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const WorkSpaceError = ({ error, reset }: WorkSpaceErrorProps) => {
  const t = useTranslations("WorkSpacePage");

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

export default WorkSpaceError;
