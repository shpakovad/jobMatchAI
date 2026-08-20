import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";

import { analyzePayloadSchema } from "@/src/features/analyze-match";
import { createAnalysisStream } from "@/src/features/analyze-match/server";
import { validateIpRateLimit } from "@/src/shared/lib/ratelimit/withRateLimit";
import { parseSession } from "@/src/shared/lib/session/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  const rateLimitResponse = await validateIpRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const cookieStore = await cookies();
  const rawCookie = cookieStore.get("guest_session_id")?.value;

  const guestSessionId = parseSession(rawCookie);

  const t = await getTranslations("Errors.SendAnonymousAnalysis");

  if (!guestSessionId) {
    return NextResponse.json({ error: t("requiredError") }, { status: 401 });
  }

  const rawBody = await (async () => {
    try {
      return await req.json();
    } catch {
      return {};
    }
  })();

  const validation = analyzePayloadSchema.safeParse(rawBody);

  if (!guestSessionId) {
    return NextResponse.json(
      {
        error: t("noIdError"),
      },
      { status: 401 },
    );
  }

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
  const stream = await createAnalysisStream({ payload, guestSessionId, ip });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
