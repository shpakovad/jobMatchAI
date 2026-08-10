"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

import {
  aiAnalysisSchema,
  ValidatedAnalysisResult,
} from "@/src/entities/analysis/model/validation";
import { AnalyzePayload, scrapeVacancyText } from "@/src/features/analyze-match";

export const generateMatchAnalysis = async (
  payload: AnalyzePayload,
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

      Структура JSON, которую ты ОБЯЗАН вернуть:
  {
    "vacancyName": "Точное название должности из текста вакансии. Если его нет — 'Позиция из описания'",
    "matchPercentage": number (число от 0 до 100),
    "matchedSkills": ["Массив совпавших жестких навыков (Hard Skills)"],
    "missingSkills": ["Массив критичных hard skills из вакансии, которых нет в резюме"],
    "recommendation": "Развернутая, общая структурированная карьерная рекомендация.",
    
    "resumeImprovementSuggestions": [
      "Конкретный совет №1 по изменению структуры или описания текущего резюме под эту вакансию",
      "Конкретный совет №2..."
    ],
    
    "suggestedExperienceHighlights": [
      "Конкретная идея: вспомни и опиши в опыте, как ты решал задачу X (например, оптимизацию запросов Prisma). Напиши это простым техническим языком, упомянув инструменты из вакансии.",
      "Еще одна живая идея для опыта..."
    ]
    
    "interviewPreparationQuestions": [
      "Технический или поведенческий вопрос, который кандидату точно зададут на интервью на основе его слабых зон или пропущенных навыков (missingSkills)",
      "Второй критический вопрос для подготовки..."
    ]
  }
      
      Отвечай только чистым валидным JSON, без Markdown-разметки
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
