import { getRuntimeConfig, isBackendConfigured } from "@/lib/runtime-config";
import { isPartnerHostname } from "@/lib/partner-host";

type Role = "public" | "customer" | "partner" | "admin";
type ApiEnvelope<T> = { source: "INRISHI_APPS_SCRIPT"; requestId: string; ok: boolean; data?: T; error?: string; code?: string };

type ApiOptions = {
  role?: Role;
  timeoutMs?: number;
};

const SESSION_KEYS: Record<Exclude<Role, "public">, string> = {
  customer: "inrishi-v34-customer-session",
  partner: "inrishi-v34-partner-session",
  admin: "inrishi-v34-admin-session",
};

function inferredRole(): Role {
  if (typeof window === "undefined") return "public";
  const path = window.location.pathname;
  if (path === "/admin" || path.startsWith("/r/9f2a7c4d6e")) return "admin";
  if (isPartnerHostname(window.location.hostname)) return "partner";
  if (path.startsWith("/customer")) return "customer";
  return "public";
}

export function getSessionToken(role: Exclude<Role, "public">): string {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem(SESSION_KEYS[role]) || "";
}

export function setSessionToken(role: Exclude<Role, "public">, token: string) {
  if (typeof window === "undefined") return;
  clearSessionToken(role);
  window.sessionStorage.setItem(SESSION_KEYS[role], token);
}

export function clearSessionToken(role: Exclude<Role, "public">) {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(SESSION_KEYS[role]);
}

export class AppsScriptBackendError extends Error {
  code: string | undefined;
  constructor(message: string, code?: string) {
    super(message);
    this.name = "AppsScriptBackendError";
    this.code = code;
  }
}

function safeGoogleOrigin(origin: string) {
  return /^https:\/\/(?:script\.google\.com|script\.googleusercontent\.com)$/.test(origin);
}

export async function appsScriptCall<T>(action: string, payload: Record<string, unknown> = {}, options: ApiOptions = {}): Promise<T> {
  if (typeof window === "undefined") throw new AppsScriptBackendError("This service is available only through the Inrishi website.", "BROWSER_ONLY");
  if (!isBackendConfigured()) throw new AppsScriptBackendError("Inrishi services are temporarily unavailable. Please try again later.", "BACKEND_NOT_CONFIGURED");

  const config = getRuntimeConfig();
  const role = options.role ?? inferredRole();
  const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const iframeName = `inrishi_api_${requestId.replace(/[^a-z0-9_]/gi, "_")}`;
  const token = role === "public" ? "" : getSessionToken(role);

  return await new Promise<T>((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.name = iframeName;
    iframe.title = "Inrishi secure service";
    iframe.tabIndex = -1;
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.display = "none";

    const form = document.createElement("form");
    form.method = "POST";
    form.action = config.APPS_SCRIPT_URL;
    form.target = iframeName;
    form.acceptCharset = "UTF-8";
    form.style.display = "none";

    const fields: Record<string, string> = {
      action,
      requestId,
      role,
      token,
      origin: window.location.origin,
      payload: JSON.stringify(payload),
    };
    for (const [name, value] of Object.entries(fields)) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    }

    let settled = false;
    const cleanup = () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(timer);
      form.remove();
      window.setTimeout(() => iframe.remove(), 50);
    };
    const finishError = (error: Error) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    };
    const onMessage = (event: MessageEvent) => {
      const message = event.data as Partial<ApiEnvelope<T>> | null;
      if (!message || message.source !== "INRISHI_APPS_SCRIPT" || message.requestId !== requestId) return;
      if (!safeGoogleOrigin(event.origin)) return;
      if (settled) return;
      settled = true;
      cleanup();
      if (!message.ok) reject(new AppsScriptBackendError(message.error || "The request could not be completed.", message.code));
      else resolve(message.data as T);
    };
    const timer = window.setTimeout(() => finishError(new AppsScriptBackendError("Inrishi did not respond in time. Please try again.", "TIMEOUT")), options.timeoutMs ?? 45_000);

    window.addEventListener("message", onMessage);
    document.body.appendChild(iframe);
    document.body.appendChild(form);
    form.submit();
  });
}

export async function backendHealthCheck() {
  return appsScriptCall<{ service: string; version: string; status: string; timestamp: string }>("system.health", {}, { role: "public", timeoutMs: 15_000 });
}
