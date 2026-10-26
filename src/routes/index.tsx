import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Boxes, BriefcaseBusiness, Check, Cloud,
  DatabaseZap, FileText, Gauge, Headphones, Layers3, LockKeyhole, MapPin, Menu, Monitor, Navigation, Orbit, Phone, ShieldCheck, Sparkles, UsersRound, WalletCards, Workflow, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import heroArt from "@/assets/inrishi-robot-wordmark-foreground.png";
import inrishiLogo from "@/assets/inrishi-logo.png";
import { loadPortalStore, portalStoreEventName, type PortalStore } from "@/lib/portal-store";
import { submitWebsiteInquiry } from "@/lib/business-api";

import { PartnerWebsite } from "./partner";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Inrishi | Intelligence Inside" },
      { name: "description", content: "Inrishi brings intelligence inside your business with AI transformation, ERP, CRM, employee management, tailored accounting, custom software, website design, and SaaS products." },
      { property: "og:title", content: "Inrishi | Intelligence Inside" },
      { property: "og:description", content: "Intelligent software and AI-powered transformation built around the way your business works." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HostAwareHome,
});

const products = [
  {
    number: "01", title: "AI Business Transformation", category: "Make everyday work easier",
    description: "We study repetitive work, approvals and information flow, then automate the steps that slow your team down.",
    detail: "Inrishi maps how the work happens today, identifies where people repeat the same tasks, and builds a simpler flow that can connect forms, approvals, notifications, reports and business data.",
    includes: ["Process study and automation plan", "Repetitive task automation", "Approvals and notification flows", "Business dashboards and reporting", "Connections between existing tools where practical", "Testing, handover and improvement support"],
    outcome: "Less repetitive work, faster follow-up and clearer visibility for the people running the business.", icon: Sparkles,
  },
  {
    number: "02", title: "ERP", category: "Run core operations together",
    description: "Bring sales, purchases, inventory, finance and day-to-day operations into one connected business system.",
    detail: "We configure the ERP around the way your business actually works instead of forcing every team into separate spreadsheets and disconnected tools.",
    includes: ["Sales, quotation and order workflows", "Purchase and supplier workflows", "Inventory, items and stock movement", "Invoices, receipts and business records", "Approval and responsibility flows", "Customer and vendor records", "Management dashboards and reports", "Role-based access and business settings"],
    outcome: "One clearer operating view across sales, purchases, inventory, records and approvals, with less repeated entry between departments.", icon: Boxes,
  },
  {
    number: "03", title: "CRM", category: "Turn enquiries into customers",
    description: "Capture leads, plan follow-ups, manage conversations and keep every opportunity moving from enquiry to customer.",
    detail: "The CRM is built around your sales process, so your team knows who to contact, what was discussed, what comes next and which opportunities need attention.",
    includes: ["Lead capture from forms and other agreed sources", "Automatic lead assignment and custom sales stages", "Follow-up reminders, tasks and status updates", "Customer, call and conversation history", "Quotation/proposal flow and lead-to-customer conversion", "Document and requirement tracking", "Alerts and notifications through connected business channels where configured", "Sales dashboards, reports and management visibility"],
    outcome: "A more complete sales process with fewer missed follow-ups, clearer ownership and better visibility from first enquiry to customer conversion.", icon: UsersRound,
  },
  {
    number: "04", title: "Employee Management", category: "Keep people operations organised",
    description: "Manage employee records, attendance, leave, routine requests and team information from one place.",
    detail: "We bring common employee-management tasks into a simpler system for employees, managers and administrators.",
    includes: ["Employee profiles and records", "Attendance and leave workflows", "Onboarding and document collection", "Requests, approvals and notifications", "Payroll-support information and reports", "Manager and employee access controls"],
    outcome: "Less manual administration and a clearer day-to-day experience for employees and managers.", icon: BriefcaseBusiness,
  },
  {
    number: "05", title: "Books Customization", category: "Accounting that fits your process",
    description: "Adapt accounting and business-book workflows to the way your organisation actually invoices, reviews and reports.",
    detail: "We customise the accounting experience around your documents, approval rules, teams and reporting needs, while connecting it with the rest of your business workflow where required.",
    includes: ["Invoice and quotation formats", "Business and tax fields", "Approval and review workflows", "Customer, vendor and item setup", "Management reports and dashboards", "Connections with relevant business systems"],
    outcome: "A cleaner finance workflow with less duplicate entry between accounting and operations.", icon: WalletCards,
  },
  {
    number: "06", title: "Custom Software", category: "Built around your business",
    description: "When standard software does not fit, we design a system around your exact process, users and goals.",
    detail: "We convert your requirement into a usable application, test it with the intended workflow and refine it around real business use.",
    includes: ["Requirement and workflow study", "UX and interface design", "Web or desktop application development", "Roles, forms and business rules", "Reports and integrations where required", "Testing, deployment and handover"],
    outcome: "Software that follows your process instead of making your process follow the software.", icon: Workflow,
  },
  {
    number: "07", title: "SaaS Products", category: "Ready-to-use business software",
    description: "Use Inrishi cloud products for common business needs without starting a custom development project from zero.",
    detail: "We help you select, configure and adopt the relevant Inrishi product, then set up the users and business options needed for day-to-day use.",
    includes: ["Product selection and setup", "Business configuration", "User access and roles", "Data preparation where applicable", "Team onboarding and usage guidance", "Ongoing product updates and support"],
    outcome: "A faster path to using structured business software with less implementation effort.", icon: Cloud,
  },
  {
    number: "08", title: "Website Design", category: "A complete business website, not just pages",
    description: "We plan, design, build and launch a responsive website, then continue with search-readiness and post-launch SEO support.",
    detail: "The website engagement covers the customer-facing experience and the technical work needed to launch it properly. After launch, an Inrishi SEO support executive is assigned for 15 days to complete the agreed on-page SEO and indexing tasks.",
    includes: ["Website planning, page structure and visual design", "Responsive development for mobile, tablet and desktop", "Domain/deployment connection and launch checks", "SEO page titles, descriptions, headings, image text and relevant tagging", "Sitemap, robots and indexing-readiness setup", "Google Search Console and analytics connections where access is provided", "Performance, mobile usability and basic technical checks", "15-day assigned SEO executive after launch", "During the 15-day period: indexing checks, sitemap submission, metadata/tag review and agreed on-page SEO corrections", "SEO handover summary after the support period"],
    outcome: "A professional website that is launched correctly, connected to essential search tools and supported through the first 15 days of SEO and indexing setup without promising a specific search ranking.", icon: Monitor,
  },
];

type Product = (typeof products)[number];

function HostAwareHome() {
  return (
    <>
      <div className="host-main-only"><Home /></div>
      <div className="host-partner-only"><PartnerWebsite /></div>
    </>
  );
}

function Home() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [inquiryStatus, setInquiryStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [portalConfig, setPortalConfig] = useState<PortalStore | null>(null);

  useEffect(() => {
    const sync = () => setPortalConfig(loadPortalStore());
    sync();
    const event = portalStoreEventName();
    window.addEventListener(event, sync);
    return () => { window.removeEventListener(event, sync); };
  }, []);

  const websiteControls = portalConfig?.websiteControls;
  const showCustomerLogin = websiteControls?.customerLoginVisible ?? true;

  function openInquiry(product?: Product) {
    setSelected(null);
    setForm((current) => ({ ...current, message: product ? `I'd like to discuss ${product.title}.` : current.message }));
    setInquiryStatus("idle");
    setInquiryMessage("");
    setInquiryOpen(true);
  }

  async function sendInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInquiryStatus("sending");
    setInquiryMessage("");
    try {
      const requirement = [form.company ? `Company: ${form.company}` : "", form.message].filter(Boolean).join("\n\n");
      const result = await submitWebsiteInquiry({ name: form.name, phone: form.phone, email: form.email, requirement, source: "Main website" });
      setInquiryStatus("sent");
      setInquiryMessage(result.message || "Thank you. Your request has been sent to Inrishi.");
      setForm({ name: "", email: "", phone: "", company: "", message: "" });
    } catch (cause) {
      setInquiryStatus("error");
      setInquiryMessage(cause instanceof Error ? cause.message : "We could not send your request. Please try again.");
    }
  }

  return (
    <div className="site-shell min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="relative z-10">
        {websiteControls?.announcementEnabled && websiteControls.announcementText && <div className="border-b border-primary/20 bg-primary/10 px-4 py-2 text-center text-xs font-semibold text-primary">{websiteControls.announcementText}</div>}
        {websiteControls?.siteStatus === "Maintenance" && <div className="border-b border-amber-400/20 bg-amber-400/10 px-4 py-2 text-center text-xs font-semibold text-amber-200">The website is temporarily under maintenance.</div>}
        <header className="site-header">
          <div className="mx-auto grid h-[76px] max-w-[1440px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 md:flex md:justify-between md:px-10 lg:px-16">
            <a href="#top" className="flex min-w-0 items-center" aria-label="Inrishi home"><img src={inrishiLogo} alt="INRISHI" className="h-auto w-[118px] object-contain sm:w-[142px]" /></a>
            <nav className="hidden items-center gap-5 lg:gap-7 md:flex" aria-label="Main navigation"><a href="#solutions" className="nav-link">Services</a><a href="/sample-work" className="nav-link">Sample Work</a><a href="#approach" className="nav-link">Our approach</a><a href="/contact" className="nav-link">Contact</a>{showCustomerLogin && <a href="/customer-login" className="nav-link inline-flex items-center gap-1.5"><LockKeyhole size={13} /> Customer Login</a>}</nav>
            <div className="hidden lg:block"><Button onClick={() => openInquiry()} variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary">{websiteControls?.inquiryCtaLabel || "Let's talk"} <ArrowUpRight size={15} /></Button></div>
            <Button variant="ghost" size="icon" className="shrink-0 text-foreground hover:bg-secondary md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X /> : <Menu />}</Button>
          </div>
          {menuOpen && <nav className="mobile-nav flex flex-col gap-4 px-5 py-5 md:hidden" aria-label="Mobile navigation"><a href="#solutions" onClick={() => setMenuOpen(false)}>Services</a><a href="/sample-work" onClick={() => setMenuOpen(false)}>Sample Work</a><a href="#approach" onClick={() => setMenuOpen(false)}>Our approach</a><a href="/contact" onClick={() => setMenuOpen(false)}>Contact</a>{showCustomerLogin && <a href="/customer-login" onClick={() => setMenuOpen(false)} className="inline-flex items-center gap-2 text-primary"><LockKeyhole size={15} /> Customer Login</a>}<Button onClick={() => { setMenuOpen(false); openInquiry(); }} variant="ghost" className="w-fit pl-0 text-primary">{websiteControls?.inquiryCtaLabel || "Let's talk"} <ArrowUpRight /></Button></nav>}
        </header>

        <main id="top">
          <section className="hero-section relative isolate overflow-visible pt-2 sm:pt-4 lg:pt-5" aria-labelledby="hero-title">
            <div className="hero-stage mx-auto max-w-[1440px] px-4 sm:px-7 md:px-10 lg:px-16">
              <div className="hero-foreground-wrap relative mx-auto max-w-[760px]" aria-hidden="true">
                <div className="hero-halo" />
                <img
                  src={heroArt}
                  alt=""
                  className="hero-foreground-art block h-auto w-full"
                  fetchPriority="high"
                />
              </div>

              <div className="hero-copy relative z-10 mx-auto max-w-[820px] px-3 text-center">
                <h1 id="hero-title" className="font-display text-5xl font-semibold leading-none sm:text-6xl lg:text-[66px]">
                  Inrishi<span className="text-cyan">.</span>
                </h1>
                <p className="section-kicker mt-4">INTELLIGENCE INSIDE</p>
                <p className="mx-auto mt-4 max-w-[650px] text-sm leading-[1.8] text-muted-foreground sm:text-base">
                  Practical software, automation and digital services that help businesses work more clearly and grow with confidence.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button asChild className="h-11 rounded-none bg-primary px-6 text-primary-foreground hover:bg-primary/90">
                    <a href="#solutions">Explore services <ArrowUpRight size={16} /></a>
                  </Button>
                  <Button variant="ghost" onClick={() => openInquiry()} className="h-11 border border-white/10 bg-black/20 text-foreground backdrop-blur-sm hover:bg-primary/10 hover:text-primary">
                    Start a conversation <ArrowRight size={16} />
                  </Button>
                </div>
              </div>

              <div className="hero-product-strip" aria-label="Inrishi products and services">
                {products.map((product) => {
                  const Icon = product.icon;
                  return (
                    <button
                      key={`hero-${product.number}`}
                      type="button"
                      onClick={() => setSelected(product)}
                      className="hero-product-item"
                      aria-label={`Open ${product.title}`}
                    >
                      <span className="hero-product-icon"><Icon size={16} strokeWidth={1.5} /></span>
                      <span>{product.title}</span>
                    </button>
                  );
                })}
              </div>

              <a href="#solutions" className="hero-explore-link">
                See all services <ArrowDown size={14} />
              </a>
            </div>
          </section>

          <section id="solutions" className="relative mx-auto max-w-[1440px] px-5 pb-16 pt-10 md:px-10 md:pt-16 lg:px-16 lg:py-24">
            <div className="mb-12 flex flex-col items-start justify-between gap-7 md:flex-row md:items-end"><div><img src={inrishiLogo} alt="INRISHI" className="mb-6 w-[120px] opacity-80" /><p className="section-kicker">WHAT INRISHI CAN DO FOR YOUR BUSINESS</p><h2 className="mt-5 font-display text-4xl font-semibold leading-tight sm:text-5xl">Practical services, <span className="text-primary">clearly explained.</span></h2></div><p className="max-w-[340px] text-sm leading-[1.8] text-muted-foreground">See what each service includes, how Inrishi handles the work and what your business receives at the end.</p></div>
            <div className="solution-list">{products.map((product) => { const Icon = product.icon; return <article key={product.number} className="solution-row group grid items-start gap-x-4 gap-y-3 py-7 sm:grid-cols-[48px_56px_minmax(0,1fr)_minmax(0,1fr)_36px] sm:items-center sm:gap-5 sm:py-9"><span className="pt-2 font-mono text-xs text-primary sm:pt-0">/{product.number}</span><div className="solution-icon-chip shrink-0"><Icon size={20} strokeWidth={1.45} /></div><div className="min-w-0"><span className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">{product.category}</span><h3 className="mt-1 font-display text-xl font-semibold leading-snug sm:text-2xl">{product.title}</h3></div><p className="col-span-2 col-start-2 ml-11 max-w-md text-sm leading-[1.7] text-muted-foreground sm:col-span-1 sm:col-start-auto sm:ml-0">{product.description}</p><Button variant="ghost" size="icon" aria-label={`Explore ${product.title}`} title={`Explore ${product.title}`} onClick={() => setSelected(product)} className="col-start-4 row-start-1 shrink-0 text-primary hover:bg-primary/10 hover:text-cyan sm:col-start-auto sm:row-start-auto"><ArrowUpRight size={21} /></Button></article>; })}</div>
          </section>

          <section className="relative mx-auto max-w-[1440px] px-5 py-20 md:px-10 lg:px-16 lg:py-24" aria-labelledby="service-details-title">
            <div className="mb-10 max-w-3xl">
              <p className="section-kicker">WHAT YOU RECEIVE</p>
              <h2 id="service-details-title" className="mt-5 font-display text-4xl font-semibold leading-tight sm:text-5xl">Know what is included <span className="text-primary">before you choose.</span></h2>
              <p className="mt-5 text-sm leading-[1.85] text-muted-foreground sm:text-base">Each Inrishi service is explained in practical terms so you can understand the work, the support and the result before starting a conversation.</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {products.map((product) => {
                const Icon = product.icon;
                return <article key={`detail-${product.number}`} className="border border-border bg-card/55 p-6 sm:p-7">
                  <div className="flex items-start gap-4"><div className="solution-icon-chip shrink-0"><Icon size={20} strokeWidth={1.45}/></div><div><p className="font-mono text-[10px] uppercase tracking-[.15em] text-primary">SERVICE / {product.number}</p><h3 className="mt-1 font-display text-2xl font-semibold">{product.title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{product.detail}</p></div></div>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">{product.includes.map((item) => <div key={item} className="flex gap-2 text-sm leading-6 text-muted-foreground"><Check size={15} className="mt-1 shrink-0 text-primary"/><span>{item}</span></div>)}</div>
                  <div className="mt-5 border-t border-border pt-4"><p className="text-sm font-semibold text-foreground">What this helps you achieve</p><p className="mt-2 text-sm leading-7 text-muted-foreground">{product.outcome}</p></div>
                  <Button variant="ghost" onClick={() => openInquiry(product)} className="mt-4 -ml-4 text-primary hover:bg-primary/10 hover:text-primary">Ask about {product.title} <ArrowUpRight size={16}/></Button>
                </article>;
              })}
            </div>
          </section>

          <section className="relative mx-auto max-w-[1440px] px-5 py-20 md:px-10 lg:px-16 lg:py-28" aria-labelledby="connected-title">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
              <div>
                <p className="section-kicker">ONE BUSINESS, BETTER CONNECTED</p>
                <h2 id="connected-title" className="mt-6 font-display text-4xl font-semibold leading-tight sm:text-5xl">Bring your business information into <span className="text-primary">one clearer view.</span></h2>
                <p className="mt-6 max-w-lg text-sm leading-[1.9] text-muted-foreground sm:text-base">We help connect customers, day-to-day operations, employees, finance and digital channels so your teams spend less time moving information between separate tools.</p>
              </div>
              <div className="grid gap-px border border-border bg-border sm:grid-cols-2">
                {[
                  { icon: Layers3, title: "Connected operations", text: "Bring workflows, approvals and day-to-day business activity into a consistent operating layer." },
                  { icon: Gauge, title: "Clear visibility", text: "Give teams a cleaner view of work, customers and business signals without jumping across disconnected tools." },
                  { icon: ShieldCheck, title: "Right access for each person", text: "Give employees, managers and customers access only to the information and actions relevant to them." },
                  { icon: DatabaseZap, title: "Information that stays connected", text: "Reduce repeated data entry by allowing the systems used by your teams to share the information they need." },
                ].map((item) => (
                  <article key={item.title} className="bg-background/88 p-6 sm:p-7">
                    <item.icon size={23} className="text-cyan" strokeWidth={1.45} />
                    <h3 className="mt-5 font-display text-xl font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-[1.75] text-muted-foreground">{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="approach" className="relative mx-auto grid max-w-[1440px] gap-12 px-5 py-20 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24 lg:px-16 lg:py-28"><div><p className="section-kicker">HOW WE WORK WITH YOU</p><h2 className="mt-6 font-display text-4xl font-semibold leading-tight sm:text-5xl">Understand first.<br /><span className="text-cyan">Build what matters.</span></h2><p className="mt-6 max-w-md leading-[1.85] text-muted-foreground">We first understand how your team works today. Then we simplify the difficult parts, build the right solution and help your people start using it confidently.</p><Button onClick={() => openInquiry()} variant="ghost" className="mt-8 -ml-4 text-primary hover:bg-primary/10 hover:text-primary">Talk about your project <ArrowUpRight size={16} /></Button></div><div className="approach-list">{[{ n: "01", icon: DatabaseZap, title: "Understand your business", text: "Learn how your team works, what slows them down and what needs to improve." }, { n: "02", icon: Workflow, title: "Plan the better way", text: "Turn unnecessary steps and repeated work into one clear process." }, { n: "03", icon: Orbit, title: "Build and support", text: "Launch the solution, support adoption and improve it as your business grows." }].map((step) => <div key={step.n} className="grid grid-cols-[32px_minmax(0,1fr)_32px] items-center gap-4 py-6 sm:gap-7"><span className="font-mono text-xs text-primary">{step.n}</span><div className="min-w-0"><h3 className="font-display text-xl font-semibold">{step.title}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.text}</p></div><step.icon className="shrink-0 text-cyan" size={22} strokeWidth={1.5} /></div>)}</div></section>

          <section className="relative mx-auto max-w-[1440px] px-5 py-20 md:px-10 lg:px-16 lg:py-28" aria-labelledby="customer-access-title">
            <div className="overflow-hidden border border-primary/20 bg-card/62 shadow-[0_20px_80px_rgba(0,0,0,.24)]">
              <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
                <div className="p-7 sm:p-10 lg:p-12">
                  <p className="section-kicker">FOR INRISHI CUSTOMERS</p>
                  <h2 id="customer-access-title" className="mt-5 font-display text-4xl font-semibold leading-tight sm:text-5xl">{websiteControls?.customerAccessTitle ? websiteControls.customerAccessTitle : <>Everything about your project in <span className="text-primary">one customer area.</span></>}</h2>
                  <p className="mt-5 max-w-2xl text-sm leading-[1.85] text-muted-foreground sm:text-base">Use Customer Login to see your selected services, payments, work progress, documents and messages with the Inrishi team.</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {showCustomerLogin && <Button asChild className="h-11 rounded-none bg-primary px-5 text-primary-foreground hover:bg-primary/90"><a href="/customer-login"><LockKeyhole size={16} /> Customer Login</a></Button>}
                    <Button asChild variant="outline" className="h-11 rounded-none border-primary/30 bg-transparent px-5 text-primary hover:bg-primary/10"><a href="/contact">Request access <ArrowUpRight size={16} /></a></Button>
                  </div>
                </div>
                <div className="grid border-t border-border lg:border-l lg:border-t-0 sm:grid-cols-3 lg:grid-cols-1">
                  {[
                    { icon: FileText, title: "Project information", text: "See what is being worked on and keep new requirements connected to the same project." },
                    { icon: Headphones, title: "Customer support", text: "Reach the Inrishi team from the same protected customer entry point." },
                    { icon: ShieldCheck, title: "Private customer access", text: "Your customer area is protected so project information is available only after sign-in." },
                  ].map((item) => (
                    <div key={item.title} className="border-b border-border p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 lg:border-b lg:border-r-0 lg:last:border-b-0">
                      <item.icon className="text-cyan" size={20} strokeWidth={1.5} />
                      <h3 className="mt-4 font-display text-lg font-semibold">{item.title}</h3>
                      <p className="mt-2 text-xs leading-[1.7] text-muted-foreground">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="relative mx-auto max-w-[1440px] px-5 py-20 md:px-10 lg:px-16 lg:py-24" aria-labelledby="delivery-title">
            <div className="mb-10 max-w-2xl">
              <p className="section-kicker">HOW YOUR PROJECT MOVES</p>
              <h2 id="delivery-title" className="mt-5 font-display text-4xl font-semibold sm:text-5xl">From your requirement to a <span className="text-cyan">working solution.</span></h2>
            </div>
            <div className="grid gap-px border border-border bg-border md:grid-cols-4">
              {[
                ["01", "Discover", "Understand your requirement, users, current process and expected result."],
                ["02", "Design", "Plan the screens, steps and responsibilities before development begins."],
                ["03", "Build", "Build and test the agreed website, automation or business system."],
                ["04", "Improve", "Support the solution after launch and improve it when your business needs change."],
              ].map(([number, title, text]) => (
                <article key={number} className="bg-background/90 p-6 sm:p-7">
                  <span className="font-mono text-xs text-primary">/{number}</span>
                  <h3 className="mt-8 font-display text-xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-[1.75] text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="contact" className="relative mx-auto max-w-[1440px] px-5 py-20 md:px-10 lg:px-16 lg:py-28">
            <img src={inrishiLogo} alt="INRISHI" className="mb-8 w-[135px] opacity-80" />
            <p className="section-kicker">LET'S CONNECT</p>
            <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">Your next chapter<br />starts <span className="text-primary">here.</span></h2>
                <p className="mt-5 max-w-lg text-muted-foreground">Tell us what you're working on. Let's find the intelligence inside it.</p>
              </div>
              <Button onClick={() => openInquiry()} className="h-14 w-fit rounded-none bg-primary px-7 font-semibold text-primary-foreground hover:bg-primary/90">Start a conversation <ArrowUpRight size={18} /></Button>
            </div>

            <div className="mt-14 grid overflow-hidden border border-border bg-card/70 shadow-[0_20px_80px_var(--glow-green)] lg:grid-cols-[0.9fr_1.1fr]">
              <div className="p-6 sm:p-9 lg:p-10">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center border border-primary/30 bg-primary/10 text-primary"><MapPin size={20} /></span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">INRISHI OFFICE</p>
                    <h3 className="mt-1 font-display text-2xl font-semibold">Office Address</h3>
                  </div>
                </div>
                <address className="not-italic text-sm leading-[1.9] text-muted-foreground sm:text-base">
                  <strong className="font-semibold text-foreground">Sumashaila Township, Patancheru</strong><br />
                  Plot No. 76, Road No. 9<br />
                  Sumashaila Township, Isnapur<br />
                  Patancheru, Hyderabad<br />
                  Telangana 502307, India
                </address>
                <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-cyan">10 km from ORR Exit 3</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button asChild className="h-11 rounded-none bg-primary px-5 text-primary-foreground hover:bg-primary/90">
                    <a href="tel:+918341889762"><Phone size={16} /> Call +91 83418 89762</a>
                  </Button>
                  <Button asChild variant="outline" className="h-11 rounded-none border-primary/30 bg-transparent px-5 text-primary hover:bg-primary/10 hover:text-primary">
                    <a href="https://www.google.com/maps/search/?api=1&query=Plot%20No.%2076%2C%20Road%20No.%209%2C%20Sumashaila%20Township%2C%20Isnapur%2C%20Patancheru%2C%20Hyderabad%2C%20Telangana%20502307%2C%20India" target="_blank" rel="noreferrer"><Navigation size={16} /> Open in Maps</a>
                  </Button>
                </div>
              </div>
              <div className="min-h-[340px] border-t border-border lg:min-h-[430px] lg:border-l lg:border-t-0">
                <iframe
                  title="Inrishi office location in Sumashaila Township, Patancheru"
                  src="https://www.google.com/maps?q=Plot%20No.%2076%2C%20Road%20No.%209%2C%20Sumashaila%20Township%2C%20Isnapur%2C%20Patancheru%2C%20Hyderabad%2C%20Telangana%20502307%2C%20India&output=embed"
                  className="h-full min-h-[340px] w-full border-0 lg:min-h-[430px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}><DialogContent className="w-[calc(100%-2rem)] max-w-xl rounded-none border-primary/30 bg-card p-7 text-card-foreground shadow-[0_20px_80px_var(--glow-green)] sm:p-9">{selected && <><DialogHeader className="text-left"><span className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary">SOLUTION / {selected.number}</span><DialogTitle className="font-display text-3xl font-semibold leading-tight">{selected.title}</DialogTitle><DialogDescription className="pt-3 text-base leading-relaxed text-muted-foreground">{selected.description}</DialogDescription></DialogHeader><p className="border-t border-border pt-5 text-sm leading-[1.8] text-muted-foreground">{selected.detail}</p><div className="mt-5"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">WHAT IS INCLUDED</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{selected.includes.map((item) => <div key={item} className="flex gap-2 text-sm leading-6 text-muted-foreground"><Check size={15} className="mt-1 shrink-0 text-primary" /><span>{item}</span></div>)}</div></div><div className="mt-5 border border-primary/20 bg-primary/[.05] p-4"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">WHAT THIS HELPS YOU ACHIEVE</p><p className="mt-2 text-sm leading-7 text-foreground/85">{selected.outcome}</p></div><Button onClick={() => openInquiry(selected)} className="mt-5 h-11 w-fit rounded-none bg-primary px-5 text-primary-foreground hover:bg-primary/90">Talk to Inrishi about this service <ArrowUpRight size={16} /></Button></>}</DialogContent></Dialog>
      <Dialog open={inquiryOpen} onOpenChange={setInquiryOpen}><DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-none border-primary/30 bg-card p-6 text-card-foreground shadow-[0_20px_80px_var(--glow-green)] sm:p-9"><DialogHeader className="text-left"><span className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">GET IN TOUCH</span><DialogTitle className="font-display text-3xl font-semibold">Let's talk possibilities.</DialogTitle><DialogDescription className="pt-2 text-sm leading-relaxed">Tell us what you need and the Inrishi team will follow up with you.</DialogDescription></DialogHeader><form onSubmit={sendInquiry} className="mt-4 grid gap-4"><div className="grid gap-4 sm:grid-cols-2"><label className="form-label">Your name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="form-input" /></label><label className="form-label">Work email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" className="form-input" /></label></div><div className="grid gap-4 sm:grid-cols-2"><label className="form-label">Phone<input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Your phone number" className="form-input" /></label><label className="form-label">Company <span className="text-muted-foreground">(optional)</span><input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" className="form-input" /></label></div><label className="form-label">What would you like to discuss?<textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us a little about your project..." className="form-input resize-none" /></label><Button type="submit" disabled={inquiryStatus === "sending"} className="mt-1 h-11 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60">{inquiryStatus === "sending" ? "Sending…" : inquiryStatus === "sent" ? <><Check size={16} /> Request sent</> : <>Send request <ArrowRight size={16} /></>}</Button>{inquiryMessage && <p role="status" className={`text-xs leading-relaxed ${inquiryStatus === "error" ? "text-red-300" : "text-muted-foreground"}`}>{inquiryMessage}</p>}</form></DialogContent></Dialog>
    </div>
  );
}
