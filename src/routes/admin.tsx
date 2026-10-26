import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Inrishi" }, { name: "robots", content: "noindex, nofollow, noarchive" }] }),
  loader: () => { throw redirect({ to: "/" }); },
  component: () => null,
});
