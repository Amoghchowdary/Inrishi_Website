import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight, ArrowUpRight, BadgeCheck, Bot, BriefcaseBusiness, Building2, Check,
  CheckCircle2, Globe2, LockKeyhole, Menu, PhoneCall, Sparkles, UsersRound,
  Workflow, X,
} from "lucide-react";
import { siteHref } from "@/lib/site-path";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import heroArt from "@/assets/inrishi-v46-hero.png";
import inrishiLogo from "@/assets/inrishi-public-logo.png";
import storyTraditional from "@/assets/story-traditional.svg";
import storyDigital from "@/assets/story-digital.svg";
import storyAi from "@/assets/story-ai.svg";
import websiteVisual from "@/assets/product-website.svg";
import crmVisual from "@/assets/product-crm.svg";
import emsVisual from "@/assets/product-ems.svg";
import aiVisual from "@/assets/product-ai.svg";
import { loadPortalStore, portalStoreEventName, type PortalStore } from "@/lib/portal-store";
import { submitWebsiteInquiry } from "@/lib/business-api";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Inrishi | AI software for Indian businesses" },
    { name: "description", content: "Inrishi helps Indian businesses become digital and AI-ready with websites, CRM, employee management and practical AI automation." },
    { property: "og:title", content: "Inrishi | AI software for Indian businesses" },
    { property: "og:description", content: "Websites, CRM, employee management and AI automation built around the way your business already works." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}), component: Home,
});

type Offer = {
  id: string; title: string; eyebrow: string; price: string; amc?: string; summary: string;
  bullets: string[]; icon: typeof Globe2; accent: string; visual: string;
};

const primaryOffers: Offer[] = [
  { id:"website", title:"Business Website", eyebrow:"BE FOUND. LOOK TRUSTED.", price:"₹25,000 + GST", amc:"₹1,500 annual maintenance", summary:"A complete business website package built for credibility, discoverability and enquiries.", bullets:["Domain + hosting + cloud server","Responsive website design","SEO setup and Google indexing","Google Business Profile management","15-day SEO and visitor-behaviour review"], icon:Globe2, accent:"Visibility + trust + enquiries", visual:websiteVisual },
  { id:"crm", title:"CRM", eyebrow:"NEVER LOSE A CUSTOMER CONVERSATION.", price:"From ₹15,000 + GST", summary:"Keep leads, calls, messages and follow-ups together so every customer gets the right next action.", bullets:["Lead and customer records","Calling-agent workflows","Incoming messages and replies","Call handling and follow-up","Custom sales stages and dashboards"], icon:UsersRound, accent:"Calls + messages + follow-ups", visual:crmVisual },
  { id:"ems", title:"Employee Management", eyebrow:"MAKE PEOPLE OPERATIONS SIMPLE.", price:"From ₹15,000 + GST", summary:"Move attendance, leave, employee records and approvals away from scattered sheets and messages.", bullets:["Employee records","Attendance workflows","Leave and approvals","Documents and roles","Reports and employee portal"], icon:BriefcaseBusiness, accent:"Attendance + leave + records", visual:emsVisual },
  { id:"ai", title:"AI Automation", eyebrow:"AUTOMATE REPEATED WORK.", price:"Custom quotation", summary:"Use AI for customer support, document generation, internal workflows and business assistants.", bullets:["Customer support automation","Document generation","Internal approvals and workflows","AI agents and assistants","Custom process automation"], icon:Bot, accent:"Support + documents + workflows", visual:aiVisual },
];

const industries = ["Startups","SMEs","CA firms","Manufacturers","Retailers","Colleges","Medical institutions","Traditional businesses"];

function Home(){
  const [inquiryOpen,setInquiryOpen]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  const [inquiryStatus,setInquiryStatus]=useState<"idle"|"sending"|"sent"|"error">("idle");
  const [inquiryMessage,setInquiryMessage]=useState("");
  const [form,setForm]=useState({name:"",email:"",phone:"",company:"",message:""});
  const [portalConfig,setPortalConfig]=useState<PortalStore|null>(null);
  useEffect(()=>{const sync=()=>setPortalConfig(loadPortalStore());sync();const event=portalStoreEventName();window.addEventListener(event,sync);return()=>window.removeEventListener(event,sync)},[]);
  const controls=portalConfig?.websiteControls;
  const showCustomerLogin=controls?.customerLoginVisible??true;
  function openInquiry(message=""){setForm(current=>({...current,message:message||current.message}));setInquiryStatus("idle");setInquiryMessage("");setInquiryOpen(true)}
  async function sendInquiry(event:FormEvent<HTMLFormElement>){event.preventDefault();setInquiryStatus("sending");setInquiryMessage("");try{const requirement=[form.company?`Company: ${form.company}`:"",form.message].filter(Boolean).join("\n\n");const result=await submitWebsiteInquiry({name:form.name,phone:form.phone,email:form.email,requirement,source:"Main website V74"});setInquiryStatus("sent");setInquiryMessage(result.message||"Thank you. The Inrishi team will contact you.");setForm({name:"",email:"",phone:"",company:"",message:""})}catch(cause){setInquiryStatus("error");setInquiryMessage(cause instanceof Error?cause.message:"We could not send your request. Please try again.")}}

  return <div className="site-shell v73-public v74-public min-h-screen overflow-x-hidden bg-background text-foreground"><div className="relative z-10">
    {controls?.announcementEnabled&&controls.announcementText&&<div className="v73-announcement px-4 py-2 text-center text-xs font-semibold">{controls.announcementText}</div>}
    <header className="site-header v73-header"><div className="mx-auto flex h-[78px] max-w-[1480px] items-center justify-between gap-5 px-5 md:px-10 lg:px-14"><a href="#top" className="flex items-center" aria-label="Inrishi home"><img src={inrishiLogo} alt="INRISHI" className="public-brand-logo"/></a><nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation"><a href="#story" className="nav-link">Our story</a><a href="#products" className="nav-link">Products</a><a href="#visuals" className="nav-link">See the software</a><a href="#pricing" className="nav-link">Pricing</a><a href="https://partner.inrishi.in/" className="nav-link">Partner</a><a href={siteHref("/contact")} className="nav-link">Contact</a>{showCustomerLogin&&<a href={siteHref("/customer-login")} className="nav-link inline-flex items-center gap-1.5"><LockKeyhole size={14}/> Login</a>}</nav><Button onClick={()=>openInquiry("I would like a demo and quotation.")} className="v73-primary hidden lg:inline-flex">Book a demo <ArrowUpRight size={16}/></Button><Button variant="ghost" size="icon" className="md:hidden" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X/>:<Menu/>}</Button></div>{menuOpen&&<nav className="v73-mobile-nav flex flex-col gap-4 px-5 py-5 md:hidden"><a href="#story" onClick={()=>setMenuOpen(false)}>Our story</a><a href="#products" onClick={()=>setMenuOpen(false)}>Products</a><a href="#visuals" onClick={()=>setMenuOpen(false)}>See the software</a><a href="#pricing" onClick={()=>setMenuOpen(false)}>Pricing</a><a href="https://partner.inrishi.in/">Partner</a><a href={siteHref("/contact")}>Contact</a>{showCustomerLogin&&<a href={siteHref("/customer-login")}>Customer Login</a>}</nav>}</header>

    <main id="top">
      <section className="v73-hero"><div className="mx-auto grid max-w-[1480px] items-center gap-10 px-5 py-12 md:px-10 lg:grid-cols-[1.02fr_.98fr] lg:px-14 lg:py-16"><div className="v73-hero-copy"><div className="v73-kicker"><Sparkles size={15}/> AI software for Indian businesses</div><a href="#products" className="v73-heading-link"><h1>Make your business AI-ready.</h1></a><p>Start with the digital systems your business needs today. Add practical AI where it saves time, improves follow-up and makes work easier to manage.</p><div className="mt-8 flex flex-wrap gap-3"><Button onClick={()=>openInquiry("I want to understand which Inrishi product fits my business.")} className="v73-primary h-12 px-6">Book a demo <ArrowRight size={16}/></Button><Button asChild variant="outline" className="v73-secondary h-12 px-6"><a href="#products">See the products</a></Button></div><div className="v73-trust-row"><span><CheckCircle2/> One-time implementation</span><span><CheckCircle2/> Customisable</span><span><CheckCircle2/> Monthly or annual maintenance</span></div></div><div className="v73-hero-visual"><div className="v73-hero-glow"/><img src={heroArt} alt="Inrishi AI software"/><div className="v73-hero-dock">{primaryOffers.map(offer=>{const Icon=offer.icon;return <a key={offer.id} href={`#product-${offer.id}`} className="v73-dock-card v74-slide"><Icon/><span>{offer.title}</span></a>})}</div></div></div></section>

      <section className="v73-reel" aria-label="Inrishi products"><div className="v73-reel-track">{[0,1,2,3].map(group=><div className="v73-reel-group" key={group}>{primaryOffers.map(offer=>{const Icon=offer.icon;return <a className="v73-reel-chip v74-slide" key={`${group}-${offer.id}`} href={`#product-${offer.id}`}><Icon size={18}/>{offer.title}</a>})}</div>)}</div></section>

      <section id="story" className="v73-section"><div className="v73-section-head"><div><p className="v73-kicker">THE INRISHI STORY</p><h2>From manual work to an AI-ready business.</h2></div><p>Digital transformation is easier to understand when you can see the change. We build the foundation first, connect the work, and then automate what repeats.</p></div><div className="v74-story-grid"><StoryVisual image={storyTraditional} number="01" title="Traditional" text="Calls, notebooks, spreadsheets and manual follow-ups keep the business moving, but information stays scattered."/><StoryVisual image={storyDigital} number="02" title="Digital foundation" text="Website, CRM and employee systems bring customers, follow-ups and team operations into a clearer structure."/><StoryVisual image={storyAi} number="03" title="AI-enabled" text="AI handles repeated support, documents and routine workflows while your team stays in control of decisions."/></div></section>

      <section id="products" className="v73-section"><div className="v73-section-head"><div><p className="v73-kicker">START WITH THE REAL PROBLEM</p><h2>Four practical systems. One clearer business.</h2></div><p>Begin with one product or connect them over time. The software is shaped around the business instead of forcing the business into a template.</p></div><div className="v73-product-grid">{primaryOffers.map(offer=><ProductCard key={offer.id} offer={offer} onTalk={()=>openInquiry(`I want to discuss ${offer.title}.`)}/>)}</div></section>

      <section id="visuals" className="v73-section"><div className="v73-section-head"><div><p className="v73-kicker">SEE THE SOFTWARE</p><h2>Understand the product in a few seconds.</h2></div><p>Real product-style visuals show what each system does before you read the details.</p></div><div className="v73-visual-grid">{primaryOffers.map(offer=><VisualPreview key={offer.id} offer={offer}/>)}</div></section>

      <section className="v73-section"><div className="v73-section-head"><div><p className="v73-kicker">WHAT CHANGES AFTER GO-LIVE</p><h2>Technology should make the business easier to run.</h2></div><p>The goal is simple: more visibility, faster response, clearer operations and less repeated work.</p></div><div className="v73-impact-grid"><Impact icon={Globe2} title="More visible" text="A professional website and Google presence make the business easier to discover and trust."/><Impact icon={PhoneCall} title="Faster follow-up" text="CRM keeps every lead, call and next action in one customer timeline."/><Impact icon={BriefcaseBusiness} title="Better team visibility" text="Employee records, attendance and requests stop living in scattered chats and sheets."/><Impact icon={Workflow} title="Less repeated work" text="AI automation handles routine support, documents and internal steps that repeat every day."/></div></section>

      <section id="pricing" className="v73-section"><div className="v73-section-head"><div><p className="v73-kicker">CLEAR STARTING PRICES</p><h2>Start with what the business needs now.</h2></div><p>GST is additional. Advanced integrations, enterprise rollouts and custom automation are quoted after scope confirmation.</p></div><div className="v73-price-grid"><PriceCard title="Business Website" price="₹25,000" note="+ GST" detail="Domain, hosting, cloud server, website, SEO setup and Google Business Profile management." footer="AMC ₹1,500/year"/><PriceCard title="CRM" price="₹15,000" note="+ GST · starting price" detail="Customer records, calls, messages, follow-ups and custom sales workflow." footer="Maintenance based on scope"/><PriceCard title="Employee Management" price="₹15,000" note="+ GST · starting price" detail="Employee records, attendance, leave, approvals and reports." footer="Maintenance based on scope"/><PriceCard title="AI Automation" price="Custom" note="Quotation after workflow study" detail="Customer support, document generation, internal workflows and AI assistants." footer="Built around the process"/></div><div className="v73-enterprise"><Building2/><div><strong>Need multiple websites or a larger rollout?</strong><p>Enterprise packages are available for groups, colleges, medical institutions and organisations that need multiple websites or connected systems.</p></div><Button onClick={()=>openInquiry("I need an enterprise quotation.")} variant="outline" className="v73-secondary">Talk to us</Button></div></section>

      <section className="v73-section"><div className="v73-section-head"><div><p className="v73-kicker">BUILT FOR THE BUSINESSES AROUND US</p><h2>From a growing startup to an established traditional business.</h2></div><p>The software is configured around your team, process and scale — not a fixed template.</p></div><div className="v73-industry-row">{industries.map(name=><span key={name}>{name}</span>)}</div></section>

      <section className="v73-section"><div className="v73-partner-cta"><div><p className="v73-kicker">INRISHI PARTNER NETWORK</p><h2>Know a business that needs better software?</h2><p>Introduce the opportunity through the Partner Portal. Inrishi handles product explanation, scope, pricing, implementation and support.</p></div><div className="flex flex-wrap gap-3"><Button asChild className="v73-primary"><a href="https://partner.inrishi.in/">See Partner Program <ArrowUpRight/></a></Button><Button asChild variant="outline" className="v73-secondary"><a href="https://partner.inrishi.in/register">Register</a></Button></div></div></section>

      <section className="v73-section pb-28"><div className="v73-final-cta"><div><span className="v73-kicker">PRACTICAL SOFTWARE. CLEAR NEXT STEP.</span><h2>Tell us what is slowing the business down.</h2><p>We will recommend the simplest product or automation that fits the requirement.</p></div><Button onClick={()=>openInquiry("I would like a consultation and quotation.")} className="v73-primary h-12 px-7">Start a conversation <ArrowUpRight/></Button></div></section>
    </main>
    <SiteFooter/>
  </div>
  <Dialog open={inquiryOpen} onOpenChange={setInquiryOpen}><DialogContent className="v73-dialog max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Tell us what you need.</DialogTitle><DialogDescription>Share the business requirement. We will follow up with the right product, scope and quotation.</DialogDescription></DialogHeader><form onSubmit={sendInquiry} className="grid gap-4"><label className="form-label">Your name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="form-input"/></label><label className="form-label">Work email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="form-input"/></label><label className="form-label">Phone<input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="form-input"/></label><label className="form-label">Company<input value={form.company} onChange={e=>setForm({...form,company:e.target.value})} className="form-input"/></label><label className="form-label">What do you need?<textarea required rows={4} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} className="form-input"/></label><Button type="submit" disabled={inquiryStatus==="sending"} className="v73-primary">{inquiryStatus==="sending"?"Sending…":"Send request"}</Button>{inquiryMessage&&<p role="status">{inquiryMessage}</p>}</form></DialogContent></Dialog>
  </div>
}

function StoryVisual({image,number,title,text}:{image:string;number:string;title:string;text:string}){return <article className="v74-story-card v74-tile"><img src={image} alt={`${title} business stage`}/><div><span>{number}</span><h3>{title}</h3><p>{text}</p></div></article>}
function ProductCard({offer,onTalk}:{offer:Offer;onTalk:()=>void}){const Icon=offer.icon;return <article id={`product-${offer.id}`} className="v73-product-card v74-tile"><img src={offer.visual} alt={`${offer.title} interface visual`} className="v74-product-image"/><div className="v73-product-top"><div className="v73-product-icon"><Icon size={28}/></div><span>{offer.eyebrow}</span></div><h3><a href={`#product-${offer.id}`}>{offer.title}</a></h3><p>{offer.summary}</p><div className="v73-price-line"><strong>{offer.price}</strong>{offer.amc&&<small>{offer.amc}</small>}</div><ul>{offer.bullets.map(item=><li key={item}><Check size={15}/>{item}</li>)}</ul><div className="v73-product-footer"><span>{offer.accent}</span><button type="button" onClick={onTalk}>Discuss <ArrowUpRight size={15}/></button></div></article>}
function PriceCard({title,price,note,detail,footer}:{title:string;price:string;note:string;detail:string;footer:string}){return <article className="v73-price-card v74-tile"><span>{title}</span><strong>{price}</strong><small>{note}</small><p>{detail}</p><div><BadgeCheck size={18}/>{footer}</div></article>}
function Impact({icon:Icon,title,text}:{icon:typeof Globe2;title:string;text:string}){return <article className="v73-impact-card v74-tile"><Icon/><h3>{title}</h3><p>{text}</p></article>}
function VisualPreview({offer}:{offer:Offer}){return <article className="v73-visual-card v74-visual-card v74-tile"><img src={offer.visual} alt={`${offer.title} product visual`}/><div className="v74-visual-caption"><strong>{offer.title}</strong><p>{offer.summary}</p><a href={`#product-${offer.id}`}>See details <ArrowUpRight size={15}/></a></div></article>}
