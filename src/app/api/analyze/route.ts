import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";

import { checkActiveSession } from "@/src/entities/session";
import { analyzePayloadSchema } from "@/src/features/analyze-match";
import { createAnalysisStream } from "@/src/features/analyze-match/server";
import { validateIpRateLimit } from "@/src/shared/lib/ratelimit/withRateLimit";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  const rateLimitResponse = await validateIpRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const sessionId = await checkActiveSession();

  const t = await getTranslations("Errors.SendAnonymousAnalysis");

  if (!sessionId) {
    return NextResponse.json({ error: t("noIdError") }, { status: 401 });
  }

  const rawBody = await (async () => {
    try {
      return await req.json();
    } catch {
      return {};
    }
  })();

  const validation = analyzePayloadSchema.safeParse(rawBody);

  if (!validation.success) {
    return NextResponse.json(
      {
        error: t("noTextOrVacancyError"),
        details: validation.error.format(),
      },
      { status: 400 },
    );
  }

  const payload = validation.data;
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const stream = await createAnalysisStream({ payload, guestSessionId: sessionId, ip });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
