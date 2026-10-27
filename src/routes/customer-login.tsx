import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loginCustomerFn } from "@/services/customer-auth";
import inrishiLogo from "@/assets/inrishi-logo.png";

import { siteHref } from "@/lib/site-path";
export const Route = createFileRoute("/customer-login")({
  head: () => ({ meta: [{ title: "Customer Login | Inrishi" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: CustomerLogin,
});

function CustomerLogin() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true); setMessage("");
    try {
      const result = await loginCustomerFn({ data: { email: loginId.trim(), password } });
      if (!result.ok) { setMessage(result.message || "Unable to sign in. Please check your details."); return; }
      window.location.assign(siteHref("/customer-portal"));
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Unable to sign in. Please try again.");
    } finally { setPending(false); }
  }

  return <div className="workspace-shell min-h-screen overflow-x-hidden">
    <header className="workspace-header border-b border-white/10"><div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 md:px-10 lg:px-16"><a href={siteHref("/")}><img src={inrishiLogo} alt="INRISHI" className="brand-logo" /></a><Button asChild variant="ghost"><a href={siteHref("/contact")}>Need help? <ArrowRight size={15}/></a></Button></div></header>
    <nav className="mobile-page-nav md:hidden"><a href={siteHref("/#solutions")}>Services</a><a href={siteHref("/sample-work")}>Sample Work</a><a href={siteHref("/contact")}>Contact</a></nav>
    <main className="mx-auto max-w-[1180px] px-5 py-12 md:px-10 lg:px-16 lg:py-20">
      <a href={siteHref("/")} className="inline-flex items-center gap-2 text-xs text-white/60"><ArrowLeft size={14}/> Back to Inrishi</a>
      <section className="title-card auth-title-card mt-10 grid overflow-hidden lg:grid-cols-[.95fr_1.05fr]">
        <div className="border-b border-slate-200 p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-12"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><ShieldCheck/></span><p className="section-kicker mt-8">CUSTOMER ACCESS</p><h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">Your project, in one secure area.</h1><p className="mt-5 text-sm leading-7 text-muted-foreground">View selected services, payments, work progress, documents and messages connected to your Inrishi project.</p></div>
        <div className="p-7 sm:p-10 lg:p-12"><p className="section-kicker">SIGN IN</p><h2 className="mt-4 font-display text-3xl font-semibold">Customer Login</h2><p className="mt-3 text-sm text-muted-foreground">Use the Inrishi Customer Login ID and password issued to you.</p><form onSubmit={submit} className="mt-8 grid gap-5"><label className="form-label">Customer Login ID<input required autoComplete="username" value={loginId} onChange={e=>setLoginId(e.target.value)} className="form-input h-12" placeholder="customer.company@inrishi.in"/></label><label className="form-label">Password<span className="relative"><input required type={showPassword?"text":"password"} autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="form-input h-12 pr-12"/><button type="button" onClick={()=>setShowPassword(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" aria-label={showPassword?"Hide password":"Show password"}>{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></span></label>{message&&<p role="alert" className="text-sm text-red-700">{message}</p>}<Button type="submit" disabled={pending} className="h-12">{pending?"Signing in…":"Sign in"}<ArrowRight size={16}/></Button></form></div>
      </section>
    </main>
  </div>;
}
