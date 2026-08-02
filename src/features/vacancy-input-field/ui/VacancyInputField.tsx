"use client";

import { Textarea } from "@/src/shared/ui";
import { useTranslations } from "next-intl";
import { useAnalysisActions, useAnalysisStore } from "@/src/entities/analysis";

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
    </div>
  );
};
