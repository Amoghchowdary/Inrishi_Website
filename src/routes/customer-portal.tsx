import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, CheckCircle2, CreditCard, LogOut, MessageCircle, Save, Settings2,
  SlidersHorizontal, UserRound, Workflow, Wrench, Send,
  FolderArchive, Paperclip, FileDown, UploadCloud, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentCustomerFn, logoutCustomerFn } from "@/services/customer-auth";
import {
  loadPortalStore, savePortalStore, portalStoreEventName, calculateCustomerProgress,
  type CustomerRecord, type PortalService, type PortalDocument, type PortalStore,
} from "@/lib/portal-store";
import inrishiLogo from "@/assets/inrishi-logo.png";
import { deletePortalFile, openPortalFile, putPortalFile } from "@/lib/portal-file-db";

export const Route = createFileRoute("/customer-portal")({
  head: () => ({ meta: [{ title: "Customer Area | Inrishi" }, { name: "robots", content: "noindex, nofollow" }] }),
  loader: async () => {
    const customer = await getCurrentCustomerFn();
    if (!customer) throw redirect({ to: "/customer-login" });
    return customer;
  },
  component: CustomerPortalPage,
});

type TabKey = "overview" | "services" | "payments" | "progress" | "chat" | "documents" | "profile" | "settings";

const tabs: Array<{ key: TabKey; label: string; icon: typeof Workflow }> = [
  { key: "overview", label: "Overview", icon: Workflow },
  { key: "services", label: "Services", icon: Wrench },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "progress", label: "Work progress", icon: SlidersHorizontal },
  { key: "chat", label: "Chat with Inrishi", icon: MessageCircle },
  { key: "documents", label: "Document vault", icon: FolderArchive },
  { key: "profile", label: "Profile", icon: UserRound },
  { key: "settings", label: "Settings", icon: Settings2 },
];

const customerServiceDescriptions: Record<string, string> = {
  "AI Business Transformation": "Automation and connected workflows that reduce repetitive work and make everyday operations easier to manage.",
  "ERP": "A connected system for sales, purchases, inventory, finance and core business operations.",
  "CRM": "Lead tracking, follow-ups, customer history and a clearer sales process from enquiry to conversion.",
  "Employee Management": "Employee records, attendance, leave, requests and day-to-day people management in one place.",
  "Books Customization": "Accounting and business-book workflows adapted to your documents, approvals and reporting needs.",
  "Custom Software": "Software designed specifically around your business process when standard products do not fit.",
  "SaaS Products": "Ready-to-use Inrishi cloud products configured for your business needs.",
  "Website Design": "Planning, responsive design, development, launch, SEO setup and 15 days of assigned SEO support after launch.",
};

function CustomerPortalPage() {
  const session = Route.useLoaderData();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [store, setStore] = useState<PortalStore | null>(null);
  const [chatText, setChatText] = useState("");
  const [chatFiles, setChatFiles] = useState<File[]>([]);
  const [vaultFiles, setVaultFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setStore(loadPortalStore());
    sync();
    const event = portalStoreEventName();
    window.addEventListener(event, sync);
    return () => {
      window.removeEventListener(event, sync);
    };
  }, []);

  const customer = useMemo(() => {
    if (!store) return null;
    return store.customers.find((item) => item.loginId === session.email || item.email === session.email) ?? store.customers[0] ?? null;
  }, [store, session.email]);

  function commit(updatedCustomer: CustomerRecord, message?: string) {
    if (!store) return;
    const next: PortalStore = {
      ...store,
      customers: store.customers.map((item) => item.id === updatedCustomer.id ? updatedCustomer : item),
    };
    savePortalStore(next);
    setStore(next);
    if (message) {
      setNotice(message);
      window.setTimeout(() => setNotice(null), 2500);
    }
  }

  async function storeFiles(files: File[], category: PortalDocument["category"]) {
    if (!customer) return [];
    const accepted = files.filter((file) => file.size <= 5 * 1024 * 1024);
    const docs: PortalDocument[] = [];
    for (const file of accepted) {
      const id = `document-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      await putPortalFile(id, customer.id, file);
      docs.push({ id, customerId: customer.id, name: file.name, mimeType: file.type || "application/octet-stream", size: file.size, uploadedBy: "customer", createdAt: new Date().toISOString(), category });
    }
    return docs;
  }

  async function addVaultDocuments() {
    if (!customer || !vaultFiles.length) return;
    setUploading(true);
    try {
      const docs = await storeFiles(vaultFiles, "document-vault");
      commit({ ...customer, documents: [...customer.documents, ...docs] }, `${docs.length} document${docs.length === 1 ? "" : "s"} added to your vault.`);
      setVaultFiles([]);
    } finally { setUploading(false); }
  }

  async function removeDocument(document: PortalDocument) {
    if (!customer) return;
    await deletePortalFile(document.id);
    const messages = customer.messages.map((message) => ({ ...message, attachmentIds: (message.attachmentIds ?? []).filter((id) => id !== document.id) }));
    commit({ ...customer, messages, documents: customer.documents.filter((item) => item.id !== document.id) }, "Document removed.");
  }

  async function logout() {
    await logoutCustomerFn();
    window.location.replace("/customer-login");
  }

  if (!customer || !store) {
    return <div className="site-shell min-h-screen bg-background text-foreground"><div className="relative z-10 mx-auto max-w-[1200px] px-6 py-20">Loading your customer area…</div></div>;
  }

  const selectedServices = customer.services.filter((service) => service.selected);
  const activeProgress = calculateCustomerProgress(customer);
  const pendingPayments = customer.payments.filter((payment) => payment.status !== "Paid");

  return (
    <div className="workspace-shell min-h-screen overflow-x-hidden text-white">
      <div className="relative z-10">
        <header className="workspace-header border-b border-white/10">
          <div className="mx-auto flex h-[76px] max-w-[1540px] items-center justify-between gap-5 px-5 md:px-8 lg:px-12">
            <a href="/" aria-label="Inrishi home"><img src={inrishiLogo} alt="INRISHI" className="w-[118px] sm:w-[142px]" /></a>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-white/70 md:block">{customer.name} · {customer.loginId}</span>
              <Button variant="ghost" onClick={logout} className="text-primary hover:bg-primary/10 hover:text-primary"><LogOut size={15} /> Sign out</Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1540px] px-5 py-8 md:px-8 lg:px-12 lg:py-10">
          <a href="/" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/70 hover:text-primary"><ArrowLeft size={14} /> Inrishi website</a>

          <div className="mt-7 grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
            <aside className="workspace-sidebar h-fit p-4 lg:sticky lg:top-24">
              <div className="border-b border-border px-3 pb-4 pt-2">
                <p className="section-kicker">CUSTOMER AREA</p>
                <p className="mt-2 text-sm text-white/70">Your Inrishi account</p>
              </div>
              <nav className="mt-3 grid gap-1" aria-label="Customer portal">
                {tabs.map(({ key, label, icon: Icon }) => (
                  <button key={key} type="button" onClick={() => setActiveTab(key)} className={`flex items-center gap-3 px-3 py-3 text-left text-sm transition-colors ${activeTab === key ? "bg-primary/12 text-primary" : "text-white/70 hover:bg-white/5 hover:text-foreground"}`}>
                    <Icon size={17} /> {label}
                  </button>
                ))}
              </nav>
            </aside>

            <section className="workspace-content min-w-0">
              {notice && <div className="mb-4 border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground">{notice}</div>}

              {activeTab === "overview" && (
                <div>
                  <p className="section-kicker">OVERVIEW</p>
                  <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">Welcome, <span className="text-primary">{customer.name}</span>.</h1>
                  <p className="mt-4 max-w-3xl text-base font-medium leading-[1.85] text-white/78">See your services, payments, project progress, documents and messages with Inrishi in one place.</p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Metric label="Selected services" value={String(selectedServices.length)} />
                    <Metric label="Project progress" value={`${Math.round(activeProgress)}%`} />
                    <Metric label="Pending payments" value={String(pendingPayments.length)} />
                    <Metric label="Chat messages" value={String(customer.messages.length)} />
                  </div>

                  <div className="mt-6 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
                    <div className="border border-border workspace-panel p-6">
                      <h2 className="font-display text-2xl font-semibold">Current services</h2>
                      <div className="mt-5 grid gap-3">
                        {selectedServices.length ? selectedServices.map((service) => (
                          <div key={service.id} className="flex items-center justify-between gap-4 border-t border-border pt-3 text-sm">
                            <span>{service.name}</span><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-primary">{service.status}</span>
                          </div>
                        )) : <p className="text-sm text-white/70">No services selected yet.</p>}
                      </div>
                      <Button variant="ghost" onClick={() => setActiveTab("services")} className="mt-5 -ml-4 text-primary">Manage services</Button>
                    </div>
                    <div className="border border-border workspace-panel p-6">
                      <h2 className="font-display text-2xl font-semibold">Work status</h2>
                      <div className="mt-5 h-2 overflow-hidden bg-secondary"><div className="h-full bg-primary" style={{ width: `${activeProgress}%` }} /></div>
                      <p className="mt-3 text-sm text-white/70">Overall project progress: {Math.round(activeProgress)}%</p>
                      <Button variant="ghost" onClick={() => setActiveTab("progress")} className="mt-5 -ml-4 text-primary">View detailed progress</Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "services" && (
                <PortalPanel title="Your services" kicker="SERVICES" description="Choose the Inrishi services you are interested in. Your selection is sent to Inrishi for confirmation before any commercial work begins.">
                  <div className="grid gap-4 md:grid-cols-2">
                    {customer.services.map((service) => (
                      <button key={service.id} type="button" onClick={() => {
                        const updated: CustomerRecord = {
                          ...customer,
                          services: customer.services.map((item) => {
                            if (item.id !== service.id) return item;
                            const status: PortalService["status"] = !item.selected ? "Requested" : "Available";
                            return { ...item, selected: !item.selected, status };
                          }),
                        };
                        commit(updated, `${service.name} selection updated.`);
                      }} className={`border p-5 text-left transition-colors ${service.selected ? "border-primary/50 bg-primary/10" : "border-border workspace-panel-soft hover:border-primary/30"}`}>
                        <div className="flex items-start justify-between gap-4"><h3 className="font-display text-xl font-semibold">{service.name}</h3>{service.selected && <CheckCircle2 className="text-primary" size={20} />}</div>
                        <p className="mt-3 text-sm leading-6 text-white/65">{customerServiceDescriptions[service.name] || "Talk to Inrishi to understand what is included for your requirement."}</p>
                        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">{service.status}</p>
                      </button>
                    ))}
                  </div>
                </PortalPanel>
              )}

              {activeTab === "payments" && (
                <PortalPanel title="Payments" kicker="PAYMENTS" description="View your invoices, amounts due and payment status. Payment updates are confirmed by Inrishi after they are received.">
                  <div className="grid gap-4">
                    {customer.payments.map((payment) => (
                      <div key={payment.id} className="grid gap-4 border border-border bg-card/55 p-5 md:grid-cols-[1fr_auto] md:items-center">
                        <div><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">{payment.id}</p><h3 className="mt-2 font-display text-xl font-semibold">{payment.label}</h3><p className="mt-2 text-sm text-white/70">₹{payment.amount.toLocaleString("en-IN")} · {payment.dueDate} · {payment.status}</p></div>
                        {payment.status === "Paid" ? <span className="inline-flex items-center gap-2 text-sm text-primary"><CheckCircle2 size={16} /> Paid</span> : <span className="text-sm font-semibold text-amber-200">{payment.status}</span>}
                      </div>
                    ))}
                  </div>
                </PortalPanel>
              )}

              {activeTab === "progress" && (
                <PortalPanel title="Work progress" kicker="PROJECT STATUS" description="Track current milestones and completion percentages updated by the Inrishi admin team.">
                  <div className="grid gap-4">
                    {customer.progress.map((item) => (
                      <div key={item.id} className="border border-border bg-card/55 p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-display text-xl font-semibold">{item.label}</h3><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-primary">{item.status}</span></div>
                        <p className="mt-3 text-sm leading-relaxed text-white/70">{item.detail}</p>
                        <div className="mt-4 h-2 overflow-hidden bg-secondary"><div className="h-full bg-primary" style={{ width: `${item.percent}%` }} /></div>
                        <p className="mt-2 text-xs text-white/70">{item.percent}% complete</p>
                      </div>
                    ))}
                  </div>
                </PortalPanel>
              )}

              {activeTab === "chat" && (
                <PortalPanel title="Chat with Inrishi" kicker="COMPANY CHAT" description="Send messages, requirement documents, photos and logos directly to the Inrishi team. Every attachment is also stored in your document vault.">
                  <div className="max-h-[500px] space-y-3 overflow-y-auto border border-border bg-black/20 p-4">
                    {customer.messages.map((message) => (
                      <div key={message.id} className={`max-w-[86%] border px-4 py-3 text-sm ${message.from === "customer" ? "ml-auto border-primary/30 bg-primary/10" : "border-border bg-card/70"}`}>
                        {message.text && <p>{message.text}</p>}
                        {(message.attachmentIds ?? []).length > 0 && <div className="mt-3 grid gap-2">{(message.attachmentIds ?? []).map((id) => { const doc = customer.documents.find((item) => item.id === id); return doc ? <button key={id} type="button" onClick={() => openPortalFile(doc.id, doc.name)} className="flex items-center gap-2 border border-white/10 bg-black/20 px-3 py-2 text-left text-xs text-white/80 hover:border-primary/40 hover:text-white"><Paperclip size={14} className="text-primary" /><span className="min-w-0 flex-1 truncate">{doc.name}</span><FileDown size={13} /></button> : null; })}</div>}
                        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-white/65">{message.from === "customer" ? "You" : "Inrishi"}</p>
                      </div>
                    ))}
                  </div>
                  <form className="mt-4 grid gap-3" onSubmit={async (event) => { event.preventDefault(); const text = chatText.trim(); if (!text && !chatFiles.length) return; setUploading(true); try { const docs = await storeFiles(chatFiles, "chat"); const message = { id: `message-${Date.now()}`, from: "customer" as const, text, createdAt: new Date().toISOString(), attachmentIds: docs.map((doc) => doc.id) }; commit({ ...customer, documents: [...customer.documents, ...docs], messages: [...customer.messages, message] }, "Message sent to Inrishi."); setChatText(""); setChatFiles([]); } finally { setUploading(false); } }}>
                    <textarea className="form-input min-h-24 resize-y" value={chatText} onChange={(event) => setChatText(event.target.value)} placeholder="Type a message to Inrishi…" />
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <label className="inline-flex cursor-pointer items-center gap-2 border border-border bg-card/55 px-4 py-2 text-sm font-semibold text-white hover:border-primary/40"><Paperclip size={16} className="text-primary" /> Attach documents / photos<input type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.txt" className="sr-only" onChange={(e) => setChatFiles(Array.from(e.target.files ?? []))} /></label>
                      <Button type="submit" disabled={uploading} className="h-11 rounded-none bg-primary text-primary-foreground"><Send size={16} /> {uploading ? "Uploading…" : "Send"}</Button>
                    </div>
                    {chatFiles.length > 0 && <p className="text-xs text-white/65">{chatFiles.length} attachment{chatFiles.length === 1 ? "" : "s"} selected · maximum 5 MB each.</p>}
                  </form>
                </PortalPanel>
              )}

              {activeTab === "documents" && (
                <PortalPanel title="Document vault" kicker="CUSTOMER FILES" description="Keep project documents, photos, logos and chat attachments together in your private customer file area.">
                  <div className="mb-6 flex flex-wrap items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/15"><UploadCloud size={16} /> Select files<input type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.txt" className="sr-only" onChange={(e) => setVaultFiles(Array.from(e.target.files ?? []))} /></label>
                    <Button type="button" disabled={!vaultFiles.length || uploading} onClick={addVaultDocuments} className="h-10 rounded-none bg-primary text-primary-foreground">Upload to vault</Button>
                    {vaultFiles.length > 0 && <span className="text-xs text-white/65">{vaultFiles.length} selected</span>}
                  </div>
                  <div className="grid gap-3">
                    {customer.documents.length === 0 ? <div className="border border-dashed border-white/15 p-8 text-center text-sm text-white/60">No documents uploaded yet.</div> : customer.documents.slice().reverse().map((doc) => <div key={doc.id} className="grid gap-3 border border-border bg-card/55 p-4 sm:grid-cols-[1fr_auto] sm:items-center"><div className="min-w-0"><p className="truncate font-semibold text-white">{doc.name}</p><p className="mt-1 text-xs text-white/60">{doc.category.replace("-", " ")} · {(doc.size / 1024).toFixed(doc.size > 1024 * 1024 ? 0 : 1)} KB · {doc.uploadedBy}</p></div><div className="flex gap-2"><Button type="button" variant="outline" onClick={() => openPortalFile(doc.id, doc.name)} className="rounded-none border-white/15"><FileDown size={15} /> Open</Button><Button type="button" variant="ghost" onClick={() => removeDocument(doc)} className="text-red-300 hover:bg-red-500/10 hover:text-red-200"><Trash2 size={15} /></Button></div></div>)}
                  </div>
                </PortalPanel>
              )}

              {activeTab === "profile" && (
                <ProfileEditor customer={customer} onSave={(updated) => commit(updated, "Profile saved.")} />
              )}

              {activeTab === "settings" && (
                <PortalPanel title="Settings" kicker="PREFERENCES" description="Choose which project, chat and payment updates you want to receive.">
                  <div className="grid gap-3">
                    {([
                      ["emailUpdates", "Email updates", "Receive project and account updates by email."],
                      ["chatAlerts", "Chat alerts", "Notify you when the Inrishi team replies."],
                      ["paymentAlerts", "Payment alerts", "Notify you when a payment status changes."],
                    ] as const).map(([key, title, text]) => (
                      <label key={key} className="flex items-start justify-between gap-5 border border-border bg-card/55 p-5">
                        <span><span className="font-medium">{title}</span><span className="mt-1 block text-sm text-white/70">{text}</span></span>
                        <input type="checkbox" className="mt-1 h-5 w-5 accent-emerald-400" checked={customer.settings[key]} onChange={(event) => commit({ ...customer, settings: { ...customer.settings, [key]: event.target.checked } }, "Settings updated.")} />
                      </label>
                    ))}
                  </div>
                </PortalPanel>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="border border-border workspace-panel p-5"><p className="font-mono text-[10px] uppercase tracking-[0.13em] text-white/70">{label}</p><p className="mt-3 font-display text-3xl font-semibold text-primary">{value}</p></div>;
}

function PortalPanel({ kicker, title, description, children }: { kicker: string; title: string; description: string; children: React.ReactNode }) {
  return <div><p className="section-kicker">{kicker}</p><h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">{title}</h1><p className="mt-4 max-w-3xl text-base font-medium leading-[1.85] text-white/78">{description}</p><div className="mt-8">{children}</div></div>;
}

function ProfileEditor({ customer, onSave }: { customer: CustomerRecord; onSave: (customer: CustomerRecord) => void }) {
  const [form, setForm] = useState({ name: customer.name, company: customer.company, phone: customer.phone });
  return (
    <PortalPanel title="Your profile" kicker="PROFILE" description="Keep your name, business and contact details up to date for your Inrishi projects.">
      <form className="grid max-w-2xl gap-5" onSubmit={(event) => { event.preventDefault(); onSave({ ...customer, ...form }); }}>
        <label className="form-label">Name<input className="form-input h-11" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <label className="form-label">Company<input className="form-input h-11" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} /></label>
        <label className="form-label">Phone<input className="form-input h-11" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
        <label className="form-label">Inrishi Login ID<input className="form-input h-11 opacity-70" value={customer.loginId} readOnly /></label><label className="form-label">Contact email<input className="form-input h-11 opacity-70" value={customer.recoveryEmail || customer.email} readOnly /></label>
        <Button type="submit" className="h-11 w-fit rounded-none bg-primary text-primary-foreground"><Save size={16} /> Save profile</Button>
      </form>
    </PortalPanel>
  );
}
