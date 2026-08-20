import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

const secret = process.env.SESSION_SECRET;

if (!secret) {
  throw new Error("Critical configuration error: SESSION_SECRET not specified in . env");
}

const sign = (id: string) => {
  return createHmac("sha256", secret).update(id).digest("base64url");
};

export const serializeSession = (id: string): string => {
  return `${id}.${sign(id)}`;
};

export const parseSession = (raw: string | undefined): string | null => {
  if (!raw) return null;

  const [id, mac] = raw.split(".");
  if (!id || !mac) return null;

  const expected = Buffer.from(sign(id));
  const actual = Buffer.from(mac);

  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return null;
  }

  return id;
};
