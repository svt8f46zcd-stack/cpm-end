"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  MapPin,
  Home,
  Building2,
  Users,
  Zap,
  Flame,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Euro,
  Leaf,
  Clock,
  TrendingDown,
  Shield,
  Navigation,
} from "lucide-react";
import type {
  CalculatorFormData,
  ProviderSuggestion,
  TariffResult,
  ApiError,
} from "@/types";
import {
  validatePostalCode,
  getAddressByPostalCode,
  getStreetSuggestions,
  getProviderSuggestions,
  calculateTariffs,
  detectProviderByLocation,
  formatCurrency,
} from "@/lib/tariff-api";

interface TariffCalculatorProps {
  compact?: boolean;
}

interface DetectedLocation {
  postalCode: string;
  city?: string;
  accuracy?: number;
}

async function reverseGeocode(latitude: number, longitude: number): Promise<DetectedLocation | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&zoom=18&addressdetails=1`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const postalCode = data?.address?.postcode;
    const city = data?.address?.city || data?.address?.town || data?.address?.municipality || data?.address?.village;

    if (!postalCode || !/^\d{5}$/.test(postalCode)) return null;

    return { postalCode, city };
  } catch {
    return null;
  }
}

export default function TariffCalculator({ compact = false }: TariffCalculatorProps) {
  const [formData, setFormData] = useState<CalculatorFormData>({
    postalCode: "",
    street: "",
    houseNumber: "",
    city: "",
    consumptionStrom: undefined,
    consumptionGas: undefined,
    currentProvider: "",
    customerType: "private",
    tariffType: "both",
    householdSize: 2,
  });

  const [errors, setErrors] = useState<ApiError[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string>("");
  const [results, setResults] = useState<TariffResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [streetSuggestions, setStreetSuggestions] = useState<string[]>([]);
  const [providerSuggestions, setProviderSuggestions] = useState<ProviderSuggestion[]>([]);
  const [showStreetDropdown, setShowStreetDropdown] = useState(false);
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const streetInputRef = useRef<HTMLInputElement>(null);
  const providerInputRef = useRef<HTMLInputElement>(null);
  const locationRequestRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.postalCode && validatePostalCode(formData.postalCode) && formData.street) {
        try {
          const suggestions = await getStreetSuggestions(formData.postalCode, formData.street);
          setStreetSuggestions(suggestions);
          setShowStreetDropdown(suggestions.length > 0);
        } catch {
          setStreetSuggestions([]);
          setShowStreetDropdown(false);
        }
      } else {
        setStreetSuggestions([]);
        setShowStreetDropdown(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [formData.postalCode, formData.street]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.currentProvider && formData.currentProvider.length >= 2) {
        try {
          const type = formData.tariffType === "both" ? undefined : formData.tariffType;
          const suggestions = await getProviderSuggestions(formData.currentProvider, type);
          setProviderSuggestions(suggestions);
          setShowProviderDropdown(suggestions.length > 0);
        } catch {
          setProviderSuggestions([]);
          setShowProviderDropdown(false);
        }
      } else {
        setProviderSuggestions([]);
        setShowProviderDropdown(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [formData.currentProvider, formData.tariffType]);

  useEffect(() => {
    const autoDetectCity = async () => {
      if (!validatePostalCode(formData.postalCode)) {
        setFormData((prev) => (prev.city ? { ...prev, city: "" } : prev));
        return;
      }

      try {
        const addressData = await getAddressByPostalCode(formData.postalCode);
        if (addressData) {
          setFormData((prev) => ({ ...prev, city: addressData.city }));

          if (!formData.currentProvider) {
            const detectedProvider = await detectProviderByLocation(formData.postalCode);
            if (detectedProvider) {
              setFormData((prev) => ({ ...prev, currentProvider: detectedProvider.name }));
            }
          }
        }
      } catch {
        // Manual input remains available when lookup is unavailable.
      }
    };

    autoDetectCity();
  }, [formData.postalCode]);

  useEffect(() => {
    if (formData.householdSize && formData.customerType === "private") {
      const baseStrom = 1500 + (formData.householdSize - 1) * 500;
      const baseGas = 8000 + (formData.householdSize - 1) * 2000;

      setFormData((prev) => ({
        ...prev,
        consumptionStrom: prev.consumptionStrom || baseStrom,
        consumptionGas: prev.consumptionGas || baseGas,
      }));
    }
  }, [formData.householdSize, formData.customerType]);

  const handleFieldChange = useCallback(
    <K extends keyof CalculatorFormData>(field: K, value: CalculatorFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors.some((e) => e.field === field)) {
        setErrors((prev) => prev.filter((e) => e.field !== field));
      }
    },
    [errors]
  );

  const handleFieldBlur = useCallback((field: string) => {
    setTouchedFields((prev) => new Set(prev).add(field));
  }, []);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationMessage("Standorterkennung wird von diesem Gerät nicht unterstützt.");
      return;
    }

    const requestId = ++locationRequestRef.current;
    setIsDetectingLocation(true);
    setLocationMessage("");
    setErrors((prev) => prev.filter((error) => error.field !== "postalCode"));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (requestId !== locationRequestRef.current) return;

        const location = await reverseGeocode(position.coords.latitude, position.coords.longitude);
        if (!location) {
          setLocationMessage("Standort konnte nicht eindeutig in eine PLZ umgewandelt werden. Bitte PLZ eingeben.");
          setIsDetectingLocation(false);
          return;
        }

        setFormData((prev) => ({
          ...prev,
          postalCode: location.postalCode,
          city: location.city || prev.city,
        }));
        setLocationMessage(location.city ? `${location.postalCode} · ${location.city}` : location.postalCode);
        setIsDetectingLocation(false);
      },
      () => {
        setLocationMessage("Standortzugriff wurde nicht freigegeben. Sie können die PLZ direkt eingeben.");
        setIsDetectingLocation(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  const selectStreet = useCallback((street: string) => {
    setFormData((prev) => ({ ...prev, street }));
    setShowStreetDropdown(false);
    streetInputRef.current?.focus();
  }, []);

  const selectProvider = useCallback((provider: string) => {
    setFormData((prev) => ({ ...prev, currentProvider: provider }));
    setShowProviderDropdown(false);
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: ApiError[] = [];
    if (!formData.postalCode || !validatePostalCode(formData.postalCode)) {
      newErrors.push({
        code: "INVALID_POSTAL_CODE",
        message: "Bitte geben Sie eine gültige 5-stellige Postleitzahl ein.",
        field: "postalCode",
      });
    }
    if (!formData.customerType) {
      newErrors.push({ code: "MISSING_CUSTOMER_TYPE", message: "Bitte wählen Sie einen Kundentyp aus.", field: "customerType" });
    }
    if (!formData.tariffType) {
      newErrors.push({ code: "MISSING_TARIFF_TYPE", message: "Bitte wählen Sie eine Tarifart aus.", field: "tariffType" });
    }
    setErrors(newErrors);
    if (newErrors.length) {
      setTouchedFields((prev) => new Set(prev).add("postalCode"));
    }
    return newErrors.length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsCalculating(true);
    setShowResults(false);

    try {
      const tariffResults = await calculateTariffs(formData);
      setResults(tariffResults);
      setShowResults(true);
    } catch {
      setErrors([{ code: "CALCULATION_ERROR", message: "Bei der Berechnung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut." }]);
    } finally {
      setIsCalculating(false);
    }
  };

  const resetCalculator = () => {
    setFormData({
      postalCode: "",
      street: "",
      houseNumber: "",
      city: "",
      consumptionStrom: undefined,
      consumptionGas: undefined,
      currentProvider: "",
      customerType: "private",
      tariffType: "both",
      householdSize: 2,
    });
    setResults([]);
    setShowResults(false);
    setErrors([]);
    setTouchedFields(new Set());
    setLocationMessage("");
  };

  const getFieldError = (field: string): string | undefined => {
    if (!touchedFields.has(field)) return undefined;
    return errors.find((e) => e.field === field)?.message;
  };

  const postalError = getFieldError("postalCode");
  const locationButton = (
    <button
      type="button"
      onClick={detectLocation}
      disabled={isDetectingLocation}
      className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 rounded-lg border border-accent-200 bg-accent-50 px-3 py-2 text-sm font-semibold text-accent-700 transition hover:bg-accent-100 disabled:cursor-wait disabled:opacity-60 dark:border-accent-800 dark:bg-accent-900/30 dark:text-accent-300"
      aria-label="Standort erkennen"
    >
      {isDetectingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
      <span className="hidden sm:inline">Standort</span>
    </button>
  );

  if (compact) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 md:p-8">
        <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Kostenlose Tarifprüfung</h3>
        <p className="mb-6 text-gray-600 dark:text-gray-400">PLZ automatisch erkennen oder direkt eingeben.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="compact-postalCode" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Postleitzahl *</label>
            <div className="relative">
              <input
                type="text"
                id="compact-postalCode"
                required
                inputMode="numeric"
                autoComplete="postal-code"
                pattern="[0-9]{5}"
                maxLength={5}
                value={formData.postalCode}
                onChange={(e) => handleFieldChange("postalCode", e.target.value.replace(/\D/g, ""))}
                onBlur={() => handleFieldBlur("postalCode")}
                className={`w-full rounded-lg border px-4 py-3 pr-28 transition-colors focus:border-transparent focus:ring-2 focus:ring-accent-500 dark:bg-gray-700 dark:text-white ${postalError ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
                placeholder="12345"
              />
              {locationButton}
            </div>
            {locationMessage && <p className="mt-2 text-xs text-accent-700 dark:text-accent-300">{locationMessage}</p>}
            {postalError && <p className="mt-1 flex items-center gap-1 text-sm text-red-600"><AlertCircle className="h-4 w-4" />{postalError}</p>}
          </div>
          <button type="submit" className="w-full btn-primary" disabled={isCalculating}>
            {isCalculating ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-5 w-5 animate-spin" />Wird berechnet...</span> : "Kostenlos prüfen lassen"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <section id="tarifrechner" className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 dark:from-gray-900 dark:to-gray-800 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">Live Tarifrechner</h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">PLZ erkennen lassen oder direkt eingeben. Ort und verfügbare Informationen werden automatisch ergänzt.</p>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-800">
          {!showResults && (
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Schritt 1 von 2: Ihre Daten</span>
                <div className="flex items-center gap-2"><div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"><div className="h-full w-1/2 rounded-full bg-accent-500" /></div><span className="font-semibold text-accent-500">50%</span></div>
              </div>
            </div>
          )}

          <div className="p-6 md:p-8">
            {!showResults ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="postalCode" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"><MapPin className="mr-1 inline h-4 w-4" />Postleitzahl *</label>
                    <div className="relative">
                      <input
                        type="text"
                        id="postalCode"
                        required
                        inputMode="numeric"
                        autoComplete="postal-code"
                        maxLength={5}
                        value={formData.postalCode}
                        onChange={(e) => handleFieldChange("postalCode", e.target.value.replace(/\D/g, ""))}
                        onBlur={() => handleFieldBlur("postalCode")}
                        className={`w-full rounded-lg border px-4 py-3 pr-28 transition-colors focus:border-transparent focus:ring-2 focus:ring-accent-500 dark:bg-gray-700 dark:text-white ${postalError ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
                        placeholder="12345"
                      />
                      {locationButton}
                    </div>
                    <div className="mt-2 flex min-h-5 items-center gap-2">
                      {isDetectingLocation && <><Loader2 className="h-4 w-4 animate-spin text-accent-500" /><span className="text-xs text-gray-500 dark:text-gray-400">Standort wird ermittelt…</span></>}
                      {!isDetectingLocation && locationMessage && <><CheckCircle className="h-4 w-4 text-green-500" /><span className="text-xs text-green-700 dark:text-green-400">{locationMessage}</span></>}
                      {!isDetectingLocation && !locationMessage && formData.city && <><CheckCircle className="h-4 w-4 text-green-500" /><span className="text-xs text-green-700 dark:text-green-400">{formData.city} automatisch erkannt</span></>}
                    </div>
                    {postalError && <p className="mt-1 flex items-center gap-1 text-sm text-red-600"><AlertCircle className="h-4 w-4" />{postalError}</p>}
                  </div>

                  <div className="relative">
                    <label htmlFor="street" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"><Home className="mr-1 inline h-4 w-4" />Straße</label>
                    <input ref={streetInputRef} type="text" id="street" autoComplete="street-address" value={formData.street} onChange={(e) => handleFieldChange("street", e.target.value)} onFocus={() => formData.postalCode && validatePostalCode(formData.postalCode) && setShowStreetDropdown(streetSuggestions.length > 0)} onBlur={() => setTimeout(() => setShowStreetDropdown(false), 200)} className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" placeholder="Automatische Vervollständigung" />
                    {showStreetDropdown && streetSuggestions.length > 0 && <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-700">{streetSuggestions.map((street, index) => <button key={`${street}-${index}`} type="button" onClick={() => selectStreet(street)} className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-600"><MapPin className="h-4 w-4 text-gray-400" />{street}</button>)}</div>}
                  </div>

                  <div>
                    <label htmlFor="houseNumber" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Hausnummer</label>
                    <input type="text" id="houseNumber" autoComplete="address-line2" value={formData.houseNumber} onChange={(e) => handleFieldChange("houseNumber", e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" placeholder="12a" />
                  </div>

                  <div>
                    <label htmlFor="city" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Ort</label>
                    <input type="text" id="city" value={formData.city || ""} readOnly className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400" placeholder="Wird automatisch ausgefüllt" />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"><Users className="mr-1 inline h-4 w-4" />Kundentyp *</label>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => handleFieldChange("customerType", "private")} className={`flex-1 rounded-lg border-2 px-4 py-3 transition-all ${formData.customerType === "private" ? "border-accent-500 bg-accent-50 text-accent-600 dark:bg-accent-900/20" : "border-gray-200 dark:border-gray-700"}`}><Users className="mr-2 inline h-5 w-5" />Privat</button>
                      <button type="button" onClick={() => handleFieldChange("customerType", "business")} className={`flex-1 rounded-lg border-2 px-4 py-3 transition-all ${formData.customerType === "business" ? "border-accent-500 bg-accent-50 text-accent-600 dark:bg-accent-900/20" : "border-gray-200 dark:border-gray-700"}`}><Building2 className="mr-2 inline h-5 w-5" />Gewerbe</button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"><Zap className="mr-1 inline h-4 w-4" />Tarifart *</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button type="button" onClick={() => handleFieldChange("tariffType", "strom")} className={`rounded-lg border-2 px-3 py-3 transition-all ${formData.tariffType === "strom" ? "border-yellow-500 bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20" : "border-gray-200 dark:border-gray-700"}`}><Zap className="mx-auto mb-1 h-5 w-5" /><span className="text-sm">Strom</span></button>
                      <button type="button" onClick={() => handleFieldChange("tariffType", "gas")} className={`rounded-lg border-2 px-3 py-3 transition-all ${formData.tariffType === "gas" ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700"}`}><Flame className="mx-auto mb-1 h-5 w-5" /><span className="text-sm">Gas</span></button>
                      <button type="button" onClick={() => handleFieldChange("tariffType", "both")} className={`rounded-lg border-2 px-3 py-3 transition-all ${formData.tariffType === "both" ? "border-green-500 bg-green-50 text-green-600 dark:bg-green-900/20" : "border-gray-200 dark:border-gray-700"}`}><Euro className="mx-auto mb-1 h-5 w-5" /><span className="text-sm">Kombi</span></button>
                    </div>
                  </div>
                </div>

                {formData.customerType === "private" && <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"><Users className="mr-1 inline h-4 w-4" />Personen im Haushalt</label>
                  <div className="flex items-center gap-4"><input type="range" min="1" max="10" value={formData.householdSize} onChange={(e) => handleFieldChange("householdSize", parseInt(e.target.value, 10))} className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-accent-500 dark:bg-gray-700" /><span className="w-12 text-center text-2xl font-bold text-gray-900 dark:text-white">{formData.householdSize}</span></div>
                </div>}

                <div className="grid gap-6 md:grid-cols-2">
                  {(formData.tariffType === "strom" || formData.tariffType === "both") && <div><label htmlFor="consumptionStrom" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"><Zap className="mr-1 inline h-4 w-4" />Jahresverbrauch Strom (kWh)</label><input type="number" id="consumptionStrom" min="0" value={formData.consumptionStrom || ""} onChange={(e) => handleFieldChange("consumptionStrom", parseInt(e.target.value, 10) || undefined)} className="w-full rounded-lg border border-gray-300 px-4 py-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white" placeholder="Auto-berechnet" /><p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Basierend auf {formData.householdSize} Personen</p></div>}
                  {(formData.tariffType === "gas" || formData.tariffType === "both") && <div><label htmlFor="consumptionGas" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"><Flame className="mr-1 inline h-4 w-4" />Jahresverbrauch Gas (kWh)</label><input type="number" id="consumptionGas" min="0" value={formData.consumptionGas || ""} onChange={(e) => handleFieldChange("consumptionGas", parseInt(e.target.value, 10) || undefined)} className="w-full rounded-lg border border-gray-300 px-4 py-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white" placeholder="Auto-berechnet" /><p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Basierend auf {formData.householdSize} Personen</p></div>}
                </div>

                <div className="relative">
                  <label htmlFor="currentProvider" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"><Search className="mr-1 inline h-4 w-4" />Aktueller Energieversorger</label>
                  <div className="relative">
                    <input ref={providerInputRef} type="text" id="currentProvider" value={formData.currentProvider} onChange={(e) => handleFieldChange("currentProvider", e.target.value)} onFocus={() => setShowProviderDropdown(providerSuggestions.length > 0)} onBlur={() => setTimeout(() => setShowProviderDropdown(false), 200)} className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 focus:border-transparent focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" placeholder="z.B. Stadtwerke München, E.ON" />
                    {formData.currentProvider && <button type="button" onClick={() => handleFieldChange("currentProvider", "")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>}
                  </div>
                  {showProviderDropdown && providerSuggestions.length > 0 && <div className="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-700">{providerSuggestions.map((provider) => <button key={provider.id} type="button" onClick={() => selectProvider(provider.name)} className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-600">{provider.type === "strom" && <Zap className="h-4 w-4 text-yellow-500" />}{provider.type === "gas" && <Flame className="h-4 w-4 text-blue-500" />}{provider.type === "both" && <Euro className="h-4 w-4 text-green-500" />}{provider.name}</button>)}</div>}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Optional · hilft bei der besseren Beratung</p>
                </div>

                <button type="submit" disabled={isCalculating} className="flex w-full items-center justify-center gap-2 btn-primary py-4 text-lg">{isCalculating ? <><Loader2 className="h-6 w-6 animate-spin" /><span>Berechne beste Tarife...</span></> : <><TrendingDown className="h-6 w-6" /><span>Jetzt Einsparpotenzial berechnen</span></>}</button>
                <p className="text-center text-xs text-gray-500 dark:text-gray-400">🔒 Ihre Daten werden vertraulich behandelt.</p>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="mb-8 text-center"><h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Ihre persönlichen Ersparnisse</h3><p className="text-gray-600 dark:text-gray-400">Basierend auf Ihren Angaben für {formData.city || formData.postalCode}</p></div>
                <div className="mb-8 grid gap-4 md:grid-cols-3">
                  {results.slice(0, 3).map((result, index) => <div key={result.tariff.id} className={`relative rounded-xl border-2 p-6 ${index === 0 ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"}`}>{index === 0 && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-green-500 px-3 py-1 text-sm font-semibold text-white">Bester Tarif</div>}<div className="text-center"><p className="mb-1 text-sm text-gray-600 dark:text-gray-400">{result.tariff.provider}</p><p className="mb-3 font-semibold text-gray-900 dark:text-white">{result.tariff.name}</p><div className="mb-1 text-3xl font-bold text-green-600">{formatCurrency(result.savings)}</div><p className="mb-3 text-sm text-gray-600 dark:text-gray-400">Ersparnis pro Jahr</p><div className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(result.monthlyCost)}<span className="text-sm text-gray-500">/Monat</span></div></div><ul className="mt-4 space-y-2">{result.features.map((feature, i) => <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><CheckCircle className="h-4 w-4 shrink-0 text-green-500" />{feature}</li>)}</ul></div>)}
                </div>
                <div className="flex flex-col justify-center gap-4 sm:flex-row"><a href="#kontakt" className="btn-primary text-center">Jetzt wechseln & sparen</a><button type="button" onClick={resetCalculator} className="btn-secondary text-center">Neue Berechnung</button></div>
                <div className="mt-8 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20"><div className="flex items-start gap-3"><Leaf className="mt-0.5 h-6 w-6 shrink-0 text-blue-600" /><div><h4 className="mb-1 font-semibold text-gray-900 dark:text-white">Nachhaltigkeit zählt</h4><p className="text-sm text-gray-600 dark:text-gray-400">Viele unserer Tarife bieten 100% Ökostrom oder klimaneutrales Gas. Fragen Sie uns nach den umweltfreundlichsten Optionen!</p></div></div></div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 text-center md:grid-cols-4">
          <div className="flex flex-col items-center"><CheckCircle className="mb-2 h-8 w-8 text-green-500" /><span className="text-sm text-gray-600 dark:text-gray-400">Kostenlos & unverbindlich</span></div>
          <div className="flex flex-col items-center"><Clock className="mb-2 h-8 w-8 text-blue-500" /><span className="text-sm text-gray-600 dark:text-gray-400">Berechnung in Sekunden</span></div>
          <div className="flex flex-col items-center"><Shield className="mb-2 h-8 w-8 text-purple-500" /><span className="text-sm text-gray-600 dark:text-gray-400">Datenschutz garantiert</span></div>
          <div className="flex flex-col items-center"><TrendingDown className="mb-2 h-8 w-8 text-green-500" /><span className="text-sm text-gray-600 dark:text-gray-400">Bis zu 500€ sparen</span></div>
        </div>
      </div>
    </section>
  );
}
