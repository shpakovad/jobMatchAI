"use server";

import { timingSafeEqual } from "node:crypto";

import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

import { WINDOW_SECONDS } from "@/src/shared/constants";
import { serializeSession } from "@/src/shared/lib/session/server";
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

  const inputBuffer = Buffer.from(code.trim());
  const masterBuffer = Buffer.from(MASTER_DEMO_CODE.trim());

  if (inputBuffer.length !== masterBuffer.length || !timingSafeEqual(inputBuffer, masterBuffer)) {
    return { success: false, error: t("noSessionCodeError") };
  }

  const rawSessionId = randomUUID();

  const secureSessionValue = serializeSession(rawSessionId);

  const cookieStore = await cookies();
  cookieStore.set({
    name: "guest_session_id",
    value: secureSessionValue,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: WINDOW_SECONDS,
  });

  return { success: true };
};
