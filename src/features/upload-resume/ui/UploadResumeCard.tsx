"use client";

import { CheckCircle2, FileText, Loader2, Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";

import { useAnalysisActions, useAnalysisStore } from "@/src/entities/analysis";
import { parsePdfToText } from "@/src/features/upload-resume/lib/parsePdf";
import { Button, Field, FieldLabel, Input, Textarea } from "@/src/shared/ui";

const MAX_RESUME_FILE_SIZE_BYTES = 4 * 1024 * 1024;

export const UploadResumeCard = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "parsing" | "success" | "error">("idle");
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const t = useTranslations("WorkSpacePage.UploadResumeSection");

  const resumeText = useAnalysisStore((state) => state.resumeText);
  const { setResumeText } = useAnalysisActions();

  const processFile = async (file: File) => {
    // 🌟 ПЕРВЫМ ДЕЛОМ: Если прошлый файл еще парсится — намертво отменяем его! [📡]
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (file.type !== "application/pdf") {
      setStatus("error");
      return;
    }

    if (file.size > MAX_RESUME_FILE_SIZE_BYTES) {
      setStatus("error");
      return;
    }

    // Создаем свежий контроллер отмены для текущего файла [📡]
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setFileName(file.name);
    setResumeText("");
    setStatus("parsing");

    try {
      // Передаем signal вторым аргументом в наш обновленный парсер [📡]
      const text = await parsePdfToText(file, controller.signal);

      // Двойная проверка безопасности: если компонент передумал, не пишем стейт [📡]
      if (controller.signal.aborted) return;

      if (!text) throw new Error("Error loading PDF text");

      setResumeText(text);
      setStatus("success");
    } catch (error) {
      // Если это была запланированная отмена — молча выходим, не пугая юзера ошибками [📡]
      if (error instanceof Error && error?.name === "AbortError") {
        return;
      }
      console.error(error);
      setResumeText("");
      setStatus("error");
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleResetFile = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Гасим фоновый парсинг, если он еще шел! [📡]
    }
    setFileName("");
    setResumeText("");
    setStatus("idle");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleResumeTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length === 0) {
      handleResetFile();
    }
    setResumeText(text);
  };

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  return (
    <div className="mb-14">
      <div>
        <p className="text-center text-sm text-slate-400">{t("step")}</p>

        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`mt-2 text-center transition-all duration-200 ${
            isDragActive
              ? "scale-[1.01] border-blue-500 bg-blue-500/5"
              : "border-white/10 bg-slate-900/40"
          }`}
        >
          <Field
            className={`hover:border-primary/40 hover:bg-primary/5 flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-white/10 bg-card transition-all hover:cursor-pointer ${
              status === "parsing" ? "pointer-events-none opacity-50" : ""
            } flex h-[150px] items-center justify-center sm:h-[250px] sm:w-[400px]`}
          >
            <div className="flex w-full items-end justify-end">
              <Button
                variant="secondary"
                onClick={handleResetFile}
                disabled={status === "idle" || status === "parsing"}
              >
                <X />
              </Button>
            </div>
            <FieldLabel htmlFor="resume-file-input" className="max-w-auto absolute flex flex-col">
              {status === "idle" && (
                <>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800">
                    <Upload size={18} color="white" />
                  </div>
                  <div className="text-center">
                    <p className="w-[200px] pb-2 text-xs font-medium text-slate-50 sm:w-auto sm:text-sm">
                      {t("dragFileLabel")}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{t("format")}</p>
                  </div>
                </>
              )}

              {status === "parsing" && (
                <>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800">
                    <Loader2 className="animate-spin text-blue-500" size={18} />
                  </div>
                  <p className="pb-2 text-xs font-medium text-slate-50 sm:text-sm">
                    {t("loadingLabel")}
                  </p>
                  <p className="mt-0.5 max-w-xs truncate text-xs text-muted-foreground">
                    {fileName}
                  </p>
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
                  <p className="pb-2 text-xs font-medium text-red-500 sm:text-sm">
                    {t("errorLabel")}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t("errorAction")}</p>
                </>
              )}
            </FieldLabel>
            <Input
              id="resume-file-input"
              type="file"
              accept=".pdf"
              className="z-10 h-[100%] border-0 text-transparent file:text-card hover:cursor-pointer"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={status === "parsing"}
            />
          </Field>
        </div>
      </div>
      <div className="mt-4 max-w-full sm:w-[400px]">
        <Textarea
          className="min-h-[260px]"
          aria-label={t("resumeTextAriaLabel")}
          placeholder={t("resumeTextPlaceholder")}
          value={resumeText}
          onChange={handleResumeTextChange}
        />
      </div>
    </div>
  );
};
