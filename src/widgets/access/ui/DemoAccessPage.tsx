import { LockKeyhole } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/src/navigation";
import { buttonVariants, Input } from "@/src/shared/ui";

export const DemoAccessPage = () => {
  const t = useTranslations("DemoAccessPage");

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <section className="flex w-full max-w-md flex-col items-center justify-center rounded-lg px-6 py-7 sm:px-8">
        <div className="mb-6 flex size-11 items-center justify-center rounded-lg border border-blue-400/25 bg-blue-400/10 text-blue-300">
          <LockKeyhole size={22} aria-hidden="true" />
        </div>

        <h1 className="mb-3 text-3xl font-bold leading-tight text-primary">{t("title")}</h1>
        <p className="mb-7 text-sm leading-6 text-muted-foreground">{t("description")}</p>

        <div className="space-y-4">
          <Input
            aria-label={t("codeLabel")}
            placeholder={t("codeLabel")}
            className="h-11 border-white/15 bg-transparent px-4 text-slate-100 placeholder:text-slate-500"
          />

          <Link
            href="/workspace"
            className={buttonVariants({ className: "h-11 w-full text-sm font-semibold" })}
          >
            {t("continueLabel")}
          </Link>
        </div>
      </section>
    </main>
  );
};
