import { getRuntimeConfig } from "@/lib/runtime-config";

function configuredHostname(origin: string) {
  try {
    return new URL(origin).hostname.toLowerCase();
  } catch {
    return "";
  }
}

export function isPartnerHostname(hostname: string) {
  const host = hostname.toLowerCase();
  const configuredPartnerHost = configuredHostname(getRuntimeConfig().PARTNER_ORIGIN);
  return host === configuredPartnerHost || host.startsWith("partner.");
}

export function partnerOriginFromLocation() {
  return getRuntimeConfig().PARTNER_ORIGIN;
}

export function ensurePartnerHost(pathname: string) {
  if (typeof window === "undefined") return;
  if (isPartnerHostname(window.location.hostname)) return;
  window.location.replace(`${getRuntimeConfig().PARTNER_ORIGIN}${pathname}`);
}

export function mainOriginFromLocation() {
  return getRuntimeConfig().MAIN_ORIGIN;
}

export function ensureMainHost(pathname: string) {
  if (typeof window === "undefined") return;
  if (!isPartnerHostname(window.location.hostname)) return;
  window.location.replace(`${getRuntimeConfig().MAIN_ORIGIN}${pathname}`);
}
