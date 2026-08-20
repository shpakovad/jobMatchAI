"use server";

import { cookies } from "next/headers";

import { parseSession } from "@/src/shared/lib/session/server";

interface SessionResponse {
  hasActiveSession: boolean;
  sessionId: string | null;
}

export const checkActiveSession = async (): Promise<SessionResponse> => {
  const cookieStore = await cookies();

  const rawCookie = cookieStore.get("guest_session_id")?.value;
  const guestSessionId = parseSession(rawCookie);

  return { hasActiveSession: !!guestSessionId, sessionId: guestSessionId };
};
