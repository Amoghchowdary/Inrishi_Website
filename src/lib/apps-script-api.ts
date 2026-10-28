import{getRuntimeConfig,isBackendConfigured}from"@/lib/runtime-config";

type Envelope<T>={source:"INRISHI_APPS_SCRIPT";requestId:string;ok:boolean;data?:T;error?:string;code?:string;site?:string;version?:string};

function isTrustedAppsScriptOrigin(origin:string){
  try{
    const host=new URL(origin).hostname.toLowerCase();
    return host==="script.google.com"||
      host==="script.googleusercontent.com"||
      host.endsWith("-script.googleusercontent.com")||
      host.endsWith(".script.googleusercontent.com");
  }catch{return false}
}

type Role="public"|"customer"|"admin";
const KEYS={customer:"inrishi-v62-customer-session",admin:"inrishi-v62-admin-session"} as const;
function currentRole():Role{
  if(typeof window==="undefined")return"public";
  const p=location.pathname;
  if(p.startsWith("/r/")||p.endsWith("/admin")||p.includes("/admin/"))return"admin";
  if(p.includes("/customer"))return"customer";
  return"public";
}
export function getSessionToken(r:Exclude<Role,"public">){return typeof window==="undefined"?"":sessionStorage.getItem(KEYS[r])||""}
export function setSessionToken(r:Exclude<Role,"public">,t:string){if(typeof window!=="undefined"){clearSessionToken(r);sessionStorage.setItem(KEYS[r],t)}}
export function clearSessionToken(r:Exclude<Role,"public">){if(typeof window!=="undefined")sessionStorage.removeItem(KEYS[r])}
export class AppsScriptBackendError extends Error{
  code:string|undefined;
  constructor(message:string,code?:string){super(message);this.name="AppsScriptBackendError";this.code=code}
}

export async function appsScriptCall<T>(
  action:string,
  payload:Record<string,unknown>={},
  options:{role?:Role;timeoutMs?:number}={}
):Promise<T>{
  if(typeof window==="undefined")throw new AppsScriptBackendError("Browser only","BROWSER_ONLY");
  if(!isBackendConfigured())throw new AppsScriptBackendError("Inrishi services are temporarily unavailable.","BACKEND_NOT_CONFIGURED");

  const config=getRuntimeConfig();
  const role=options.role??currentRole();
  const requestId=`req-${Date.now()}-${crypto.randomUUID?.()??Math.random().toString(36).slice(2)}`;
  const iframeName=`inrishi_api_${requestId.replace(/[^a-z0-9_]/gi,"_")}`;
  const token=role==="public"?"":getSessionToken(role);

  return await new Promise<T>((resolve,reject)=>{
    const iframe=document.createElement("iframe");
    iframe.name=iframeName;
    iframe.title="Inrishi secure backend response";
    iframe.style.display="none";
    iframe.setAttribute("aria-hidden","true");

    const form=document.createElement("form");
    form.method="POST";
    form.action=config.APPS_SCRIPT_URL;
    form.target=iframeName;
    form.style.display="none";
    form.acceptCharset="UTF-8";

    const fields={
      action,
      requestId,
      site:config.SITE_ID,
      role,
      token,
      origin:location.origin,
      pageUrl:location.href,
      payload:JSON.stringify(payload),
    };

    for(const[name,value]of Object.entries(fields)){
      const input=document.createElement("input");
      input.type="hidden";
      input.name=name;
      input.value=String(value??"");
      form.appendChild(input);
    }

    let settled=false;
    const cleanup=()=>{
      removeEventListener("message",onMessage);
      clearTimeout(timer);
      form.remove();
      setTimeout(()=>iframe.remove(),100);
    };
    const onMessage=(event:MessageEvent)=>{
      const message=event.data as Partial<Envelope<T>>|null;
      if(settled||!message||message.source!=="INRISHI_APPS_SCRIPT"||message.requestId!==requestId)return;
      if(!isTrustedAppsScriptOrigin(event.origin))return;
      if(message.site&&message.site!==config.SITE_ID)return;
      settled=true;
      cleanup();
      message.ok
        ?resolve(message.data as T)
        :reject(new AppsScriptBackendError(message.error||"Request failed",message.code));
    };
    const timer=setTimeout(()=>{
      if(settled)return;
      settled=true;
      cleanup();
      reject(new AppsScriptBackendError("The Inrishi backend did not respond in time.","BACKEND_RESPONSE_TIMEOUT"));
    },options.timeoutMs??60000);

    addEventListener("message",onMessage);
    document.body.append(iframe,form);
    form.submit();
  });
}
