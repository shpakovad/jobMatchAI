"use server";

import { randomUUID } from "crypto";
import { cookies } from "next/headers";

import {
  AnalyzePayload,
  generateMatchAnalysis,
  saveAnonymousAnalysis,
} from "@/src/features/analyze-match";

export const handleAIAnalysis = async (payload: AnalyzePayload): Promise<ReadableStream> => {
  const guestSessionId = randomUUID();

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

  const encoder = new TextEncoder();
  const isRussianLang = payload.locale === "ru";

  return new ReadableStream({
    async start(controller) {
      const sendStep = (step: string) => controller.enqueue(encoder.encode(step));

      sendStep(isRussianLang ? "Извлечение данных" : "Extracting data");

      try {
        sendStep(isRussianLang ? "Выполнение анализа ИИ" : "Running AI analysis");
        const aiParsedResult = await generateMatchAnalysis(payload);

        sendStep(isRussianLang ? "Сохранение результата" : "Saving result");
        await saveAnonymousAnalysis({
          id: guestSessionId,
          analysis: aiParsedResult,
          isRussianLang,
        });

        console.log("cookieStore");

        sendStep(isRussianLang ? "Успешно" : "Success");
        controller.close();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        const resultMessage = errorMessage.includes("User location is not supported")
          ? isRussianLang
            ? "Сервисы Gemini недоступны в вашем регионе. Пожалуйста, смените страну в вашем VPN."
            : "User location is not supported for the API use. Please check your VPN region."
          : errorMessage;

        controller.enqueue(encoder.encode(`ERROR:${resultMessage}`));
        controller.close();
      }
    },
  });
};
