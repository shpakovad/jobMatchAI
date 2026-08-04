import { useTranslations } from "next-intl";

export type Locale = "en" | "ru";

export type TranslationType = ReturnType<typeof useTranslations>;
