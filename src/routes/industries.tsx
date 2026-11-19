import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import inrishiLogo from "@/assets/inrishi-public-logo.png";
import { siteHref } from "@/lib/site-path";

export const Route=createFileRoute("/industries")({head:()=>({meta:[
  {title:"Business Software & AI Automation by Industry | INRISHI India"},
  {name:"description",content:"See how INRISHI CRM, employee management, websites and AI automation can support startups, SMEs, CA firms, manufacturers, retailers, colleges, medical institutions and traditional businesses in India."},
  {name:"robots",content:"index,follow,max-image-preview:large,max-snippet:-1"},
]}),component:Page});

const industries=[
  ["Startups & SMEs","Build a reliable digital foundation early: website, customer follow-up, employee operations and automation that can grow with the team."],
  ["CA firms & professional services","Organise enquiries, client follow-up, employee workflows, document preparation and repeat service communication."],
  ["Manufacturers & distributors","Improve B2B lead tracking, internal approvals, employee operations, reporting and repetitive customer or document workflows."],
  ["Retailers & service businesses","Strengthen online discovery, customer follow-up, repeat engagement and team coordination."],
  ["Colleges & institutions","Digitise employee or administrative workflows, approvals, enquiries, documents and internal communication where suitable."],
  ["Medical institutions","Support structured enquiry handling, staff workflows, administrative processes and digital presence without replacing regulated clinical systems."],
  ["Traditional businesses","Move from calls, notebooks and scattered spreadsheets to a clearer website, CRM, employee system and practical automation in stages."],
] as const;

function Page(){return <div className="v73-public v76-public relative z-10 min-h-screen"><header className="site-header"><div className="mx-auto flex h-[74px] max-w-[1200px] items-center justify-between px-5"><a href={siteHref("/")}><img src={inrishiLogo} alt="INRISHI" className="public-brand-logo"/></a><nav className="flex gap-5 text-sm"><a href={siteHref("/services")}>Services</a><a href={siteHref("/about-inrishi")}>About</a></nav></div></header><main className="mx-auto max-w-[1200px] px-5 py-16"><p className="section-kicker">INDUSTRIES INRISHI SERVES</p><h1 className="mt-5 max-w-5xl font-display text-5xl font-semibold text-white sm:text-6xl">Different industries. Different workflows. One principle: configure the software around the work.</h1><p className="mt-6 max-w-4xl text-lg leading-8 text-white/70">INRISHI serves businesses across India with websites, CRM, employee management and AI automation. The solution is selected only after understanding the industry, users and operating process.</p><section className="mt-12 grid gap-5 md:grid-cols-2">{industries.map(([title,text])=><article key={title} className="v38-panel p-7"><h2 className="font-display text-2xl font-semibold text-white">{title}</h2><p className="mt-3 text-sm leading-7 text-white/70">{text}</p></article>)}</section><section className="v38-panel mt-10 p-7"><h2 className="font-display text-3xl font-semibold text-white">Choose the operating problem first</h2><p className="mt-4 max-w-4xl text-white/70">A business may need only a website, only CRM, only employee management, or a combination with AI automation. INRISHI scopes the minimum practical system before expanding.</p><div className="mt-6 flex flex-wrap gap-3"><a href={siteHref("/services")} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-white">Explore INRISHI services <ArrowRight size={15}/></a><a href={siteHref("/contact")} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-white">Discuss your industry requirement <ArrowRight size={15}/></a></div></section></main><SiteFooter/></div>}
