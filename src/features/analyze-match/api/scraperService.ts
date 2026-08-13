"use server";

import * as cheerio from "cheerio";

const MAX_HTML_SIZE_BYTES = 2 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 6000;

function isSafeUrl(urlInput: string): boolean {
  try {
    const parsed = new URL(urlInput);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;

    const hostname = parsed.hostname.toLowerCase();

    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname === "[::1]"
    ) {
      return false;
    }

    const privateIpRegex =
      /^(10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)$/;
    if (privateIpRegex.test(hostname)) return false;

    return true;
  } catch {
    return false;
  }
}

export const scrapeVacancyText = async (url: string, isRussianLang: boolean): Promise<string> => {
  if (!isSafeUrl(url)) {
    throw new Error(
      isRussianLang
        ? "Предоставленный URL-адрес небезопасен или недействителен. Пожалуйста, скопируйте описание вакансии в виде текста."
        : "The provided URL is unsafe or invalid. Please copy the job description as text.",
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const message = isRussianLang
        ? "Не удалось открыть ссылку. Статус:"
        : "Failed to open link. Status:";
      throw new Error(`${message} ${response.status}`);
    }

    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_HTML_SIZE_BYTES) {
      const message = isRussianLang
        ? "Веб-страница слишком большая, чтобы скачать уу содержимое безопасно."
        : "The webpage is too large to download safety.";
      throw new Error(message);
    }

    const html = await response.text();

    if (html.length > MAX_HTML_SIZE_BYTES) {
      throw new Error(
        isRussianLang
          ? "Размер текста на веб-странице превышает безопасный лимит"
          : "The webpage text size exceeds the security limit.",
      );
    }

    const $ = cheerio.load(html);

    $("script, style, nav, footer, header, noscript, iframe").remove();

    const pageText = $("body").text();
    const cleanText = pageText.replace(/\s+/g, " ").trim();

    if (!cleanText || cleanText.length < 20) {
      throw new Error(
        isRussianLang
          ? "Невозможно извлечь текст с этой страницы."
          : "Could not extract readable text content from this webpage.",
      );
    }

    return cleanText;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        isRussianLang
          ? "Время подключения истекло. Возможно, сайт слишком медленный. Пожалуйста, скопируйте описание вакансии в виде текста."
          : "The connection timed out while loading the link. The site might be too slow. Please copy the job description as text.",
      );
    }

    throw new Error(
      isRussianLang
        ? "Невозможно прочитать текст по предоставленной ссылке (сайт может быть защищён или закрыт). Пожалуйста, скопируйте описание вакансии в виде текста."
        : "The text at the provided link could not be read (the site may be protected or down). Please copy the job description as text.",
    );
  }
};
