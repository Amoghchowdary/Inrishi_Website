export type InrishiRuntimeConfig = {
  APP_VERSION: string;
  ENVIRONMENT: string;
  SITE_ID: "main" | "partner";
  APPS_SCRIPT_URL: string;
  MAIN_ORIGIN: string;
  PARTNER_ORIGIN: string;
  MAX_UPLOAD_MB: number;
  PORTALS: {
    main: { home:string; customerLogin:string; customerPortal:string; partnerNetwork:string; partnerLogin:string; partnerRegister:string; partnerPortal:string; adminEntry:string; hiddenAdminEntry:string };
    partner: { home:string; login:string; register:string; portal:string };
  };
};

type RuntimeOverride = Omit<Partial<InrishiRuntimeConfig>, "PORTALS"> & { PORTALS?: { main?: Partial<InrishiRuntimeConfig["PORTALS"]["main"]>; partner?: Partial<InrishiRuntimeConfig["PORTALS"]["partner"]> } };
declare global { interface Window { INRISHI_CONFIG?: RuntimeOverride; } }

const defaults: InrishiRuntimeConfig = {
  APP_VERSION: "67.0.0",
  ENVIRONMENT: "production",
  SITE_ID: "main",
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbzQ1YMIghWp_p3hy3NxsJraffY_AjLA77JlyfYF7YvkGlylLnV2MiDgJViLjByn9ntq/exec",
  MAIN_ORIGIN: "https://www.inrishi.in",
  PARTNER_ORIGIN: "https://partner.inrishi.in",
  MAX_UPLOAD_MB: 5,
  PORTALS: {
    main: {
      home: "/", customerLogin: "/customer-login", customerPortal: "/customer-portal",
      partnerNetwork: "https://partner.inrishi.in/", partnerLogin: "https://partner.inrishi.in/login", partnerRegister: "https://partner.inrishi.in/register", partnerPortal: "https://partner.inrishi.in/portal",
      adminEntry: "/admin", hiddenAdminEntry: "/r/9f2a7c4d6e"
    },
    partner: { home: "https://partner.inrishi.in/", login: "https://partner.inrishi.in/login", register: "https://partner.inrishi.in/register", portal: "https://partner.inrishi.in/portal" }
  }
};

export function getRuntimeConfig(): InrishiRuntimeConfig {
  if (typeof window === "undefined") return defaults;
  const override = window.INRISHI_CONFIG ?? {};
  return { ...defaults, ...override, PORTALS: { main: { ...defaults.PORTALS.main, ...(override.PORTALS?.main ?? {}) }, partner: { ...defaults.PORTALS.partner, ...(override.PORTALS?.partner ?? {}) } } };
}
export function isBackendConfigured(): boolean {
  const endpoint=getRuntimeConfig().APPS_SCRIPT_URL.trim();
  return /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec(?:\?.*)?$/.test(endpoint);
}
export const runtimeConfig: InrishiRuntimeConfig = getRuntimeConfig();
