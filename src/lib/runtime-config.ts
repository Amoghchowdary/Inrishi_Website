export type InrishiRuntimeConfig = {
  APP_VERSION: string;
  ENVIRONMENT: "production" | string;
  APPS_SCRIPT_URL: string;
  MAIN_ORIGIN: string;
  PARTNER_ORIGIN: string;
  MAX_UPLOAD_MB: number;
  PORTALS: {
    main: { home: string; customerLogin: string; customerPortal: string; adminEntry: string };
    partner: { home: string; login: string; register: string; portal: string };
  };
};

declare global {
  interface Window {
    INRISHI_CONFIG?: Partial<InrishiRuntimeConfig>;
  }
}

const defaults: InrishiRuntimeConfig = {
  APP_VERSION: "39.0.0",
  ENVIRONMENT: "production",
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbzQ1YMIghWp_p3hy3NxsJraffY_AjLA77JlyfYF7YvkGlylLnV2MiDgJViLjByn9ntq/exec",
  MAIN_ORIGIN: "https://www.inrishi.in",
  PARTNER_ORIGIN: "https://partner.inrishi.in",
  MAX_UPLOAD_MB: 5,
  PORTALS: {
    main: { home: "/", customerLogin: "/customer-login", customerPortal: "/customer-portal", adminEntry: "/r/9f2a7c4d6e" },
    partner: { home: "/", login: "/login", register: "/register", portal: "/portal" },
  },
};

export function getRuntimeConfig(): InrishiRuntimeConfig {
  if (typeof window === "undefined") return defaults;
  return { ...defaults, ...(window.INRISHI_CONFIG ?? {}) };
}

export function isBackendConfigured() {
  const url = getRuntimeConfig().APPS_SCRIPT_URL.trim();
  return /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec(?:\?.*)?$/.test(url);
}
