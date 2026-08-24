import { db } from "@/src/shared/api/prisma";

export const releaseAttempt = async (sessionId: string, message: string): Promise<void> => {
  try {
    await db.anonymousAnalysis.update({
      where: { id: sessionId },
      data: {
        attemptsCount: {
          decrement: 1,
        },
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : message;
    console.error(errorMessage);
  }
};
