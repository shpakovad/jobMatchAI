"use client";

import { useTranslations, useLocale } from "next-intl";
import { Sparkles } from "lucide-react";
import { Link, usePathname, useRouter } from "@/src/navigation";
import { divider } from "@/src/shared/styles";
import { Button } from "@/src/shared/ui";
import { useResetAnalysisFlow } from "@/src/features/analysis-status-guard";

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Header");
  const locale = useLocale();
  const { resetAnalysisFlow } = useResetAnalysisFlow();

  const isExactRootPath = pathname === "/";

  const isActiveLocale = (value: string) => locale === value;

  const localeClassName = (value: string) =>
    [
      "px-1",
      "py-1",
      isActiveLocale(value)
        ? "text-primary hover:cursor-default"
        : "text-muted-foreground hover:cursor-pointer hover:text-slate-50",
    ]
      .filter(Boolean)
      .join(" ");

  const onChangeLocale = (value: string) => {
    router.replace({ pathname }, { locale: value });
  };

  return (
    <header className={`flex flex-col items-center justify-between pb-4 pt-4 ${divider}`}>
      <div className="mb-4 flex w-full justify-end">
        <div
          className="flex h-9 items-center overflow-hidden p-1 text-xs font-semibold text-slate-300 shadow-sm"
          aria-label="Language switcher"
        >
          <span onClick={() => onChangeLocale("en")} className={localeClassName("en")}>
            EN
          </span>
          <span>/</span>
          <span onClick={() => onChangeLocale("ru")} className={localeClassName("ru")}>
            RU
          </span>
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-end">
          <Sparkles color="oklch(70.7% 0.165 254.624)" />
          <span className="pl-3 text-sm font-semibold text-primary">JobMatch AI</span>
        </div>
        {!isExactRootPath ? (
          <Link href="/">
            <Button onClick={resetAnalysisFlow} variant="secondary">
              {t("backToMain")}
            </Button>
          </Link>
        ) : (
          <Link href="/workspace">
            <Button>{t("startLabel")}</Button>
          </Link>
        )}
      </div>
    </header>
  );
};
