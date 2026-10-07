import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_academic_secret_key_trinhminhphu_2026"
);

const TOKEN_NAME = "tmp_auth_token";

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  [key: string]: unknown;
}

export async function signToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<TokenPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function getSessionUserFromRequest(
  req: NextRequest
): Promise<TokenPayload | null> {
  const token =
    req.cookies.get(TOKEN_NAME)?.value ||
    req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  return await verifyToken(token);
}

export { TOKEN_NAME };
