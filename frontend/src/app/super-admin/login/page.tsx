import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "./form";
import { superAdminRequest, sessionCookie } from "../api";

export const instant = false;

export default async function Login({ searchParams }: PageProps<"/super-admin/login">) {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookie)?.value;

  if (token) {
    const response = await superAdminRequest("overview", {
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => null);
    if (response?.ok) {
      redirect("/super-admin");
    }
  }

  const { notice } = await searchParams;
  return (
    <main className="login-shell">
      <section className="login-card" aria-labelledby="login-title">
        <div className="brand"><span className="brand-mark" aria-hidden="true">H</span> Haberry Arcade</div>
        <h1 id="login-title">Super Admin sign-in</h1>
        <p className="muted">Use your Haberry administrator account.</p>
        {notice === "session" && <p role="status" className="muted">Signed out of this browser. The server could not revoke the previous session.</p>}
        <LoginForm />
      </section>
    </main>
  );
}
