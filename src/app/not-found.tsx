import "./[locale]/globals.css";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { ErrorIcon } from "@/src/shared/icons/ErrorIcon";
import { Button } from "@/src/shared/ui";

const NotFoundPage = () => {
  const t = useTranslations("NotFoundPage");

  return (
    <body
      style={{
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
      className="p-4text-slate-100 dark flex min-h-screen w-full flex-col items-center justify-center bg-[#0d1117]"
    >
      <div className="animate-in fade-in flex w-full max-w-md flex-col items-center justify-center space-y-6 text-center duration-500">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-destructive">
          <ErrorIcon />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold tracking-tight text-slate-100">{t("title")}</h1>
          <p className="text-sm leading-relaxed text-slate-400">{t("message")}</p>
        </div>

        <Link href="/">
          <Button variant="secondary">{t("buttonText")}</Button>
        </Link>
      </div>
    </body>
  );
};

export default NotFoundPage;
