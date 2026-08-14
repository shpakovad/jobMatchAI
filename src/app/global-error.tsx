"use client";

import { useTranslations } from "next-intl";
import { startTransition, useEffect } from "react";

import { ErrorIcon } from "@/src/shared/icons/ErrorIcon";
import { Button } from "@/src/shared/ui";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const t = useTranslations("GlobalErrorPage");

  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleAppReset = () => {
    startTransition(() => {
      reset();
    });

    window.location.reload();
  };

  return (
    <html lang="en">
      <body className="dark flex min-h-screen w-full flex-col items-center justify-center bg-[#0d1117] p-4 font-sans text-slate-100">
        <div className="animate-in fade-in flex w-full max-w-md flex-col items-center justify-center space-y-6 text-center duration-500">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-destructive">
            <ErrorIcon />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-100">{t("title")}</h1>
            <p className="text-sm leading-relaxed text-slate-400">{t("description")}</p>
          </div>

          <Button variant="secondary" onClick={handleAppReset}>
            {t("restartAppLabel")}
          </Button>
        </div>
      </body>
    </html>
  );
}
