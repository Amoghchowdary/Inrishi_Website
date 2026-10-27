import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { PartnerLogin } from "./partner-login";
import { ensurePartnerHost } from "@/lib/partner-host";
export const Route=createFileRoute("/login")({component:Page});function Page(){useEffect(()=>ensurePartnerHost("/login"),[]);return <PartnerLogin/>}
