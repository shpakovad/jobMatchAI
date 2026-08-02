"use server";

import { cookies } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as cheerio from "cheerio";
import { randomUUID } from "crypto";
import { db } from "@/src/shared/api/prisma";
import { redirect } from "@/src/navigation";

interface AnalyzePayload {
  resumeText: string;
  vacancyText: string;
  locale: string;
}

async function scrapeVacancyText(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to open link. Status: ${response.status}`);
    }

    const html = await response.text();

    const $ = cheerio.load(html);

    $("script, style, nav, footer, header").remove();

    const pageText = $("body").text();

    return pageText.replace(/\s+/g, " ").trim();
  } catch (error) {
    console.error("Error parsing job posting link:", error);
    throw new Error(
      "The text at the provided link could not be read. Please copy the job description as text.",
    );
  }
}

export async function handleAIAnalysis(payload: AnalyzePayload) {
  try {
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

    const aiParsedResult = JSON.parse(rawText);

    const guestSessionId = randomUUID();

    try {
      await db.anonymousAnalysis.create({
        data: {
          id: guestSessionId,
          vacancyName:
            aiParsedResult.vacancyName && aiParsedResult.vacancyName !== "undefined"
              ? String(aiParsedResult.vacancyName)
              : isRussianLang
                ? "Неизвестная вакансия"
                : "Unknown vacancy",
          matchPercentage: Number(aiParsedResult.matchPercentage) || 0,
          matchedSkills: Array.isArray(aiParsedResult.matchedSkills)
            ? aiParsedResult.matchedSkills
            : [],
          missingSkills: Array.isArray(aiParsedResult.missingSkills)
            ? aiParsedResult.missingSkills
            : [],
          recommendation: String(
            aiParsedResult.recommendation ||
              (isRussianLang ? "Рекомендация отсутствует" : "No recommendation"),
          ),
        },
      });
    } catch (prismaError) {
      const errorMessage = isRussianLang
        ? "Критическая ошибка внутри PRISMA:"
        : "Critical PRISMA error:";
      console.error(errorMessage, prismaError);
      throw prismaError;
    }

    const cookieStore = await cookies();

    cookieStore.set({
      name: "guest_session_id",
      value: String(guestSessionId),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 40,
    });
  } catch (error) {
    const isRussianLang = payload.locale === "ru";
    const errorMessage =
      (error as Error).message || (isRussianLang ? "Неизвестная ошибка" : "Unknown error");
    return { success: false, error: errorMessage };
  }
  redirect({
    href: "/analysis",
    locale: payload.locale,
  });
}
