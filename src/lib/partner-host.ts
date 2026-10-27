import{getRuntimeConfig}from"@/lib/runtime-config";
function host(origin:string){try{return new URL(origin).hostname.toLowerCase()}catch{return""}}
export function isPartnerHostname(hostname:string){const h=hostname.toLowerCase();return h===host(getRuntimeConfig().PARTNER_ORIGIN)||h.startsWith("partner.")}
export function ensurePartnerHost(pathname:string){if(typeof window!=="undefined"&&!isPartnerHostname(window.location.hostname))window.location.replace(`${getRuntimeConfig().PARTNER_ORIGIN}${pathname}`)}
export function ensureMainHost(pathname:string){if(typeof window!=="undefined"&&isPartnerHostname(window.location.hostname))window.location.replace(`${getRuntimeConfig().MAIN_ORIGIN}${pathname}`)}
