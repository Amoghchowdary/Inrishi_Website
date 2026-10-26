import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowLeft, BadgeIndianRupee, BriefcaseBusiness, CheckCircle2, CircleUserRound, FileText,
  FolderArchive, LayoutDashboard, LogOut, Mail, MessageCircle, Plus, Send, Settings2,
  Target, UsersRound, WalletCards, Workflow, X, ShieldCheck,
} from "lucide-react";
import inrishiLogo from "@/assets/inrishi-logo.png";
import { Button } from "@/components/ui/button";
import {
  createPartnerLead, isPartnerLeadConversionEligible, loadPortalStore, refreshPortalStoreFromServer,
  portalStoreEventName, requiredPartnerLeadAdvance, savePortalStore, type LeadStatus, type PartnerLead, type PartnerRecord, type PortalStore,
} from "@/lib/portal-store";
import { getCurrentPartnerFn, logoutPartnerFn } from "@/services/partner-auth";
import { deletePortalFile, openPortalFile, putPortalFile } from "@/lib/portal-file-db";
import { convertPartnerLead, recordPartnerAdvancePayment, sendPartnerCustomerLogin } from "@/lib/business-api";

export const Route = createFileRoute("/partner-portal")({
  head: () => ({ meta: [{ title: "Partner Workspace | Inrishi" }, { name: "robots", content: "noindex, nofollow" }] }),
  loader: async () => {
    const partner = await getCurrentPartnerFn();
    if (!partner) throw redirect({ to: "/partner-login" });
    return partner;
  },
  component: PartnerPortalRoute,
});

type Tab = "dashboard" | "leads" | "customers" | "projects" | "incentives" | "outbox" | "documents" | "chat" | "profile" | "settings";
const tabs: Array<{ key: Tab; label: string; icon: typeof LayoutDashboard }> = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "leads", label: "Leads", icon: Target },
  { key: "customers", label: "Customers", icon: UsersRound },
  { key: "projects", label: "Projects", icon: Workflow },
  { key: "incentives", label: "Incentives", icon: BadgeIndianRupee },
  { key: "outbox", label: "Customer login details", icon: Mail },
  { key: "documents", label: "Documents", icon: FolderArchive },
  { key: "chat", label: "Chat with Inrishi", icon: MessageCircle },
  { key: "profile", label: "Profile & payout", icon: CircleUserRound },
  { key: "settings", label: "Settings", icon: Settings2 },
];

function PartnerPortalRoute() {
  const session = Route.useLoaderData();
  return <PartnerPortal session={session} />;
}

export function PartnerPortal({ session }: { session: { loginId?: string; email: string; name?: string } }) {
  const [store, setStore] = useState<PortalStore | null>(null);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [chat, setChat] = useState("");
  const [notice, setNotice] = useState("");
  const [partnerFiles, setPartnerFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  useEffect(() => {
    const sync = () => setStore(loadPortalStore()); sync();
    window.addEventListener(portalStoreEventName(), sync);
    return () => { window.removeEventListener(portalStoreEventName(), sync); };
  }, []);

  const partner = useMemo(() => store?.partners.find((item) => item.loginId === (session.loginId ?? session.email) || item.email === session.email) ?? null, [store, session.email, session.loginId]);
  function commit(next: PortalStore, message?: string) { savePortalStore(next); setStore(next); if (message) { setNotice(message); setTimeout(()=>setNotice(""), 2600); } }
  function updatePartner(updated: PartnerRecord, message?: string) { if (!store) return; commit({ ...store, partners: store.partners.map((item)=>item.id===updated.id?updated:item) }, message); }
  async function logout() { await logoutPartnerFn(); window.location.replace("/login"); }

  if (!store || !partner) return <div className="workspace-shell min-h-screen p-10 text-white">Loading your partner area…</div>;
  if (partner.status !== "Approved") return <PendingApproval partner={partner} onLogout={logout}/>;

  const customers = store.customers.filter((customer)=>customer.partnerId===partner.id);
  const incentives = partner.incentives;
  const earned = incentives.filter((i)=>i.status==="Earned"||i.status==="Payout pending"||i.status==="Paid").reduce((sum,i)=>sum+i.incentiveAmount,0);
  const paid = incentives.filter((i)=>i.status==="Paid").reduce((sum,i)=>sum+i.incentiveAmount,0);
  const activeProjects = customers.filter((customer)=>customer.services.some((service)=>service.selected && service.status!=="Completed")).length;
  const onboardingLeads = partner.leads.filter((lead)=>!["Converted","Lost","Not interested"].includes(lead.status)).length;

  async function uploadPartnerDocuments() {
    if (!partnerFiles.length || !partner) return;
    const activePartner = partner;
    setUploadingFiles(true);
    try {
      const docs = [] as PartnerRecord["documents"];
      for (const file of partnerFiles.filter((item) => item.size <= 5 * 1024 * 1024)) {
        const id = `partner-document-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        await putPortalFile(id, activePartner.id, file);
        docs.push({ id, partnerId: activePartner.id, name: file.name, mimeType: file.type || "application/octet-stream", size: file.size, category: "Other", uploadedAt: new Date().toISOString() });
      }
      updatePartner({ ...activePartner, documents: [...activePartner.documents, ...docs] }, `${docs.length} partner document${docs.length === 1 ? "" : "s"} uploaded.`);
      setPartnerFiles([]);
    } finally { setUploadingFiles(false); }
  }

  async function removePartnerDocument(id: string) {
    if (!partner) return;
    const activePartner = partner;
    await deletePortalFile(id);
    updatePartner({ ...activePartner, documents: activePartner.documents.filter((doc) => doc.id !== id) }, "Partner document removed.");
  }

  async function recordAdvancePayment(lead: PartnerLead, amount: number, reference: string) {
    try {
      await recordPartnerAdvancePayment({ leadId: lead.id, amount, reference });
      const refreshed = await refreshPortalStoreFromServer();
      setStore(refreshed);
      setNotice(`Advance payment recorded for ${lead.customerName}. The lead is now eligible for conversion.`);
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : "Unable to record the payment.");
    }
    setTimeout(()=>setNotice(""), 3600);
  }


  async function sendCustomerLoginDetails(id: string, customerId: string) {
    try {
      const result = await sendPartnerCustomerLogin({ id, customerId });
      const refreshed = await refreshPortalStoreFromServer();
      setStore(refreshed);
      setNotice(result.message || "Customer login details sent successfully.");
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : "Unable to send the customer login details.");
    }
    setTimeout(()=>setNotice(""), 3600);
  }
  async function convertLead(lead: PartnerLead) {
    try {
      await convertPartnerLead({ leadId: lead.id });
      const refreshed = await refreshPortalStoreFromServer();
      setStore(refreshed);
      setNotice(`Customer created successfully: ${lead.customerName}. It is now visible under Customers.`);
      setTab("customers");
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : "Unable to convert this lead.");
    }
    setTimeout(()=>setNotice(""), 3600);
  }

  return <div className="workspace-shell min-h-screen text-white"><div className="relative z-10">
    <header className="workspace-header border-b border-white/10"><div className="mx-auto flex h-[76px] max-w-[1540px] items-center justify-between gap-5 px-5 md:px-8 lg:px-12"><a href="/"><img src={inrishiLogo} className="w-[132px]" alt="Inrishi"/></a><div className="flex items-center gap-3"><span className="hidden text-sm text-white/60 md:block">{partner.name} · {partner.status}</span><Button variant="ghost" onClick={logout} className="text-primary hover:bg-primary/10 hover:text-primary"><LogOut size={15}/> Sign out</Button></div></div></header>
    <main className="mx-auto max-w-[1540px] px-5 py-8 md:px-8 lg:px-12"><a href="/" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.16em] text-white/60 hover:text-primary"><ArrowLeft size={14}/> Partner website</a>{notice&&<div className="fixed right-5 top-24 z-50 border border-primary/30 bg-[#071820] px-5 py-3 text-sm font-semibold text-primary shadow-2xl">{notice}</div>}
      <div className="mt-7 grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)]"><aside className="workspace-sidebar h-fit p-4 lg:sticky lg:top-24"><div className="border-b border-border px-3 pb-4 pt-2"><p className="section-kicker">PARTNER AREA</p><p className="mt-2 text-sm font-semibold text-white">{partner.name}</p><p className="mt-1 text-xs text-white/45">Inrishi Partner Network · ₹{store.partnerWebsiteControls.incentiveAmount.toLocaleString("en-IN")} incentive</p></div><nav className="mt-3 grid gap-1">{tabs.map(({key,label,icon:Icon})=><button key={key} onClick={()=>setTab(key)} className={`flex items-center gap-3 px-3 py-3 text-left text-sm font-semibold ${tab===key?"bg-primary/12 text-primary":"text-white/65 hover:bg-white/5 hover:text-white"}`}><Icon size={17}/>{label}</button>)}</nav></aside>
      <section className="workspace-content min-w-0">
        {tab==="dashboard"&&<Panel kicker="YOUR OVERVIEW" title={`Welcome, ${partner.name}.`} description="See your leads, customers, project status and incentives in one place."><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6"><Metric label="Total leads" value={String(partner.leads.length)}/><Metric label="Trying to onboard" value={String(onboardingLeads)}/><Metric label="Converted" value={String(partner.leads.filter((l)=>l.status==="Converted").length)}/><Metric label="Customers" value={String(customers.length)}/><Metric label="Active projects" value={String(activeProjects)}/><Metric label="Incentive earned" value={`₹${earned.toLocaleString("en-IN")}`}/></div><div className="mt-6 grid gap-5 xl:grid-cols-[1.15fr_.85fr]"><Box title="Recent leads"><div className="grid gap-3">{partner.leads.slice(-6).reverse().map((lead)=><button key={lead.id} onClick={()=>setTab("leads")} className="grid gap-2 border-t border-white/8 py-3 text-left sm:grid-cols-[1fr_auto]"><span><strong className="block text-white">{lead.customerName}</strong><small className="text-white/45">{lead.company||"Individual"} · {lead.service}</small></span><span className="font-mono text-[10px] uppercase tracking-[.12em] text-primary">{lead.status}</span></button>)}{!partner.leads.length&&<Empty text="No leads yet."/>}</div></Box><Box title="Incentive summary"><div className="grid grid-cols-2 gap-3"><Mini label="Expected" value={`₹${incentives.filter(i=>i.status==="Expected").reduce((s,i)=>s+i.incentiveAmount,0).toLocaleString("en-IN")}`}/><Mini label="Earned" value={`₹${earned.toLocaleString("en-IN")}`}/><Mini label="Paid" value={`₹${paid.toLocaleString("en-IN")}`}/><Mini label="Pending payout" value={`₹${incentives.filter(i=>i.status==="Payout pending").reduce((s,i)=>s+i.incentiveAmount,0).toLocaleString("en-IN")}`}/></div></Box></div></Panel>}

        {tab==="leads"&&<Panel kicker="LEADS" title="Your leads" description={`A lead can be created as a customer after the required first payment is recorded. The customer status changes automatically after conversion.`}><div className="flex flex-wrap items-center justify-between gap-3"><div className="text-sm text-white/55">Website Design · ${store.partnerWebsiteControls.conversionAdvancePercent}% first payment required before customer creation · ₹{store.partnerWebsiteControls.incentiveAmount.toLocaleString("en-IN")} incentive</div><Button onClick={()=>setShowLeadForm(true)} className="rounded-none bg-primary text-primary-foreground"><Plus size={16}/> Add lead</Button></div><div className="mt-6 grid gap-3">{partner.leads.slice().reverse().map((lead)=><LeadCard key={lead.id} lead={lead} advancePercent={store.partnerWebsiteControls.conversionAdvancePercent} requiredAdvance={requiredPartnerLeadAdvance(store,lead)} eligible={isPartnerLeadConversionEligible(store,lead)} onChange={(updated)=>updatePartner({...partner,leads:partner.leads.map((item)=>item.id===updated.id?updated:item)},"Lead updated.")} onRecordPayment={(amount,reference)=>recordAdvancePayment(lead,amount,reference)} onConvert={()=>convertLead(lead)}/>)}</div>{showLeadForm&&<LeadForm onClose={()=>setShowLeadForm(false)} onCreate={(input)=>{const lead=createPartnerLead(partner,input,store.partnerWebsiteControls.servicePrice);updatePartner({...partner,leads:[...partner.leads,lead]},"Lead created.");setShowLeadForm(false);}}/>}</Panel>}

        {tab==="customers"&&<Panel kicker="CUSTOMERS" title="Your customers" description="Customers you successfully bring to Inrishi appear here with their project and login details."><div className="grid gap-3">{customers.length?customers.map((customer)=><div key={customer.id} className="workspace-panel grid gap-4 p-5 md:grid-cols-[1fr_auto]"><div><p className="font-display text-xl font-semibold text-white">{customer.name}</p><p className="mt-1 text-sm text-white/50">{customer.company} · {customer.recoveryEmail || customer.email}</p><p className="mt-2 text-xs text-white/60">Inrishi Login ID: <strong className="text-white">{customer.loginId}</strong></p><p className="mt-3 font-mono text-[10px] uppercase tracking-[.12em] text-primary">Project {customer.projectId} · Login {customer.loginDelivered?"sent":"ready"}</p></div><div className="self-center text-right"><span className="text-xs text-white/45">Website Design</span><p className="mt-1 font-semibold text-white">{customer.services.find(s=>s.name==="Website Design")?.status}</p></div></div>):<Empty text="Customers will appear here after a successful conversion."/>}</div></Panel>}

        {tab==="projects"&&<Panel kicker="CUSTOMER PROJECTS" title="Customer projects" description="Track the projects for customers you introduced. Inrishi handles delivery while your relationship to the customer remains recorded."><div className="grid gap-3">{customers.map((customer)=><div key={customer.id} className="workspace-panel p-5"><div className="flex flex-wrap justify-between gap-3"><div><p className="font-display text-xl font-semibold">{customer.projectId} · {customer.company||customer.name}</p><p className="mt-1 text-sm text-white/50">Customer: {customer.name}</p></div><span className="font-mono text-[10px] uppercase tracking-[.12em] text-primary">{customer.services.find(s=>s.name==="Website Design")?.status}</span></div><div className="mt-4 grid grid-cols-4 gap-1">{customer.progress.map((item)=><div key={item.id} className={`h-2 ${item.status==="Completed"?"bg-primary":item.status==="Review"?"bg-cyan-400/70":item.status==="In progress"?"bg-primary/45":"bg-white/8"}`}/>)}</div></div>)}{!customers.length&&<Empty text="No projects yet."/>}</div></Panel>}

        {tab==="incentives"&&<Panel kicker="INCENTIVES" title="Your incentives" description="See the incentives linked to converted customers and whether each one is expected, earned, awaiting payout or paid."><div className="grid gap-3">{incentives.length?incentives.slice().reverse().map((item)=><div key={item.id} className="workspace-panel grid gap-4 p-5 sm:grid-cols-[1fr_auto]"><div><p className="font-display text-xl font-semibold">₹{item.incentiveAmount.toLocaleString("en-IN")} · {item.service}</p><p className="mt-2 text-sm text-white/50">Base ₹{item.baseValue.toLocaleString("en-IN")} · {item.incentiveRate}% · Project {item.projectId}</p></div><span className="self-center font-mono text-[10px] uppercase tracking-[.12em] text-primary">{item.status}</span></div>):<Empty text="Incentives are created when a lead converts."/>}</div></Panel>}

        {tab==="outbox"&&<Panel kicker="CUSTOMER ACCESS" title="Send customer login" description="After a lead becomes a customer, you can send their Inrishi Login ID and a newly generated temporary password directly to their registered email. The temporary password is created only when you send it and is not stored in this workspace."><div className="grid gap-3">{store.partnerOutbox.filter(m=>m.partnerId===partner.id).slice().reverse().map((message)=><div key={message.id} className="workspace-panel p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold text-white">{message.recipient}</p><p className="mt-1 text-sm text-white/50">Inrishi Login ID: <strong className="text-white">{message.loginId || store.customers.find(c=>c.id===message.customerId)?.loginId || "Created"}</strong></p></div><span className="font-mono text-[10px] uppercase tracking-[.12em] text-primary">{message.status}</span></div><p className="mt-4 border border-white/8 bg-black/20 p-4 text-xs leading-6 text-white/60">{message.status==="Sent" ? "Login details were sent to the customer by email." : "A secure temporary password will be generated when you send the login details."}</p>{message.status!=="Sent"&&<Button onClick={()=>void sendCustomerLoginDetails(message.id,message.customerId)} className="mt-4 rounded-none bg-primary text-primary-foreground"><Send size={16}/> Send login details by email</Button>}</div>)}{!store.partnerOutbox.some(m=>m.partnerId===partner.id)&&<Empty text="Customer login delivery becomes available after a lead is converted."/>}</div></Panel>}

        {tab==="documents"&&<Panel kicker="YOUR DOCUMENTS" title="Your documents" description="Keep your KYC, agreement, payout and other partner documents together in one place."><div className="flex flex-wrap gap-3"><label className="inline-flex cursor-pointer items-center gap-2 border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"><FolderArchive size={16}/> Select documents<input type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.txt" className="sr-only" onChange={(e)=>setPartnerFiles(Array.from(e.target.files??[]))}/></label><Button disabled={!partnerFiles.length||uploadingFiles} onClick={uploadPartnerDocuments} className="rounded-none bg-primary text-primary-foreground">{uploadingFiles?"Uploading…":"Upload documents"}</Button></div><div className="mt-6 grid gap-3">{partner.documents.length?partner.documents.slice().reverse().map((doc)=><div key={doc.id} className="workspace-panel grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center"><div><strong>{doc.name}</strong><p className="mt-1 text-xs text-white/45">{doc.category} · {(doc.size/1024).toFixed(1)} KB</p></div><div className="flex gap-2"><Button variant="outline" onClick={()=>openPortalFile(doc.id,doc.name)} className="rounded-none border-white/15">Open</Button><Button variant="ghost" onClick={()=>removePartnerDocument(doc.id)} className="text-red-300 hover:bg-red-500/10">Remove</Button></div></div>):<Empty text="No partner documents uploaded yet."/>}</div></Panel>}

        {tab==="chat"&&<Panel kicker="HELP & SUPPORT" title="Chat with Inrishi" description="Chat directly with the Inrishi team about leads, customers, incentives or account questions."><div className="max-h-[460px] space-y-3 overflow-auto workspace-panel p-4">{partner.messages.map((m)=><div key={m.id} className={`max-w-[85%] border p-4 text-sm ${m.from==="partner"?"ml-auto border-primary/30 bg-primary/8":"border-white/10 bg-white/[.025]"}`}><p>{m.text}</p><p className="mt-2 font-mono text-[9px] uppercase tracking-[.12em] text-white/40">{m.from==="partner"?"You":"Inrishi"}</p></div>)}</div><form className="mt-4 flex gap-3" onSubmit={(e)=>{e.preventDefault();if(!chat.trim())return;updatePartner({...partner,messages:[...partner.messages,{id:`pm-${Date.now()}`,partnerId:partner.id,from:"partner",text:chat.trim(),createdAt:new Date().toISOString()}]},"Message sent.");setChat("");}}><input className="form-input h-11 flex-1" value={chat} onChange={(e)=>setChat(e.target.value)} placeholder="Message Inrishi…"/><Button className="h-11 rounded-none bg-primary text-primary-foreground"><Send size={16}/> Send</Button></form></Panel>}

        {tab==="profile"&&<PartnerProfile partner={partner} onSave={(p)=>updatePartner(p,"Profile updated.")}/>} 
        {tab==="settings"&&<PartnerSettings partner={partner} onSave={(p)=>updatePartner(p,"Settings updated.")}/>} 
      </section></div>
    </main>
  </div></div>;
}

function PendingApproval({partner,onLogout}:{partner:PartnerRecord;onLogout:()=>void}) { return <div className="workspace-shell min-h-screen text-white"><div className="mx-auto flex min-h-screen max-w-[760px] items-center px-5"><div className="workspace-panel w-full p-8 sm:p-10"><img src={inrishiLogo} className="w-[145px]" alt="Inrishi"/><div className="mt-10 flex h-14 w-14 items-center justify-center border border-amber-300/25 bg-amber-300/8 text-amber-200"><ShieldCheck/></div><p className="section-kicker mt-7">{partner.status}</p><h1 className="mt-3 font-display text-4xl font-semibold">Your partner application is under review.</h1><p className="mt-4 leading-7 text-white/60">Your registration is complete. Inrishi is reviewing your application, and the full partner features will open after approval.</p><button onClick={onLogout} className="mt-7 inline-flex h-11 items-center gap-2 border border-white/15 px-5 font-semibold"><LogOut size={16}/> Sign out</button></div></div></div>; }

function Panel({kicker,title,description,children}:{kicker:string;title:string;description:string;children:React.ReactNode}) { return <div><p className="section-kicker">{kicker}</p><h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">{title}</h1><p className="mt-4 max-w-3xl leading-7 text-white/60">{description}</p><div className="mt-8">{children}</div></div>; }
function Metric({label,value}:{label:string;value:string}) { return <div className="workspace-panel p-5"><p className="font-mono text-[9px] uppercase tracking-[.13em] text-white/45">{label}</p><p className="mt-3 font-display text-3xl font-semibold text-primary">{value}</p></div>; }
function Mini({label,value}:{label:string;value:string}) { return <div className="border border-white/8 bg-black/15 p-4"><p className="text-xs text-white/45">{label}</p><p className="mt-2 font-display text-2xl font-semibold text-primary">{value}</p></div>; }
function Box({title,children}:{title:string;children:React.ReactNode}) { return <div className="workspace-panel p-6"><h2 className="font-display text-2xl font-semibold">{title}</h2><div className="mt-5">{children}</div></div>; }
function Empty({text}:{text:string}) { return <div className="border border-dashed border-white/12 p-8 text-center text-sm text-white/45">{text}</div>; }

function LeadCard({lead,onChange,onRecordPayment,onConvert,requiredAdvance,advancePercent,eligible}:{lead:PartnerLead;onChange:(lead:PartnerLead)=>void;onRecordPayment:(amount:number,reference:string)=>void;onConvert:()=>void;requiredAdvance:number;advancePercent:number;eligible:boolean}) {
  const [amount,setAmount]=useState(String(lead.advancePaymentAmount || requiredAdvance));
  const [reference,setReference]=useState(lead.advancePaymentReference || "");
  useEffect(()=>{setAmount(String(lead.advancePaymentAmount || requiredAdvance));setReference(lead.advancePaymentReference || "");},[lead.id,lead.advancePaymentAmount,lead.advancePaymentReference,requiredAdvance]);
  const stages: LeadStatus[] = ["New","Contacted","Interested","Qualified","Proposal","On hold","Lost","Not interested"];
  return <div className="workspace-panel p-5">
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_220px]">
      <div><div className="flex flex-wrap items-center gap-3"><p className="font-display text-xl font-semibold">{lead.customerName}</p>{lead.status==="Converted"&&<span className="inline-flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.12em] text-primary"><CheckCircle2 size={13}/> Customer created</span>}</div><p className="mt-1 text-sm text-white/50">{lead.company||"Individual"} · {lead.email||lead.phone}</p><p className="mt-3 text-sm text-white/60">{lead.notes||"No notes"}</p></div>
      {lead.status==="Converted"?<div className="flex items-center justify-end text-sm font-semibold text-primary"><CheckCircle2 size={16} className="mr-2"/> Converted</div>:<label className="form-label">Lead status<select className="form-input h-10" value={lead.status} onChange={(e)=>onChange({...lead,status:e.target.value as LeadStatus})}>{stages.map((stage)=><option key={stage}>{stage}</option>)}</select></label>}
    </div>
    <div className="mt-5 border-t border-white/10 pt-5">
      <div className="grid gap-4 lg:grid-cols-[180px_220px_minmax(0,1fr)_auto] lg:items-end">
        <div><p className="font-mono text-[9px] uppercase tracking-[.12em] text-white/40">Customer creation rule</p><p className="mt-2 text-sm font-semibold text-white">{advancePercent}% advance required</p><p className="mt-1 text-xs text-white/45">Minimum ₹{requiredAdvance.toLocaleString("en-IN")}</p></div>
        <label className="form-label">Advance received<input type="number" min={requiredAdvance} className="form-input h-10" value={amount} disabled={lead.status==="Converted"} onChange={(e)=>setAmount(e.target.value)}/></label>
        <label className="form-label">Payment reference<input className="form-input h-10" value={reference} disabled={lead.status==="Converted"} onChange={(e)=>setReference(e.target.value)} placeholder="UTR / transaction / receipt reference"/></label>
        <div className="flex flex-wrap gap-2">{lead.status!=="Converted"&&lead.advancePaymentStatus!=="Paid"&&<Button type="button" variant="outline" onClick={()=>onRecordPayment(Number(amount),reference)} className="rounded-none border-primary/30 text-primary">Record {advancePercent}% payment</Button>}{lead.status!=="Converted"&&<Button type="button" disabled={!eligible} onClick={onConvert} className="rounded-none bg-primary text-primary-foreground disabled:cursor-not-allowed disabled:opacity-35">{eligible?"Create customer":`${advancePercent}% payment required`}</Button>}</div>
      </div>
      <div className={`mt-4 border px-4 py-3 text-sm ${eligible||lead.status==="Converted"?"border-primary/25 bg-primary/[.06] text-primary":"border-amber-300/15 bg-amber-300/[.04] text-amber-100/70"}`}>{lead.status==="Converted"?`Customer created successfully · Customer ${lead.convertedCustomerId} · Project ${lead.projectId}`:lead.advancePaymentStatus==="Paid"?`Advance payment confirmed: ₹${lead.advancePaymentAmount.toLocaleString("en-IN")}${lead.advancePaymentReference?` · Ref ${lead.advancePaymentReference}`:""}. This lead is ready to be created as a customer.`:`The customer can be created after at least ₹${requiredAdvance.toLocaleString("en-IN")} has been recorded as paid.`}</div>
    </div>
  </div>;
}

function LeadForm({onClose,onCreate}:{onClose:()=>void;onCreate:(lead:Omit<PartnerLead,"id"|"partnerId"|"service"|"expectedValue"|"status"|"createdAt"|"advancePaymentAmount"|"advancePaymentStatus"|"advancePaymentReference"|"advancePaymentRecordedAt"|"convertedCustomerId"|"projectId">)=>void}) { const [form,setForm]=useState({customerName:"",company:"",phone:"",email:"",location:"",notes:"",source:"",followUpDate:""}); function update(k:keyof typeof form,v:string){setForm(s=>({...s,[k]:v}));} return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4"><form onSubmit={(e)=>{e.preventDefault();onCreate(form);}} className="workspace-panel max-h-[90vh] w-full max-w-3xl overflow-auto p-7"><div className="flex items-start justify-between"><div><p className="section-kicker">NEW LEAD</p><h2 className="mt-2 font-display text-3xl font-semibold">Website Design lead</h2></div><button type="button" onClick={onClose} className="p-2 text-white/50 hover:text-white"><X/></button></div><div className="mt-7 grid gap-5 sm:grid-cols-2"><F label="Customer name" v={form.customerName} set={(v)=>update("customerName",v)} req/><F label="Business / Company" v={form.company} set={(v)=>update("company",v)}/><F label="Phone" v={form.phone} set={(v)=>update("phone",v)} req/><F label="Customer contact email" v={form.email} set={(v)=>update("email",v)} req/><F label="Location" v={form.location} set={(v)=>update("location",v)}/><F label="Lead source" v={form.source} set={(v)=>update("source",v)}/><F label="Follow-up date" v={form.followUpDate} set={(v)=>update("followUpDate",v)} type="date"/><label className="form-label sm:col-span-2">Notes<textarea className="form-input min-h-24" value={form.notes} onChange={(e)=>update("notes",e.target.value)}/></label></div><div className="mt-7 flex justify-end gap-3"><Button type="button" variant="outline" onClick={onClose} className="rounded-none border-white/15">Cancel</Button><Button className="rounded-none bg-primary text-primary-foreground"><Plus size={16}/> Create lead</Button></div></form></div>; }
function F({label,v,set,req=false,type="text"}:{label:string;v:string;set:(v:string)=>void;req?:boolean;type?:string}) { return <label className="form-label">{label}<input className="form-input h-11" type={type} required={req} value={v} onChange={(e)=>set(e.target.value)}/></label>; }

function PartnerProfile({partner,onSave}:{partner:PartnerRecord;onSave:(p:PartnerRecord)=>void}) { const [draft,setDraft]=useState(partner); useEffect(()=>setDraft(partner),[partner]); return <Panel kicker="PROFILE & PAYOUT DETAILS" title="Partner profile" description="Keep business, contact, tax and payout information current."><div className="mb-6 grid gap-3 sm:grid-cols-2"><div className="workspace-panel p-4"><p className="font-mono text-[10px] uppercase tracking-[.14em] text-primary">Your Inrishi Login ID</p><p className="mt-2 break-all font-semibold text-white">{partner.loginId}</p><p className="mt-1 text-xs text-white/45">Use this ID only to sign in to Inrishi. It is not a normal email inbox.</p></div><div className="workspace-panel p-4"><p className="font-mono text-[10px] uppercase tracking-[.14em] text-primary">Contact email</p><p className="mt-2 break-all font-semibold text-white">{partner.recoveryEmail}</p><p className="mt-1 text-xs text-white/45">This email is used for verification and password recovery.</p></div></div><div className="grid max-w-4xl gap-5 sm:grid-cols-2"><F label="Name" v={draft.name} set={(v)=>setDraft({...draft,name:v})}/><F label="Company" v={draft.company} set={(v)=>setDraft({...draft,company:v})}/><F label="Phone" v={draft.phone} set={(v)=>setDraft({...draft,phone:v})}/><F label="City" v={draft.city} set={(v)=>setDraft({...draft,city:v})}/><F label="Beneficiary name" v={draft.payout.beneficiaryName} set={(v)=>setDraft({...draft,payout:{...draft.payout,beneficiaryName:v}})}/><F label="Bank" v={draft.payout.bankName} set={(v)=>setDraft({...draft,payout:{...draft.payout,bankName:v}})}/><F label="Account last 4 digits" v={draft.payout.accountLast4} set={(v)=>setDraft({...draft,payout:{...draft.payout,accountLast4:v}})}/><F label="IFSC" v={draft.payout.ifsc} set={(v)=>setDraft({...draft,payout:{...draft.payout,ifsc:v}})}/><F label="PAN" v={draft.payout.pan} set={(v)=>setDraft({...draft,payout:{...draft.payout,pan:v}})}/><F label="GSTIN" v={draft.payout.gstin} set={(v)=>setDraft({...draft,payout:{...draft.payout,gstin:v}})}/></div><Button onClick={()=>onSave(draft)} className="mt-7 rounded-none bg-primary text-primary-foreground">Save profile</Button></Panel>; }
function PartnerSettings({partner,onSave}:{partner:PartnerRecord;onSave:(p:PartnerRecord)=>void}) { return <Panel kicker="SETTINGS" title="Settings" description="Choose the partner updates and reminders you want to receive."><div className="grid max-w-3xl gap-3">{([['emailUpdates','Email updates','Account and partner programme updates.'],['leadAlerts','Lead reminders','Follow-up and lead-state alerts.'],['incentiveAlerts','Incentive alerts','Earned and payout status changes.'],['customerUpdates','Customer updates','Customer/project changes for your originated business.']] as const).map(([key,title,body])=><label key={key} className="workspace-panel flex items-start justify-between gap-5 p-5"><span><strong>{title}</strong><span className="mt-1 block text-sm text-white/50">{body}</span></span><input type="checkbox" className="h-5 w-5 accent-emerald-400" checked={partner.settings[key]} onChange={(e)=>onSave({...partner,settings:{...partner.settings,[key]:e.target.checked}})}/></label>)}<div className="workspace-panel p-5"><p className="font-semibold">Security</p><p className="mt-2 text-sm leading-6 text-white/50">Your sign-in is protected by your password and a verification code sent to your registered contact email. You can change your password from the security options available in your account.</p></div></div></Panel>; }
