"use client";

import { Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import { useAnalysisActions } from "@/src/entities/analysis";
import { checkActiveSession } from "@/src/entities/session";
import { Link, usePathname, useRouter } from "@/src/navigation";
import { divider } from "@/src/shared/styles";
import { Button, FullScreenLoader } from "@/src/shared/ui";

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Header");
  const locale = useLocale();
  const { reset } = useAnalysisActions();
  const [isPending, startTransition] = useTransition();

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

  const handleStartRedirect = async () => {
    const sessionId = await checkActiveSession();

    if (sessionId) {
      startTransition(() => router.push("/workspace"));
    } else {
      startTransition(() => router.push("/access"));
    }
  };

  return (
    <header className={`flex flex-col items-center justify-between pb-4 pt-4 ${divider}`}>
      {isPending && <FullScreenLoader />}
      <div className="mb-4 flex w-full justify-end">
        <div
          className="flex h-9 items-center overflow-hidden p-1 text-xs font-semibold text-slate-300 shadow-sm"
          aria-label="Language switcher"
        >
          <button
            onClick={() => onChangeLocale("en")}
            className={localeClassName("en")}
            lang="en"
            aria-label="Switch to English language"
            aria-pressed={isActiveLocale("en")}
          >
            EN
          </button>
          <span>/</span>
          <button
            onClick={() => onChangeLocale("ru")}
            className={localeClassName("ru")}
            lang="ru"
            aria-label="Переключить на русский язык"
            aria-pressed={isActiveLocale("ru")}
          >
            RU
          </button>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-between sm:flex-row">
        <div className="flex items-end">
          <Sparkles color="oklch(70.7% 0.165 254.624)" />
          <span className="pl-3 text-sm font-semibold text-primary">JobMatch AI</span>
        </div>
        {!isExactRootPath ? (
          <Link href="/" className="mt-5 sm:mt-0">
            <Button className="text-xs sm:text-sm" onClick={reset} variant="secondary">
              {t("backToMain")}
            </Button>
          </Link>
        ) : (
          <Button className="mt-5 text-xs sm:mt-0 sm:text-sm" onClick={handleStartRedirect}>
            {t("startLabel")}
          </Button>
        )}
      </div>
    </header>
  );
};
