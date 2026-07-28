import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { border } from "@/src/shared/styles";

export const UploadResumeSection = () => {
  const t = useTranslations("WorkSpacePage.UploadResumeSection");
  return (
    <div className="mb-14">
      <div>
        <p className="font-mono text-sm text-slate-400">{t("step")}</p>
        <div className="mt-2">
          <div
            className={`border-2 border-dashed bg-card ${border} hover:border-primary/40 hover:bg-primary/5 flex cursor-pointer flex-col items-center gap-3 rounded-xl p-12 transition-all`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800">
              <Upload size={18} color="white" />
            </div>
            <div className="text-center">
              <p className="pb-2 text-sm font-medium text-slate-50">{t("dragFileLabel")}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{t("format")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
