import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { analyzePayloadSchema } from "@/src/features/analyze-match";
import { createAnalysisStream } from "@/src/features/analyze-match/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const guestSessionId = cookieStore.get("guest_session_id")?.value;

  const rawBody = await (async () => {
    try {
      return await req.json();
    } catch {
      return {};
    }
  })();

  const validation = analyzePayloadSchema.safeParse(rawBody);

  const isRussianLang = rawBody?.locale === "ru";

  if (!guestSessionId) {
    return NextResponse.json(
      {
        error: isRussianLang ? "Страница Анализа не найдена" : "Analysis page not found",
      },
      { status: 401 },
    );
  }

  if (!validation.success) {
    return NextResponse.json(
      {
        error: isRussianLang
          ? "Не хватает текста резюме или вакансии"
          : "Resume or vacancy text is missing",
        details: validation.error.format(),
      },
      { status: 400 },
    );
  }

  const payload = validation.data;

  const stream = createAnalysisStream({ payload, guestSessionId });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
