"use server";

import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
type AccessResponse = { success: true } | { success: false; error: string };

export const verifyDemoCode = async (code: string): Promise<AccessResponse> => {
  const t = await getTranslations("Errors.VerifyDemoCode");

  const MASTER_DEMO_CODE = process.env.PROJECT_DEMO_CODE;

  if (!code || code.trim() !== MASTER_DEMO_CODE) {
    return {
      success: false,
      error: t("noCodeError"),
    };
  }

  const guestSessionId = randomUUID();
  const cookieStore = await cookies();
  cookieStore.set({
    name: "guest_session_id",
    value: String(guestSessionId),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });

  return { success: true };
};
