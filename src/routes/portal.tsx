import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { PartnerPortal } from "./partner-portal";
import { getCurrentPartnerFn } from "@/services/partner-auth";
import { ensurePartnerHost } from "@/lib/partner-host";
export const Route=createFileRoute("/portal")({loader:async()=>{const p=await getCurrentPartnerFn();if(!p)throw redirect({to:"/login"});return p},component:Page});function Page(){const session=Route.useLoaderData();useEffect(()=>ensurePartnerHost("/portal"),[]);return <PartnerPortal session={session}/>}
