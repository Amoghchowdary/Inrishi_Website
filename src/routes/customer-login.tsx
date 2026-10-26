import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loginCustomerFn } from "@/services/customer-auth";
import inrishiLogo from "@/assets/inrishi-logo.png";

export const Route = createFileRoute("/customer-login")({
  head: () => ({
    meta: [
      { title: "Customer Login | Inrishi" },
      { name: "description", content: "Secure customer access for Inrishi clients." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CustomerLoginPage,
});

function CustomerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    try {
      const result = await loginCustomerFn({ data: { email, password } });
      if (!result.ok) {
        setMessage(result.message ?? "Unable to sign in. Please check your details and try again.");
        return;
      }
      window.location.assign("/customer-portal");
    } catch {
      setMessage("We couldn't complete the sign-in request. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="workspace-shell min-h-screen overflow-x-hidden text-white">
      <div className="relative z-10">
        <header className="site-header border-b border-border/60">
          <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-5 px-5 md:px-10 lg:px-16">
            <a href="/" className="flex min-w-0 items-center" aria-label="Inrishi home">
              <img src={inrishiLogo} alt="INRISHI" className="h-auto w-[118px] object-contain sm:w-[142px]" />
            </a>
            <nav className="hidden items-center gap-6 md:flex" aria-label="Customer login navigation">
              <a href="/#solutions" className="nav-link">Services</a>
              <a href="/sample-work" className="nav-link">Sample Work</a>
              <a href="/contact" className="nav-link">Contact</a>
            </nav>
            <Button asChild variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary">
              <a href="/contact">Need help? <ArrowRight size={15} /></a>
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] px-5 py-12 md:px-10 md:py-18 lg:px-16 lg:py-20">
          <a href="/" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft size={14} /> Back to Inrishi
          </a>

          <section className="mt-10 grid overflow-hidden border border-border bg-card/68 shadow-[0_24px_90px_rgba(0,0,0,.34)] lg:grid-cols-[0.92fr_1.08fr]">
            <div className="relative overflow-hidden border-b border-border p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
              <div className="absolute -left-20 top-10 h-52 w-52 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
              <div className="relative z-10">
                <span className="flex h-12 w-12 items-center justify-center border border-primary/30 bg-primary/10 text-primary"><ShieldCheck size={23} /></span>
                <p className="section-kicker mt-8">CUSTOMER ACCESS</p>
                <h1 className="mt-5 max-w-xl font-display text-4xl font-semibold leading-[1.08] sm:text-5xl">Your Inrishi customer area, <span className="text-primary">all in one place.</span></h1>
                <p className="mt-6 max-w-lg text-sm leading-[1.85] text-muted-foreground sm:text-base">Sign in with the Inrishi Customer Login ID provided by our team. This Login ID is used only inside Inrishi and is not a normal email inbox.</p>
                <div className="mt-10 grid gap-4 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3"><LockKeyhole className="mt-0.5 shrink-0 text-cyan" size={18} /><span>Private access to your project information, payments, documents and messages.</span></div>
                  <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 shrink-0 text-cyan" size={18} /><span>Your account stays protected while you move through the customer area.</span></div>
                </div>
              </div>
            </div>

            <div className="p-7 sm:p-10 lg:p-12">
              <p className="section-kicker">SIGN IN</p>
              <h2 className="mt-4 font-display text-3xl font-semibold">Customer Login</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Sign in with the Inrishi Customer Login ID and password provided by our team.</p>

              <form onSubmit={handleSubmit} className="customer-login-form mt-8 grid gap-6" noValidate>
                <label className="form-label">
                  Inrishi Customer Login ID
                  <span className="relative block">
                    <Mail size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      autoComplete="username"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="customer.company@inrishi.in"
                      className="form-input login-input h-12"
                    />
                  </span>
                </label>

                <label className="form-label">
                  Password
                  <span className="relative block">
                    <LockKeyhole size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={1}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      className="form-input login-input login-password-input h-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-primary"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </span>
                </label>

                <div className="flex justify-end text-xs">
                  <a href="/contact" className="text-primary transition-colors hover:text-cyan">Need help signing in?</a>
                </div>

                {message && <p role="alert" className="border border-destructive/35 bg-destructive/10 px-4 py-3 text-sm text-foreground">{message}</p>}

                <Button type="submit" disabled={pending} className="h-12 rounded-none bg-primary font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
                  {pending ? "Signing in…" : <>Sign in <ArrowRight size={16} /></>}
                </Button>
              </form>
            </div>
          </section>
        </main>

        <footer className="workspace-simple-footer mx-auto max-w-[1440px] px-5 py-8 text-center text-xs font-semibold text-white/70 md:px-10 lg:px-16">Inrishi · Intelligence Inside</footer>
      </div>
    </div>
  );
}
