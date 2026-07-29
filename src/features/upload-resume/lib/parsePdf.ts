export const parsePdfToText = async (file: File): Promise<string> => {
  const pdfjs = await import("pdfjs-dist/webpack.mjs");

  interface PDFTextItem {
    str: string;
  }

  const arrayBuffer = await file.arrayBuffer();

  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const items = textContent.items as PDFTextItem[];
    const pageText = items
      .map((item) => {
        return item.str;
      })
      .join(" ");
    fullText += pageText + "\n";
  }

  return fullText.trim();
};
