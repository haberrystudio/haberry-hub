"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { superAdminRequest, sessionCookie } from "./api";

export async function signOut() {
  const jar = await cookies();
  const token = jar.get(sessionCookie)?.value;
  let failed = false;
  if (token) {
    try {
      const response = await superAdminRequest("logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      failed = !response.ok && response.status !== 401;
    } catch {
      failed = true;
    }
  }
  jar.delete(sessionCookie);
  redirect(failed ? "/super-admin/login?notice=session" : "/super-admin/login");
}
