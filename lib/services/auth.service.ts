// import bcrypt from "bcryptjs";
// import { SignJWT, jwtVerify } from "jose";

// const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// export async function hashPassword(password: string) {
//   const salt = await bcrypt.genSalt(10);
//   return bcrypt.hash(password, salt);
// }

// export async function verifyPassword(password: string, hash: string) {
//   return bcrypt.compare(password, hash);
// }

// export type SessionPayload = {
//   uid: string;
//   role: "ADMIN" | "STAFF" | "EVENT_OWNER";
//   email: string;
// };

// export async function signSession(payload: SessionPayload) {
//   return new SignJWT(payload)
//     .setProtectedHeader({ alg: "HS256" })
//     .setIssuedAt()
//     .setExpirationTime("7d")
//     .sign(JWT_SECRET);
// }

// export async function verifySession(token: string) {
//   const { payload } = await jwtVerify(token, JWT_SECRET);
//   return payload as unknown as SessionPayload;
// }

// export function setAuthCookie(res: Response, token: string) {
//   // NextResponse is a Response subclass; use Headers to set Set-Cookie
//   const cookie = `session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${
//     7 * 24 * 60 * 60
//   }`;
//   res.headers.append("Set-Cookie", cookie);
// }

// export function clearAuthCookie(res: Response) {
//   const cookie = `session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
//   res.headers.append("Set-Cookie", cookie);
// }
