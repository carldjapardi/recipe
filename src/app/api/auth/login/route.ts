import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { findByUsername } from "@/lib/users";
import { signToken } from "@/lib/auth";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
};

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username?.trim() || !password) {
    return NextResponse.json(
      { error: "Username and password required" },
      { status: 400 }
    );
  }

  const user = findByUsername(username.trim());
  if (!user) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const valid = await compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = await signToken({ userId: user.id, username: user.username });
  const res = NextResponse.json({ username: user.username });
  res.cookies.set("token", token, COOKIE_OPTS);
  return res;
}
