import { appsScriptCall } from "@/lib/apps-script-api";
import type { PortalStore } from "@/lib/portal-store";
export type CustomerPortalSnapshot={ok:boolean;version:string;revision:number;generatedAt:string;store:PortalStore;services?:Array<{id:string;name:string;description?:string}>;notifications?:Array<{id:string;title:string;body:string;read:boolean;createdAt:string}>};
export const getCustomerPortalSnapshotFn=()=>appsScriptCall<CustomerPortalSnapshot>("customer.portal.snapshot",{},{role:"customer"});
