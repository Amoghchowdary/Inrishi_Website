import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SeoServiceSections } from "@/components/seo-service-sections";
import inrishiLogo from "@/assets/inrishi-public-logo.png";
import visualArt from "@/assets/product-ems.svg";
import { siteHref } from "@/lib/site-path";

export const Route=createFileRoute("/services/employee-management")({head:()=>({meta:[
  {title:"Employee Management Software for Indian Businesses | INRISHI"},
  {name:"description",content:"INRISHI employee management software helps Indian businesses organise employee records, attendance, leave, onboarding, documents, requests, approvals and role-based access."},
  {name:"robots",content:"index,follow,max-image-preview:large,max-snippet:-1"},
]}),component:Page});

function Page(){
  const includes=["Employee profiles and records","Attendance and leave","Onboarding and documents","Requests and approvals","Payroll-support information","Employee and manager access"];
  return <div className="v73-public v76-public relative z-10 min-h-screen"><header className="site-header"><div className="mx-auto flex h-[74px] max-w-[1200px] items-center justify-between px-5"><a href={siteHref("/")}><img src={inrishiLogo} alt="INRISHI" className="public-brand-logo"/></a><a href={siteHref("/services")} className="font-semibold text-white">All Services</a></div></header><main className="mx-auto max-w-[1200px] px-5 py-16"><p className="section-kicker">INRISHI / EMPLOYEE MANAGEMENT INDIA</p><h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold sm:text-6xl">Employee management software for growing teams</h1><p className="mt-6 max-w-4xl text-lg leading-8 text-muted-foreground">Organise employee records, attendance, leave, onboarding, documents and approvals in one controlled system instead of scattered sheets and messages.</p><img src={visualArt} alt="INRISHI employee management software for attendance leave records and approvals" className="v76-service-hero mt-10"/><section className="v38-panel v76-tile mt-10 p-7"><h2 className="font-display text-3xl font-semibold">What the employee system can include</h2><div className="mt-6 grid gap-3 md:grid-cols-2">{includes.map(x=><div key={x} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-white"><CheckCircle2 className="shrink-0" size={18}/><span>{x}</span></div>)}</div><p className="mt-6 text-sm text-muted-foreground">The final EMS workflow is configured around employee roles, attendance rules, approvals, reporting needs and the operating structure of the organisation.</p></section>
  <SeoServiceSections
    audience={["Startups building formal people operations","SMEs with attendance and leave complexity","Manufacturers with shift-based employee records","Retail or multi-team businesses","Colleges, institutions and traditional businesses moving away from manual registers"]}
    replaces={["Attendance registers and separate spreadsheets","Leave requests through calls or chat","Scattered employee documents","Manual approval chains","Repeated HR status questions"]}
    outcomes={["One source of truth for employee records","Faster leave and approval handling","Clear role-based access","Less manual reconciliation","Better operational visibility for management"]}
    questions={[
      {q:"Is this an HRMS or employee management system?",a:"INRISHI configures the system around the required employee operations. It can include records, attendance, leave, documents, approvals, employee access and reporting without forcing unnecessary modules."},
      {q:"Can attendance and leave rules be customised?",a:"Yes. Rules, roles, approval flows and reporting can be configured around the organisation's working model and policies."},
      {q:"Can employees get their own access?",a:"Employee and manager access can be included with role-based visibility depending on the project scope."},
      {q:"What is the starting price?",a:"Employee Management starts from ₹15,000 + GST. Final pricing depends on modules, users, rules, integrations and customisation."},
    ]}
    related={[{href:"/services/crm",label:"CRM software"},{href:"/services/ai-business-transformation",label:"AI automation"}]}
  /></main><SiteFooter/></div>;
}
