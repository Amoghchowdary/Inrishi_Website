import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SeoServiceSections } from "@/components/seo-service-sections";
import inrishiLogo from "@/assets/inrishi-public-logo.png";
import visualArt from "@/assets/product-crm.svg";
import { siteHref } from "@/lib/site-path";

export const Route=createFileRoute("/services/crm")({head:()=>({meta:[
  {title:"CRM Software for SMEs & Indian Businesses | INRISHI"},
  {name:"description",content:"INRISHI CRM software helps SMEs and growing Indian businesses manage leads, calls, messages, follow-ups, customer history, sales stages and team visibility in one configurable workflow."},
  {name:"robots",content:"index,follow,max-image-preview:large,max-snippet:-1"},
]}),component:Page});

function Page(){
  const includes=["Lead capture and assignment","Custom sales stages","Follow-up reminders and tasks","Customer conversation history","Proposal and conversion flow","Sales dashboards and reporting"];
  return <div className="v73-public v76-public relative z-10 min-h-screen"><header className="site-header"><div className="mx-auto flex h-[74px] max-w-[1200px] items-center justify-between px-5"><a href={siteHref("/")}><img src={inrishiLogo} alt="INRISHI" className="public-brand-logo"/></a><a href={siteHref("/services")} className="font-semibold text-white">All Services</a></div></header><main className="mx-auto max-w-[1200px] px-5 py-16"><p className="section-kicker">INRISHI / CRM SOFTWARE INDIA</p><h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold sm:text-6xl">CRM software for Indian businesses</h1><p className="mt-6 max-w-4xl text-lg leading-8 text-muted-foreground">Bring leads, calls, messages, follow-ups and customer history into one configurable system so every enquiry has a clear owner and next action.</p><img src={visualArt} alt="INRISHI CRM software interface for lead management and customer follow-up" className="v76-service-hero mt-10"/><section className="v38-panel v76-tile mt-10 p-7"><h2 className="font-display text-3xl font-semibold">What INRISHI CRM can include</h2><div className="mt-6 grid gap-3 md:grid-cols-2">{includes.map(x=><div key={x} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-white"><CheckCircle2 className="shrink-0" size={18}/><span>{x}</span></div>)}</div><p className="mt-6 text-sm text-muted-foreground">CRM scope, integrations, user roles and commercial terms are confirmed after INRISHI studies the actual sales and customer workflow.</p></section>
  <SeoServiceSections
    audience={["SMEs and growing sales teams","CA firms and professional-service businesses","Manufacturers and distributors managing B2B enquiries","Retail and service businesses with repeat follow-up","Teams moving away from spreadsheets and personal call notes"]}
    replaces={["Scattered lead spreadsheets","Untracked WhatsApp or phone follow-ups","Personal notebooks and reminder lists","Disconnected customer histories","Manual handover between salespeople"]}
    outcomes={["Clear ownership of every lead","Faster follow-up and fewer missed enquiries","Shared customer history across the team","More predictable sales-stage visibility","Cleaner reporting for management"]}
    questions={[
      {q:"Can INRISHI CRM be customised?",a:"Yes. Fields, sales stages, roles, dashboards and workflow rules can be configured around the business process rather than forcing a fixed template."},
      {q:"Does the CRM support calls and messages?",a:"The CRM can be configured around calling-agent workflows, incoming messages, replies, customer conversations and follow-up actions based on the implementation scope."},
      {q:"Is INRISHI CRM suitable for small businesses?",a:"Yes. The system can start with a focused lead and follow-up workflow and expand as the team and process become more complex."},
      {q:"What does CRM implementation cost?",a:"The public starting price is from ₹15,000 + GST. Final scope depends on users, workflows, integrations and customisation requirements."},
    ]}
    related={[{href:"/services/ai-business-transformation",label:"AI automation"},{href:"/services/website-design",label:"Business websites"}]}
  /></main><SiteFooter/></div>;
}
