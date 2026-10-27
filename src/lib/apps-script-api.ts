import{getRuntimeConfig,isBackendConfigured}from"@/lib/runtime-config";

type Envelope<T>={source:"INRISHI_APPS_SCRIPT";requestId:string;ok:boolean;data?:T;error?:string;code?:string;site?:string;version?:string};
type BridgeReady={source:"INRISHI_APPS_SCRIPT_BRIDGE";type:"ready";site?:string;version?:string};

function isTrustedAppsScriptOrigin(origin:string){
  try{
    const host=new URL(origin).hostname.toLowerCase();
    return host==="script.google.com"||host==="script.googleusercontent.com"||host.endsWith("-script.googleusercontent.com")||host.endsWith(".script.googleusercontent.com");
  }catch{return false}
}

type Role="public"|"customer"|"admin";
const KEYS={customer:"inrishi-v59-customer-session",admin:"inrishi-v59-admin-session"} as const;
function currentRole():Role{if(typeof window==="undefined")return"public";const p=location.pathname;if(p.startsWith("/r/")||p.endsWith("/admin")||p.includes("/admin/"))return"admin";if(p.includes("/customer"))return"customer";return"public"}
export function getSessionToken(r:Exclude<Role,"public">){return typeof window==="undefined"?"":sessionStorage.getItem(KEYS[r])||""}
export function setSessionToken(r:Exclude<Role,"public">,t:string){if(typeof window!=="undefined"){clearSessionToken(r);sessionStorage.setItem(KEYS[r],t)}}
export function clearSessionToken(r:Exclude<Role,"public">){if(typeof window!=="undefined")sessionStorage.removeItem(KEYS[r])}
export class AppsScriptBackendError extends Error{code:string|undefined;constructor(message:string,code?:string){super(message);this.name="AppsScriptBackendError";this.code=code}}

let bridgeIframe:HTMLIFrameElement|null=null;
let bridgeReadyPromise:Promise<HTMLIFrameElement>|null=null;

function resetBridge(){
  bridgeIframe?.remove();
  bridgeIframe=null;
  bridgeReadyPromise=null;
}

function ensureRpcBridge():Promise<HTMLIFrameElement>{
  if(typeof window==="undefined")return Promise.reject(new AppsScriptBackendError("Browser only","BROWSER_ONLY"));
  if(bridgeReadyPromise)return bridgeReadyPromise;
  const config=getRuntimeConfig();
  bridgeReadyPromise=new Promise<HTMLIFrameElement>((resolve,reject)=>{
    const iframe=document.createElement("iframe");
    bridgeIframe=iframe;
    iframe.title="Inrishi secure backend bridge";
    iframe.style.display="none";
    iframe.setAttribute("aria-hidden","true");
    const url=new URL(config.APPS_SCRIPT_URL);
    url.searchParams.set("mode","rpc-bridge");
    url.searchParams.set("site",config.SITE_ID);
    url.searchParams.set("caller",location.origin);
    url.searchParams.set("pageUrl",location.href);
    iframe.src=url.toString();
    let settled=false;
    const cleanup=()=>{removeEventListener("message",onReady);clearTimeout(timer)};
    const onReady=(event:MessageEvent)=>{
      const message=event.data as Partial<BridgeReady>|null;
      if(settled||event.source!==iframe.contentWindow||!message||message.source!=="INRISHI_APPS_SCRIPT_BRIDGE"||message.type!=="ready")return;
      if(!isTrustedAppsScriptOrigin(event.origin))return;
      if(message.site&&message.site!==config.SITE_ID)return;
      settled=true;cleanup();resolve(iframe);
    };
    const timer=setTimeout(()=>{if(!settled){settled=true;cleanup();resetBridge();reject(new AppsScriptBackendError("The Inrishi backend bridge could not start.","BACKEND_BRIDGE_TIMEOUT"))}},20000);
    addEventListener("message",onReady);
    document.body.appendChild(iframe);
  });
  return bridgeReadyPromise;
}

export async function appsScriptCall<T>(action:string,payload:Record<string,unknown>={},options:{role?:Role;timeoutMs?:number}={}):Promise<T>{
  if(typeof window==="undefined")throw new AppsScriptBackendError("Browser only","BROWSER_ONLY");
  if(!isBackendConfigured())throw new AppsScriptBackendError("Inrishi services are temporarily unavailable.","BACKEND_NOT_CONFIGURED");
  const config=getRuntimeConfig(),r=options.role??currentRole(),requestId=`req-${Date.now()}-${crypto.randomUUID?.()??Math.random().toString(36).slice(2)}`,token=r==="public"?"":getSessionToken(r);
  const iframe=await ensureRpcBridge();
  return await new Promise<T>((resolve,reject)=>{
    let settled=false;
    const cleanup=()=>{removeEventListener("message",onMessage);clearTimeout(timer)};
    const onMessage=(event:MessageEvent)=>{
      const m=event.data as Partial<Envelope<T>>|null;
      if(settled||event.source!==iframe.contentWindow||!m||m.source!=="INRISHI_APPS_SCRIPT"||m.requestId!==requestId)return;
      if(!isTrustedAppsScriptOrigin(event.origin))return;
      settled=true;cleanup();m.ok?resolve(m.data as T):reject(new AppsScriptBackendError(m.error||"Request failed",m.code));
    };
    const timer=setTimeout(()=>{if(!settled){settled=true;cleanup();resetBridge();reject(new AppsScriptBackendError("The Inrishi backend did not return a response in time.","BACKEND_RESPONSE_TIMEOUT"))}},options.timeoutMs??45000);
    addEventListener("message",onMessage);
    const request={requestId,site:config.SITE_ID,role:r,token,pageUrl:location.href,payload,action};
    iframe.contentWindow?.postMessage({source:"INRISHI_FRONTEND",request},"*");
  });
}
