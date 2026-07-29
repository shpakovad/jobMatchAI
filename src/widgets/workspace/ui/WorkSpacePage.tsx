import { useTranslations } from "next-intl";
import { Button } from "@/src/shared/ui/button";
import { UploadResumeCard } from "@/src/features/upload-resume";
import { VacancyInputField } from "@/src/features/vacancy-input-field";

export const WorkSpacePage = () => {
  const t = useTranslations("WorkSpacePage");

  return (
    <div className="flex w-full flex-col items-center justify-center pb-14 pt-14">
      <p className="pb-10 text-primary">{t("title")}</p>
      <UploadResumeCard />
      <VacancyInputField />
      <Button>Analyze</Button>
    </div>
  );
};
