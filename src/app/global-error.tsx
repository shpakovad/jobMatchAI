"use client";

import "./[locale]/globals.css";

import { useEffect } from "react";

import { ErrorIcon } from "@/src/shared/icons/ErrorIcon";
import { Button } from "@/src/shared/ui";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleAppReset = () => {
    window.location.reload();
  };

  return (
    <body
      style={{
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
      className="dark flex min-h-screen w-full flex-col items-center justify-center bg-[#0d1117] p-4 font-sans text-slate-100"
    >
      <div className="animate-in fade-in flex w-full max-w-md flex-col items-center justify-center space-y-6 text-center duration-500">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-destructive">
          <ErrorIcon />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold tracking-tight text-slate-100">Ooops...</h1>
          <p className="text-sm leading-relaxed text-slate-400">
            Возникла неожиданная ошибка в работе приложения. Мы уже выявили проблему и работаем над
            её исправлением.
          </p>
          <p className="text-sm leading-relaxed text-slate-400">
            There was an unexpected glitch in the app interface. We've already identified the issue
            and are working on a fix.
          </p>
        </div>

        <Button variant="secondary" onClick={handleAppReset}>
          Перезапустить приложение / Restart App
        </Button>
      </div>
    </body>
  );
}
