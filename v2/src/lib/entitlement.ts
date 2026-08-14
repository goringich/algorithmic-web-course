import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "algohar_entitlement";

type EntitlementPayload = {
  sub: string;
  tier: "full";
  exp: number;
};

function secret() {
  const value = process.env.ENTITLEMENT_SECRET;
  if (!value || value.length < 32) return null;
  return value;
}

function signature(body: string, key: string) {
  return createHmac("sha256", key).update(body).digest("base64url");
}

export function issueEntitlementToken(subject: string, expiresAt: Date) {
  const key = secret();
  if (!key) throw new Error("ENTITLEMENT_SECRET must contain at least 32 characters");
  const payload: EntitlementPayload = {
    sub: subject.slice(0, 120),
    tier: "full",
    exp: Math.floor(expiresAt.getTime() / 1000),
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${signature(body, key)}`;
}

export function verifyEntitlementToken(token: string | undefined): EntitlementPayload | null {
  const key = secret();
  if (!key || !token) return null;
  const [body, provided] = token.split(".");
  if (!body || !provided) return null;
  const expected = signature(body, key);
  const expectedBytes = Buffer.from(expected);
  const providedBytes = Buffer.from(provided);
  if (expectedBytes.length !== providedBytes.length || !timingSafeEqual(expectedBytes, providedBytes)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Partial<EntitlementPayload>;
    if (payload.tier !== "full" || typeof payload.sub !== "string" || typeof payload.exp !== "number") return null;
    if (payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload as EntitlementPayload;
  } catch {
    return null;
  }
}

export async function hasFullEntitlement() {
  const store = await cookies();
  return Boolean(verifyEntitlementToken(store.get(COOKIE_NAME)?.value));
}

export async function activateEntitlement(token: string) {
  const payload = verifyEntitlementToken(token);
  if (!payload) return false;
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.max(60, payload.exp - Math.floor(Date.now() / 1000)),
  });
  return true;
}
