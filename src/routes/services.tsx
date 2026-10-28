import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight,CheckCircle2 } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import inrishiLogo from "@/assets/inrishi-public-logo.png";
import { siteHref } from "@/lib/site-path";
export const Route=createFileRoute("/services")({head:()=>({meta:[{title:"Business Software, ERP, CRM, AI Automation & Website Services | Inrishi"},{name:"description",content:"Explore Inrishi services including AI business transformation, ERP, CRM, employee management, books customization, custom software, SaaS products and website design."},{name:"robots",content:"index,follow"}]}),component:ServicesPage});
const items=[
 ["AI Business Transformation","ai-business-transformation","Simplify repetitive work, approvals and information flow with practical automation."],
 ["ERP","erp","Connect sales, purchases, inventory, finance, approvals and operational records."],
 ["CRM","crm","Manage leads, follow-ups, customer history and sales conversion in one structured workflow."],
 ["Employee Management","employee-management","Organise employee records, attendance, leave, requests and people operations."],
 ["Books Customization","books-customization","Adapt accounting and business-book workflows to your documents, approvals and reporting."],
 ["Custom Software","custom-software","Build web or desktop software around a specific business process and user workflow."],
 ["SaaS Products","saas-products","Adopt configurable Inrishi cloud products for common business requirements."],
 ["Website Design","website-design","Plan, design, build and launch a responsive website with search-readiness support."],
];
function ServicesPage(){return <div className="relative z-10 min-h-screen"><header className="site-header"><div className="mx-auto flex h-[74px] max-w-[1320px] items-center justify-between px-5 lg:px-8"><a href={siteHref("/")}><img src={inrishiLogo} alt="INRISHI" className="public-brand-logo"/></a><nav className="flex gap-5 text-sm"><a href={siteHref("/")}>Home</a><a href={siteHref("/partner-program")} className="text-primary">Become a Partner</a></nav></div></header><main className="mx-auto max-w-[1320px] px-5 py-16 lg:px-8"><p className="section-kicker">INRISHI SERVICES</p><h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold sm:text-6xl">Software and automation built around the way your business works.</h1><p className="mt-6 max-w-4xl text-lg leading-8 text-muted-foreground">Explore the service areas Inrishi can plan, configure, build and support. Each engagement is scoped against the actual business requirement before commercial commitment.</p><div className="mt-12 grid gap-4 md:grid-cols-2">{items.map(([name,slug,body])=><article key={slug} className="v38-panel p-7"><CheckCircle2 className="text-primary"/><h2 className="mt-4 font-display text-2xl font-semibold">{name}</h2><p className="mt-3 text-base leading-7 text-muted-foreground">{body}</p><a className="mt-5 inline-flex items-center gap-2 font-semibold text-primary" href={siteHref(`/services/${slug}`)}>Explore {name} <ArrowRight size={15}/></a></article>)}</div></main><SiteFooter/></div>}
