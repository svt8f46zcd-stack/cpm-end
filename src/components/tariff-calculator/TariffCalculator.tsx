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
  ChevronDown,
  X,
  Euro,
  Leaf,
  Clock,
  TrendingDown,
  Shield,
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
  formatNumber,
} from "@/lib/tariff-api";

interface TariffCalculatorProps {
  compact?: boolean;
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
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<TariffResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [streetSuggestions, setStreetSuggestions] = useState<string[]>([]);
  const [providerSuggestions, setProviderSuggestions] = useState<ProviderSuggestion[]>([]);
  const [showStreetDropdown, setShowStreetDropdown] = useState(false);
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const streetInputRef = useRef<HTMLInputElement>(null);
  const providerInputRef = useRef<HTMLInputElement>(null);

  // Debounced street suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.postalCode && validatePostalCode(formData.postalCode) && formData.street && formData.street.length > 0) {
        try {
          const suggestions = await getStreetSuggestions(formData.postalCode, formData.street);
          setStreetSuggestions(suggestions);
          setShowStreetDropdown(suggestions.length > 0);
        } catch (error) {
          console.error("Error fetching street suggestions:", error);
        }
      } else {
        setStreetSuggestions([]);
        setShowStreetDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [formData.postalCode, formData.street]);

  // Debounced provider suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.currentProvider && formData.currentProvider.length >= 2) {
        try {
          const type = formData.tariffType === "both" ? undefined : (formData.tariffType as "strom" | "gas");
          const suggestions = await getProviderSuggestions(formData.currentProvider, type);
          setProviderSuggestions(suggestions);
          setShowProviderDropdown(suggestions.length > 0);
        } catch (error) {
          console.error("Error fetching provider suggestions:", error);
        }
      } else {
        setProviderSuggestions([]);
        setShowProviderDropdown(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [formData.currentProvider, formData.tariffType]);

  // Auto-detect city when postal code changes
  useEffect(() => {
    const autoDetectCity = async () => {
      if (formData.postalCode && validatePostalCode(formData.postalCode)) {
        try {
          const addressData = await getAddressByPostalCode(formData.postalCode);
          if (addressData) {
            setFormData((prev) => ({ ...prev, city: addressData.city }));
            
            // Try to detect provider based on location
            const detectedProvider = await detectProviderByLocation(formData.postalCode);
            if (detectedProvider && !formData.currentProvider) {
              setFormData((prev) => ({ ...prev, currentProvider: detectedProvider.name }));
            }
          }
        } catch (error) {
          console.error("Error detecting city:", error);
        }
      }
    };

    autoDetectCity();
  }, [formData.postalCode]);

  // Auto-calculate consumption based on household size
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
      
      // Clear error for this field when user starts typing
      if (errors.some((e) => e.field === field)) {
        setErrors((prev) => prev.filter((e) => e.field !== field));
      }
    },
    [errors]
  );

  const handleFieldBlur = useCallback((field: string) => {
    setTouchedFields((prev) => new Set(prev).add(field));
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
      newErrors.push({
        code: "MISSING_CUSTOMER_TYPE",
        message: "Bitte wählen Sie einen Kundentyp aus.",
        field: "customerType",
      });
    }

    if (!formData.tariffType) {
      newErrors.push({
        code: "MISSING_TARIFF_TYPE",
        message: "Bitte wählen Sie eine Tarifart aus.",
        field: "tariffType",
      });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = errors[0]?.field;
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsCalculating(true);
    setShowResults(false);

    try {
      const tariffResults = await calculateTariffs(formData);
      setResults(tariffResults);
      setShowResults(true);
    } catch (error) {
      setErrors([
        {
          code: "CALCULATION_ERROR",
          message: "Bei der Berechnung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
        },
      ]);
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
  };

  const getFieldError = (field: string): string | undefined => {
    if (!touchedFields.has(field)) return undefined;
    return errors.find((e) => e.field === field)?.message;
  };

  if (compact) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Kostenlose Tarifprüfung
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Füllen Sie das Formular aus und wir melden uns innerhalb von 24 Stunden.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Postleitzahl *
            </label>
            <input
              type="text"
              required
              pattern="[0-9]{5}"
              maxLength={5}
              value={formData.postalCode}
              onChange={(e) => handleFieldChange("postalCode", e.target.value.replace(/\D/g, ""))}
              onBlur={() => handleFieldBlur("postalCode")}
              className={`w-full px-4 py-3 border ${getFieldError("postalCode") ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors`}
              placeholder="12345"
            />
            {getFieldError("postalCode") && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {getFieldError("postalCode")}
              </p>
            )}
          </div>
          <button type="submit" className="w-full btn-primary" disabled={isCalculating}>
            {isCalculating ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Wird berechnet...
              </span>
            ) : (
              "Kostenlos prüfen lassen"
            )}
          </button>
        </form>
      </div>
    );
  }

  return (
    <section id="tarifrechner" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Live Tarifrechner
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Berechnen Sie Ihr Einsparpotenzial in wenigen Sekunden. 
            Unsere intelligenten Felder füllen sich automatisch aus.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Progress indicator */}
          {!showResults && (
            <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Schritt 1 von 2: Ihre Daten
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-accent-500 rounded-full"></div>
                  </div>
                  <span className="text-accent-500 font-semibold">50%</span>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 md:p-8">
            {!showResults ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Postal Code */}
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Postleitzahl *
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      maxLength={5}
                      value={formData.postalCode}
                      onChange={(e) => handleFieldChange("postalCode", e.target.value.replace(/\D/g, ""))}
                      onBlur={() => handleFieldBlur("postalCode")}
                      className={`w-full px-4 py-3 border ${getFieldError("postalCode") ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors`}
                      placeholder="12345"
                    />
                    {getFieldError("postalCode") && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {getFieldError("postalCode")}
                      </p>
                    )}
                    {formData.city && (
                      <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {formData.city}
                      </p>
                    )}
                  </div>

                  {/* Street */}
                  <div className="relative">
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Home className="w-4 h-4 inline mr-1" />
                      Straße
                    </label>
                    <input
                      ref={streetInputRef}
                      type="text"
                      id="street"
                      value={formData.street}
                      onChange={(e) => handleFieldChange("street", e.target.value)}
                      onFocus={() => formData.postalCode && validatePostalCode(formData.postalCode) && setShowStreetDropdown(true)}
                      onBlur={() => setTimeout(() => setShowStreetDropdown(false), 200)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                      placeholder="Automatische Vervollständigung"
                    />
                    {showStreetDropdown && streetSuggestions.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {streetSuggestions.map((street, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => selectStreet(street)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                          >
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {street}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* House Number */}
                  <div>
                    <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Hausnummer
                    </label>
                    <input
                      type="text"
                      id="houseNumber"
                      value={formData.houseNumber}
                      onChange={(e) => handleFieldChange("houseNumber", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                      placeholder="12a"
                    />
                  </div>

                  {/* City (auto-filled) */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ort
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={formData.city || ""}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                      placeholder="Wird automatisch ausgefüllt"
                    />
                  </div>
                </div>

                {/* Customer Type & Tariff Type */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Customer Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      Kundentyp *
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleFieldChange("customerType", "private")}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                          formData.customerType === "private"
                            ? "border-accent-500 bg-accent-50 dark:bg-accent-900/20 text-accent-600"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <Users className="w-5 h-5" />
                        <span>Privat</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFieldChange("customerType", "business")}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                          formData.customerType === "business"
                            ? "border-accent-500 bg-accent-50 dark:bg-accent-900/20 text-accent-600"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <Building2 className="w-5 h-5" />
                        <span>Gewerbe</span>
                      </button>
                    </div>
                  </div>

                  {/* Tariff Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Zap className="w-4 h-4 inline mr-1" />
                      Tarifart *
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleFieldChange("tariffType", "strom")}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                          formData.tariffType === "strom"
                            ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <Zap className="w-5 h-5" />
                        <span>Strom</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFieldChange("tariffType", "gas")}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                          formData.tariffType === "gas"
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <Flame className="w-5 h-5" />
                        <span>Gas</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFieldChange("tariffType", "both")}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                          formData.tariffType === "both"
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <Euro className="w-5 h-5" />
                        <span>Kombi</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Household Size & Consumption */}
                {formData.customerType === "private" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Users className="w-4 h-4 inline mr-1" />
                        Personen im Haushalt
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={formData.householdSize}
                          onChange={(e) => handleFieldChange("householdSize", parseInt(e.target.value))}
                          className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent-500"
                        />
                        <span className="text-2xl font-bold text-gray-900 dark:text-white w-12 text-center">
                          {formData.householdSize}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Consumption Inputs */}
                <div className="grid md:grid-cols-2 gap-6">
                  {(formData.tariffType === "strom" || formData.tariffType === "both") && (
                    <div>
                      <label htmlFor="consumptionStrom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <Zap className="w-4 h-4 inline mr-1" />
                        Jahresverbrauch Strom (kWh)
                      </label>
                      <input
                        type="number"
                        id="consumptionStrom"
                        value={formData.consumptionStrom || ""}
                        onChange={(e) => handleFieldChange("consumptionStrom", parseInt(e.target.value) || undefined)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="Auto-berechnet"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Basierend auf {formData.householdSize} Personen
                      </p>
                    </div>
                  )}

                  {(formData.tariffType === "gas" || formData.tariffType === "both") && (
                    <div>
                      <label htmlFor="consumptionGas" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <Flame className="w-4 h-4 inline mr-1" />
                        Jahresverbrauch Gas (kWh)
                      </label>
                      <input
                        type="number"
                        id="consumptionGas"
                        value={formData.consumptionGas || ""}
                        onChange={(e) => handleFieldChange("consumptionGas", parseInt(e.target.value) || undefined)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="Auto-berechnet"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Basierend auf {formData.householdSize} Personen
                      </p>
                    </div>
                  )}
                </div>

                {/* Current Provider */}
                <div className="relative">
                  <label htmlFor="currentProvider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Search className="w-4 h-4 inline mr-1" />
                    Aktueller Energieversorger
                  </label>
                  <div className="relative">
                    <input
                      ref={providerInputRef}
                      type="text"
                      id="currentProvider"
                      value={formData.currentProvider}
                      onChange={(e) => handleFieldChange("currentProvider", e.target.value)}
                      onFocus={() => setShowProviderDropdown(true)}
                      onBlur={() => setTimeout(() => setShowProviderDropdown(false), 200)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors pr-10"
                      placeholder="z.B. Stadtwerke München, E.ON"
                    />
                    {formData.currentProvider && (
                      <button
                        type="button"
                        onClick={() => handleFieldChange("currentProvider", "")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  {showProviderDropdown && providerSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                      {providerSuggestions.map((provider) => (
                        <button
                          key={provider.id}
                          type="button"
                          onClick={() => selectProvider(provider.name)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                        >
                          {provider.type === "strom" && <Zap className="w-4 h-4 text-yellow-500" />}
                          {provider.type === "gas" && <Flame className="w-4 h-4 text-blue-500" />}
                          {provider.type === "both" && <Euro className="w-4 h-4 text-green-500" />}
                          {provider.name}
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Optional – hilft bei der besseren Beratung
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isCalculating}
                  className="w-full btn-primary text-lg py-4 flex items-center justify-center gap-2"
                >
                  {isCalculating ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Berechne beste Tarife...</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-6 h-6" />
                      <span>Jetzt Einsparpotenzial berechnen</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  🔒 Ihre Daten sind sicher. Wir geben keine Informationen an Dritte weiter.
                </p>
              </form>
            ) : (
              /* Results Section */
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Ihre persönlichen Ersparnisse
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Basierend auf Ihren Angaben für {formData.city || formData.postalCode}
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  {results.slice(0, 3).map((result, index) => (
                    <div
                      key={result.tariff.id}
                      className={`relative rounded-xl p-6 border-2 transition-all ${
                        index === 0
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                      }`}
                    >
                      {index === 0 && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Bester Tarif
                        </div>
                      )}
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{result.tariff.provider}</p>
                        <p className="font-semibold text-gray-900 dark:text-white mb-3">{result.tariff.name}</p>
                        <div className="text-3xl font-bold text-green-600 mb-1">
                          {formatCurrency(result.savings)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Ersparnis pro Jahr</p>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(result.monthlyCost)}<span className="text-sm text-gray-500">/Monat</span>
                        </div>
                      </div>
                      <ul className="mt-4 space-y-2">
                        {result.features.map((feature, i) => (
                          <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="#kontakt" className="btn-primary text-center">
                    Jetzt wechseln & sparen
                  </a>
                  <button
                    type="button"
                    onClick={resetCalculator}
                    className="btn-secondary text-center"
                  >
                    Neue Berechnung
                  </button>
                </div>

                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Leaf className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Nachhaltigkeit zählt
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Viele unserer Tarife bieten 100% Ökostrom oder klimaneutrales Gas. 
                        Fragen Sie uns nach den umweltfreundlichsten Optionen!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center">
            <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Kostenlos & unverbindlich</span>
          </div>
          <div className="flex flex-col items-center">
            <Clock className="w-8 h-8 text-blue-500 mb-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Berechnung in Sekunden</span>
          </div>
          <div className="flex flex-col items-center">
            <Shield className="w-8 h-8 text-purple-500 mb-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Datenschutz garantiert</span>
          </div>
          <div className="flex flex-col items-center">
            <TrendingDown className="w-8 h-8 text-green-500 mb-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Bis zu 500€ sparen</span>
          </div>
        </div>
      </div>
    </section>
  );
}
