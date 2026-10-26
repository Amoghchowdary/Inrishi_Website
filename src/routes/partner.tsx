import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight, BriefcaseBusiness, CheckCircle2, CircleUserRound, Cloud, FileCheck2,
  Globe2, Handshake, Layers3, LineChart, LogIn, MailCheck, Monitor, ShieldCheck,
  Sparkles, Target, UserCheck, UsersRound, WalletCards, Workflow,
} from "lucide-react";
import { useEffect, useState } from "react";
import inrishiLogo from "@/assets/inrishi-logo.png";
import { loadPortalStore, portalStoreEventName, type PortalStore } from "@/lib/portal-store";

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title: "Become an Inrishi Partner | Inrishi" },
      { name: "description", content: "Become an Inrishi Partner. Learn about Inrishi services, partner onboarding, lead conversion and the approved partner area." },
    ],
  }),
  component: PartnerWebsite,
});

const whyItems = [
  [Layers3, "Inrishi handles delivery", "You focus on finding and managing the customer relationship. Inrishi handles planning, design, development, testing and delivery."],
  [LineChart, "Keep your opportunities organised", "See your leads, customers, projects and incentives in one easy-to-follow partner area."],
  [CircleUserRound, "Customer creation built in", "After the required advance is paid, convert the lead into an Inrishi customer without entering the same information again."],
  [ShieldCheck, "Managed by Inrishi", "Inrishi reviews partner approvals, customer payments, projects and incentives so every step stays clear and accountable."],
] as const;

const partnerBenefits = [
  [Target, "Bring qualified opportunities", "Add prospective customers and track each step from first contact to conversion."],
  [UsersRound, "Own the relationship", "Keep visibility of the customers you originate while Inrishi manages project delivery."],
  [Sparkles, "Track incentives", "See Expected, Earned, Payout Pending and Paid incentive states without mixing them with customer payments."],
  [MailCheck, "Create the customer login", "Once the required payment is confirmed, the customer account and login details are prepared from your partner area."],
] as const;

const services = [
  { icon: Sparkles, title: "AI Business Transformation", intro: "We help businesses reduce repetitive work and connect everyday processes with practical automation.", includes: ["Process review and automation plan", "Approvals, reminders and notifications", "Data movement between relevant business tools", "Dashboards and reports", "Testing and team handover"] },
  { icon: Layers3, title: "ERP", intro: "A connected system for the parts of the business that need to work together every day.", includes: ["Sales, quotations and orders", "Purchases and supplier records", "Inventory and stock movement", "Invoices, receipts and business records", "Approvals and responsibility flows", "Management reports and business access controls"] },
  { icon: UsersRound, title: "CRM", intro: "A clear way to manage enquiries, follow-ups, opportunities and customer relationships from first contact onward.", includes: ["Lead capture from agreed sources", "Automatic assignment and sales stages", "Follow-up reminders and tasks", "Customer and conversation history", "Quotation/proposal and conversion flow", "Requirement/document tracking", "Alerts, notifications and sales reporting"] },
  { icon: BriefcaseBusiness, title: "Employee Management", intro: "Bring employee records and routine people-management work into one organised system.", includes: ["Employee profiles", "Attendance and leave", "Onboarding documents", "Requests and approvals", "Manager and employee access"] },
  { icon: WalletCards, title: "Books Customization", intro: "Adapt business-book and accounting workflows to your documents, approval process and reporting needs.", includes: ["Invoice and quotation formats", "Business and tax fields", "Review and approval steps", "Customer/vendor/item setup", "Reports and business connections"] },
  { icon: Workflow, title: "Custom Software", intro: "Purpose-built software when standard products do not match the way the business actually works.", includes: ["Requirement study", "UI/UX design", "Custom application development", "Roles and business rules", "Testing, deployment and handover"] },
  { icon: Cloud, title: "SaaS Products", intro: "Ready-to-use Inrishi software for common business needs, configured for faster adoption.", includes: ["Product setup", "Business configuration", "User roles", "Onboarding support", "Product updates and support"] },
  { icon: Monitor, title: "Website Design", intro: "A complete website engagement covering planning, design, development, launch and the first SEO/search-readiness work after launch.", includes: ["Website planning, page structure and visual design", "Responsive development", "Domain and deployment connection", "SEO titles, descriptions, headings, image text and relevant tagging", "Sitemap, robots and indexing readiness", "Google Search Console and analytics connections where access is provided", "Performance and mobile checks", "15-day assigned SEO executive after launch", "Indexing checks, sitemap submission, metadata/tag review and agreed on-page corrections during the support period"] },
] as const;

const process = [
  ["01", "Register", "Submit your name, business/contact information and create your Partner login."],
  ["02", "Inrishi reviews your application", "You can still sign in while your application is being reviewed. Full partner features open after approval."],
  ["03", "Add a lead", "Create an eligible prospect and manage follow-ups through your Partner Area."],
  ["04", "Collect the required first payment", "The configured first-payment threshold must be recorded as paid before the system enables customer conversion."],
  ["05", "Create the customer", "After the required first payment is confirmed, the customer account, project, login details and incentive record are created together."],
  ["06", "Track the project and incentive", "See the customer project status, login details and your incentive status from the same partner area."],
] as const;

export function PartnerWebsite() {
  const [store, setStore] = useState<PortalStore | null>(null);
  useEffect(() => {
    const sync = () => setStore(loadPortalStore());
    sync();
    window.addEventListener(portalStoreEventName(), sync);
    return () => {
      window.removeEventListener(portalStoreEventName(), sync);
    };
  }, []);

  const controls = store?.partnerWebsiteControls;
  const advancePercent = controls?.conversionAdvancePercent ?? 50;

  return (
    <div className="partner-site min-h-screen text-foreground">
      {controls?.announcementEnabled && controls.announcementText && (
        <div className="relative z-20 border-b border-primary/20 bg-primary/10 px-5 py-2 text-center text-xs font-semibold text-primary">{controls.announcementText}</div>
      )}
      <header className="partner-nav relative z-20 border-b border-white/8">
        <div className="mx-auto flex h-[78px] max-w-[1320px] items-center justify-between px-5 lg:px-8">
          <a href="/" aria-label="Inrishi Partner"><img src={inrishiLogo} alt="Inrishi" className="w-[132px]" /></a>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-white/65 lg:flex">
            <a href="#why" className="hover:text-white">Why Choose Us</a>
            <a href="#become" className="hover:text-white">Become a Partner</a>
            <a href="#services" className="hover:text-white">Services</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <a href="#process" className="hover:text-white">Process</a>
            {controls?.loginVisible !== false && <a href="/login" className="hover:text-primary">Login</a>}
            {controls?.registrationOpen !== false && <a href="/register" className="hover:text-primary">Register</a>}
          </nav>
          <div className="flex gap-2 lg:hidden">
            {controls?.loginVisible !== false && <a href="/login" className="inline-flex h-10 items-center gap-2 border border-white/15 px-4 text-sm font-semibold text-white"><LogIn size={15} /> Login</a>}
            {controls?.registrationOpen !== false && <a href="/register" className="hidden h-10 items-center gap-2 bg-primary px-4 text-sm font-semibold text-primary-foreground sm:inline-flex">Register <ArrowRight size={15} /></a>}
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid min-h-[690px] max-w-[1320px] items-center gap-12 px-5 py-20 lg:grid-cols-[1.08fr_.92fr] lg:px-8">
          <div>
            <p className="section-kicker">INRISHI PARTNER NETWORK</p>
            <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl">{controls?.heroTitle ?? "Become an Inrishi Partner"}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">{controls?.heroSubtitle ?? "Bring the customer. Inrishi handles the technology delivery."}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {controls?.registrationOpen !== false && <a href="/register" className="inline-flex h-12 items-center gap-2 bg-primary px-6 font-semibold text-primary-foreground">Become a Partner <ArrowRight size={17} /></a>}
              {controls?.loginVisible !== false && <a href="/login" className="inline-flex h-12 items-center gap-2 border border-white/15 px-6 font-semibold text-white">Partner Login <LogIn size={17} /></a>}
            </div>
            <div className="mt-10 max-w-2xl border-l-2 border-primary/60 pl-5">
              <p className="font-semibold text-white">Pricing is shown separately.</p>
              <p className="mt-2 text-sm leading-6 text-white/52">See what Inrishi provides here. Approved commercial details will be shown in the dedicated Pricing section when they are finalised.</p>
            </div>
          </div>
          <div className="partner-hero-card border border-white/10 bg-black/25 p-7 backdrop-blur-sm">
            <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center border border-primary/30 bg-primary/10 text-primary"><Handshake /></div><div><p className="font-display text-2xl font-semibold text-white">How the partnership works</p><p className="text-sm text-white/55">Lead → first payment → customer → project → incentive</p></div></div>
            <div className="mt-7 grid gap-3">{["Add an eligible lead", `Record the required ${advancePercent}% first payment`, "Convert the lead into a customer", "Create customer login details", "Track Inrishi project delivery", "Track your incentive status"].map((item, index) => <div key={item} className="flex items-center gap-4 border border-white/8 bg-white/[.025] px-4 py-3"><span className="font-mono text-[10px] text-primary">0{index + 1}</span><span className="font-semibold text-white/85">{item}</span></div>)}</div>
          </div>
        </section>

        <section id="why" className="border-y border-white/8 bg-black/15">
          <div className="mx-auto max-w-[1320px] px-5 py-20 lg:px-8">
            <p className="section-kicker">WHY CHOOSE INRISHI</p>
            <div className="mt-5 max-w-3xl"><h2 className="font-display text-4xl font-semibold text-white sm:text-5xl">Bring the customer relationship. Inrishi handles the delivery.</h2><p className="mt-5 leading-8 text-white/60">You do not need your own design or development team. Bring the opportunity and manage the relationship; Inrishi handles the technology work and keeps the project visible to you.</p></div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">{whyItems.map(([Icon, title, body]) => <article key={title} className="border border-white/10 bg-black/20 p-7"><Icon className="text-primary" size={24}/><h3 className="mt-5 font-display text-2xl font-semibold text-white">{title}</h3><p className="mt-3 leading-7 text-white/60">{body}</p></article>)}</div>
          </div>
        </section>

        <section id="become">
          <div className="mx-auto max-w-[1320px] px-5 py-20 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
              <div><p className="section-kicker">BECOMING A PARTNER</p><h2 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">A simple approval process.</h2><p className="mt-5 leading-8 text-white/60">Register with your details and sign in at any time. Inrishi reviews the application, and your full partner features become available after approval.</p><div className="mt-7 flex gap-3">{controls?.registrationOpen !== false && <a href="/register" className="inline-flex h-11 items-center gap-2 bg-primary px-5 font-semibold text-primary-foreground">Register <ArrowRight size={16}/></a>}<a href="/login" className="inline-flex h-11 items-center gap-2 border border-white/15 px-5 font-semibold text-white">Login <LogIn size={16}/></a></div></div>
              <div className="grid gap-4 sm:grid-cols-2">{partnerBenefits.map(([Icon,title,body])=><div key={title} className="border border-white/10 bg-white/[.025] p-6"><Icon size={22} className="text-primary"/><h3 className="mt-4 font-display text-xl font-semibold text-white">{title}</h3><p className="mt-3 text-sm leading-7 text-white/58">{body}</p></div>)}</div>
            </div>
          </div>
        </section>

        <section id="services" className="border-y border-white/8 bg-black/15">
          <div className="mx-auto max-w-[1320px] px-5 py-20 lg:px-8">
            <p className="section-kicker">SERVICES WE PROVIDE</p>
            <div className="mt-5 max-w-3xl"><h2 className="font-display text-4xl font-semibold text-white sm:text-5xl">What Inrishi can deliver for your customers.</h2><p className="mt-5 leading-8 text-white/60">These are Inrishi services. Each service explains the work we handle so you can clearly explain the value to a prospective customer.</p></div>
            <div className="mt-9 grid gap-5 lg:grid-cols-2">
              {services.map(({icon: Icon,title,intro,includes}) => <article key={title} className="border border-white/10 bg-black/20 p-6 sm:p-7"><div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center border border-primary/25 bg-primary/[.07] text-primary"><Icon size={20}/></div><div><h3 className="font-display text-2xl font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-7 text-white/58">{intro}</p></div></div><div className="mt-5 grid gap-2 sm:grid-cols-2">{includes.map((item)=><div key={item} className="flex gap-2 text-sm leading-6 text-white/65"><CheckCircle2 size={15} className="mt-1 shrink-0 text-primary"/><span>{item}</span></div>)}</div></article>)}
            </div>
          </div>
        </section>

        <section id="pricing">
          <div className="mx-auto max-w-[1320px] px-5 py-20 lg:px-8">
            <p className="section-kicker">PRICING</p>
            <div className="mt-5 grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
              <div><h2 className="font-display text-4xl font-semibold text-white sm:text-5xl">Pricing will have its own clear section.</h2><p className="mt-5 leading-8 text-white/60">We are keeping service information separate from pricing so customers and partners can first understand what is included. Approved service-wise pricing will be added here when finalised.</p></div>
              <div className="border border-primary/20 bg-primary/[.04] p-7 sm:p-9">
                <p className="font-mono text-[10px] uppercase tracking-[.16em] text-primary">PRICING STATUS</p>
                <h3 className="mt-4 font-display text-3xl font-semibold text-white">Service pricing is being finalised.</h3>
                <p className="mt-4 max-w-xl leading-7 text-white/58">The partner process can continue while public service pricing is being finalised. Only approved pricing will be shown on this website.</p>
                <div className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5 text-sm text-white/60"><FileCheck2 size={19} className="text-primary"/> Only final, approved pricing will be published here.</div>
              </div>
            </div>
          </div>
        </section>

        <section id="process" className="border-t border-white/8 bg-black/15">
          <div className="mx-auto max-w-[1320px] px-5 py-20 lg:px-8">
            <p className="section-kicker">WHAT IS THE PROCESS?</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold text-white sm:text-5xl">From registration to customer delivery, every step is clear.</h2>
            <div className="mt-8 grid gap-px bg-white/10 md:grid-cols-2 lg:grid-cols-3">{process.map(([number,title,body])=><article key={number} className="bg-[#06111b] p-7"><span className="font-mono text-xs text-primary">{number}</span><h3 className="mt-4 font-display text-2xl font-semibold text-white">{title}</h3><p className="mt-3 leading-7 text-white/60">{body}</p></article>)}</div>
          </div>
        </section>

        <section className="border-y border-white/8 bg-primary/[.035]">
          <div className="mx-auto grid max-w-[1320px] gap-7 px-5 py-16 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8"><div><p className="section-kicker">READY TO START?</p><h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">Register for the Inrishi Partner Network.</h2><p className="mt-3 text-white/58">Your application will be reviewed by Inrishi. Once approved, you can start adding leads and managing your partner activity.</p></div><div className="flex flex-wrap gap-3">{controls?.registrationOpen !== false && <a href="/register" className="inline-flex h-12 items-center gap-2 bg-primary px-6 font-semibold text-primary-foreground">Register <ArrowRight size={17}/></a>}{controls?.loginVisible !== false && <a href="/login" className="inline-flex h-12 items-center gap-2 border border-white/15 px-6 font-semibold text-white">Login <LogIn size={17}/></a>}</div></div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/8"><div className="mx-auto flex max-w-[1320px] flex-col gap-3 px-5 py-8 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between lg:px-8"><span>Inrishi Partner Network · Intelligence Inside</span><span>Inrishi services · Partner Network · Managed by Inrishi</span></div></footer>
    </div>
  );
}
