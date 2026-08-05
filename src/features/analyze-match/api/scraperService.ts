"use server";

import * as cheerio from "cheerio";

export const scrapeVacancyText = async (url: string): Promise<string> => {
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
};
