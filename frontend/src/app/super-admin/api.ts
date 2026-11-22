export const sessionCookie = "haberry_platform_session";

export async function superAdminRequest(path: string, options?: RequestInit) {
  const origin = process.env.HABERRY_API_URL ?? "http://127.0.0.1:5000";
  return fetch(`${origin}/v1/super-admin/${path}`, {
    ...options,
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
}
