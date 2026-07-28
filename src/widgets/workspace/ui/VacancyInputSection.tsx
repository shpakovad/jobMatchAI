import { Textarea } from "@/src/shared/ui/textarea";
import { useTranslations } from "next-intl";

export const VacancyInputSection = () => {
  const t = useTranslations("WorkSpacePage.VacancyInputSection");
  return (
    <div className="mb-14">
      <p className="pb-2 text-center font-mono text-sm text-slate-400">{t("step")}</p>
      <Textarea
        className="min-h-[300px] min-w-[500px]"
        placeholder={`${t("textareaPlaceholder")}`}
      />
    </div>
  );
};
