import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { siteHref } from "@/lib/site-path";

type QA = { q: string; a: string };

type Props = {
  audience: string[];
  replaces: string[];
  outcomes: string[];
  questions: QA[];
  related?: Array<{ href: string; label: string }>;
};

export function SeoServiceSections({ audience, replaces, outcomes, questions, related = [] }: Props) {
  return (
    <>
      <section className="mt-10 grid gap-5 lg:grid-cols-3" aria-label="Service fit and outcomes">
        <article className="v38-panel v76-tile p-7">
          <p className="section-kicker">WHO IT FITS</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-white">Businesses this solution is designed for</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-white/75">
            {audience.map((item) => <li key={item} className="flex gap-3"><CheckCircle2 size={17} className="mt-1 shrink-0" />{item}</li>)}
          </ul>
        </article>
        <article className="v38-panel v76-tile p-7">
          <p className="section-kicker">WHAT IT REPLACES</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-white">Manual or disconnected work it can simplify</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-white/75">
            {replaces.map((item) => <li key={item} className="flex gap-3"><CheckCircle2 size={17} className="mt-1 shrink-0" />{item}</li>)}
          </ul>
        </article>
        <article className="v38-panel v76-tile p-7">
          <p className="section-kicker">BUSINESS OUTCOME</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-white">What a better operating flow should improve</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-white/75">
            {outcomes.map((item) => <li key={item} className="flex gap-3"><CheckCircle2 size={17} className="mt-1 shrink-0" />{item}</li>)}
          </ul>
        </article>
      </section>

      <section className="v38-panel mt-10 p-7" aria-labelledby="common-questions">
        <p className="section-kicker">COMMON QUESTIONS</p>
        <h2 id="common-questions" className="mt-3 font-display text-3xl font-semibold text-white">Quick answers for buyers comparing options</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {questions.map(({ q, a }) => (
            <article key={q} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h3 className="font-display text-lg font-semibold text-white">{q}</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">{a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6" aria-label="Related INRISHI services">
        <h2 className="font-display text-xl font-semibold text-white">Related INRISHI pages</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <a className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-white" href={siteHref("/services")}>All services <ArrowUpRight size={14} /></a>
          <a className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-white" href={siteHref("/about-inrishi")}>About INRISHI <ArrowUpRight size={14} /></a>
          <a className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-white" href={siteHref("/industries")}>Industries <ArrowUpRight size={14} /></a>
          {related.map(({ href, label }) => <a key={href} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-white" href={siteHref(href)}>{label} <ArrowUpRight size={14} /></a>)}
        </div>
      </section>
    </>
  );
}
