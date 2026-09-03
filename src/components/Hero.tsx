"use client";

import { ArrowRight, CheckCircle, MapPin, Shield, Sparkles, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 pt-28 text-white md:pt-36">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_20%,rgba(14,165,233,0.18),transparent_34%),radial-gradient(circle_at_15%_80%,rgba(37,99,235,0.18),transparent_30%)]" />
      <div className="absolute right-[-10%] top-[-20%] -z-10 h-[32rem] w-[32rem] rounded-full bg-accent-500/10 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 sm:px-6 md:pb-24 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-28">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-400/20 bg-accent-400/10 px-4 py-2 text-sm font-semibold text-accent-200">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Kostenlose Energieberatung
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
            Bezahlen Sie noch zu viel für <span className="text-accent-400">Strom & Gas?</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            Wir prüfen Ihren Tarif, zeigen Ihnen Ihr Einsparpotenzial und begleiten Sie persönlich beim Wechsel. Kostenlos, transparent und ohne unnötigen Aufwand.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#tarifrechner" className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-4 text-base font-extrabold text-white shadow-xl shadow-accent-500/20 transition hover:-translate-y-0.5 hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-300 focus:ring-offset-2 focus:ring-offset-slate-950">
              Tarif kostenlos prüfen <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </a>
            <a href="#ablauf" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-4 text-base font-bold text-white transition hover:bg-white/10">
              So funktioniert es
            </a>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {['Kostenlos & unverbindlich', 'Persönliche Beratung', 'Privat & Gewerbe'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />{item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-accent-500/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-accent-300"><Zap className="h-4 w-4" /> Tarifcheck</div>
                <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">In wenigen Sekunden starten</h2>
              </div>
              <div className="hidden rounded-xl bg-emerald-400/10 p-3 text-emerald-300 sm:block"><Shield className="h-6 w-6" /></div>
            </div>

            <div className="space-y-3">
              <a href="#tarifrechner" className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-accent-400/40 hover:bg-white/10">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-500/15 text-accent-300"><MapPin className="h-5 w-5" /></span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-bold">PLZ eingeben oder Standort erkennen</span><span className="block text-xs text-slate-400">Ort wird automatisch ergänzt</span></span>
                <ArrowRight className="h-5 w-5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-accent-300" />
              </a>
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300"><Zap className="h-5 w-5" /></span>
                <span><span className="block text-sm font-bold">Strom, Gas oder beides</span><span className="block text-xs text-slate-400">Passend zu Ihrem Bedarf</span></span>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300"><CheckCircle className="h-5 w-5" /></span>
                <span><span className="block text-sm font-bold">Einsparpotenzial erhalten</span><span className="block text-xs text-slate-400">Danach auf Wunsch persönliche Beratung</span></span>
              </div>
            </div>

            <a href="#tarifrechner" className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-4 text-center font-extrabold text-slate-950 transition hover:bg-slate-100">Jetzt Tarifcheck starten <ArrowRight className="h-5 w-5" /></a>
            <p className="mt-4 text-center text-xs text-slate-500">Keine Verpflichtung · Ihre Angaben werden vertraulich behandelt</p>
          </div>
        </div>
      </div>

      <div className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[['24/7', 'Online starten'], ['100%', 'kostenlos prüfen'], ['1', 'Ansprechpartner'], ['DE', 'Privat & Gewerbe']].map(([value, label]) => (
            <div key={label} className="px-3 py-5 text-center sm:py-6"><div className="text-xl font-black text-white sm:text-2xl">{value}</div><div className="mt-1 text-xs text-slate-400 sm:text-sm">{label}</div></div>
          ))}
        </div>
      </div>
    </section>
  );
}
