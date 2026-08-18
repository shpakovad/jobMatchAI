"use server";

import { cookies } from "next/headers";

export const checkActiveSession = async (): Promise<boolean> => {
  const cookieStore = await cookies();

  const guestSessionId = cookieStore.get("guest_session_id")?.value;

  return !!guestSessionId;
};
