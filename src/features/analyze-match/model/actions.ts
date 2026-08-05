"use server";

import { randomUUID } from "crypto";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";

import {
  AnalyzePayload,
  generateMatchAnalysis,
  saveAnonymousAnalysis,
} from "@/src/features/analyze-match";
import { redirect } from "@/src/navigation";

type AnalysisResponse = { success: boolean; error?: string };

export const handleAIAnalysis = async (payload: AnalyzePayload): Promise<AnalysisResponse> => {
  try {
    const isRussianLang = payload.locale === "ru";

    const aiParsedResult = await generateMatchAnalysis(payload);

    const guestSessionId = randomUUID();

    await saveAnonymousAnalysis({ id: guestSessionId, analysis: aiParsedResult, isRussianLang });

    const cookieStore = await cookies();

    cookieStore.set({
      name: "guest_session_id",
      value: String(guestSessionId),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 40,
      sameSite: "lax",
    });

    redirect({
      href: "/analysis",
      locale: payload.locale,
    });

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    const isRussianLang = payload.locale === "ru";
    const errorMessage =
      error instanceof Error
        ? error.message
        : isRussianLang
          ? "Неизвестная ошибка"
          : "Unknown error";
    const resultMessage = errorMessage.includes("User location is not supported")
      ? isRussianLang
        ? "Сервисы Gemini недоступны в вашем регионе. Пожалуйста, смените страну в вашем VPN."
        : "User location is not supported for the API use. Please check your VPN region."
      : errorMessage;
    return { success: false, error: resultMessage };
  }
};
