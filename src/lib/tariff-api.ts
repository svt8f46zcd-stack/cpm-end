/**
 * German Energy Tariff Calculator API Service
 * 
 * This service provides mock implementations for the tariff calculator.
 * In production, these would be replaced with actual API calls to energy comparison APIs.
 * 
 * Note: Real energy tariff APIs in Germany require business partnerships and API keys.
 * Common providers include:
 * - Verivox API
 * - Check24 Partner API  
 * - Framo Energie API
 * - Tarifcheck API
 * 
 * For this implementation, we provide realistic mock data and simulation logic.
 */

import type {
  AddressData,
  TariffData,
  CalculatorFormData,
  ProviderSuggestion,
  TariffResult,
  ApiError,
} from '@/types';

// Mock data for German cities by postal code
const POSTAL_CODE_DATA: Record<string, { city: string; state: string }> = {
  '10115': { city: 'Berlin', state: 'Berlin' },
  '10117': { city: 'Berlin', state: 'Berlin' },
  '10119': { city: 'Berlin', state: 'Berlin' },
  '20095': { city: 'Hamburg', state: 'Hamburg' },
  '20097': { city: 'Hamburg', state: 'Hamburg' },
  '80331': { city: 'München', state: 'Bayern' },
  '80333': { city: 'München', state: 'Bayern' },
  '50667': { city: 'Köln', state: 'Nordrhein-Westfalen' },
  '50668': { city: 'Köln', state: 'Nordrhein-Westfalen' },
  '60311': { city: 'Frankfurt am Main', state: 'Hessen' },
  '60313': { city: 'Frankfurt am Main', state: 'Hessen' },
  '70173': { city: 'Stuttgart', state: 'Baden-Württemberg' },
  '70174': { city: 'Stuttgart', state: 'Baden-Württemberg' },
};

// Mock streets for autocomplete
const STREETS_BY_POSTAL: Record<string, string[]> = {
  '10115': ['Friedrichstraße', 'Unter den Linden', 'Oranienburger Straße', 'Chausseestraße'],
  '10117': ['Wilhelmstraße', 'Voßstraße', 'Behrenstraße', 'Pariser Platz'],
  '20095': ['Mönckebergstraße', 'Spitalerstraße', 'Steindamm', 'Kirchenallee'],
  '80331': ['Marienplatz', 'Kaufingerstraße', 'Neuhauser Straße', 'Sendlinger Straße'],
  '50667': ['Hohe Straße', 'Schildergasse', 'Breite Straße', 'Rudolfplatz'],
  '60311': ['Zeil', 'Kaiserstraße', 'Berger Straße', 'Schweizer Straße'],
  '70173': ['Königstraße', 'Schlossplatz', 'Calwer Straße', 'Theodor-Heuss-Straße'],
};

// Mock energy providers in Germany
const PROVIDERS: ProviderSuggestion[] = [
  { id: '1', name: 'Stadtwerke München', type: 'both' },
  { id: '2', name: 'E.ON', type: 'both' },
  { id: '3', name: 'Vattenfall', type: 'both' },
  { id: '4', name: 'EnBW', type: 'both' },
  { id: '5', name: 'RWE', type: 'both' },
  { id: '6', name: 'Shell Energy', type: 'both' },
  { id: '7', name: 'Naturstrom AG', type: 'strom' },
  { id: '8', name: 'Greenpeace Energy', type: 'both' },
  { id: '9', name: 'Lichtblick', type: 'both' },
  { id: '10', name: 'Otto Energy', type: 'both' },
  { id: '11', name: 'Yello Strom', type: 'strom' },
  { id: '12', name: 'GASAG', type: 'gas' },
  { id: '13', name: 'Mainova', type: 'both' },
  { id: '14', name: 'Thüga', type: 'both' },
  { id: '15', name: 'Trianel', type: 'both' },
];

// Mock tariff data
const TARIFFS: TariffData[] = [
  {
    id: 't1',
    name: 'Basis Strom',
    provider: 'Stadtwerke München',
    type: 'strom',
    basePrice: 120,
    workingPrice: 0.32,
    contractDuration: 12,
    cancellationPeriod: 4,
    greenEnergy: false,
  },
  {
    id: 't2',
    name: 'Öko Strom Plus',
    provider: 'Naturstrom AG',
    type: 'strom',
    basePrice: 145,
    workingPrice: 0.35,
    contractDuration: 12,
    cancellationPeriod: 4,
    bonus: 50,
    co2Emissions: 0,
    greenEnergy: true,
  },
  {
    id: 't3',
    name: 'Smart Gas',
    provider: 'E.ON',
    type: 'gas',
    basePrice: 95,
    workingPrice: 0.12,
    contractDuration: 24,
    cancellationPeriod: 6,
    greenEnergy: false,
  },
  {
    id: 't4',
    name: 'Klima Gas Bio',
    provider: 'Greenpeace Energy',
    type: 'gas',
    basePrice: 110,
    workingPrice: 0.14,
    contractDuration: 12,
    cancellationPeriod: 4,
    bonus: 30,
    greenEnergy: true,
  },
  {
    id: 't5',
    name: 'Komfort Strom',
    provider: 'Vattenfall',
    type: 'strom',
    basePrice: 135,
    workingPrice: 0.33,
    contractDuration: 12,
    cancellationPeriod: 3,
    bonus: 75,
    greenEnergy: false,
  },
  {
    id: 't6',
    name: 'Easy Gas',
    provider: 'Shell Energy',
    type: 'gas',
    basePrice: 88,
    workingPrice: 0.115,
    contractDuration: 12,
    cancellationPeriod: 4,
    greenEnergy: false,
  },
];

/**
 * Validate German postal code format
 */
export function validatePostalCode(postalCode: string): boolean {
  const regex = /^\d{5}$/;
  return regex.test(postalCode);
}

/**
 * Get city and state by postal code (simulates API call)
 */
export async function getAddressByPostalCode(
  postalCode: string
): Promise<{ city: string; state: string } | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  
  if (!validatePostalCode(postalCode)) {
    return null;
  }
  
  return POSTAL_CODE_DATA[postalCode] || null;
}

/**
 * Get street suggestions based on postal code (simulates autocomplete API)
 */
export async function getStreetSuggestions(
  postalCode: string,
  query?: string
): Promise<string[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 150));
  
  if (!validatePostalCode(postalCode)) {
    return [];
  }
  
  const streets = STREETS_BY_POSTAL[postalCode] || [];
  
  if (query) {
    return streets.filter((street) =>
      street.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  return streets;
}

/**
 * Get provider suggestions based on search query
 */
export async function getProviderSuggestions(
  query: string,
  type?: 'strom' | 'gas' | 'both'
): Promise<ProviderSuggestion[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  if (!query.trim()) {
    return [];
  }
  
  let results = PROVIDERS.filter((provider) =>
    provider.name.toLowerCase().includes(query.toLowerCase())
  );
  
  if (type && type !== 'both') {
    results = results.filter(
      (p) => p.type === type || p.type === 'both'
    );
  }
  
  return results.slice(0, 8);
}

/**
 * Calculate annual costs based on consumption and tariff
 */
export function calculateAnnualCost(
  consumption: number,
  tariff: TariffData
): number {
  return tariff.basePrice + consumption * tariff.workingPrice - (tariff.bonus || 0);
}

/**
 * Get estimated consumption based on household size/type
 */
export function getEstimatedConsumption(
  customerType: 'private' | 'business',
  tariffType: 'strom' | 'gas',
  householdSize?: number
): number {
  if (customerType === 'business') {
    return tariffType === 'strom' ? 3500 : 15000;
  }
  
  const size = householdSize || 2;
  
  if (tariffType === 'strom') {
    // Average German household consumption
    const baseConsumption = 1500;
    return baseConsumption + (size - 1) * 500;
  } else {
    // Average gas consumption for heating
    const baseConsumption = 8000;
    return baseConsumption + (size - 1) * 2000;
  }
}

/**
 * Calculate and compare tariffs based on form data
 */
export async function calculateTariffs(
  formData: CalculatorFormData
): Promise<TariffResult[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const results: TariffResult[] = [];
  const relevantTariffs = TARIFFS.filter(
    (t) => formData.tariffType === 'both' || t.type === formData.tariffType
  );
  
  const stromConsumption = formData.consumptionStrom || getEstimatedConsumption(formData.customerType, 'strom');
  const gasConsumption = formData.consumptionGas || getEstimatedConsumption(formData.customerType, 'gas');
  
  for (const tariff of relevantTariffs) {
    const consumption = tariff.type === 'strom' ? stromConsumption : gasConsumption;
    const annualCost = calculateAnnualCost(consumption, tariff);
    
    // Calculate savings compared to average market price
    const avgMarketPrice = tariff.type === 'strom' ? 1200 : 1500;
    const savings = Math.max(0, avgMarketPrice - annualCost);
    
    const features: string[] = [];
    if (tariff.greenEnergy) features.push('100% Ökostrom / Klimaneutrales Gas');
    if (tariff.bonus) features.push(`${tariff.bonus}€ Neukundenbonus`);
    if (tariff.contractDuration <= 12) features.push('Kurze Vertragslaufzeit');
    if (tariff.cancellationPeriod <= 4) features.push('Schnell kündbar');
    if (tariff.co2Emissions === 0) features.push('CO₂-neutral');
    
    results.push({
      tariff,
      annualCost: Math.round(annualCost),
      savings: Math.round(savings),
      monthlyCost: Math.round(annualCost / 12),
      features,
    });
  }
  
  // Sort by savings (best deal first)
  return results.sort((a, b) => b.savings - a.savings);
}

/**
 * Simulate auto-detection of current provider based on location
 * In reality, this would require access to grid operator databases
 */
export async function detectProviderByLocation(
  postalCode: string
): Promise<ProviderSuggestion | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // This is a simplified simulation
  // Real implementation would need grid operator lookup
  const defaultProviders: Record<string, string> = {
    '10115': 'Vattenfall',
    '20095': 'Hamburg Energie',
    '80331': 'Stadtwerke München',
    '50667': 'RheinEnergie',
    '60311': 'Mainova',
    '70173': 'EnBW',
  };
  
  const providerName = defaultProviders[postalCode];
  if (providerName) {
    return PROVIDERS.find((p) => p.name === providerName) || null;
  }
  
  return null;
}

/**
 * Validate form data
 */
export function validateFormData(
  formData: CalculatorFormData
): ApiError[] {
  const errors: ApiError[] = [];
  
  if (!formData.postalCode || !validatePostalCode(formData.postalCode)) {
    errors.push({
      code: 'INVALID_POSTAL_CODE',
      message: 'Bitte geben Sie eine gültige 5-stellige Postleitzahl ein.',
      field: 'postalCode',
    });
  }
  
  if (!formData.customerType) {
    errors.push({
      code: 'MISSING_CUSTOMER_TYPE',
      message: 'Bitte wählen Sie einen Kundentyp aus.',
      field: 'customerType',
    });
  }
  
  if (!formData.tariffType) {
    errors.push({
      code: 'MISSING_TARIFF_TYPE',
      message: 'Bitte wählen Sie eine Tarifart aus.',
      field: 'tariffType',
    });
  }
  
  return errors;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('de-DE').format(num);
}
