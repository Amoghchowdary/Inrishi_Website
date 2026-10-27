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

type AdminLoginResponse = {
  ok?: boolean;
  message?: string;
  token?: string;
  mustChangePassword?: boolean;
  admin?: AdminSession;
};

export async function loginAdminFn({ data }: { data: { identifier: string; password: string } }) {
  const identifier = data.identifier.trim();

  // Backward-compatible payload: older Apps Script deployments used `id`,
  // while newer backend handlers may use `identifier` or `email`.
  const raw = await appsScriptCall<AdminLoginResponse>(
    "auth.admin.login",
    {
      id: identifier,
      identifier,
      email: identifier,
      password: data.password,
    },
    { role: "public", timeoutMs: 45000 },
  );

  const ok = raw.ok ?? Boolean(raw.token);
  if (ok && raw.token) {
    setSessionToken("admin", raw.token);
  }

  return {
    ...raw,
    ok: Boolean(ok && raw.token),
    message:
      ok && !raw.token
        ? "The backend accepted the credentials but did not return an administrator session token."
        : raw.message,
  };
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
  try {
    await appsScriptCall("auth.logout", { role: "admin" }, { role: "admin" });
  } catch {}
  clearSessionToken("admin");
  return { ok: true as const };
}

export const listAdminAccountsFn = () =>
  appsScriptCall<AdminAccount[]>("admin.accounts.list", {}, { role: "admin" });

export const createAdminAccountFn = (data: { name: string; email: string; role: string; password: string }) =>
  appsScriptCall<{ ok: boolean; id?: string; message?: string }>("admin.accounts.create", data, { role: "admin" });

export const updateAdminAccountStatusFn = (data: { id: string; status: "Active" | "Suspended" | "Inactive" }) =>
  appsScriptCall<{ ok: boolean; message?: string }>("admin.accounts.status", data, { role: "admin" });

export const issueAdminTemporaryPasswordFn = (data: { id: string }) =>
  appsScriptCall<{ ok: boolean; email: string; temporaryPassword: string; message?: string }>(
    "admin.accounts.issueTemporaryPassword",
    data,
    { role: "admin" },
  );

export async function changeAdminPasswordFn(data: { currentPassword: string; newPassword: string }) {
  const r = await appsScriptCall<{ ok: boolean; message?: string }>(
    "auth.admin.changePassword",
    data,
    { role: "admin" },
  );
  if (r.ok) clearSessionToken("admin");
  return r;
}
