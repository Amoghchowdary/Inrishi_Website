import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, KeyRound, ShieldCheck, UserPlus, UserRoundSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  completeCustomerRecoveryFn,
  completeCustomerRegistrationFn,
  loginCustomerFn,
  requestCustomerRecoveryOtpFn,
  requestCustomerRegistrationOtpFn,
  verifyCustomerRecoveryOtpFn,
  verifyCustomerRegistrationOtpFn,
  type CustomerRecoveryKind,
} from "@/services/customer-auth";
import inrishiLogo from "@/assets/inrishi-logo.png";
import { siteHref } from "@/lib/site-path";

export const Route = createFileRoute("/customer-login")({
  head: () => ({ meta: [{ title: "Customer Login | Inrishi" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: CustomerLogin,
});

type Mode="login"|"registerRequest"|"registerOtp"|"registerComplete"|"recoveryRequest"|"recoveryOtp"|"recoveryComplete";

function CustomerLogin() {
  const [mode,setMode]=useState<Mode>("login");
  const [identifier,setIdentifier]=useState("");
  const [password,setPassword]=useState("");
  const [showPassword,setShowPassword]=useState(false);
  const [pending,setPending]=useState(false);
  const [message,setMessage]=useState("");

  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [phone,setPhone]=useState("");
  const [company,setCompany]=useState("");
  const [otp,setOtp]=useState("");
  const [masked,setMasked]=useState("");
  const [registrationToken,setRegistrationToken]=useState("");

  const [recoveryKind,setRecoveryKind]=useState<CustomerRecoveryKind>("password");
  const [recoveryEmail,setRecoveryEmail]=useState("");
  const [recoveryToken,setRecoveryToken]=useState("");
  const [newPassword,setNewPassword]=useState("");
  const [recoveredCustomerId,setRecoveredCustomerId]=useState("");

  async function submitLogin(event:FormEvent){
    event.preventDefault();setPending(true);setMessage("");
    try{
      const result=await loginCustomerFn({data:{identifier:identifier.trim(),password}});
      if(!result.ok){setMessage(result.message||"Unable to sign in. Please check your details.");return}
      window.location.assign(siteHref("/customer-portal"));
    }catch(cause){setMessage(cause instanceof Error?cause.message:"Unable to sign in. Please try again.")}
    finally{setPending(false)}
  }

  async function requestRegistration(event:FormEvent){
    event.preventDefault();setPending(true);setMessage("");
    try{
      const r=await requestCustomerRegistrationOtpFn({data:{name:name.trim(),email:email.trim(),phone:phone.trim()}});
      if(!r.ok){setMessage(r.message||"Unable to send verification code.");return}
      setMasked(r.maskedRecoveryEmail||email);setOtp("");setMode("registerOtp");
      setMessage(`Verification code sent to ${r.maskedRecoveryEmail||email}.`);
    }catch(c){setMessage(c instanceof Error?c.message:"Unable to send verification code.")}
    finally{setPending(false)}
  }

  async function verifyRegistration(event:FormEvent){
    event.preventDefault();setPending(true);setMessage("");
    try{
      const r=await verifyCustomerRegistrationOtpFn({data:{name:name.trim(),email:email.trim(),phone:phone.trim(),otp}});
      if(!r.ok||!r.registrationToken){setMessage(r.message||"Verification failed.");return}
      setRegistrationToken(r.registrationToken);setMode("registerComplete");setMessage("Gmail verified. Create your password.");
    }catch(c){setMessage(c instanceof Error?c.message:"Unable to verify the code.")}
    finally{setPending(false)}
  }

  async function completeRegistration(event:FormEvent){
    event.preventDefault();setPending(true);setMessage("");
    try{
      const r=await completeCustomerRegistrationFn({data:{registrationToken,password:newPassword,...(company.trim()?{company:company.trim()}:{})}});
      if(!r.ok){setMessage(r.message||"Unable to create the customer account.");return}
      setIdentifier(r.loginEmail||email);setRecoveredCustomerId(r.customerId||"");setPassword("");setNewPassword("");setMode("login");
      setMessage(`${r.message||"Customer account created."}${r.customerId?` Customer ID: ${r.customerId}`:""}`);
    }catch(c){setMessage(c instanceof Error?c.message:"Unable to create the customer account.")}
    finally{setPending(false)}
  }

  function beginRecovery(kind:CustomerRecoveryKind){
    setRecoveryKind(kind);setRecoveryEmail("");setOtp("");setRecoveryToken("");setNewPassword("");setRecoveredCustomerId("");setMessage("");setMode("recoveryRequest");
  }

  async function requestRecovery(event:FormEvent){
    event.preventDefault();setPending(true);setMessage("");
    try{
      const r=await requestCustomerRecoveryOtpFn({data:{recoveryEmail:recoveryEmail.trim(),kind:recoveryKind}});
      if(!r.ok){setMessage(r.message||"Unable to send verification code.");return}
      setMasked(r.maskedRecoveryEmail||recoveryEmail);setOtp("");setMode("recoveryOtp");
      setMessage(`Verification code sent to ${r.maskedRecoveryEmail||recoveryEmail}.`);
    }catch(c){setMessage(c instanceof Error?c.message:"Unable to send verification code.")}
    finally{setPending(false)}
  }

  async function verifyRecovery(event:FormEvent){
    event.preventDefault();setPending(true);setMessage("");
    try{
      const r=await verifyCustomerRecoveryOtpFn({data:{recoveryEmail:recoveryEmail.trim(),kind:recoveryKind,otp}});
      if(!r.ok||!r.recoveryToken){setMessage(r.message||"Verification failed.");return}
      setRecoveryToken(r.recoveryToken);
      if(recoveryKind==="customerId"){
        const done=await completeCustomerRecoveryFn({data:{recoveryToken:r.recoveryToken,kind:"customerId"}});
        if(!done.ok){setMessage(done.message||"Customer ID recovery failed.");return}
        setRecoveredCustomerId(done.customerId||"");setIdentifier(done.loginEmail||recoveryEmail);setMode("login");
        setMessage(`Customer ID: ${done.customerId||"Unavailable"}. Sign in using your registered email or Customer ID.`);
      }else{
        setMode("recoveryComplete");setMessage("OTP verified. Create your new password.");
      }
    }catch(c){setMessage(c instanceof Error?c.message:"Unable to verify the code.")}
    finally{setPending(false)}
  }

  async function completeRecovery(event:FormEvent){
    event.preventDefault();setPending(true);setMessage("");
    try{
      const r=await completeCustomerRecoveryFn({data:{recoveryToken,kind:"password",newPassword}});
      if(!r.ok){setMessage(r.message||"Unable to reset the password.");return}
      setIdentifier(r.loginEmail||recoveryEmail);setPassword("");setNewPassword("");setMode("login");
      setMessage(r.message||"Password updated successfully.");
    }catch(c){setMessage(c instanceof Error?c.message:"Unable to reset the password.")}
    finally{setPending(false)}
  }

  return <div className="workspace-shell min-h-screen overflow-x-hidden">
    <header className="workspace-header border-b border-white/10"><div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 md:px-10 lg:px-16"><a href={siteHref("/")}><img src={inrishiLogo} alt="INRISHI" className="brand-logo"/></a><Button asChild variant="ghost"><a href={siteHref("/contact")}>Need help? <ArrowRight size={15}/></a></Button></div></header>
    <nav className="mobile-page-nav md:hidden"><a href={siteHref("/#solutions")}>Services</a><a href={siteHref("/sample-work")}>Sample Work</a><a href={siteHref("/contact")}>Contact</a></nav>
    <main className="mx-auto max-w-[1180px] px-5 py-12 md:px-10 lg:px-16 lg:py-20">
      <a href={siteHref("/")} className="inline-flex items-center gap-2 text-xs text-white/60"><ArrowLeft size={14}/> Back to Inrishi</a>
      <section className="title-card auth-title-card mt-10 grid overflow-hidden lg:grid-cols-[.95fr_1.05fr]">
        <div className="border-b border-slate-200 p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-12"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><ShieldCheck/></span><p className="section-kicker mt-8">CUSTOMER ACCESS</p><h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">Your project, in one secure area.</h1><p className="mt-5 text-sm leading-7 text-muted-foreground">Customers use their own registered Gmail address. Inrishi does not issue a separate email inbox for customer access.</p></div>
        <div className="p-7 sm:p-10 lg:p-12">
          {mode==="login"&&<form onSubmit={submitLogin} className="grid gap-5"><p className="section-kicker">SIGN IN</p><h2 className="font-display text-3xl font-semibold">Customer Login</h2><label className="form-label">Registered Gmail or Customer ID<input required autoComplete="username" value={identifier} onChange={e=>setIdentifier(e.target.value)} className="form-input h-12" placeholder="yourname@gmail.com"/></label><label className="form-label">Password<span className="relative"><input required type={showPassword?"text":"password"} autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="form-input h-12 pr-12"/><button type="button" onClick={()=>setShowPassword(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" aria-label={showPassword?"Hide password":"Show password"}>{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></span></label><Button type="submit" disabled={pending} className="h-12">{pending?"Signing in…":"Sign in"}<ArrowRight size={16}/></Button><div className="grid gap-2 sm:grid-cols-3"><button type="button" onClick={()=>beginRecovery("password")} className="text-left text-sm font-semibold text-emerald-700">Forgot Password?</button><button type="button" onClick={()=>beginRecovery("customerId")} className="text-left text-sm font-semibold text-emerald-700">Forgot Customer ID?</button><button type="button" onClick={()=>{setMessage("");setMode("registerRequest")}} className="text-left text-sm font-semibold text-emerald-700 sm:text-right">Register with Gmail</button></div></form>}
          {mode==="registerRequest"&&<form onSubmit={requestRegistration} className="grid gap-5"><UserPlus className="text-primary"/><h2 className="font-display text-3xl font-semibold">Register customer access</h2><p className="text-sm text-muted-foreground">Use your own Gmail address. We will verify it with an OTP before creating the account.</p><label className="form-label">Name<input required value={name} onChange={e=>setName(e.target.value)} className="form-input"/></label><label className="form-label">Gmail address<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="yourname@gmail.com" className="form-input"/></label><label className="form-label">Phone<input required value={phone} onChange={e=>setPhone(e.target.value)} className="form-input"/></label><label className="form-label">Company (optional)<input value={company} onChange={e=>setCompany(e.target.value)} className="form-input"/></label><Button type="submit" disabled={pending}>{pending?"Sending…":"Send Gmail OTP"}</Button><button type="button" onClick={()=>setMode("login")} className="text-left text-sm font-semibold text-emerald-700">Back to login</button></form>}
          {mode==="registerOtp"&&<form onSubmit={verifyRegistration} className="grid gap-5"><KeyRound className="text-primary"/><h2 className="font-display text-3xl font-semibold">Verify Gmail</h2><p className="text-sm">Enter the 6-digit OTP sent to {masked}.</p><label className="form-label">OTP<input required inputMode="numeric" maxLength={6} value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,"").slice(0,6))} className="form-input"/></label><Button type="submit" disabled={pending}>{pending?"Verifying…":"Verify OTP"}</Button></form>}
          {mode==="registerComplete"&&<form onSubmit={completeRegistration} className="grid gap-5"><h2 className="font-display text-3xl font-semibold">Create password</h2><p className="text-sm">Your Gmail is verified. Create the password for your Inrishi customer portal.</p><label className="form-label">New password<input required minLength={8} type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="form-input"/></label><Button type="submit" disabled={pending}>{pending?"Creating…":"Create customer account"}</Button></form>}
          {mode==="recoveryRequest"&&<form onSubmit={requestRecovery} className="grid gap-5"><UserRoundSearch className="text-primary"/><h2 className="font-display text-3xl font-semibold">{recoveryKind==="password"?"Forgot Password":"Forgot Customer ID"}</h2><p className="text-sm">Enter the email registered with your customer account. We will verify ownership by OTP first.</p><label className="form-label">Registered email<input required type="email" value={recoveryEmail} onChange={e=>setRecoveryEmail(e.target.value)} className="form-input"/></label><Button type="submit" disabled={pending}>{pending?"Sending…":"Send OTP"}</Button><button type="button" onClick={()=>setMode("login")} className="text-left text-sm font-semibold text-emerald-700">Back to login</button></form>}
          {mode==="recoveryOtp"&&<form onSubmit={verifyRecovery} className="grid gap-5"><KeyRound className="text-primary"/><h2 className="font-display text-3xl font-semibold">Verify recovery OTP</h2><p className="text-sm">Enter the 6-digit OTP sent to {masked}.</p><label className="form-label">OTP<input required inputMode="numeric" maxLength={6} value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,"").slice(0,6))} className="form-input"/></label><Button type="submit" disabled={pending}>{pending?"Verifying…":"Verify OTP"}</Button></form>}
          {mode==="recoveryComplete"&&<form onSubmit={completeRecovery} className="grid gap-5"><h2 className="font-display text-3xl font-semibold">Create new password</h2><p className="text-sm">OTP verification is complete. Create the new password now.</p><label className="form-label">New password<input required minLength={8} type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="form-input"/></label><Button type="submit" disabled={pending}>{pending?"Updating…":"Create new password"}</Button></form>}
          {message&&<p role="status" className="mt-5 text-sm font-semibold">{message}</p>}
          {recoveredCustomerId&&mode==="login"&&<p className="mt-2 text-xs text-slate-500">Recovered Customer ID: {recoveredCustomerId}</p>}
        </div>
      </section>
    </main>
  </div>;
}
