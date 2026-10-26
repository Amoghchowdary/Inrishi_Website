import { appsScriptCall, clearSessionToken, getSessionToken, setSessionToken } from "@/lib/apps-script-api";

export type AdminSession = {
  id: string;
  email: string;
  name?: string;
  role?: string;
};

export type AdminAccount = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
};

export async function loginAdminFn({ data }: { data: { id: string; password: string } }) {
  const result = await appsScriptCall<{
    ok: boolean;
    message?: string;
    token?: string;
    mustChangePassword?: boolean;
    admin?: AdminSession;
  }>("auth.admin.login", data, { role: "public" });
  if (result.ok && result.token) setSessionToken("admin", result.token);
  return result;
}

export async function getCurrentAdminFn() {
  if (!getSessionToken("admin")) return null;
  try {
    return await appsScriptCall<AdminSession | null>("auth.admin.session", {}, { role: "admin" });
  } catch {
    clearSessionToken("admin");
    return null;
  }
}

export async function logoutAdminFn() {
  try { await appsScriptCall("auth.logout", { role: "admin" }, { role: "admin" }); } catch { /* clear locally */ }
  clearSessionToken("admin");
  return { ok: true as const };
}

export async function listAdminAccountsFn() {
  return appsScriptCall<AdminAccount[]>("admin.accounts.list", {}, { role: "admin" });
}

export async function createAdminAccountFn(data: { name: string; email: string; role: string; password: string }) {
  return appsScriptCall<{ ok: boolean; id?: string; email?: string; name?: string; role?: string; message?: string }>("admin.accounts.create", data, { role: "admin" });
}

export async function updateAdminAccountStatusFn(data: { id: string; status: "Active" | "Suspended" | "Inactive" }) {
  return appsScriptCall<{ ok: boolean; message?: string }>("admin.accounts.status", data, { role: "admin" });
}

export async function issueAdminTemporaryPasswordFn(data: { id: string }) {
  return appsScriptCall<{ ok: boolean; email: string; temporaryPassword: string; message?: string }>("admin.accounts.issueTemporaryPassword", data, { role: "admin" });
}

export async function changeAdminPasswordFn(data: { currentPassword: string; newPassword: string }) {
  const result = await appsScriptCall<{ ok: boolean; message?: string }>("auth.admin.changePassword", data, { role: "admin" });
  if (result.ok) clearSessionToken("admin");
  return result;
}
