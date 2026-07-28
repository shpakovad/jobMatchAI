import { useTranslations } from "next-intl";
import { UploadResumeSection } from "./UploadResumeSection";
import { VacancyInputSection } from "./VacancyInputSection";
import { Button } from "@/src/shared/ui/button";

export const WorkSpacePage = () => {
  const t = useTranslations("WorkSpacePage");

  return (
    <div className="flex w-full flex-col items-center justify-center pb-14 pt-14">
      <p className="pb-10 text-primary">{t("title")}</p>
      <UploadResumeSection />
      <VacancyInputSection />
      <Button>Analyze</Button>
    </div>
  );
};
