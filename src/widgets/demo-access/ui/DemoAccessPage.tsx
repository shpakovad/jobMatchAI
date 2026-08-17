"use client";

import { LockKeyhole } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { verifyDemoCode } from "@/src/features/demo-access";
import { useRouter } from "@/src/navigation";
import { Button, FullScreenLoader, Input, toast, Toaster } from "@/src/shared/ui";

export const DemoAccessPage = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const t = useTranslations("DemoAccessPage");
  const locale = useLocale();
  const router = useRouter();

  const handleContinue = async () => {
    if (inputValue.length === 0) {
      return;
    }
    const result = await verifyDemoCode(inputValue, locale);

    if (!result.success) {
      setError(result.error);
      showToast();
    } else {
      startTransition(() => router.push("/workspace"));
    }
  };

  const showToast = () => {
    toast.add({
      type: "error",
      description: error,
      priority: "high",
    });
  };

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      {error && <Toaster />}
      {isPending && <FullScreenLoader />}
      <section className="flex w-full max-w-md flex-col items-center justify-center rounded-lg px-6 py-7 sm:px-8">
        <div className="mb-6 flex size-11 items-center justify-center rounded-lg border border-blue-400/25 bg-blue-400/10 text-blue-300">
          <LockKeyhole size={22} aria-hidden="true" />
        </div>

        <h1 className="mb-3 text-center text-2xl font-bold leading-tight text-primary sm:text-3xl">
          {t("title")}
        </h1>
        <p className="mb-7 text-center text-sm leading-6 text-muted-foreground">
          {t("description")}
        </p>

        <div className="space-y-4">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            aria-label={t("codeLabel")}
            placeholder={t("codeLabel")}
            className="mb-3.5 h-11 border-white/15 bg-transparent px-4 text-slate-100 placeholder:text-slate-500"
          />

          <Button
            className="h-11 w-full"
            disabled={inputValue.length === 0}
            onClick={handleContinue}
          >
            {t("continueLabel")}
          </Button>
        </div>
      </section>
    </main>
  );
};
