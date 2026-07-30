import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "./button";

interface ErrorPageProps {
  message: string;
  resetError: () => void;
}

export const ErrorPage = ({ message, resetError }: ErrorPageProps) => {
  const t = useTranslations("ErrorPage");
  return (
    <div className="absolute flex h-full w-full flex-col items-center justify-center bg-background p-4">
      <div className="flex max-w-md flex-col items-center rounded-2xl border border-red-500/20 bg-slate-900/50 p-8 text-center shadow-xl shadow-red-500/5">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>

        <h2 className="mb-2 text-xl font-bold text-slate-100">{t("title")}</h2>
        <p className="mb-6 text-sm leading-relaxed text-slate-400">{message}</p>
        <Link href="/">
          <Button onClick={resetError} variant="secondary">
            {t("goToMainLabel")}
          </Button>
        </Link>
      </div>
    </div>
  );
};
