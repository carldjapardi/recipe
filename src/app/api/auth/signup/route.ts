import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { findByUsername, createUser } from "@/lib/users";
import { signToken, COOKIE_OPTS } from "@/lib/auth";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username?.trim() || !password) {
    return NextResponse.json(
      { error: "Username and password required" },
      { status: 400 }
    );
  }

  if (password.length < 4) {
    return NextResponse.json(
      { error: "Password must be at least 4 characters" },
      { status: 400 }
    );
  }

  if (findByUsername(username.trim())) {
    return NextResponse.json(
      { error: "Username already taken" },
      { status: 409 }
    );
  }

  const passwordHash = await hash(password, 10);
  const user = createUser(username.trim(), passwordHash);
  const token = await signToken({ userId: user.id, username: user.username });

  const res = NextResponse.json({ username: user.username });
  res.cookies.set("token", token, COOKIE_OPTS);
  return res;
}
