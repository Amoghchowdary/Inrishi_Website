import { appsScriptCall } from "@/lib/apps-script-api";

export async function submitWebsiteInquiry(input: { name: string; phone: string; email?: string; requirement: string; source?: string }) {
  return appsScriptCall<{ ok: boolean; id: string; message: string }>("public.contact.submit", input, { role: "public" });
}

export async function registerPartner(input: { name: string; email: string; phone: string; company: string; city: string; experience: string; note: string; password: string }) {
  return appsScriptCall<{ ok: boolean; message?: string; loginId?: string; status?: string }>("partner.register", input, { role: "public" });
}

export async function recordPartnerAdvancePayment(input: { leadId: string; amount: number; reference: string }) {
  return appsScriptCall<{ ok: boolean; requiredAdvance: number }>("partner.recordAdvance", input, { role: "partner" });
}

export async function convertPartnerLead(input: { leadId: string }) {
  return appsScriptCall<{ ok: boolean; customerId: string; projectId: string; loginId: string }>("partner.convertLead", input, { role: "partner", timeoutMs: 60_000 });
}

export async function sendPartnerCustomerLogin(input: { id: string; customerId: string }) {
  return appsScriptCall<{ ok: boolean; message: string }>("partner.sendCustomerLogin", input, { role: "partner", timeoutMs: 60_000 });
}

export type WebsiteInquiry = { id: string; name: string; phone: string; email: string; requirement: string; source: string; status: string; createdAt: string };
export async function listWebsiteInquiries() {
  return appsScriptCall<WebsiteInquiry[]>("admin.inquiries.list", {}, { role: "admin" });
}
export async function updateWebsiteInquiryStatus(id: string, status: string) {
  return appsScriptCall<{ ok: boolean }>("admin.inquiries.status", { id, status }, { role: "admin" });
}
