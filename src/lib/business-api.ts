import{appsScriptCall}from"@/lib/apps-script-api";
export type WebsiteInquiry={id:string;name:string;phone:string;email:string;requirement:string;source:string;status:string;createdAt:string};
export const submitWebsiteInquiry=(input:{name:string;phone:string;email:string;requirement:string;source?:string})=>appsScriptCall<{ok:boolean;id:string;message:string}>("public.contact.submit",input,{role:"public"});
export const listWebsiteInquiries=()=>appsScriptCall<WebsiteInquiry[]>("admin.inquiries.list",{},{role:"admin"});
export const updateWebsiteInquiryStatus=(id:string,status:string)=>appsScriptCall<{ok:boolean}>("admin.inquiries.status",{id,status},{role:"admin"});
