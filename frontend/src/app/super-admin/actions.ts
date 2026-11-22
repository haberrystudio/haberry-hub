"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { superAdminRequest, sessionCookie } from "./api";

export async function signIn(_previous: string, form: FormData) {
  let session: { token: string; maxAge: number };
  try {
    const response = await superAdminRequest("login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });
    if (response.status === 429) return "Too many attempts. Try again in a minute.";
    if (response.status === 400 || response.status === 401) return "Invalid email or password.";
    if (!response.ok) return "Sign-in is temporarily unavailable.";
    session = await response.json();
  } catch {
    return "Sign-in is temporarily unavailable.";
  }

  (await cookies()).set(sessionCookie, session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: session.maxAge,
  });
  redirect("/super-admin");
}
