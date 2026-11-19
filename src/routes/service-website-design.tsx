import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SeoServiceSections } from "@/components/seo-service-sections";
import inrishiLogo from "@/assets/inrishi-public-logo.png";
import visualArt from "@/assets/product-website.svg";
import { siteHref } from "@/lib/site-path";

export const Route=createFileRoute("/services/website-design")({head:()=>({meta:[
  {title:"Business Website Development & SEO Services India | INRISHI"},
  {name:"description",content:"INRISHI builds responsive business websites in India with domain, hosting, technical SEO, on-page SEO, Google indexing readiness, analytics and post-launch search support."},
  {name:"robots",content:"index,follow,max-image-preview:large,max-snippet:-1"},
]}),component:Page});

function Page(){
  const includes=["Page planning and visual design","Responsive development","Domain, hosting and deployment connection","On-page and technical SEO setup","Sitemap, robots and indexing readiness","Analytics, performance and mobile checks"];
  return <div className="v73-public v76-public relative z-10 min-h-screen"><header className="site-header"><div className="mx-auto flex h-[74px] max-w-[1200px] items-center justify-between px-5"><a href={siteHref("/")}><img src={inrishiLogo} alt="INRISHI" className="public-brand-logo"/></a><a href={siteHref("/services")} className="font-semibold text-white">All Services</a></div></header><main className="mx-auto max-w-[1200px] px-5 py-16"><p className="section-kicker">INRISHI / BUSINESS WEBSITE DEVELOPMENT INDIA</p><h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold sm:text-6xl">Business websites built for trust, enquiries and search discovery</h1><p className="mt-6 max-w-4xl text-lg leading-8 text-muted-foreground">Plan, design, build and launch a responsive business website with domain, hosting, technical SEO, on-page search structure, analytics and indexing readiness.</p><img src={visualArt} alt="INRISHI business website development with SEO mobile and conversion features" className="v76-service-hero mt-10"/><section className="v38-panel v76-tile mt-10 p-7"><h2 className="font-display text-3xl font-semibold">What the website engagement can include</h2><div className="mt-6 grid gap-3 md:grid-cols-2">{includes.map(x=><div key={x} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-white"><CheckCircle2 className="shrink-0" size={18}/><span>{x}</span></div>)}</div><p className="mt-6 text-sm text-muted-foreground">Search visibility depends on competition, site quality, content, authority, crawl/indexing signals and time. INRISHI implements search-readiness and ongoing improvement; no fixed ranking is promised.</p></section>
  <SeoServiceSections
    audience={["Startups that need a credible public presence","SMEs whose current website does not generate trust or enquiries","Traditional businesses moving online","Professional services and CA firms","Manufacturers and retailers that need product/service discovery"]}
    replaces={["Outdated or non-responsive websites","Social-media-only business presence","Unclear service pages","Missing analytics and conversion tracking","Weak metadata, crawl paths and indexing signals"]}
    outcomes={["Stronger business credibility","Clearer service and product discovery","Better mobile usability","Cleaner search-engine crawlability","More measurable enquiry and acquisition paths"]}
    questions={[
      {q:"Does INRISHI include SEO with website development?",a:"Yes. The website package can include on-page SEO, technical search readiness, structured metadata, sitemap and robots configuration, indexing support, analytics and post-launch review."},
      {q:"Does INRISHI guarantee first-page rankings?",a:"No. Search rankings are controlled by search engines and depend on competition, authority, relevance, content and many external factors. INRISHI improves the technical and content foundation and monitors opportunities."},
      {q:"Is domain and hosting included?",a:"The standard website package can include domain, hosting, cloud server setup and deployment based on the agreed scope."},
      {q:"What is the public website package price?",a:"The standard public website package is ₹25,000 + GST, with ₹1,500 annual maintenance. Enterprise or multi-site requirements are quoted separately."},
    ]}
    related={[{href:"/services/ai-business-transformation",label:"AI automation"},{href:"/services/crm",label:"CRM software"}]}
  /></main><SiteFooter/></div>;
}
