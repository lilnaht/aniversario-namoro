import "server-only";

import { cookies } from "next/headers";
import { randomBytes, createHmac, timingSafeEqual } from "crypto";
import { config } from "@/lib/config";

const SESSION_COOKIE = "admin_session";
const ATTEMPT_COOKIE = "admin_attempts";
const SESSION_TTL_SECONDS = 60 * 60 * 12;
const LOCK_THRESHOLD = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

type SessionPayload = {
  exp: number;
  iat: number;
  nonce: string;
};

type AttemptPayload = {
  count: number;
  lockedUntil: number | null;
};

function getSecret() {
  if (!config.adminPassword) {
    throw new Error("ADMIN_PASSWORD not configured.");
  }
  return config.adminPassword;
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function encode(payload: object) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(body);
  return `${body}.${signature}`;
}

function decode<T>(token: string): T | null {
  const [body, signature] = token.split(".");
  if (!body || !signature) {
    return null;
  }
  const expected = sign(body);
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf-8")) as T;
  } catch {
    return null;
  }
}

export function isPasswordValid(candidate: string) {
  if (!config.adminPassword) {
    return false;
  }
  const candidateBuffer = Buffer.from(candidate);
  const secretBuffer = Buffer.from(config.adminPassword);
  if (candidateBuffer.length !== secretBuffer.length) {
    return false;
  }
  return timingSafeEqual(candidateBuffer, secretBuffer);
}

export async function createAdminSession() {
  const payload: SessionPayload = {
    iat: Date.now(),
    exp: Date.now() + SESSION_TTL_SECONDS * 1000,
    nonce: randomBytes(16).toString("hex"),
  };
  const token = encode(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getAdminSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }
  const payload = decode<SessionPayload>(token);
  if (!payload || payload.exp < Date.now()) {
    return null;
  }
  return payload;
}

export async function requireAdminSession() {
  if (!(await getAdminSession())) {
    throw new Error("Unauthorized");
  }
}

export async function getAttemptState(): Promise<AttemptPayload> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ATTEMPT_COOKIE)?.value;
  if (!token) {
    return { count: 0, lockedUntil: null };
  }
  const payload = decode<AttemptPayload>(token);
  if (!payload) {
    return { count: 0, lockedUntil: null };
  }
  if (payload.lockedUntil && payload.lockedUntil < Date.now()) {
    return { count: 0, lockedUntil: null };
  }
  return payload;
}

export async function registerFailedAttempt() {
  const state = await getAttemptState();
  const nextCount = state.count + 1;
  const lockedUntil = nextCount >= LOCK_THRESHOLD ? Date.now() + LOCK_DURATION_MS : null;
  const payload: AttemptPayload = { count: nextCount, lockedUntil };
  const token = encode(payload);
  const cookieStore = await cookies();
  cookieStore.set(ATTEMPT_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.ceil(LOCK_DURATION_MS / 1000),
  });
  return payload;
}

export async function resetAttempts() {
  const cookieStore = await cookies();
  cookieStore.set(ATTEMPT_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function getLoginDelayMs(attempts: number) {
  return Math.min(1500 * attempts, 5000);
}
