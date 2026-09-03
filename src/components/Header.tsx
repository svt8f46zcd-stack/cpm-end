"use client";

import { useState } from "react";
import { Menu, X, Zap, ArrowRight } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/90 text-white shadow-lg backdrop-blur-xl">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Hauptnavigation">
        <a href="/" className="group flex items-center gap-3" aria-label="CPM Energie Startseite">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500 shadow-lg shadow-accent-500/20 transition-transform group-hover:scale-105">
            <Zap className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
          <span className="leading-none">
            <span className="block text-base font-extrabold tracking-tight">CPM ENERGIE</span>
            <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">Strom · Gas · Beratung</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#tarifrechner" className="text-sm font-medium text-slate-300 transition hover:text-white">Tarifrechner</a>
          <a href="#vorteile" className="text-sm font-medium text-slate-300 transition hover:text-white">Vorteile</a>
          <a href="#ablauf" className="text-sm font-medium text-slate-300 transition hover:text-white">Ablauf</a>
          <a href="#kontakt" className="text-sm font-medium text-slate-300 transition hover:text-white">Kontakt</a>
          <a href="#tarifrechner" className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-accent-500/20 transition hover:-translate-y-0.5 hover:bg-accent-600">
            Tarif prüfen <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="rounded-xl border border-white/10 p-2.5 text-slate-200 transition hover:bg-white/10 md:hidden"
          aria-label={isMenuOpen ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-white/10 bg-slate-950 px-4 py-5 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {[['#tarifrechner', 'Tarifrechner'], ['#vorteile', 'Vorteile'], ['#ablauf', 'Ablauf'], ['#kontakt', 'Kontakt']].map(([href, label]) => (
              <a key={href} href={href} onClick={closeMenu} className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white">{label}</a>
            ))}
            <a href="#tarifrechner" onClick={closeMenu} className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-bold text-white">Tarif kostenlos prüfen <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
          </div>
        </div>
      )}
    </header>
  );
}
