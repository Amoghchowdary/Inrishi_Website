import { appsScriptCall, clearSessionToken, getSessionToken, setSessionToken } from "@/lib/apps-script-api";

export type AdminPermission="dashboard"|"website"|"inquiries"|"customers"|"requirements"|"partners"|"services"|"projects"|"incentives"|"communications"|"administration"|"audit";
export type AdminSession={id:string;email:string;name?:string;role?:string;permissions?:AdminPermission[]};
export type AdminAccount={id:string;name:string;email:string;role:string;status:string;permissions?:AdminPermission[];createdAt?:string;updatedAt?:string;lastLoginAt?:string;lastOtpAt?:string};
export type AdminBeginResponse={ok:boolean;message?:string;adminId?:string;identifier?:string;maskedRecoveryEmail?:string;mustChangePassword?:boolean};
export type AdminOtpResponse={ok:boolean;message?:string;token?:string;mustChangePassword?:boolean;admin?:AdminSession};

export const beginAdminLoginFn=({data}:{data:{identifier:string;password:string}})=>appsScriptCall<AdminBeginResponse>("auth.admin.begin",{identifier:data.identifier.trim(),id:data.identifier.trim(),email:data.identifier.trim(),password:data.password},{role:"public",timeoutMs:60000});
export async function verifyAdminLoginOtpFn({data}:{data:{identifier:string;adminId?:string;otp:string}}){
  const r=await appsScriptCall<AdminOtpResponse>("auth.admin.verifyOtp",data,{role:"public",timeoutMs:60000});
  if(r.ok&&r.token)setSessionToken("admin",r.token);return r;
}
export async function getCurrentAdminFn(){if(!getSessionToken("admin"))return null;try{return await appsScriptCall<AdminSession|null>("auth.admin.session",{},{role:"admin"})}catch{clearSessionToken("admin");return null}}
export async function logoutAdminFn(){try{await appsScriptCall("auth.logout",{role:"admin"},{role:"admin"})}catch{}clearSessionToken("admin");return{ok:true as const}}
export const listAdminAccountsFn=()=>appsScriptCall<AdminAccount[]>("admin.accounts.list",{},{role:"admin"});
export const createAdminAccountFn=(data:{name:string;email:string;role:"Admin"|"Super Admin";permissions:AdminPermission[]})=>appsScriptCall<{ok:boolean;id?:string;message?:string}>("admin.accounts.create",data,{role:"admin"});
export const deleteAdminAccountFn=(id:string)=>appsScriptCall<{ok:boolean}>("admin.accounts.delete",{id},{role:"admin"});
export const updateAdminPermissionsFn=(id:string,permissions:AdminPermission[])=>appsScriptCall<{ok:boolean;permissions:AdminPermission[]}>("admin.accounts.permissions",{id,permissions},{role:"admin"});
export const updateAdminAccountStatusFn=(data:{id:string;status:"Active"|"Suspended"|"Inactive"})=>appsScriptCall<{ok:boolean;message?:string}>("admin.accounts.status",data,{role:"admin"});
export const issueAdminTemporaryPasswordFn=(id:string)=>appsScriptCall<{ok:boolean;email:string;message?:string}>("admin.accounts.issueTemporaryPassword",{id},{role:"admin"});
export async function changeAdminPasswordFn(data:{currentPassword:string;newPassword:string}){const r=await appsScriptCall<{ok:boolean;message?:string}>("auth.admin.changePassword",data,{role:"admin"});if(r.ok)clearSessionToken("admin");return r}
