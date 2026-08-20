"use server";

import { cookies } from "next/headers";

import { parseSession } from "@/src/shared/lib/session/server";

export const checkActiveSession = async (): Promise<boolean> => {
  const cookieStore = await cookies();

  const rawCookie = cookieStore.get("guest_session_id")?.value;
  const guestSessionId = parseSession(rawCookie);

  return !!guestSessionId;
};
