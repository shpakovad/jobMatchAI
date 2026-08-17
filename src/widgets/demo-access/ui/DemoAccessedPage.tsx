"use client";

import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/src/navigation";
import { Button } from "@/src/shared/ui";

export const DemoAccessedPage = () => {
  const t = useTranslations("DemoAccessedPage");

  return (
    <div className="flex w-full select-none flex-col items-center justify-center p-4 text-slate-100 sm:min-h-[85vh]">
      <div className="animate-in fade-in w-full max-w-md space-y-6 rounded-2xl p-6 text-center duration-300">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 className="h-7 w-7 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold tracking-tight text-slate-100">{t("title")}</h1>
          <p className="pb-5 text-sm leading-relaxed text-slate-400">{t("description")}</p>
        </div>
        <Link href="/workspace">
          <Button>{t("continueLabel")}</Button>
        </Link>
      </div>
    </div>
  );
};
