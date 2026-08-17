import { Zap } from "lucide-react";
import { useTranslations } from "next-intl";

import { divider } from "@/src/shared/styles";

export const MainSection = () => {
  const t = useTranslations("LandingPage.MainSection");
  return (
    <div
      className={`flex w-full flex-col items-center justify-center pb-10 pt-10 sm:pb-20 sm:pt-20 ${divider}`}
    >
      <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-b border-blue-400/20 bg-blue-400/10 px-3 py-1 font-mono text-xs text-blue-400">
        <Zap color="oklch(70.7% 0.165 254.624)" size={14} />
        <span>{t("badge")}</span>
      </div>
      <h1 className="mb-4 text-2xl font-bold leading-tight tracking-tight text-primary sm:text-4xl md:text-5xl">
        JobMatch AI
      </h1>
      <p className="text-center text-base font-semibold leading-relaxed text-muted-foreground sm:text-xl">
        {t("title")}
      </p>
    </div>
  );
};
