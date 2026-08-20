import dns from "node:dns/promises";

import * as cheerio from "cheerio";
import { getTranslations } from "next-intl/server";

import { TranslationType } from "@/src/shared/types";

const MAX_HTML_SIZE_BYTES = 2 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 6000;
const MAX_REDIRECTS = 3;
const ALLOWED_PORTS = ["80", "443", ""];

const isPrivateIp = (ip: string): boolean => {
  if (ip === "127.0.0.1" || ip === "0.0.0.0" || ip === "::1" || ip === "localhost") return true;

  if (ip.startsWith("::ffff:")) {
    const ipv4 = ip.replace("::ffff:", "");
    return isPrivateIp(ipv4);
  }

  const parts = ip.split(".").map((p) => parseInt(p, 10));
  if (parts.length === 4 && !parts.some(isNaN)) {
    const [a, b] = parts;
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a === 169 && b === 254) return true; // 169.254.0.0/16 (AWS/Google!)
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
  }

  if (ip.toLowerCase().startsWith("fe80") || ip.toLowerCase().startsWith("fc00")) return true;

  return false;
};

const validateUrlSecurity = async (urlInput: string, t: TranslationType): Promise<void> => {
  const parsed = new URL(urlInput);

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(t("invalidProtocol"));
  }

  if (!ALLOWED_PORTS.includes(parsed.port)) {
    throw new Error(t("disallowedPort"));
  }

  try {
    const lookup = await dns.lookup(parsed.hostname);

    if (isPrivateIp(lookup.address)) {
      throw new Error(t("blockedIp"));
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (
      errorMsg.includes("INVALID_PROTOCOL") ||
      errorMsg.includes("DISALLOWED_PORT") ||
      errorMsg.includes("PRIVATE_IP_BLOCKED")
    ) {
      throw error;
    }
    throw new Error(t("dnsFailed"));
  }
};

export const scrapeVacancyText = async (initialUrl: string): Promise<string> => {
  const t = await getTranslations("Errors.ScrapeVacancyText");
  let currentUrl = initialUrl;
  let redirectCount = 0;
  let html = "";

  while (redirectCount <= MAX_REDIRECTS) {
    try {
      await validateUrlSecurity(currentUrl, t);
    } catch {
      throw new Error(t("noSafeUrl"));
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(currentUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        signal: controller.signal,
        redirect: "manual",
      });

      clearTimeout(timeoutId);

      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get("location");
        if (!location) break;

        currentUrl = new URL(location, currentUrl).toString();
        redirectCount++;
        continue;
      }

      if (!response.ok) {
        throw new Error(`${t("linkError")} ${response.status}`);
      }

      const contentLength = response.headers.get("content-length");
      if (contentLength && parseInt(contentLength, 10) > MAX_HTML_SIZE_BYTES) {
        throw new Error(t("largePageError"));
      }

      html = await response.text();
      break;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(t("abortError"));
      }
      throw error;
    }
  }

  if (redirectCount > MAX_REDIRECTS) {
    throw new Error(t("noSafeUrl"));
  }

  if (html.length > MAX_HTML_SIZE_BYTES) {
    throw new Error(t("textSizeError"));
  }

  try {
    const $ = cheerio.load(html);
    $("script, style, nav, footer, header, noscript, iframe").remove();

    const pageText = $("body").text();
    const cleanText = pageText.replace(/\s+/g, " ").trim();

    if (!cleanText || cleanText.length < 20) {
      throw new Error(t("notReadableTextError"));
    }

    return cleanText;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (errorMsg.includes("Error")) throw error;
    throw new Error(t("notReadableLinkError"));
  }
};
