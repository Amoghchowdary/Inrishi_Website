import { appsScriptCall } from "@/lib/apps-script-api";
import type { PortalStore, ProgressItem } from "@/lib/portal-store";
import type { WebsiteInquiry } from "@/lib/business-api";
import type { AdminAccount } from "@/services/admin-auth";

export type AdminControlSnapshot={
  ok:boolean;
  version:string;
  revision:number;
  generatedAt:string;
  store:PortalStore;
  inquiries:WebsiteInquiry[];
  admins:AdminAccount[];
  counts:{customers:number;partners:number;partnerApplications:number;projects:number;inquiries:number;pendingPartners:number};
};

export const getAdminControlSnapshotFn=()=>appsScriptCall<AdminControlSnapshot>("admin.control.snapshot",{},{role:"admin"});
export const updateAdminPartnerStatusFn=(data:{partnerId:string;status:"Pending approval"|"Approved"|"Rejected"|"Suspended"|"Inactive";adminNote?:string})=>appsScriptCall<{ok:boolean;status:string}>("admin.partner.status",data,{role:"admin"});
export const updateAdminCustomerStatusFn=(data:{customerId:string;status:"Active"|"Paused"})=>appsScriptCall<{ok:boolean;status:string}>("admin.customer.status",data,{role:"admin"});
export const updateAdminProjectProgressFn=(data:{customerId:string;progressId:string;status:ProgressItem["status"];percent:number;detail?:string})=>appsScriptCall<{ok:boolean;status:string;percent:number}>("admin.project.progress",data,{role:"admin"});
export const saveAdminWebsiteControlsFn=(data:{scope:"main"|"partner";controls:Record<string,unknown>})=>appsScriptCall<{ok:boolean;scope:string}>("admin.controls.save",data,{role:"admin"});
