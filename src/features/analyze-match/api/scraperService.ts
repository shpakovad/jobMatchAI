"use server";

import * as cheerio from "cheerio";
import { getTranslations } from "next-intl/server";

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
      /^(10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3)\.\d+\.\d+|169\.254\.\d+\.\d+)$/;
    if (privateIpRegex.test(hostname)) return false;

    return true;
  } catch {
    return false;
  }
}

export const scrapeVacancyText = async (url: string): Promise<string> => {
  const t = await getTranslations("Errors.ScrapeVacancyText");

  if (!isSafeUrl(url)) {
    throw new Error(t("noSafeUrl"));
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
      const message = t("linkError");
      throw new Error(`${message} ${response.status}`);
    }

    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_HTML_SIZE_BYTES) {
      const message = t("largePageError");
      throw new Error(message);
    }

    const html = await response.text();

    if (html.length > MAX_HTML_SIZE_BYTES) {
      throw new Error(t("textSizeError"));
    }

    const $ = cheerio.load(html);

    $("script, style, nav, footer, header, noscript, iframe").remove();

    const pageText = $("body").text();
    const cleanText = pageText.replace(/\s+/g, " ").trim();

    if (!cleanText || cleanText.length < 20) {
      throw new Error(t("notReadableTextError"));
    }

    return cleanText;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(t("abortError"));
    }

    throw new Error(t("notReadableLinkError"));
  }
};
