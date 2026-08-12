"use server";

import { cookies } from "next/headers";

import {
  AnalyzePayload,
  generateMatchAnalysis,
  saveAnonymousAnalysis,
} from "@/src/features/analyze-match";

export const handleAIAnalysis = async (payload: AnalyzePayload): Promise<ReadableStream> => {
  const cookieStore = await cookies();
  const guestSessionId = cookieStore.get("guest_session_id")?.value;

  const isRussianLang = payload.locale === "ru";

  if (!guestSessionId) {
    throw new Error(isRussianLang ? "Страница Анализа не найдена" : "Analysis page not found");
  }

  const encoder = new TextEncoder();

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

        sendStep(isRussianLang ? "Успешно" : "Success");
        controller.close();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        const errorObj = error as Record<string, unknown>;
        const rawErrorStatus = Number(errorObj?.status || errorObj?.code || 0);

        let resultMessage = errorMessage;
        if (
          errorMessage.includes("Prisma") ||
          errorMessage.includes("prisma") ||
          errorMessage.includes("database")
        ) {
          resultMessage = isRussianLang
            ? "Не удалось сохранить отчет в базу данных из-за внутренней ошибки сервера. Пожалуйста, попробуйте отправить запрос еще раз."
            : "Failed to save the report to the database due to an internal server error. Please try submitting your request again.";
        } else if (
          rawErrorStatus === 503 ||
          errorMessage.includes("503") ||
          errorMessage.includes("high demand") ||
          errorMessage.includes("Service Unavailable")
        ) {
          resultMessage = isRussianLang
            ? "Серверы ИИ сейчас перегружены из-за высокого количества запросов. Пожалуйста, подождите пару минут и попробуйте отправить резюме еще раз."
            : "AI servers are currently overloaded due to high demand. Please wait a couple of minutes and try submitting your resume again.";
        } else if (errorMessage.includes("User location is not supported")) {
          resultMessage = isRussianLang
            ? "Сервисы Gemini недоступны в вашем регионе. Пожалуйста, смените страну в вашем VPN."
            : "User location is not supported for the API use. Please check your VPN region.";
        }

        controller.enqueue(encoder.encode(`ERROR:${resultMessage}`));
        controller.close();
      }
    },
  });
};
