"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/src/navigation";
import { divider } from "@/src/shared/styles";
import { Locale } from "@/src/shared/types";
import { Button } from "@/src/shared/ui/button";
import { SignInModal, ModalLayout, SignUpModal } from "@/src/features/login";

export const Header = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const t = useTranslations("Header");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = params ? params.locale : "ru";

  const isActiveLocale = (value: string) => locale === value;

  const localeClassName = (value: string) =>
    [
      "px-1",
      "py-1",
      isActiveLocale(value)
        ? "text-slate-50 hover:cursor-default"
        : "text-slate-500 hover:cursor-pointer hover:text-slate-50",
    ]
      .filter(Boolean)
      .join(" ");

  const onChangeLocale = (value: string) => {
    router.replace(pathname, { locale: value as Locale });
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
          <span className="pl-3 text-sm font-semibold text-slate-100">JobMatch AI</span>
        </div>
        <ModalLayout
          description={
            <>
              {isSignUp ? t("Login.signUpDescription") : t("Login.description")}
              <Button
                type="button"
                variant="ghost"
                className="text-slate-100 hover:text-slate-500"
                onClick={() => setIsSignUp((prev) => !prev)}
              >
                {isSignUp ? t("Login.title") : t("Login.description1")}
              </Button>
            </>
          }
          translation={t}
          submitText={isSignUp ? t("Login.description1") : t("Login.title")}
        >
          <div
            key={isSignUp ? "sign-up" : "sign-in"}
            className="animate-in fade-in-0 slide-in-from-right-2 duration-150"
          >
            {isSignUp ? <SignUpModal /> : <SignInModal />}
          </div>
        </ModalLayout>
      </div>
    </header>
  );
};
