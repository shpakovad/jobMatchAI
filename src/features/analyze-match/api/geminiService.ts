"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

import { aiAnalysisSchema, ValidatedAnalysisResult } from "@/src/entities/analysis";
import { AnalyzePayload } from "@/src/features/analyze-match";
import { getSystemPrompt } from "@/src/features/analyze-match/config/gemini";
import { scrapeVacancyText } from "@/src/features/analyze-match/server";

export const generateMatchAnalysis = async (
  payload: AnalyzePayload,
): Promise<ValidatedAnalysisResult> => {
  const isRussianLang = payload.locale === "ru";

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      isRussianLang
        ? "Ключ API не существует. Пожалуйста, укажите его в файле .env."
        : "API key does not exist. Please set it in the .env file.",
    );
  }

  const ai = new GoogleGenerativeAI(apiKey);
  let finalVacancyContent = payload.vacancyText.trim();

  const isUrl =
    finalVacancyContent.startsWith("http://") || finalVacancyContent.startsWith("https://");
  if (isUrl) {
    finalVacancyContent = await scrapeVacancyText(finalVacancyContent, isRussianLang);
  }

  const targetLanguage = payload.locale === "ru" ? "русском языке" : "английском языке (English)";
  const systemPrompt = getSystemPrompt(targetLanguage);

  const model = ai.getGenerativeModel({
    model: "gemini-3.6-flash",
    systemInstruction: systemPrompt,
  });

  const userContent = `
      ВОТ ТЕКСТ РЕЗЮМЕ КАНДИДАТА:
      ${payload.resumeText}

      --------------------------------------------------
      ВОТ ТЕКСТ ИЛИ ССЫЛКА НА ВАКАНСИЮ:
      ${finalVacancyContent}
    `;

  const response = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: userContent }] }],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const rawText = response.response.text();
  if (!rawText) {
    throw new Error(isRussianLang ? "AI вернул пустой ответ" : "AI returned empty response.");
  }

  const rawJson = JSON.parse(rawText);

  return aiAnalysisSchema.parse(rawJson);
};
