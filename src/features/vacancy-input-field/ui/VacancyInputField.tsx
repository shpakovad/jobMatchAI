"use client";

import { Textarea } from "@/src/shared/ui/textarea";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const VacancyInputField = () => {
  const t = useTranslations("WorkSpacePage.VacancyInputSection");
  const [text, setText] = useState("");

  return (
    <div className="mb-14">
      <p className="pb-2 text-center font-mono text-sm text-slate-400">{t("step")}</p>
      <Textarea
        className="min-h-[300px] min-w-[500px]"
        placeholder={`${t("textareaPlaceholder")}`}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
};
