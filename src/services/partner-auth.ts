import { appsScriptCall, clearSessionToken, getSessionToken, setSessionToken } from "@/lib/apps-script-api";

type PartnerSession = { loginId: string; email: string; name?: string; partnerId?: string };

export async function beginPartnerPasswordLoginFn({ data }: { data: { identifier: string; password: string } }) {
  return appsScriptCall<{
    ok: boolean;
    message?: string;
    loginId: string;
    partnerName: string;
    partnerStatus: string;
    maskedRecoveryEmail: string;
  }>("auth.partner.begin", data, { role: "public" });
}

export async function verifyPartnerLoginOtpFn({ data }: { data: { identifier: string; otp: string } }) {
  const result = await appsScriptCall<{ ok: boolean; message?: string; token?: string; partnerStatus?: string; loginId?: string }>("auth.partner.verifyOtp", data, { role: "public" });
  if (result.ok && result.token) setSessionToken("partner", result.token);
  return result;
}

export async function requestPartnerResetOtpFn({ data }: { data: { identifier: string } }) {
  return appsScriptCall<{ ok: boolean; message?: string; loginId: string; maskedRecoveryEmail: string }>("auth.partner.requestReset", data, { role: "public" });
}

export async function completePartnerPasswordResetFn({ data }: { data: { identifier: string; otp: string; newPassword: string } }) {
  return appsScriptCall<{ ok: boolean; message?: string }>("auth.partner.resetPassword", data, { role: "public" });
}

export async function verifyPartnerResetOtpFn({ data }: { data: { identifier: string; otp: string } }) {
  return appsScriptCall<{ ok: boolean; message?: string }>("auth.partner.verifyResetOtp", data, { role: "public" });
}

export async function getCurrentPartnerFn() {
  if (!getSessionToken("partner")) return null;
  try {
    return await appsScriptCall<PartnerSession | null>("auth.partner.session", {}, { role: "partner" });
  } catch {
    clearSessionToken("partner");
    return null;
  }
}

export async function logoutPartnerFn() {
  try { await appsScriptCall("auth.logout", { role: "partner" }, { role: "partner" }); } catch { /* clear locally */ }
  clearSessionToken("partner");
  return { ok: true as const };
}
