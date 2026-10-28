import { appsScriptCall } from "@/lib/apps-script-api";
export type AppNotification={id:string;type:string;title:string;body:string;read:boolean;createdAt:string};
export const listNotificationsFn=(role:"admin"|"customer")=>appsScriptCall<AppNotification[]>("notifications.list",{},{role});
export const markNotificationReadFn=(role:"admin"|"customer",id:string)=>appsScriptCall<{ok:boolean}>("notifications.read",{id},{role});
export const createCustomerRequirementFn=(data:{serviceId?:string;title:string;description:string;priority:string})=>appsScriptCall<{ok:boolean;requirement?:unknown}>("customer.requirement.create",data,{role:"customer"});
