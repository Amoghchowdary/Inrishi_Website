import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  LockKeyhole,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  BriefcaseBusiness,
  DatabaseZap,
  Monitor,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import inrishiLogo from "@/assets/inrishi-logo.png";
import { loadPortalStore, portalStoreEventName } from "@/lib/portal-store";

export const Route = createFileRoute("/sample-work")({
  head: () => ({
    meta: [
      { title: "Sample Work | Inrishi" },
      {
        name: "description",
        content:
          "Explore representative examples of the systems and business workflows Inrishi can design across operations, CRM, employee management, website design and AI-enabled software.",
      },
      { property: "og:title", content: "Sample Work | Inrishi" },
      {
        property: "og:description",
        content: "Representative examples of intelligent systems and workflows built around real business operations.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: SampleWorkPage,
});

const work = [
  {
    icon: UsersRound,
    number: "01",
    type: "CUSTOMER OPERATIONS",
    title: "CRM workflow",
    text: "A connected customer pipeline that keeps conversations, opportunities, next actions and relationship context together.",
  },
  {
    icon: Boxes,
    number: "02",
    type: "BUSINESS OPERATIONS",
    title: "ERP business system",
    text: "One connected place for inventory, purchases, sales and the everyday business steps that would otherwise be managed separately.",
  },
  {
    icon: BriefcaseBusiness,
    number: "03",
    type: "PEOPLE OPERATIONS",
    title: "Employee management",
    text: "A practical system for attendance, leave, payroll information, employee records and everyday people management.",
  },
  {
    icon: DatabaseZap,
    number: "04",
    type: "DATA & REPORTING",
    title: "Operations dashboard",
    text: "A management dashboard that turns day-to-day business information into clear views of work, issues and performance.",
  },
  {
    icon: Sparkles,
    number: "05",
    type: "AI TRANSFORMATION",
    title: "AI-assisted workflow",
    text: "Automation designed to reduce repetitive work, keep important business information together and help teams complete routine tasks faster.",
  },
  {
    icon: Monitor,
    number: "06",
    type: "DIGITAL EXPERIENCE",
    title: "Website design",
    text: "A responsive, brand-led website experience shaped around clear navigation, strong content hierarchy, performance and customer conversion.",
  },
];

function SampleWorkPage() {
  const [showCustomerLogin, setShowCustomerLogin] = useState(true);
  useEffect(() => {
    const sync = () => setShowCustomerLogin(loadPortalStore().websiteControls.customerLoginVisible);
    sync();
    const event = portalStoreEventName();
    window.addEventListener(event, sync);
    return () => { window.removeEventListener(event, sync); };
  }, []);
  return (
    <div className="site-shell min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="relative z-10">
        <header className="site-header border-b border-border/60">
          <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-5 px-5 md:px-10 lg:px-16">
            <a href="/" className="flex min-w-0 items-center" aria-label="Inrishi home">
              <img src={inrishiLogo} alt="INRISHI" className="h-auto w-[118px] object-contain sm:w-[142px]" />
            </a>
            <nav className="hidden items-center gap-6 md:flex" aria-label="Sample work navigation">
              <a href="/#solutions" className="nav-link">Services</a>
              <a href="/sample-work" className="nav-link text-primary">Sample Work</a>
              <a href="/contact" className="nav-link">Contact</a>
              {showCustomerLogin && <a href="/customer-login" className="nav-link inline-flex items-center gap-1.5"><LockKeyhole size={13} /> Customer Login</a>}
            </nav>
            <Button asChild variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary">
              <a href="/contact">Let's talk <ArrowUpRight size={15} /></a>
            </Button>
          </div>
        </header>

        <main>
          <section className="relative mx-auto max-w-[1440px] px-5 pb-16 pt-16 md:px-10 md:pb-24 md:pt-24 lg:px-16 lg:pb-28 lg:pt-28">
            <a href="/" className="mb-10 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary">
              <ArrowLeft size={14} /> Back to Inrishi
            </a>
            <div className="grid gap-10 lg:grid-cols-[1fr_0.65fr] lg:items-end lg:gap-20">
              <div>
                <p className="section-kicker">INRISHI / SAMPLE WORK</p>
                <h1 className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-[78px]">
                  Systems shaped around <span className="text-primary">real work.</span>
                </h1>
              </div>
              <div className="border-l border-primary/30 pl-6 sm:pl-8">
                <p className="text-base leading-[1.85] text-muted-foreground">
                  Examples of the kinds of business systems Inrishi can design. They are shown to help you understand what we can build for your own requirement.
                </p>
              </div>
            </div>
          </section>

          <section className="relative mx-auto max-w-[1440px] px-5 pb-20 md:px-10 lg:px-16 lg:pb-28">
            <div className="grid border-l border-t border-border md:grid-cols-2 xl:grid-cols-3">
              {work.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.number} className="group min-h-[330px] border-b border-r border-border bg-card/30 p-7 transition-colors hover:bg-card/60 sm:p-8">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-primary">/{item.number}</span>
                      <Icon size={27} strokeWidth={1.3} className="text-cyan" />
                    </div>
                    <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">{item.type}</p>
                    <h2 className="mt-3 font-display text-2xl font-semibold leading-tight sm:text-3xl">{item.title}</h2>
                    <p className="mt-4 text-sm leading-[1.8] text-muted-foreground">{item.text}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="relative mx-auto grid max-w-[1440px] gap-10 px-5 py-16 md:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-16 lg:py-24">
            <div>
              <p className="section-kicker">HOW WE TURN YOUR REQUIREMENT INTO A SYSTEM</p>
              <h2 className="mt-5 font-display text-4xl font-semibold leading-tight sm:text-5xl">Same principle.<br /><span className="text-cyan">Your process.</span></h2>
            </div>
            <div className="grid gap-0 border-t border-border">
              {[
                ["01", "Understand", "Understand who uses the process today, what information is involved and where the problems occur."],
                ["02", "Design", "Plan the screens, steps and responsibilities around the result your business needs."],
                ["03", "Build", "Build the approved solution and connect it to the relevant business tools where required."],
                ["04", "Refine", "Review the working solution with your team and improve the parts that matter most."],
              ].map(([n, title, text]) => (
                <div key={n} className="grid grid-cols-[42px_minmax(0,1fr)] gap-4 border-b border-border py-6 sm:grid-cols-[55px_170px_minmax(0,1fr)] sm:items-center sm:gap-6">
                  <span className="font-mono text-xs text-primary">/{n}</span>
                  <h3 className="font-display text-xl font-semibold">{title}</h3>
                  <p className="col-start-2 text-sm leading-[1.75] text-muted-foreground sm:col-start-auto">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="relative mx-auto max-w-[1440px] px-5 pb-24 pt-10 md:px-10 lg:px-16 lg:pb-32">
            <div className="grid overflow-hidden border border-primary/25 bg-card/70 shadow-[0_20px_80px_var(--glow-green)] lg:grid-cols-[1fr_auto]">
              <div className="p-7 sm:p-10">
                <p className="section-kicker">START WITH YOUR BUSINESS NEED</p>
                <h2 className="mt-5 max-w-3xl font-display text-3xl font-semibold leading-tight sm:text-4xl">Tell us what is slowing your team down or what you want to improve. We’ll show you what a practical solution could look like.</h2>
              </div>
              <div className="flex items-center border-t border-border p-7 sm:p-10 lg:border-l lg:border-t-0">
                <Button asChild className="h-12 rounded-none bg-primary px-6 text-primary-foreground hover:bg-primary/90">
                  <a href="/contact">Start a conversation <ArrowRight size={16} /></a>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
