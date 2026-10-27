import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { getRuntimeConfig } from "@/lib/runtime-config";
export const Route=createFileRoute("/register")({head:()=>({meta:[{title:"Partner Registration | Inrishi"},{name:"robots",content:"noindex, nofollow"}]}),component:ExternalPartnerRedirect});
function ExternalPartnerRedirect(){useEffect(()=>{window.location.replace(`${getRuntimeConfig().PARTNER_ORIGIN}/register`)},[]);return <main className="workspace-shell grid min-h-screen place-items-center px-5"><div className="workspace-panel p-8 text-center"><h1 className="font-display text-2xl font-semibold">Opening Inrishi Partner Network</h1><p className="mt-3">Redirecting to partner.inrishi.in…</p><a className="mt-5 inline-flex font-semibold text-emerald-700" href={`${getRuntimeConfig().PARTNER_ORIGIN}/register`}>Continue</a></div></main>}
