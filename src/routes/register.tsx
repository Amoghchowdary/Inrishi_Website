import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { PartnerRegister } from "./partner-register";
import { ensurePartnerHost } from "@/lib/partner-host";
export const Route=createFileRoute("/register")({component:Page});function Page(){useEffect(()=>ensurePartnerHost("/register"),[]);return <PartnerRegister/>}
