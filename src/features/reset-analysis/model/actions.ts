"use server";

import { cookies } from "next/headers";

export const deleteGuestSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("guest_session_id");
};
