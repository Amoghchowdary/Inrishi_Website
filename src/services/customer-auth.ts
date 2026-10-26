import { appsScriptCall, clearSessionToken, getSessionToken, setSessionToken } from "@/lib/apps-script-api";

type CustomerSession = { email: string; name: string; customerId?: string };

export async function loginCustomerFn({ data }: { data: { email: string; password: string } }) {
  const result = await appsScriptCall<{ ok: boolean; message?: string; token?: string; customer?: CustomerSession }>("auth.customer.login", data, { role: "public" });
  if (result.ok && result.token) setSessionToken("customer", result.token);
  return result;
}

export async function getCurrentCustomerFn() {
  const token = getSessionToken("customer");
  if (!token) return null;
  try {
    return await appsScriptCall<CustomerSession | null>("auth.customer.session", {}, { role: "customer" });
  } catch {
    clearSessionToken("customer");
    return null;
  }
}

export async function logoutCustomerFn() {
  try { await appsScriptCall("auth.logout", { role: "customer" }, { role: "customer" }); } catch { /* clear locally even if backend is unavailable */ }
  clearSessionToken("customer");
  return { ok: true as const };
}

