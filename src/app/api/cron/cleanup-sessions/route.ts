import { NextResponse } from "next/server";

import { db } from "@/src/shared/api/prisma";
import { WINDOW_SECONDS } from "@/src/shared/constants";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const twoHoursAgo = new Date(Date.now() - WINDOW_SECONDS * 1000);

    const deleted = await db.anonymousAnalysis.deleteMany({
      where: {
        createdAt: {
          lt: twoHoursAgo,
        },
      },
    });

    return NextResponse.json({ success: true, deletedCount: deleted.count });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
