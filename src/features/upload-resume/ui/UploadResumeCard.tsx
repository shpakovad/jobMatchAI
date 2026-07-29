"use client";

import { ChangeEvent, useState } from "react";
import { CheckCircle2, FileText, Loader2, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { parsePdfToText } from "@/src/features/upload-resume/lib/parsePdf";
import { useAnalysisStore } from "@/src/entities/analysis";

export const UploadResumeCard = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "parsing" | "success" | "error">("idle");

  const t = useTranslations("WorkSpacePage.UploadResumeSection");

  const { setResumeText } = useAnalysisStore();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setStatus("error");
      return;
    }

    setFileName(file.name);
    setStatus("parsing");

    try {
      const text = await parsePdfToText(file);

      if (!text) {
        throw new Error("Error loading PDF text");
      }

      setResumeText(text);
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="mb-14">
      <div>
        <p className="text-center font-mono text-sm text-slate-400">{t("step")}</p>
        <div className="mt-2">
          <label
            htmlFor="resume-file-input"
            className={`hover:border-primary/40 hover:bg-primary/5 flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-white/10 bg-card transition-all ${
              status === "parsing" ? "pointer-events-none opacity-50" : ""
            } flex h-[250px] w-[400px] items-center justify-center`}
          >
            <input
              id="resume-file-input"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
              disabled={status === "parsing"}
            />
            {status === "idle" && (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800">
                  <Upload size={18} color="white" />
                </div>
                <div className="text-center">
                  <p className="pb-2 text-sm font-medium text-slate-50">{t("dragFileLabel")}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t("format")}</p>
                </div>
              </>
            )}

            {status === "parsing" && (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800">
                  <Loader2 className="animate-spin text-blue-500" size={18} />
                </div>
                <p className="pb-2 text-sm font-medium text-slate-50">{t("loadingLabel")}</p>
                <p className="mt-0.5 max-w-xs truncate text-xs text-muted-foreground">{fileName}</p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800">
                  <CheckCircle2 className="text-green-500" size={18} />
                </div>
                <p className="pb-2 text-sm font-medium text-green-500">{t("successLabel")}</p>
                <div className="mt-0.5 flex max-w-xs items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5">
                  <FileText size={14} className="shrink-0 text-slate-50" />
                  <p className="truncate text-xs text-muted-foreground">{fileName}</p>
                </div>
              </>
            )}

            {status === "error" && (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800">
                  <Upload className="text-red-500" size={18} />
                </div>
                <p className="pb-2 text-sm font-medium text-red-500">{t("errorLabel")}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{t("errorAction")}</p>
              </>
            )}
          </label>
        </div>
      </div>
    </div>
  );
};
