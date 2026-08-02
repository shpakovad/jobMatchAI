"use client";

import { useTranslations } from "next-intl";
import { HelpCircle } from "lucide-react";
import { useAnalysisActions, useAnalysisStore } from "@/src/entities/analysis";
import { Textarea } from "@/src/shared/ui";

const MAX_VACANCY_TEXT_LENGTH = 5000;

export const VacancyInputField = () => {
  const t = useTranslations("WorkSpacePage.VacancyInputSection");

  const vacancyText = useAnalysisStore((state) => state.vacancyText);
  const { setVacancyText } = useAnalysisActions();

  return (
    <div className="mb-14">
      <p className="pb-2 text-center font-mono text-sm text-slate-400">{t("step")}</p>
      <Textarea
        className="min-h-[300px] min-w-[500px]"
        placeholder={`${t("textareaPlaceholder")}`}
        value={vacancyText}
        maxLength={MAX_VACANCY_TEXT_LENGTH}
        onChange={(e) => setVacancyText(e.target.value.slice(0, MAX_VACANCY_TEXT_LENGTH))}
      />
      <p className="pt-2 text-right text-xs text-muted-foreground">
        {t("textareaLimitInfo", {
          currentLength: vacancyText.length,
          maxLength: MAX_VACANCY_TEXT_LENGTH,
        })}
      </p>
      <div className="mt-1.5 flex select-none items-center gap-2 text-xs">
        <HelpCircle size={14} className="position-relative bottom-0.5 shrink-0 text-red-300" />
        <p className="leading-normal text-red-300">{t("textareaWarning")}</p>
      </div>
    </div>
  );
};
