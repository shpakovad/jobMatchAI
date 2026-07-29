"use client";

import { Button } from "@/src/shared/ui/button";
import { useAnalysisStore } from "@/src/entities/analysis";

export const AnalyzeButton = () => {
  const isReady = useAnalysisStore((state) => state.getIsReady());

  return <Button disabled={!isReady}>Analyze</Button>;
};
