import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import inrishiLogo from "@/assets/inrishi-public-logo.png";
import websiteVisual from "@/assets/product-website.svg";
import crmVisual from "@/assets/product-crm.svg";
import emsVisual from "@/assets/product-ems.svg";
import aiVisual from "@/assets/product-ai.svg";
import { siteHref } from "@/lib/site-path";
export const Route=createFileRoute("/services")({head:()=>({meta:[{title:"Website, CRM, Employee Software & AI Automation | Inrishi"},{name:"description",content:"Explore Inrishi's four primary business software offerings: Business Website, CRM, Employee Management and AI Automation."},{name:"robots",content:"index,follow"}]}),component:ServicesPage});
const items=[
 ["Business Website","website-design","Build trust online with a managed website, domain, hosting, SEO and Google presence.",websiteVisual],
 ["CRM","crm","Bring leads, calls, messages and follow-ups into one customer workflow.",crmVisual],
 ["Employee Management","employee-management","Keep attendance, leave, employee records and approvals in one place.",emsVisual],
 ["AI Automation","ai-business-transformation","Automate repeated support, documents and internal workflows while people stay in control.",aiVisual],
] as const;
function ServicesPage(){return <div className="v73-public v74-public relative z-10 min-h-screen"><header className="site-header"><div className="mx-auto flex h-[74px] max-w-[1320px] items-center justify-between px-5 lg:px-8"><a href={siteHref("/")}><img src={inrishiLogo} alt="INRISHI" className="public-brand-logo"/></a><nav className="flex gap-5 text-sm"><a href={siteHref("/")}>Home</a><a href="https://partner.inrishi.in/">Partner</a></nav></div></header><main className="mx-auto max-w-[1320px] px-5 py-16 lg:px-8"><p className="section-kicker">INRISHI PRODUCTS</p><h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold sm:text-6xl">Start with the business problem. Choose the simplest system that fixes it.</h1><p className="mt-6 max-w-4xl text-lg leading-8 text-muted-foreground">These four products form the public Inrishi offering for Indian businesses. Each system can be configured around the actual workflow.</p><div className="mt-12 grid gap-5 md:grid-cols-2">{items.map(([name,slug,body,visual])=><article key={slug} className="v38-panel v74-tile v74-service-card overflow-hidden p-0"><img src={visual} alt={`${name} visual`}/><div className="p-7"><h2 className="font-display text-2xl font-semibold">{name}</h2><p className="mt-3 text-base leading-7 text-muted-foreground">{body}</p><a className="mt-5 inline-flex items-center gap-2 font-semibold" href={siteHref(`/services/${slug}`)}>Explore {name} <ArrowRight size={15}/></a></div></article>)}</div></main><SiteFooter/></div>}
