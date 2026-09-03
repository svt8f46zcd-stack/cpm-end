"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ChevronDown, Loader2, MapPin, Search, X } from "lucide-react";

interface Locality {
  name: string;
  postalCode: string;
  municipality?: { name?: string };
  district?: { name?: string };
  federalState?: { name?: string };
}

interface Street {
  name: string;
  postalCode: string;
  locality: string;
  suburb?: string;
  borough?: string;
}

const API = "https://openplzapi.org/de";

export default function PostalCodeLookup() {
  const [postalCode, setPostalCode] = useState("");
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [selectedLocality, setSelectedLocality] = useState<Locality | null>(null);
  const [street, setStreet] = useState("");
  const [streets, setStreets] = useState<Street[]>([]);
  const [loading, setLoading] = useState(false);
  const [streetLoading, setStreetLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [streetOpen, setStreetOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const value = postalCode.replace(/\D/g, "").slice(0, 5);
    if (value !== postalCode) setPostalCode(value);

    if (value.length !== 5) {
      setLocalities([]);
      setSelectedLocality(null);
      setOpen(false);
      setError("");
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API}/Localities?postalCode=${encodeURIComponent(value)}&page=1&pageSize=50`, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
          cache: "force-cache",
        });
        if (!response.ok) throw new Error("lookup failed");
        const data = (await response.json()) as Locality[];
        const unique = Array.from(new Map(data.map((item) => [item.name + item.postalCode, item])).values());
        setLocalities(unique);
        setSelectedLocality(unique.length === 1 ? unique[0] : null);
        setOpen(unique.length > 1);
        if (!unique.length) setError("Diese PLZ wurde nicht gefunden.");
      } catch (err) {
        if ((err as Error).name !== "AbortError") setError("PLZ konnte gerade nicht geprüft werden. Bitte versuchen Sie es erneut.");
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [postalCode]);

  useEffect(() => {
    if (!selectedLocality || street.trim().length < 2) {
      setStreets([]);
      setStreetOpen(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setStreetLoading(true);
      try {
        const params = new URLSearchParams({
          name: street.trim(),
          postalCode: selectedLocality.postalCode,
          locality: selectedLocality.name,
          page: "1",
          pageSize: "20",
        });
        const response = await fetch(`${API}/Streets?${params.toString()}`, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
          cache: "force-cache",
        });
        if (!response.ok) throw new Error("street lookup failed");
        const data = (await response.json()) as Street[];
        setStreets(data);
        setStreetOpen(data.length > 0);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setStreets([]);
      } finally {
        setStreetLoading(false);
      }
    }, 180);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [street, selectedLocality]);

  const chooseLocality = (locality: Locality) => {
    setSelectedLocality(locality);
    setOpen(false);
    setStreet("");
    setStreets([]);
  };

  const clear = () => {
    setPostalCode("");
    setSelectedLocality(null);
    setStreet("");
    setLocalities([]);
    setStreets([]);
    setError("");
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8" aria-label="PLZ und Ort prüfen">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <div className="mb-2 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
              <MapPin className="h-4 w-4" aria-hidden="true" /> Adresse automatisch erkennen
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">PLZ eingeben. Ort wird automatisch erkannt.</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Wir verwenden aktuelle offene deutsche Postleitzahldaten. Bei mehreren Orten zur gleichen PLZ können Sie den richtigen Ort auswählen.</p>
          </div>

          <div className="w-full lg:max-w-md">
            <label htmlFor="cpm-postal-code" className="mb-2 block text-sm font-bold text-slate-800">Postleitzahl</label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                id="cpm-postal-code"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={5}
                value={postalCode}
                onChange={(event) => setPostalCode(event.target.value)}
                placeholder="z. B. 55116"
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-lg font-bold text-slate-950 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                aria-describedby="cpm-postal-status"
              />
              {loading ? <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-blue-600" aria-label="PLZ wird geprüft" /> : postalCode ? <button type="button" onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700" aria-label="PLZ löschen"><X className="h-5 w-5" /></button> : null}
            </div>

            {open && localities.length > 0 && (
              <div className="relative z-20">
                <div className="absolute mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl" role="listbox" aria-label="Orte zur PLZ">
                  <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">Mehrere Orte gefunden</div>
                  {localities.map((locality) => (
                    <button key={`${locality.postalCode}-${locality.name}`} type="button" onClick={() => chooseLocality(locality)} className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition hover:bg-blue-50">
                      <span><span className="block font-bold text-slate-900">{locality.name}</span><span className="text-xs text-slate-500">{locality.municipality?.name || locality.district?.name || locality.federalState?.name || "Deutschland"}</span></span>
                      <ChevronDown className="h-4 w-4 -rotate-90 text-slate-400" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div id="cpm-postal-status" className="mt-3 min-h-6 text-sm" aria-live="polite">
              {selectedLocality ? (
                <div className="flex items-center gap-2 font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" aria-hidden="true" /> {selectedLocality.postalCode} · {selectedLocality.name}</div>
              ) : error ? <span className="text-red-600">{error}</span> : postalCode.length > 0 && postalCode.length < 5 ? <span className="text-slate-500">Noch {5 - postalCode.length} Ziffern</span> : null}
            </div>
          </div>
        </div>

        {selectedLocality && (
          <div className="mt-6 border-t border-slate-100 pt-6">
            <label htmlFor="cpm-street" className="mb-2 block text-sm font-bold text-slate-800">Straße optional</label>
            <div className="relative max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                id="cpm-street"
                autoComplete="street-address"
                value={street}
                onChange={(event) => setStreet(event.target.value)}
                placeholder={`Straße in ${selectedLocality.name}`}
                className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-base font-semibold text-slate-950 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
              {streetLoading && <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-blue-600" aria-label="Straßen werden gesucht" />}
            </div>
            {streetOpen && streets.length > 0 && (
              <div className="relative z-10 max-w-xl">
                <div className="absolute mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl" role="listbox" aria-label="Straßenvorschläge">
                  {streets.map((item, index) => (
                    <button key={`${item.name}-${item.locality}-${index}`} type="button" onClick={() => { setStreet(item.name); setStreetOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-blue-50">
                      <MapPin className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
                      <span className="font-semibold text-slate-900">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
