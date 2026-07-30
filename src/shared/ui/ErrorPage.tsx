import Link from "next/link";
import { useTranslations } from "next-intl";
import { ErrorIcon } from "@/src/shared/icons/ErrorIcon";
import { ReactNode } from "react";

interface ErrorPageProps {
  message: string;
  children: ReactNode;
}

export const ErrorPage = ({ message, children }: ErrorPageProps) => {
  const t = useTranslations("ErrorPage");
  return (
    <div className="absolute flex h-full w-full flex-col items-center justify-center bg-background p-4">
      <div className="flex max-w-md flex-col items-center rounded-2xl border border-red-500/20 bg-slate-900/50 p-8 text-center shadow-xl shadow-red-500/5">
        <div className="mb-4 flex h-16 w-16 items-center justify-center">
          <ErrorIcon />
        </div>
        <h2 className="mb-2 text-xl font-bold text-slate-100">{t("title")}</h2>
        <p className="mb-6 text-sm leading-relaxed text-slate-400">{message}</p>
        {children}
      </div>
    </div>
  );
};
