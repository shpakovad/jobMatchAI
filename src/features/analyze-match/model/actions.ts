"use server";

import { randomUUID } from "crypto";
import { cookies } from "next/headers";

import {
  generateMatchAnalysis,
  IAnalyzePayload,
  saveAnonymousAnalysis,
} from "@/src/features/analyze-match";
import { redirect } from "@/src/navigation";

type AIAnalysisResponse = { success: false; error: string } | never;

export const handleAIAnalysis = async (payload: IAnalyzePayload): Promise<AIAnalysisResponse> => {
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
  } catch (error) {
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
  redirect({
    href: "/analysis",
    locale: payload.locale,
  });
  return undefined as never;
};
