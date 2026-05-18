import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { serialize, parse as parseCookie } from "cookie";
import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "abdan_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const encoder = new TextEncoder();

export type AdminSession = {
  adminId: number | null;
  name: string;
  role: "owner" | "admin" | "editor" | "support";
  email?: string | null;
};

export type AdminRequest = Request & {
  adminSession?: AdminSession | null;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured for ABDAN admin sessions.");
  }
  return encoder.encode(secret);
}

function getConfiguredPasscode() {
  return process.env.ADMIN_PANEL_PASSCODE || process.env.ABDAN_ADMIN_PASSCODE || "";
}

export function isAdminPasscodeConfigured() {
  return Boolean(getConfiguredPasscode().trim());
}

export function verifyAdminPasscode(candidate: string) {
  const configured = getConfiguredPasscode().trim();
  if (!configured) return false;

  const left = Buffer.from(candidate.trim());
  const right = Buffer.from(configured);

  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export async function createAdminSessionToken(session: AdminSession) {
  return await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getJwtSecret());
}

export async function readAdminSession(req: Request) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = parseCookie(cookieHeader);
  const token = cookies[SESSION_COOKIE];

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as AdminSession;
  } catch {
    return null;
  }
}

export function appendSessionCookie(res: Response, token: string) {
  res.append(
    "Set-Cookie",
    serialize(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    }),
  );
}

export function clearSessionCookie(res: Response) {
  res.append(
    "Set-Cookie",
    serialize(SESSION_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      path: "/",
    }),
  );
}

export async function requireAdmin(req: AdminRequest, res: Response, next: NextFunction) {
  const session = await readAdminSession(req);

  if (!session) {
    res.status(401).json({ message: "Admin authentication is required." });
    return;
  }

  req.adminSession = session;
  next();
}
