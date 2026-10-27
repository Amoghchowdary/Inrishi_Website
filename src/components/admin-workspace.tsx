import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Activity, Globe2, Handshake, Inbox, LayoutDashboard, LogOut, RefreshCw, ShieldCheck, UsersRound, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import inrishiLogo from "@/assets/inrishi-public-logo.png";
import { changeAdminPasswordFn, loginAdminFn, logoutAdminFn, type AdminSession } from "@/services/admin-auth";
import {
  getAdminControlSnapshotFn,
  saveAdminWebsiteControlsFn,
  updateAdminCustomerStatusFn,
  updateAdminPartnerStatusFn,
  updateAdminProjectProgressFn,
  type AdminControlSnapshot,
} from "@/services/admin-control";
import { updateWebsiteInquiryStatus } from "@/lib/business-api";
import type { CustomerRecord, PartnerStatus, ProgressItem } from "@/lib/portal-store";

type Tab="dashboard"|"website"|"inquiries"|"customers"|"partners"|"projects"|"security";
const nav:[Tab,string,typeof Activity][]=[
  ["dashboard","Dashboard",LayoutDashboard],
  ["website","Website",Globe2],
  ["inquiries","Website inquiries",Inbox],
  ["customers","Customers",UsersRound],
  ["partners","Partners",Handshake],
  ["projects","Projects",Workflow],
  ["security","Security",ShieldCheck],
];

export function AdminWorkspace({initial}:{initial:AdminSession|null}){
  const[session,setSession]=useState(initial);
  const[id,setId]=useState("");
  const[password,setPassword]=useState("");
  const[message,setMessage]=useState("");
  const[loginLoading,setLoginLoading]=useState(false);
  const[snapshot,setSnapshot]=useState<AdminControlSnapshot|null>(null);
  const[loading,setLoading]=useState(false);
  const[error,setError]=useState("");
  const[tab,setTab]=useState<Tab>("dashboard");

  const refresh=useCallback(async()=>{
    if(!session)return;
    setLoading(true);setError("");
    try{setSnapshot(await getAdminControlSnapshotFn())}
    catch(e){setError(e instanceof Error?e.message:"The Admin Control Center could not load production data.")}
    finally{setLoading(false)}
  },[session]);

  useEffect(()=>{if(session)void refresh()},[session,refresh]);

  async function login(e:FormEvent){
    e.preventDefault();if(loginLoading)return;setLoginLoading(true);setMessage("");
    try{
      const identifier=id.trim();
      const r=await loginAdminFn({data:{identifier,password}});
      if(!r.ok){setMessage(r.message||"Administrator sign in was not accepted.");return}
      setSession(r.admin||{id:identifier,email:identifier});setPassword("");if(r.mustChangePassword)setTab("security");
    }catch(c){setMessage(c instanceof Error?c.message:"Unable to reach the Inrishi authentication service.")}
    finally{setLoginLoading(false)}
  }

  async function logout(){await logoutAdminFn();setSession(null);setSnapshot(null)}
  async function passwordChanged(){await logoutAdminFn();setSession(null);setSnapshot(null);setMessage("Password changed successfully. Sign in again with the new password.")}
  async function inquiryStatus(id:string,status:string){try{await updateWebsiteInquiryStatus(id,status);await refresh()}catch(e){setError(e instanceof Error?e.message:"Inquiry status could not be updated.")}}
  async function partnerStatus(partnerId:string,status:PartnerStatus){try{await updateAdminPartnerStatusFn({partnerId,status});await refresh()}catch(e){setError(e instanceof Error?e.message:"Partner status could not be updated.")}}
  async function customerStatus(customerId:string,status:"Active"|"Paused"){try{await updateAdminCustomerStatusFn({customerId,status});await refresh()}catch(e){setError(e instanceof Error?e.message:"Customer status could not be updated.")}}
  async function saveProgress(customerId:string,progressId:string,status:ProgressItem["status"],percent:number,detail?:string){try{await updateAdminProjectProgressFn({customerId,progressId,status,percent,...(detail===undefined?{}:{detail})});await refresh()}catch(e){setError(e instanceof Error?e.message:"Project progress could not be updated.")}}
  async function saveControls(scope:"main"|"partner",controls:Record<string,unknown>){try{await saveAdminWebsiteControlsFn({scope,controls});await refresh()}catch(e){setError(e instanceof Error?e.message:"Website controls could not be saved.")}}

  if(!session)return <div className="workspace-shell grid min-h-screen place-items-center px-5"><form onSubmit={login} className="workspace-panel w-full max-w-md p-8"><img src={inrishiLogo} alt="INRISHI" className="admin-brand-logo"/><p className="section-kicker mt-8">SUPER ADMIN</p><h1 className="mt-3 font-display text-3xl font-semibold">Administrator sign in</h1><p className="mt-2 text-sm">Use your administrator ID or registered administrator email.</p><div className="mt-6 grid gap-5"><label className="form-label">Administrator ID or email<input required autoComplete="username" value={id} onChange={e=>setId(e.target.value)} className="form-input"/></label><label className="form-label">Password<input required autoComplete="current-password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="form-input"/></label>{message&&<p role="alert" className="text-sm font-semibold text-red-700">{message}</p>}<Button type="submit" disabled={loginLoading}>{loginLoading?"Signing in…":"Sign in"}</Button></div></form></div>;

  return <div className="workspace-shell min-h-screen">
    <header className="workspace-header border-b border-white/10"><div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between px-5 lg:px-8"><img src={inrishiLogo} alt="INRISHI" className="admin-brand-logo"/><div className="flex items-center gap-2"><Button onClick={()=>void refresh()} variant="ghost"><RefreshCw size={16}/> Refresh</Button><Button onClick={logout} variant="ghost"><LogOut size={16}/> Sign out</Button></div></div></header>
    <div className="mx-auto grid max-w-[1600px] gap-5 px-5 py-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
      <aside className="workspace-sidebar h-fit p-3"><p className="px-3 py-2 text-xs font-bold uppercase tracking-[.16em] text-white/40">Control center</p>{nav.map(([key,label,Icon])=><button key={key} onClick={()=>setTab(key)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold ${tab===key?"bg-primary/12 text-primary":"text-white/65 hover:text-white"}`}><Icon size={17}/>{label}</button>)}</aside>
      <main className="workspace-content min-w-0">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-primary">SUPER ADMIN</p><h1 className="mt-2 font-display text-3xl font-semibold text-white">Inrishi Control Center</h1>{snapshot&&<p className="mt-2 text-xs text-white/45">Production backend {snapshot.version} · refreshed {new Date(snapshot.generatedAt).toLocaleString()}</p>}</div>{loading&&<span className="text-sm text-white/60">Refreshing production data…</span>}</div>
        {error&&<div className="workspace-panel mb-5 border-red-200 p-4 text-sm font-semibold text-red-700">{error}</div>}
        {!snapshot&&loading&&<LoadingPanel/>}
        {!snapshot&&!loading&&<Empty title="Production data is unavailable" body="The authenticated Admin snapshot did not load. Use Refresh after verifying the deployed Apps Script backend."/>}
        {snapshot&&tab==="dashboard"&&<Dashboard snapshot={snapshot}/>} 
        {snapshot&&tab==="website"&&<WebsiteModule snapshot={snapshot} onSave={saveControls}/>} 
        {snapshot&&tab==="inquiries"&&<InquiriesModule snapshot={snapshot} onStatus={inquiryStatus}/>} 
        {snapshot&&tab==="customers"&&<CustomersModule snapshot={snapshot} onStatus={customerStatus}/>} 
        {snapshot&&tab==="partners"&&<PartnersModule snapshot={snapshot} onStatus={partnerStatus}/>} 
        {snapshot&&tab==="projects"&&<ProjectsModule snapshot={snapshot} onSave={saveProgress}/>} 
        {snapshot&&tab==="security"&&<SecurityModule snapshot={snapshot} onPasswordChanged={passwordChanged}/>} 
      </main>
    </div>
  </div>;
}

function Dashboard({snapshot}:{snapshot:AdminControlSnapshot}){
  const recentInquiries=snapshot.inquiries.slice(-5).reverse();
  const recentPartners=snapshot.store.partnerApplications.slice(-5).reverse();
  return <div className="grid gap-5"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6"><Metric label="Customers" value={snapshot.counts.customers}/><Metric label="Partners" value={snapshot.counts.partners}/><Metric label="Pending partners" value={snapshot.counts.pendingPartners}/><Metric label="Projects" value={snapshot.counts.projects}/><Metric label="Inquiries" value={snapshot.counts.inquiries}/><Metric label="Applications" value={snapshot.counts.partnerApplications}/></div><div className="grid gap-5 xl:grid-cols-2"><section className="workspace-panel p-6"><h2 className="font-display text-2xl font-semibold">Recent website inquiries</h2><div className="mt-4 grid gap-3">{recentInquiries.length?recentInquiries.map(i=><div key={i.id} className="rounded-lg bg-slate-50 p-4"><div className="flex justify-between gap-3"><strong>{i.name}</strong><span className="text-xs">{i.status}</span></div><p className="mt-1 text-sm">{i.requirement}</p></div>):<p className="text-sm">No website inquiries are recorded yet.</p>}</div></section><section className="workspace-panel p-6"><h2 className="font-display text-2xl font-semibold">Recent partner applications</h2><div className="mt-4 grid gap-3">{recentPartners.length?recentPartners.map(a=><div key={a.id} className="rounded-lg bg-slate-50 p-4"><div className="flex justify-between gap-3"><strong>{a.name}</strong><span className="text-xs">{a.status}</span></div><p className="mt-1 text-sm">{a.company||a.city||a.recoveryEmail}</p></div>):<p className="text-sm">No partner applications are recorded yet.</p>}</div></section></div></div>;
}

function WebsiteModule({snapshot,onSave}:{snapshot:AdminControlSnapshot;onSave:(scope:"main"|"partner",controls:Record<string,unknown>)=>Promise<void>}){
  const[main,setMain]=useState(snapshot.store.websiteControls);
  const[partner,setPartner]=useState(snapshot.store.partnerWebsiteControls);
  useEffect(()=>{setMain(snapshot.store.websiteControls);setPartner(snapshot.store.partnerWebsiteControls)},[snapshot]);
  return <div className="grid gap-5 xl:grid-cols-2"><form className="workspace-panel p-6" onSubmit={e=>{e.preventDefault();void onSave("main",main as unknown as Record<string,unknown>)}}><p className="section-kicker">MAIN WEBSITE</p><h2 className="mt-2 font-display text-2xl font-semibold">Website controls</h2><div className="mt-5 grid gap-4"><label className="form-label">Site status<select className="form-input" value={main.siteStatus} onChange={e=>setMain({...main,siteStatus:e.target.value as "Live"|"Maintenance"})}><option>Live</option><option>Maintenance</option></select></label><label className="form-label">Inquiry CTA<input className="form-input" value={main.inquiryCtaLabel} onChange={e=>setMain({...main,inquiryCtaLabel:e.target.value})}/></label><label className="form-label">Customer access title<input className="form-input" value={main.customerAccessTitle} onChange={e=>setMain({...main,customerAccessTitle:e.target.value})}/></label><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={main.customerLoginVisible} onChange={e=>setMain({...main,customerLoginVisible:e.target.checked})}/> Customer login visible</label><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={main.announcementEnabled} onChange={e=>setMain({...main,announcementEnabled:e.target.checked})}/> Announcement enabled</label><label className="form-label">Announcement<textarea className="form-input" rows={3} value={main.announcementText} onChange={e=>setMain({...main,announcementText:e.target.value})}/></label><Button type="submit">Save main website controls</Button></div></form><form className="workspace-panel p-6" onSubmit={e=>{e.preventDefault();void onSave("partner",partner as unknown as Record<string,unknown>)}}><p className="section-kicker">PARTNER WEBSITE</p><h2 className="mt-2 font-display text-2xl font-semibold">Partner controls</h2><div className="mt-5 grid gap-4"><label className="form-label">Site status<select className="form-input" value={partner.siteStatus} onChange={e=>setPartner({...partner,siteStatus:e.target.value as "Live"|"Maintenance"})}><option>Live</option><option>Maintenance</option></select></label><label className="form-label">Hero title<input className="form-input" value={partner.heroTitle} onChange={e=>setPartner({...partner,heroTitle:e.target.value})}/></label><label className="form-label">Hero subtitle<textarea className="form-input" rows={3} value={partner.heroSubtitle} onChange={e=>setPartner({...partner,heroSubtitle:e.target.value})}/></label><div className="grid gap-4 sm:grid-cols-3"><label className="form-label">Service price<input type="number" className="form-input" value={partner.servicePrice} onChange={e=>setPartner({...partner,servicePrice:Number(e.target.value)})}/></label><label className="form-label">Incentive<input type="number" className="form-input" value={partner.incentiveAmount} onChange={e=>setPartner({...partner,incentiveAmount:Number(e.target.value)})}/></label><label className="form-label">First payment %<input type="number" min={0} max={100} className="form-input" value={partner.conversionAdvancePercent} onChange={e=>setPartner({...partner,conversionAdvancePercent:Number(e.target.value)})}/></label></div><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={partner.registrationOpen} onChange={e=>setPartner({...partner,registrationOpen:e.target.checked})}/> Registration open</label><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={partner.loginVisible} onChange={e=>setPartner({...partner,loginVisible:e.target.checked})}/> Partner login visible</label><Button type="submit">Save partner website controls</Button></div></form></div>;
}

function InquiriesModule({snapshot,onStatus}:{snapshot:AdminControlSnapshot;onStatus:(id:string,status:string)=>Promise<void>}){return <div className="grid gap-3">{snapshot.inquiries.length?snapshot.inquiries.map(i=><article key={i.id} className="workspace-panel p-5"><div className="grid gap-4 lg:grid-cols-[1fr_220px]"><div><strong>{i.name}</strong><p className="mt-1 text-sm">{i.requirement}</p><p className="mt-2 text-xs">{i.phone}{i.email?` · ${i.email}`:""} · {i.source}</p></div><label className="form-label">Status<select className="form-input" value={i.status||"New"} onChange={e=>void onStatus(i.id,e.target.value)}><option>New</option><option>Contacted</option><option>Closed</option></select></label></div></article>):<Empty title="No website inquiries" body="New website inquiries will appear here automatically from the production backend."/>}</div>}

function CustomersModule({snapshot,onStatus}:{snapshot:AdminControlSnapshot;onStatus:(id:string,status:"Active"|"Paused")=>Promise<void>}){return <div className="grid gap-3">{snapshot.store.customers.length?snapshot.store.customers.map(c=><article key={c.id} className="workspace-panel grid gap-4 p-5 lg:grid-cols-[1.3fr_1fr_1fr_180px]"><div><strong>{c.name}</strong><p className="mt-1 text-sm">{c.company||"Individual customer"}</p></div><div><p className="text-xs uppercase">Login ID</p><span className="text-sm font-semibold">{c.loginId}</span></div><div><p className="text-xs uppercase">Project</p><span className="text-sm font-semibold">{c.projectId||"—"}</span></div><label className="form-label">Status<select className="form-input" value={c.status} onChange={e=>void onStatus(c.id,e.target.value as "Active"|"Paused")}><option>Active</option><option>Paused</option></select></label></article>):<Empty title="No customers" body="Converted and direct customer records will appear here from the shared production database."/>}</div>}

function PartnersModule({snapshot,onStatus}:{snapshot:AdminControlSnapshot;onStatus:(id:string,status:PartnerStatus)=>Promise<void>}){
  const applicationsByPartner=new Map(snapshot.store.partnerApplications.map(a=>[a.partnerId,a] as const));
  return <div className="grid gap-3">{snapshot.store.partners.length?snapshot.store.partners.map(p=>{const app=applicationsByPartner.get(p.id);return <article key={p.id} className="workspace-panel p-5"><div className="grid gap-4 xl:grid-cols-[1.2fr_1fr_1fr_220px]"><div><strong>{p.name}</strong><p className="mt-1 text-sm">{p.company||p.city||"Partner"}</p><p className="mt-2 text-xs">{p.recoveryEmail}</p></div><div><p className="text-xs uppercase">Partner Login ID</p><span className="text-sm font-semibold">{p.loginId}</span></div><div><p className="text-xs uppercase">Activity</p><span className="text-sm">{p.leads.length} leads · {p.incentives.length} incentives</span></div><label className="form-label">Status<select className="form-input" value={p.status} onChange={e=>void onStatus(p.id,e.target.value as PartnerStatus)}><option>Pending approval</option><option>Approved</option><option>Suspended</option><option>Inactive</option><option>Rejected</option></select></label></div>{app?.note&&<p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm">Application note: {app.note}</p>}</article>}):<Empty title="No partners" body="New partner registrations will appear here for review and approval."/>}</div>;
}

function ProjectsModule({snapshot,onSave}:{snapshot:AdminControlSnapshot;onSave:(customerId:string,progressId:string,status:ProgressItem["status"],percent:number,detail?:string)=>Promise<void>}){
  const projects=snapshot.store.customers.filter(c=>c.projectId||(c.services||[]).some(s=>s.selected));
  return <div className="grid gap-4">{projects.length?projects.map(c=><ProjectCard key={c.id} customer={c} onSave={onSave}/>):<Empty title="No projects" body="Project records will appear here when a customer has an active service or project ID."/>}</div>;
}

function ProjectCard({customer,onSave}:{customer:CustomerRecord;onSave:(customerId:string,progressId:string,status:ProgressItem["status"],percent:number,detail?:string)=>Promise<void>}){
  const avg=Math.round(customer.progress.length?customer.progress.reduce((s,p)=>s+p.percent,0)/customer.progress.length:0);
  return <article className="workspace-panel p-6"><div className="flex flex-wrap justify-between gap-4"><div><h2 className="font-display text-2xl font-semibold">{customer.company||customer.name}</h2><p className="mt-1 text-sm">Project {customer.projectId||"not assigned"}</p></div><strong className="text-3xl">{avg}%</strong></div><div className="mt-5 grid gap-3">{customer.progress.length?customer.progress.map(p=><ProgressEditor key={p.id} customerId={customer.id} item={p} onSave={onSave}/>):<p className="text-sm">No project milestones are configured yet.</p>}</div></article>;
}

function ProgressEditor({customerId,item,onSave}:{customerId:string;item:ProgressItem;onSave:(customerId:string,progressId:string,status:ProgressItem["status"],percent:number,detail?:string)=>Promise<void>}){
  const[status,setStatus]=useState<ProgressItem["status"]>(item.status);const[percent,setPercent]=useState(item.percent);const[detail,setDetail]=useState(item.detail);const[saving,setSaving]=useState(false);
  useEffect(()=>{setStatus(item.status);setPercent(item.percent);setDetail(item.detail)},[item]);
  return <div className="rounded-lg bg-slate-50 p-4"><div className="grid gap-3 xl:grid-cols-[1.1fr_190px_120px_auto]"><label className="form-label">Milestone<input className="form-input" value={detail} onChange={e=>setDetail(e.target.value)}/></label><label className="form-label">Status<select className="form-input" value={status} onChange={e=>setStatus(e.target.value as ProgressItem["status"])}><option>Not started</option><option>In progress</option><option>Review</option><option>Completed</option></select></label><label className="form-label">Progress %<input type="number" min={0} max={100} className="form-input" value={percent} onChange={e=>setPercent(Number(e.target.value))}/></label><Button className="self-end" disabled={saving} onClick={async()=>{setSaving(true);try{await onSave(customerId,item.id,status,percent,detail)}finally{setSaving(false)}}}>{saving?"Saving…":"Save"}</Button></div><strong className="mt-2 block text-sm">{item.label}</strong></div>;
}

function SecurityModule({snapshot,onPasswordChanged}:{snapshot:AdminControlSnapshot;onPasswordChanged:()=>Promise<void>}){
  const[currentPassword,setCurrentPassword]=useState("");
  const[newPassword,setNewPassword]=useState("");
  const[confirmPassword,setConfirmPassword]=useState("");
  const[saving,setSaving]=useState(false);
  const[message,setMessage]=useState("");
  async function changePassword(e:FormEvent){
    e.preventDefault();setMessage("");
    if(newPassword!==confirmPassword){setMessage("New passwords do not match.");return}
    setSaving(true);
    try{
      const r=await changeAdminPasswordFn({currentPassword,newPassword});
      if(!r.ok){setMessage(r.message||"Password could not be changed.");return}
      await onPasswordChanged();
    }catch(error){setMessage(error instanceof Error?error.message:"Password could not be changed.")}
    finally{setSaving(false)}
  }
  return <div className="grid gap-5">
    <section className="workspace-panel p-6"><h2 className="font-display text-2xl font-semibold">Production security status</h2><div className="mt-5 grid gap-4 sm:grid-cols-3"><Info label="Backend version" value={snapshot.version}/><Info label="Admin accounts" value={String(snapshot.admins.length)}/><Info label="Database revision" value={String(snapshot.revision)}/></div><p className="mt-5 text-sm">Authentication, sessions, OTP verification, portal data writes and privileged operations are enforced by the deployed Apps Script backend. No database credentials or password material are stored in the frontend repository.</p></section>
    <section className="workspace-panel p-6"><h2 className="font-display text-2xl font-semibold">Change administrator password</h2><p className="mt-2 text-sm">Changing the password revokes all current Admin sessions. You will sign in again with the new password.</p><form onSubmit={changePassword} className="mt-5 grid max-w-xl gap-4"><label className="form-label">Current password<input required type="password" autoComplete="current-password" className="form-input" value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)}/></label><label className="form-label">New password<input required minLength={10} type="password" autoComplete="new-password" className="form-input" value={newPassword} onChange={e=>setNewPassword(e.target.value)}/></label><label className="form-label">Confirm new password<input required minLength={10} type="password" autoComplete="new-password" className="form-input" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}/></label>{message&&<p role="alert" className="text-sm font-semibold text-red-700">{message}</p>}<Button type="submit" disabled={saving}>{saving?"Changing…":"Change password"}</Button></form></section>
    <section className="workspace-panel p-6"><h2 className="font-display text-2xl font-semibold">Administrator accounts</h2><div className="mt-4 grid gap-3">{snapshot.admins.map(a=><div key={a.id} className="grid gap-2 rounded-lg bg-slate-50 p-4 md:grid-cols-4"><strong>{a.name}</strong><span>{a.email}</span><span>{a.role}</span><span>{a.status}</span></div>)}</div></section>
  </div>
}

function Metric({label,value}:{label:string;value:number}){return <div className="workspace-panel p-5"><p className="text-sm">{label}</p><strong className="mt-2 block text-3xl">{value}</strong></div>}
function Info({label,value}:{label:string;value:string}){return <div className="rounded-lg bg-slate-50 p-4"><p className="text-xs uppercase">{label}</p><strong className="mt-1 block">{value}</strong></div>}
function Empty({title,body}:{title:string;body:string}){return <div className="workspace-panel p-7"><h2 className="font-display text-xl font-semibold">{title}</h2><p className="mt-2 text-sm">{body}</p></div>}
function LoadingPanel(){return <div className="workspace-panel p-8 text-center"><RefreshCw className="mx-auto animate-spin text-primary"/><h2 className="mt-4 font-display text-xl font-semibold">Loading production control data</h2><p className="mt-2 text-sm">Customers, partners, projects, inquiries and controls are being loaded from Apps Script.</p></div>}
