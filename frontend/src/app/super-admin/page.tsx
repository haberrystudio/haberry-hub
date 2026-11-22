import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { superAdminRequest, sessionCookie } from "./api";
import { DashboardView } from "./dashboard-view";

export const instant = false;

export default async function SuperAdmin() {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) redirect("/super-admin/login");

  const response = await superAdminRequest("overview", {
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => null);
  if (response?.status === 401) redirect("/super-admin/login");

  const overview = response?.ok ? await response.json() : null;

  if (!overview) {
    return (
      <div className="min-h-screen bg-[#0e0f12] text-white flex items-center justify-center p-6">
        <div className="bg-[#16171d] border border-zinc-800 rounded-2xl p-8 max-w-md text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 mx-auto flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-white mb-2">API Unavailable</h2>
          <p className="text-xs text-zinc-400 mb-6">
            Unable to connect to the backend server. Please verify the backend is running.
          </p>
          <a
            href="/super-admin"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition"
          >
            Reload Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <DashboardView overview={overview} />;
}
