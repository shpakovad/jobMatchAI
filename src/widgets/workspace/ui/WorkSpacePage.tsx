import { UploadResumeSection } from "./UploadResumeSection";
import { VacancyInputSection } from "./VacancyInputSection";
import { useTranslations } from "next-intl";

export const WorkSpacePage = () => {
  const t = useTranslations("WorkSpacePage");

  return (
    <div className="flex w-full flex-col items-center justify-center pt-14">
      <p className="pb-10 text-slate-100">{t("title")}</p>
      <UploadResumeSection />
      <VacancyInputSection />
    </div>
  );
};
