import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";

import { checkIpLimit } from "./server";

export const validateIpRateLimit = async (req: Request): Promise<NextResponse | null> => {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

  const { isBlocked } = await checkIpLimit(ip);

  if (isBlocked) {
    const t = await getTranslations("Errors.SendAnonymousAnalysis");
    return NextResponse.json({ error: t("rateLimitError") }, { status: 429 });
  }

  return null;
};

export const isPageIpRateLimited = async (): Promise<null | { errorMessage: string }> => {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "127.0.0.1";
  const { isBlocked } = await checkIpLimit(ip);
  if (isBlocked) {
    const t = await getTranslations("Errors.SendAnonymousAnalysis");
    return { errorMessage: t("rateLimitError") };
  }
  return null;
};
