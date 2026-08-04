// Types for the tariff calculator API
export interface AddressData {
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  state?: string;
}

export interface TariffData {
  id: string;
  name: string;
  provider: string;
  type: 'strom' | 'gas';
  basePrice: number;
  workingPrice: number;
  contractDuration: number;
  cancellationPeriod: number;
  bonus?: number;
  co2Emissions?: number;
  greenEnergy: boolean;
}

export interface CalculatorFormData {
  postalCode: string;
  street?: string;
  houseNumber?: string;
  city?: string;
  consumptionStrom?: number;
  consumptionGas?: number;
  currentProvider?: string;
  customerType: 'private' | 'business';
  tariffType: 'strom' | 'gas' | 'both';
  email?: string;
  phone?: string;
  name?: string;
}

export interface ProviderSuggestion {
  id: string;
  name: string;
  type: 'strom' | 'gas' | 'both';
}

export interface TariffResult {
  tariff: TariffData;
  annualCost: number;
  savings: number;
  monthlyCost: number;
  features: string[];
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
}

export interface AddressAutocompleteResponse {
  suggestions: Array<{
    address: AddressData;
    score: number;
  }>;
}
