import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeadContent, Link, Outlet, createRootRouteWithContext, useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { CosmicEnvironment } from "@/components/cosmic-environment";
import inrishiLogo from "@/assets/inrishi-public-logo.png";

import { siteHref } from "@/lib/site-path";
import { getRuntimeConfig } from "@/lib/runtime-config";
function NotFoundComponent() {
  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-14">
      <section className="w-full max-w-2xl border border-white/10 bg-[#06111b]/90 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
        <img src={inrishiLogo} alt="INRISHI" className="mx-auto h-20 w-20 rounded-2xl object-contain" />
        <p className="section-kicker mt-8">INRISHI NAVIGATION</p>
        <h1 className="mt-3 font-display text-5xl font-semibold text-white">This page has moved.</h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/65">The requested page is not available at this address. Use the verified Inrishi routes below instead of leaving the website.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={siteHref("/")} className="inline-flex h-12 items-center bg-primary px-6 font-semibold text-slate-950">Main website</a>
          <a href={siteHref("/customer-login")} className="inline-flex h-12 items-center border border-white/15 px-6 font-semibold text-white">Customer Login</a>
          <a href="https://partner.inrishi.in/login" className="inline-flex h-12 items-center border border-white/15 px-6 font-semibold text-white">Partner Login</a>
        </div>
        <p className="mt-8 text-xs uppercase tracking-[.18em] text-white/35">Intelligence inside.</p>
      </section>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Please try again.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Try again</button>
          <a href={siteHref("/")} className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    document.documentElement.dataset["inrishiSite"] = "main";
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = `${getRuntimeConfig().MAIN_ORIGIN}${pathname === "/" ? "/" : pathname}`;
  }, [pathname]);

  const isWorkspaceRoute =
    pathname === "/customer-login" ||
    pathname === "/customer-portal" ||
    pathname === "/admin" ||
    pathname.startsWith("/r/9f2a7c4d6e");

  return (
    <QueryClientProvider client={queryClient}>
      <HeadContent />
      {!isWorkspaceRoute && <CosmicEnvironment />}
      <Outlet />
    </QueryClientProvider>
  );
}
