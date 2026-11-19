import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SeoServiceSections } from "@/components/seo-service-sections";
import inrishiLogo from "@/assets/inrishi-public-logo.png";
import visualArt from "@/assets/product-ai.svg";
import { siteHref } from "@/lib/site-path";

export const Route=createFileRoute("/services/ai-business-transformation")({head:()=>({meta:[
  {title:"AI Automation Company in India | Business Workflow Automation | INRISHI"},
  {name:"description",content:"INRISHI builds practical AI automation for Indian businesses: customer support automation, document generation, internal workflows, approvals, notifications and business assistants."},
  {name:"robots",content:"index,follow,max-image-preview:large,max-snippet:-1"},
]}),component:Page});

function Page(){
  const includes=["Process and workflow study","Customer support automation","Document generation","Approval and notification flows","AI assistants and internal workflows","Testing, handover and improvement support"];
  return <div className="v73-public v76-public relative z-10 min-h-screen"><header className="site-header"><div className="mx-auto flex h-[74px] max-w-[1200px] items-center justify-between px-5"><a href={siteHref("/")}><img src={inrishiLogo} alt="INRISHI" className="public-brand-logo"/></a><a href={siteHref("/services")} className="font-semibold text-white">All Services</a></div></header><main className="mx-auto max-w-[1200px] px-5 py-16"><p className="section-kicker">INRISHI / AI AUTOMATION INDIA</p><h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold sm:text-6xl">AI automation for real business workflows</h1><p className="mt-6 max-w-4xl text-lg leading-8 text-muted-foreground">Identify repeated support, document and internal workflow work, then automate the right parts while people stay in control of business decisions.</p><img src={visualArt} alt="INRISHI AI automation for customer support documents approvals and business workflows" className="v76-service-hero mt-10"/><section className="v38-panel v76-tile mt-10 p-7"><h2 className="font-display text-3xl font-semibold">What AI automation can include</h2><div className="mt-6 grid gap-3 md:grid-cols-2">{includes.map(x=><div key={x} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-white"><CheckCircle2 className="shrink-0" size={18}/><span>{x}</span></div>)}</div><p className="mt-6 text-sm text-muted-foreground">Automation is scoped after INRISHI studies the current process, data, approvals, exception handling and human decision points. We do not automate a process simply because AI can be added to it.</p></section>
  <SeoServiceSections
    audience={["Businesses with repetitive customer-support questions","Teams preparing the same documents repeatedly","Operations with approval and notification bottlenecks","Traditional businesses moving from manual coordination to digital workflows","Companies that need AI integrated into an existing CRM, website or internal process"]}
    replaces={["Repeated copy-paste and document preparation","Manual routing of routine requests","Repeated status updates and notifications","Basic repetitive support work","Disconnected process handoffs"]}
    outcomes={["Lower repetitive workload","Faster response and document turnaround","More consistent internal workflows","Clearer escalation to people when judgment is required","Practical AI adoption tied to measurable operating work"]}
    questions={[
      {q:"What is AI automation for a business?",a:"It is the use of AI and workflow logic to handle repeatable tasks such as support responses, document preparation, routing, notifications and structured internal processes while preserving human control where judgment is needed."},
      {q:"Does INRISHI build AI agents?",a:"Yes, when an agent is appropriate to the workflow. The implementation can include business assistants, tool-connected agents and controlled automated actions based on the approved scope."},
      {q:"Can AI automation work with an existing CRM or website?",a:"Yes. INRISHI can design automation around existing systems when suitable integrations and data access are available."},
      {q:"How is AI automation priced?",a:"AI automation is quoted after process study because complexity depends on workflow steps, integrations, data, controls, testing and support requirements."},
    ]}
    related={[{href:"/services/crm",label:"CRM software"},{href:"/services/employee-management",label:"Employee management"}]}
  /></main><SiteFooter/></div>;
}
