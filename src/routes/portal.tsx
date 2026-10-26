import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { PartnerPortal } from "./partner-portal";
import { getCurrentPartnerFn } from "@/services/partner-auth";
import { ensurePartnerHost } from "@/lib/partner-host";

export const Route = createFileRoute("/portal")({
  head: () => ({ meta: [{ title: "Partner Workspace | Inrishi" }, { name: "robots", content: "noindex, nofollow" }] }),
  loader: async () => {
    const partner = await getCurrentPartnerFn();
    if (!partner) throw redirect({ to: "/login" });
    return partner;
  },
  component: PartnerPortalAlias,
});

function PartnerPortalAlias() {
  const session = Route.useLoaderData();
  useEffect(() => ensurePartnerHost("/portal"), []);
  return <PartnerPortal session={session} />;
}
