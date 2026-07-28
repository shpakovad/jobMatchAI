import { Upload } from "lucide-react";
import { border } from "@/src/shared/styles";
import { useTranslations } from "next-intl";

export const UploadResumeSection = () => {
  const t = useTranslations("WorkSpacePage.UploadResumeSection");
  return (
    <div className={`bg-card ${border} mb-4 min-h-[300px] min-w-[400px] rounded-2xl p-12`}>
      <div className="space-y-4">
        <p className="font-mono text-sm text-slate-400">{t("step")}</p>
        <div>
          <div
            className={`border-2 border-dashed ${border} hover:border-primary/40 hover:bg-primary/5 flex cursor-pointer flex-col items-center gap-3 rounded-xl p-12 transition-all`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800">
              <Upload size={18} />
            </div>
            <div className="text-center">
              <p className="pb-2 text-sm font-medium text-slate-50">{t("dragFileLabel")}</p>
              <p className="mt-0.5 text-xs text-slate-500">{t("format")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
