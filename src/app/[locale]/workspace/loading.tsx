import { useTranslations } from "next-intl";

import { FullScreenLoader } from "@/src/shared/ui";

const WorkSpaceLoading = () => {
  const t = useTranslations("WorkSpacePage");
  return (
    <FullScreenLoader>
      <div className="flex items-end gap-1 font-medium text-blue-400">
        <span className="relative top-[4px]">{t("loadingLabel")}</span>
      </div>
    </FullScreenLoader>
  );
};

export default WorkSpaceLoading;
