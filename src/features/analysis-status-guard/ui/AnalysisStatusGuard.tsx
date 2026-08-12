"use client";

import { useTranslations } from "next-intl";
import { ReactNode, useEffect, useRef } from "react";

import { useResetAnalysisFlow } from "@/src/features/analysis-status-guard";
import { Link } from "@/src/navigation";
import { Button, ErrorPage } from "@/src/shared/ui";

interface AnalysisStatusGuardProps {
  isError?: boolean;
  children?: ReactNode;
}

export const AnalysisStatusGuard = ({ isError, children }: AnalysisStatusGuardProps) => {
  const t = useTranslations("AnalysisPage");
  const { resetAnalysisFlow } = useResetAnalysisFlow();
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  if (children && !isError) {
    return (
      <>
        {children}
        <div className="mb-10 flex w-full justify-center">
          <Link href="/workspace">
            <Button onClick={resetAnalysisFlow}>{t("analyzeAnotherVacancyLabel")}</Button>
          </Link>
        </div>
      </>
    );
  }

  const errorMessage = t("noDataFoundMessage");

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
