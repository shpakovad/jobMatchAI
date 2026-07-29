"use client";

import { Button } from "@/src/shared/ui/button";
import { useAnalysisStore } from "@/src/entities/analysis";
import { useTranslations } from "next-intl";

export const AnalyzeButton = () => {
  const isReady = useAnalysisStore((state) => state.getIsReady());
  const t = useTranslations("WorkSpacePage");

  return <Button disabled={!isReady}>{t("analyzeButtonLabel")}</Button>;
};
