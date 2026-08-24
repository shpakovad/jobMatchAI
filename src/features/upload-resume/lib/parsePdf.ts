export const parsePdfToText = async (file: File): Promise<string> => {
  const pdfjs = await import("pdfjs-dist/webpack.mjs");

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let fullText = "";

  const maxPages = Math.min(pdf.numPages, 20);

  const hasStrProperty = (item: unknown): item is { str: string } =>
    typeof item === "object" &&
    item !== null &&
    "str" in item &&
    typeof (item as Record<string, unknown>).str === "string";

  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();

    const pageText = textContent.items
      .filter(hasStrProperty)
      .map((item: { str: string }) => item.str)
      .join(" ");

    fullText += pageText + "\n";
  }

  return fullText.trim();
};
