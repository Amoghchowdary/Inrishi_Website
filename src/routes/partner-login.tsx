import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Clock3, KeyRound, LogIn, Mail, RefreshCw, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import inrishiLogo from "@/assets/inrishi-logo.png";
import {
  beginPartnerPasswordLoginFn,
  requestPartnerResetOtpFn,
  verifyPartnerLoginOtpFn,
  completePartnerPasswordResetFn,
} from "@/services/partner-auth";

export const Route = createFileRoute("/partner-login")({
  head: () => ({ meta: [{ title: "Partner Login | Inrishi" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: PartnerLogin,
});

type AccessMode = "login" | "otp" | "reset";

export function PartnerLogin() {
  const [mode, setMode] = useState<AccessMode>("login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [maskedRecoveryEmail, setMaskedRecoveryEmail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pendingApproval, setPendingApproval] = useState(false);
  const [loading, setLoading] = useState(false);

  function resetFeedback() {
    setError("");
    setNotice("");
    setPendingApproval(false);
  }

  function backToLogin() {
    setMode("login");
    setOtp("");
    setMaskedRecoveryEmail("");
    setNewPassword("");
    setConfirmPassword("");
    resetFeedback();
  }

  async function submitPassword(event: FormEvent) {
    event.preventDefault();
    resetFeedback();
    setLoading(true);
    try {
      const result = await beginPartnerPasswordLoginFn({ data: { identifier, password } });
      if (!result.ok) {
        setError(result.message ?? "Unable to continue. Please check your details and try again.");
        return;
      }
      setIdentifier(result.loginId);
      setMaskedRecoveryEmail(result.maskedRecoveryEmail);
      setNotice(`A 6-digit verification code has been sent to ${result.maskedRecoveryEmail}.`);
      setMode("otp");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to continue. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function submitOtp(event: FormEvent) {
    event.preventDefault();
    resetFeedback();
    setLoading(true);
    try {
      const result = await verifyPartnerLoginOtpFn({ data: { identifier, otp } });
      if (!result.ok) {
        setError(result.message ?? "The verification code could not be confirmed.");
        return;
      }
      if (result.partnerStatus === "Pending approval") {
        setPendingApproval(true);
        return;
      }
      window.location.replace("/portal");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to verify the code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function requestResetOtp() {
    resetFeedback();
    setLoading(true);
    try {
      const result = await requestPartnerResetOtpFn({ data: { identifier } });
      if (!result.ok) {
        setError(result.message ?? "Unable to send the verification code.");
        return;
      }
      setIdentifier(result.loginId);
      setMaskedRecoveryEmail(result.maskedRecoveryEmail);
      setNotice(`A 6-digit verification code has been sent to ${result.maskedRecoveryEmail}.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to send the verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function submitReset(event: FormEvent) {
    event.preventDefault();
    resetFeedback();
    if (newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setError("Use at least 8 characters with at least one letter and one number.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    setLoading(true);
    try {
      const result = await completePartnerPasswordResetFn({ data: { identifier, otp, newPassword } });
      if (!result.ok) {
        setError(result.message || "We could not update your password.");
        return;
      }
      setPassword("");
      setNotice("Password updated successfully. Sign in with your new password.");
      setMode("login");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to reset the password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="workspace-shell min-h-screen text-white">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1100px] flex-col px-5 py-8 md:px-8">
        <a href="/" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.16em] text-white/60 hover:text-primary"><ArrowLeft size={14}/> Partner website</a>
        <div className="my-auto grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
          <div className="flex flex-col justify-center">
            <img src={inrishiLogo} alt="Inrishi" className="w-[155px]"/>
            <p className="section-kicker mt-10">PARTNER ACCESS</p>
            <h1 className="mt-4 font-display text-5xl font-semibold">Lead. Convert. Deliver.</h1>
            <p className="mt-5 max-w-xl leading-8 text-white/60">Sign in with your Inrishi Partner Login ID and password. A verification code sent to your registered contact email protects access to your workspace.</p>
            <div className="mt-8 flex items-center gap-3 text-sm text-white/60"><ShieldCheck className="text-primary" size={20}/> Password + email verification</div>
          </div>

          <section className="workspace-panel p-7 sm:p-9">
            <p className="section-kicker">SECURE ACCESS</p>
            <h2 className="mt-3 font-display text-3xl font-semibold">Partner Login</h2>
            <p className="mt-3 text-sm leading-6 text-white/50">Enter your Inrishi Partner Login ID and password to continue.</p>

            {pendingApproval && <div className="mt-6 border border-amber-400/25 bg-amber-400/8 p-5"><div className="flex gap-3"><Clock3 className="mt-0.5 shrink-0 text-amber-300" size={21}/><div><p className="font-semibold text-white">Your partner account is awaiting approval.</p><p className="mt-2 text-sm leading-6 text-white/60">Your sign-in is complete. Inrishi is reviewing your application, and partner features will become available after approval.</p><a href="/portal" className="mt-4 inline-flex h-9 items-center bg-amber-300/15 px-4 text-xs font-semibold text-amber-100">View application status</a></div></div></div>}

            {notice && <div className="mt-5 border border-primary/20 bg-primary/[.06] p-4 text-sm font-semibold text-white/80">{notice}</div>}

            {mode === "login" && (
              <form onSubmit={submitPassword} className="mt-7 grid gap-5">
                <label className="admin-login-field"><span>Inrishi Partner Login ID</span><input className="admin-login-input" value={identifier} onChange={(e)=>setIdentifier(e.target.value)} autoComplete="username" placeholder="partner.name@inrishi.in" required /></label>
                <label className="admin-login-field"><span>Password</span><input className="admin-login-input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} autoComplete="current-password" required /></label>
                <button type="button" onClick={()=>{ setMode("reset"); setOtp(""); setNotice(""); setError(""); }} className="justify-self-start text-sm font-semibold text-primary hover:text-primary/80">Forgot password?</button>
                {error && <p className="text-sm font-semibold text-red-300">{error}</p>}
                <button disabled={loading} className="inline-flex h-12 items-center justify-center gap-2 bg-primary px-6 font-semibold text-primary-foreground"><Mail size={17}/>{loading ? "Verifying…" : "Continue"}</button>
              </form>
            )}

            {mode === "otp" && (
              <form onSubmit={submitOtp} className="mt-7 grid gap-5">
                <div className="workspace-panel p-4"><p className="font-mono text-[10px] uppercase tracking-[.15em] text-primary">VERIFICATION</p><p className="mt-2 text-sm text-white/70">Enter the 6-digit verification code sent to {maskedRecoveryEmail || "your registered email"}.</p></div>
                <label className="admin-login-field"><span>6-digit verification code</span><input className="admin-login-input" inputMode="numeric" maxLength={6} value={otp} onChange={(e)=>setOtp(e.target.value.replace(/\D/g, "").slice(0,6))} placeholder="000000" autoComplete="one-time-code" required /></label>
                {error && <p className="text-sm font-semibold text-red-300">{error}</p>}
                <button disabled={loading || otp.length !== 6} className="inline-flex h-12 items-center justify-center gap-2 bg-primary px-6 font-semibold text-primary-foreground"><KeyRound size={17}/>{loading ? "Verifying…" : "Verify & sign in"}</button>
                <button type="button" onClick={backToLogin} className="justify-self-start text-xs font-semibold text-white/55 hover:text-primary">Back to login</button>
              </form>
            )}

            {mode === "reset" && (
              <form onSubmit={submitReset} className="mt-7 grid gap-5">
                <div className="flex items-center justify-between gap-4"><div><p className="font-display text-xl font-semibold">Reset password</p><p className="mt-1 text-xs text-white/45">We will send a verification code to the contact email registered with your partner account.</p></div><button type="button" onClick={backToLogin} className="text-xs font-semibold text-primary">Back to login</button></div>
                <label className="admin-login-field"><span>Inrishi Partner Login ID</span><input className="admin-login-input" value={identifier} onChange={(e)=>setIdentifier(e.target.value)} autoComplete="username" required /></label>
                <button type="button" disabled={loading || !identifier.trim()} onClick={()=>void requestResetOtp()} className="inline-flex h-11 items-center justify-center gap-2 border border-primary/30 px-5 text-sm font-semibold text-primary"><RefreshCw size={16}/>{maskedRecoveryEmail ? "Send a new code" : "Send verification code"}</button>
                <label className="admin-login-field"><span>6-digit verification code</span><input className="admin-login-input" inputMode="numeric" maxLength={6} value={otp} onChange={(e)=>setOtp(e.target.value.replace(/\D/g, "").slice(0,6))} placeholder="000000" autoComplete="one-time-code" required /></label>
                <label className="admin-login-field"><span>New password</span><input className="admin-login-input" type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} autoComplete="new-password" required /></label>
                <label className="admin-login-field"><span>Confirm new password</span><input className="admin-login-input" type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} autoComplete="new-password" required /></label>
                {error && <p className="text-sm font-semibold text-red-300">{error}</p>}
                <button disabled={loading || !maskedRecoveryEmail || otp.length !== 6} className="inline-flex h-12 items-center justify-center gap-2 bg-primary px-6 font-semibold text-primary-foreground"><KeyRound size={17}/>{loading ? "Updating…" : "Verify & update password"}</button>
              </form>
            )}

            <div className="mt-6 border-t border-white/8 pt-5 text-xs leading-6 text-white/45">
              Your <code>@inrishi.in</code> Login ID is used only for Inrishi access. It is not an email inbox.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
