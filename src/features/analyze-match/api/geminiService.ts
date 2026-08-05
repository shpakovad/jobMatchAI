"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

import {
  aiAnalysisSchema,
  ValidatedAnalysisResult,
} from "@/src/entities/analysis/model/validation";
import { IAnalyzePayload, scrapeVacancyText } from "@/src/features/analyze-match";

export const generateMatchAnalysis = async (
  payload: IAnalyzePayload,
): Promise<ValidatedAnalysisResult> => {
  const targetLanguage = payload.locale === "ru" ? "русском языке" : "английском языке (English)";
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
    finalVacancyContent = await scrapeVacancyText(finalVacancyContent);
  }

  const systemPrompt = `
      Ты — профессиональный IT-рекрутер и технический эксперт. 
      Твоя задача — сравнить текст резюме кандидата и описание вакансии.
      Они могут быть написаны на разных языках (например, резюме на русском, а вакансия на английском). 
      Анализируй смысл навыков, игнорируя языковой барьер (например, "Разработка на React" и "React development" — это стопроцентное совпадение).
      
      ВАЖНОЕ ТРЕБОВАНИЕ: Ты должен выдать ответ СТРОГО в формате JSON. 
      Все текстовые пояснения, рекомендации и названия навыков в массивах должны быть написаны на ${targetLanguage}! 
      Если навык в оригинале на английском (например, "Docker"), в массиве совпавших/пропущенных скиллов пиши его общепринятое название (можно оставить на английском, если это IT-термин, но текст вокруг и рекомендация должны быть строго на целевом языке).

      Структура JSON:
      {
      "vacancyName": "Здесь напиши точное название должности из текста вакансии. Если названия должности в тексте нет, напиши 'Позиция из описания'",
        "matchPercentage": number (процент соответствия от 0 до 100),
        "matchedSkills": ["React", "TypeScript"], (навыки, которые совпали)
        "missingSkills": ["Docker", "Kubernetes"], (критичные навыки из вакансии, которых нет в резюме)
        "recommendation": "Развернутая, структурированная карьерная рекомендация, как кандидату улучшить резюме под эту вакансию."
      }
      
      Отвечай только чистым JSON, без лишних слов.
    `;

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
