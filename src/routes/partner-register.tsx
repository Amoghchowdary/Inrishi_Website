import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, UserPlus } from "lucide-react";
import { useState, type FormEvent } from "react";
import inrishiLogo from "@/assets/inrishi-logo.png";
import { registerPartner } from "@/lib/business-api";

export const Route = createFileRoute("/partner-register")({
  head: () => ({ meta: [{ title: "Partner Registration | Inrishi" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: PartnerRegister,
});

export function PartnerRegister() {
  const [submitted, setSubmitted] = useState(false);
  const [issuedLoginId, setIssuedLoginId] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", city: "", experience: "", note: "", password: "" });
  function set<K extends keyof typeof form>(key: K, value: string) { setForm((current) => ({ ...current, [key]: value })); }
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true); setError("");
    try {
      const result = await registerPartner(form);
      if (!result.ok || !result.loginId) { setError(result.message || "We could not submit your application."); return; }
      setIssuedLoginId(result.loginId);
      setSubmitted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not submit your application.");
    } finally { setPending(false); }
  }

  return <div className="workspace-shell min-h-screen text-white"><div className="relative z-10 mx-auto max-w-[1180px] px-5 py-8 md:px-8"><a href="/" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.16em] text-white/60 hover:text-primary"><ArrowLeft size={14}/> Partner website</a><div className="mt-8 grid gap-8 lg:grid-cols-[.78fr_1.22fr]">
    <aside className="workspace-panel p-7 lg:sticky lg:top-8 lg:h-fit"><img src={inrishiLogo} alt="Inrishi" className="w-[150px]"/><p className="section-kicker mt-10">PARTNER REGISTRATION</p><h1 className="mt-4 font-display text-4xl font-semibold">Build business with Inrishi.</h1><p className="mt-4 leading-7 text-white/60">Register with your details. The Inrishi team reviews your application before the full partner features become available.</p><div className="mt-8 grid gap-3 text-sm">{["You can still sign in while your application is being reviewed", "You can clearly see the services Inrishi provides", "Pricing will be shown separately once finalised", "Successful leads can be created as Inrishi customers after the required first payment"].map((item) => <div key={item} className="flex gap-3 border-t border-white/8 pt-3"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-primary"/><span className="text-white/70">{item}</span></div>)}</div></aside>
    <section className="workspace-panel p-7 sm:p-9">{submitted ? <div className="flex min-h-[520px] flex-col justify-center"><div className="flex h-14 w-14 items-center justify-center border border-primary/30 bg-primary/10 text-primary"><CheckCircle2 size={28}/></div><p className="section-kicker mt-7">APPLICATION RECEIVED</p><h2 className="mt-4 font-display text-4xl font-semibold">Your application is under review.</h2><p className="mt-4 max-w-2xl leading-7 text-white/65">Inrishi has created your Partner Login ID. You can sign in now, and the full partner area will open after your application is approved.</p><div className="mt-5 border border-primary/20 bg-primary/[.06] p-4"><p className="font-mono text-[10px] uppercase tracking-[.14em] text-primary">Your Inrishi Partner Login ID</p><p className="mt-2 break-all text-lg font-semibold text-white">{issuedLoginId}</p><p className="mt-2 text-xs leading-5 text-white/50">Use this ID only to sign in to Inrishi. It is not a normal email inbox. Your contact email is {form.email}.</p></div><a href="/login" className="mt-8 inline-flex h-11 w-fit items-center gap-2 bg-primary px-5 font-semibold text-primary-foreground">Continue to login <ArrowRight size={16}/></a></div> : <form onSubmit={submit}><p className="section-kicker">YOUR DETAILS</p><h2 className="mt-3 font-display text-4xl font-semibold">Partner application</h2><div className="mt-8 grid gap-5 sm:grid-cols-2"><Field label="Full name" value={form.name} onChange={(v)=>set("name",v)} required/><Field label="Contact email" type="email" value={form.email} onChange={(v)=>set("email",v)} required/><Field label="Phone" value={form.phone} onChange={(v)=>set("phone",v)} required/><Field label="Company / Business" value={form.company} onChange={(v)=>set("company",v)}/><Field label="City" value={form.city} onChange={(v)=>set("city",v)} required/><Field label="Create password" type="password" value={form.password} onChange={(v)=>set("password",v)} required/><label className="form-label sm:col-span-2">Sales / business experience<textarea className="form-input min-h-24 resize-y" value={form.experience} onChange={(e)=>set("experience",e.target.value)} placeholder="Briefly describe your experience or network." /></label><label className="form-label sm:col-span-2">Anything else we should know?<textarea className="form-input min-h-24 resize-y" value={form.note} onChange={(e)=>set("note",e.target.value)} /></label></div>{error&&<p className="mt-5 border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p>}<button disabled={pending} className="mt-7 inline-flex h-12 items-center gap-2 bg-primary px-6 font-semibold text-primary-foreground disabled:opacity-60"><UserPlus size={17}/> {pending?"Submitting…":"Submit application"}</button></form>}</section>
  </div></div></div>;
}

function Field({ label, value, onChange, type="text", required=false }: { label:string; value:string; onChange:(value:string)=>void; type?:string; required?:boolean }) { return <label className="form-label">{label}<input className="form-input h-11" type={type} required={required} value={value} onChange={(e)=>onChange(e.target.value)} /></label>; }
