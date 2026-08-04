"use server";

import { cookies } from "next/headers";

import { db } from "@/src/shared/api/prisma";

export const deleteGuestSession = async () => {
  try {
    const cookieStore = await cookies();
    const guestSessionId = cookieStore.get("guest_session_id")?.value;

    if (guestSessionId) {
      await db.anonymousAnalysis.delete({
        where: { id: guestSessionId },
      });
    }
    cookieStore.delete("guest_session_id");
  } catch (error) {
    console.error(error);
    const cookieStore = await cookies();
    cookieStore.delete("guest_session_id");
  }
};
