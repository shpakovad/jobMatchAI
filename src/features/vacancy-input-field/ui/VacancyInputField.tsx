"use client";

import { AlertTriangle, Info, LockKeyhole } from "lucide-react";
import { useTranslations } from "next-intl";

import { useAnalysisActions, useAnalysisStore } from "@/src/entities/analysis";
import { Textarea } from "@/src/shared/ui";

const MAX_VACANCY_TEXT_LENGTH = 5000;

export const VacancyInputField = () => {
  const t = useTranslations("WorkSpacePage.VacancyInputSection");

  const vacancyText = useAnalysisStore((state) => state.vacancyText);
  const { setVacancyText } = useAnalysisActions();

  return (
    <div className="mb-14">
      <p className="pb-2 text-center text-sm text-slate-400">{t("step")}</p>
      <Textarea
        className="min-h-[300px] min-w-96"
        placeholder={`${t("textareaPlaceholder")}`}
        value={vacancyText}
        maxLength={MAX_VACANCY_TEXT_LENGTH}
        onChange={(e) => setVacancyText(e.target.value.slice(0, MAX_VACANCY_TEXT_LENGTH))}
      />
      <p className="pb-3 pt-2 text-right text-xs text-muted-foreground">
        {t("textareaLimitInfo", {
          currentLength: vacancyText.length,
          maxLength: MAX_VACANCY_TEXT_LENGTH,
        })}
      </p>
      <div className="flex items-start gap-3 text-xs text-slate-400/90">
        <LockKeyhole size={15} className="mt-0.5 shrink-0 text-slate-500" />
        <p className="leading-relaxed">{t("privacyDisclaimer")}</p>
      </div>
      <div className="flex items-start gap-3 text-xs text-slate-400/90">
        <Info size={15} className="mt-0.5 shrink-0 text-slate-500" />
        <p className="leading-relaxed">{t("textareaWarning")}</p>
      </div>
      <div className="flex items-start gap-3 text-xs text-amber-400/90">
        <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-500/70" />
        <p className="font-medium leading-relaxed">{t("regionWarning")}</p>
      </div>
    </div>
  );
};
