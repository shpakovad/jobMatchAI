import type { PDFDocumentProxy } from "pdfjs-dist";

const hasStrProperty = (item: unknown): item is { str: string } =>
  typeof item === "object" &&
  item !== null &&
  "str" in item &&
  typeof (item as Record<string, unknown>).str === "string";

export const parsePdfToText = async (file: File, signal?: AbortSignal): Promise<string> => {
  const pdfjs = await import("pdfjs-dist/webpack.mjs");

  const arrayBuffer = await file.arrayBuffer();

  let loadingTask: ReturnType<typeof pdfjs.getDocument> | null = null;
  let pdf: PDFDocumentProxy | null = null;

  try {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    pdf = await loadingTask.promise;

    if (!pdf) {
      throw new Error("PDF initialization failed");
    }

    let fullText = "";

    const maxPages = Math.min(pdf.numPages, 20);

    for (let i = 1; i <= maxPages; i++) {
      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .filter(hasStrProperty)
        .map((item) => {
          const obj = item as Record<string, unknown>;
          return typeof obj.str === "string" ? obj.str : "";
        })
        .join(" ");

      fullText += pageText + "\n";

      page.cleanup();
    }

    return fullText.trim();
  } finally {
    if (pdf) {
      try {
        await pdf.cleanup();
      } catch {}
    }
    if (loadingTask) {
      try {
        await loadingTask.destroy();
      } catch {}
    }
  }
};
