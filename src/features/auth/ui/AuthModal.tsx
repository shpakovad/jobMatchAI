"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/src/shared/ui/button";
import type { AuthMode } from "../model/types";
import { AuthFields } from "./AuthFields";
import { ModalLayout } from "./ModalLayout";

export const AuthModal = () => {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const t = useTranslations("Header");
  const isSignUp = mode === "sign-up";

  const toggleMode = () => {
    setMode((prev) => (prev === "sign-in" ? "sign-up" : "sign-in"));
  };

  return (
    <ModalLayout
      description={
        <>
          {isSignUp ? t("Login.hasAccountPrompt") : t("Login.noAccountPrompt")}
          <Button
            type="button"
            variant="ghost"
            className="text-slate-100 hover:text-slate-500"
            onClick={toggleMode}
          >
            {isSignUp ? t("Login.title") : t("Login.noAccountAction")}
          </Button>
        </>
      }
      translation={t}
      submitText={isSignUp ? t("Login.noAccountAction") : t("Login.title")}
    >
      <div key={mode} className="animate-in fade-in-0 slide-in-from-right-2 duration-150">
        <AuthFields mode={mode} translation={t} />
      </div>
    </ModalLayout>
  );
};
