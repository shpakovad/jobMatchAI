"use server";

import { cookies } from "next/headers";

export const deleteGuestSession = async () => {
  const cookieStore = await cookies();
  if (cookieStore.has("guest_session_id")) {
    cookieStore.delete("guest_session_id");
  }
  return;
};
