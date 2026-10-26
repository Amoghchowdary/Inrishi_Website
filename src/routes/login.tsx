import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { PartnerLogin } from "./partner-login";
import { ensurePartnerHost } from "@/lib/partner-host";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Partner Login | Inrishi" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: PartnerLoginAlias,
});

function PartnerLoginAlias() {
  useEffect(() => ensurePartnerHost("/login"), []);
  return <PartnerLogin />;
}
