import{appsScriptCall,clearSessionToken,getSessionToken,setSessionToken}from"@/lib/apps-script-api";

export type CustomerSession={email:string;name:string;customerId?:string};
export type CustomerRecoveryKind="password"|"customerId";

export async function loginCustomerFn({data}:{data:{identifier:string;password:string}}){
  const r=await appsScriptCall<{ok:boolean;message?:string;token?:string;customer?:CustomerSession}>(
    "auth.customer.login",
    {email:data.identifier,identifier:data.identifier,password:data.password},
    {role:"public",timeoutMs:60000},
  );
  if(r.ok&&r.token)setSessionToken("customer",r.token);
  return r;
}

export async function requestCustomerRegistrationOtpFn({data}:{data:{name:string;email:string;phone:string}}){
  return appsScriptCall<{ok:boolean;message?:string;maskedRecoveryEmail?:string}>(
    "auth.customer.registration.request",data,{role:"public",timeoutMs:60000}
  );
}

export async function verifyCustomerRegistrationOtpFn({data}:{data:{name:string;email:string;phone:string;otp:string}}){
  return appsScriptCall<{ok:boolean;message?:string;registrationToken?:string}>(
    "auth.customer.registration.verify",data,{role:"public",timeoutMs:60000}
  );
}

export async function completeCustomerRegistrationFn({data}:{data:{registrationToken:string;password:string;company?:string}}){
  return appsScriptCall<{ok:boolean;message?:string;customerId?:string;loginEmail?:string}>(
    "auth.customer.registration.complete",data,{role:"public",timeoutMs:60000}
  );
}

export async function requestCustomerRecoveryOtpFn({data}:{data:{recoveryEmail:string;kind:CustomerRecoveryKind}}){
  return appsScriptCall<{ok:boolean;message?:string;maskedRecoveryEmail?:string;kind?:CustomerRecoveryKind}>(
    "auth.customer.recovery.request",data,{role:"public",timeoutMs:60000}
  );
}

export async function verifyCustomerRecoveryOtpFn({data}:{data:{recoveryEmail:string;kind:CustomerRecoveryKind;otp:string}}){
  return appsScriptCall<{ok:boolean;message?:string;recoveryToken?:string;kind?:CustomerRecoveryKind}>(
    "auth.customer.recovery.verify",data,{role:"public",timeoutMs:60000}
  );
}

export async function completeCustomerRecoveryFn({data}:{data:{recoveryToken:string;kind:CustomerRecoveryKind;newPassword?:string}}){
  return appsScriptCall<{ok:boolean;message?:string;customerId?:string;loginEmail?:string}>(
    "auth.customer.recovery.complete",data,{role:"public",timeoutMs:60000}
  );
}

export async function changeCustomerPasswordFn(data:{currentPassword:string;newPassword:string}){
  const r=await appsScriptCall<{ok:boolean;message?:string}>("auth.customer.changePassword",data,{role:"customer",timeoutMs:60000});
  if(r.ok)clearSessionToken("customer");
  return r;
}

export async function getCurrentCustomerFn(){
  if(!getSessionToken("customer"))return null;
  try{return await appsScriptCall<CustomerSession|null>("auth.customer.session",{},{role:"customer"})}
  catch{clearSessionToken("customer");return null}
}

export async function logoutCustomerFn(){
  try{await appsScriptCall("auth.logout",{role:"customer"},{role:"customer"})}catch{}
  clearSessionToken("customer");
  return{ok:true as const}
}
