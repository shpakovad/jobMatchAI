"use server";

import { cookies } from "next/headers";

import { parseSession } from "@/src/shared/lib/session/server";

type SessionResponse = string | null;

export const checkActiveSession = async (): Promise<SessionResponse> => {
  const cookieStore = await cookies();

  const rawCookie = cookieStore.get("guest_session_id")?.value;

  return parseSession(rawCookie);
};
