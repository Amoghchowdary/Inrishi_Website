import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowUpRight, CheckCircle2, LockKeyhole, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import inrishiLogo from "@/assets/inrishi-logo.png";
import { loadPortalStore, portalStoreEventName } from "@/lib/portal-store";
import { submitWebsiteInquiry } from "@/lib/business-api";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Inrishi | Request a Quote" },
      { name: "description", content: "Tell Inrishi about your software, AI, ERP, CRM, website or business transformation requirement." },
      { property: "og:title", content: "Contact Inrishi | Request a Quote" },
      { property: "og:description", content: "Share your project requirement directly with the Inrishi team." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ContactPage,
});

const phoneDisplay = "+91 83418 89762";
const officeAddress = "Plot No. 76, Road No. 9, Sumashaila Township, Isnapur, Patancheru, Hyderabad, Telangana 502307, India";
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(officeAddress)}`;

function ContactPage() {
  const [showCustomerLogin, setShowCustomerLogin] = useState(true);
  const [form, setForm] = useState({ name: "", phone: "", email: "", requirement: "" });
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const sync = () => setShowCustomerLogin(loadPortalStore().websiteControls.customerLoginVisible);
    sync();
    const event = portalStoreEventName();
    window.addEventListener(event, sync);
    return () => { window.removeEventListener(event, sync); };
  }, []);

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true); setSuccess(""); setError("");
    try {
      const result = await submitWebsiteInquiry({ ...form, source: "Main website contact form" });
      setSuccess(result.message || "Thank you. Your requirement has been sent to Inrishi.");
      setForm({ name: "", phone: "", email: "", requirement: "" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We couldn't send your requirement. Please try again.");
    } finally { setPending(false); }
  }

  return (
    <div className="site-shell min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="relative z-10">
        <header className="site-header border-b border-border/60">
          <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-5 px-5 md:px-10 lg:px-16">
            <a href="/" className="flex min-w-0 items-center" aria-label="Inrishi home"><img src={inrishiLogo} alt="INRISHI" className="h-auto w-[118px] object-contain sm:w-[142px]" /></a>
            <nav className="hidden items-center gap-6 md:flex" aria-label="Contact navigation">
              <a href="/#solutions" className="nav-link">Services</a><a href="/sample-work" className="nav-link">Sample Work</a><a href="/contact" className="nav-link text-primary">Contact</a>
              {showCustomerLogin && <a href="/customer-login" className="nav-link inline-flex items-center gap-1.5"><LockKeyhole size={13} /> Customer Login</a>}
            </nav>
            <Button asChild variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary"><a href="tel:+918341889762">Call us <Phone size={15} /></a></Button>
          </div>
        </header>

        <main><section className="relative mx-auto max-w-[1440px] px-5 py-14 md:px-10 md:py-20 lg:px-16 lg:py-24">
          <a href="/" className="mb-10 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary"><ArrowLeft size={14} /> Back to Inrishi</a>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.82fr] lg:gap-16 xl:gap-24">
            <div>
              <p className="section-kicker">REQUEST A QUOTE</p>
              <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-[72px]">Tell us about <span className="text-primary">your project.</span></h1>
              <p className="mt-6 max-w-2xl text-base leading-[1.8] text-muted-foreground sm:text-lg">Share what your business needs, the problem you want to solve, or the Inrishi service you are interested in. Your request goes directly into our enquiry system for follow-up.</p>

              <form onSubmit={submitInquiry} className="mt-10 grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="form-label">Full name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" autoComplete="name" className="form-input h-13" /></label>
                  <label className="form-label">Phone number<input required type="tel" inputMode="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Your phone number" autoComplete="tel" className="form-input h-13" /></label>
                </div>
                <label className="form-label">Email address <span className="text-muted-foreground">(optional)</span><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="name@example.com" autoComplete="email" className="form-input h-13" /></label>
                <label className="form-label">Your requirement<textarea required rows={7} value={form.requirement} onChange={(event) => setForm({ ...form, requirement: event.target.value })} placeholder="Tell us what your business needs, the problem you want to solve, or the service you are interested in..." className="form-input resize-y" /></label>
                {success && <div className="flex gap-3 border border-primary/30 bg-primary/10 px-4 py-3 text-sm"><CheckCircle2 size={18} className="shrink-0 text-primary" /><span>{success}</span></div>}
                {error && <div className="border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</div>}
                <Button type="submit" disabled={pending} className="h-12 w-fit rounded-none bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">{pending ? "Sending…" : "Send requirement"} <Send size={16} /></Button>
              </form>
            </div>

            <aside className="h-fit border border-border bg-card/70 p-7 shadow-[0_20px_80px_var(--glow-green)] sm:p-8 lg:mt-6">
              <p className="section-kicker">DIRECT CONTACT</p><h2 className="mt-5 font-display text-3xl font-semibold leading-tight sm:text-4xl">Prefer to speak with us?</h2>
              <div className="mt-8 border-t border-border">
                <div className="grid grid-cols-[36px_1fr] gap-4 border-b border-border py-6"><Phone size={21} className="mt-0.5 text-primary" /><div><h3 className="font-display text-base font-semibold">Call us</h3><a href="tel:+918341889762" className="mt-2 inline-block text-sm text-primary hover:text-cyan">{phoneDisplay}</a><p className="mt-1 text-xs text-muted-foreground">Tap to call directly</p></div></div>
                <div className="grid grid-cols-[36px_1fr] gap-4 py-6"><MapPin size={22} className="mt-0.5 text-primary" /><div><h3 className="font-display text-base font-semibold">Office</h3><a href={mapsUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-cyan">Sumashaila Township, Patancheru <ArrowUpRight size={14} /></a><p className="mt-2 text-xs leading-[1.7] text-muted-foreground">Isnapur, Patancheru, Telangana 502307</p></div></div>
              </div>
            </aside>
          </div>
        </section></main>
        <SiteFooter />
      </div>
    </div>
  );
}
