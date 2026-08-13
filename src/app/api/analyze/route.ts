import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createAnalysisStream } from "@/src/features/analyze-match/model/createAnalysisStream";
import type { AnalyzePayload } from "@/src/features/analyze-match/model/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const guestSessionId = cookieStore.get("guest_session_id")?.value;

  const payload = (await req.json()) as AnalyzePayload;

  const isRussianLang = payload.locale === "ru";

  if (!guestSessionId) {
    return NextResponse.json(
      {
        error: isRussianLang ? "Страница Анализа не найдена" : "Analysis page not found",
      },
      { status: 401 },
    );
  }

  if (!payload.resumeText?.trim() || !payload.vacancyText?.trim()) {
    return NextResponse.json(
      {
        error: isRussianLang
          ? "Не хватает текста резюме или вакансии"
          : "Resume or vacancy text is missing",
      },
      { status: 400 },
    );
  }

  const stream = createAnalysisStream({ payload, guestSessionId });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
