import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { PartnerRegister } from "./partner-register";
import { ensurePartnerHost } from "@/lib/partner-host";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Become an Inrishi Partner | Inrishi" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: PartnerRegisterAlias,
});

function PartnerRegisterAlias() {
  useEffect(() => ensurePartnerHost("/register"), []);
  return <PartnerRegister />;
}
