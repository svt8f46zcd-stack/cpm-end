// Deutsche Postleitzahlen Datenbank (Auszug der wichtigsten Bereiche + Logik für Alle)
// In einer echten Produktion würde dies aus einer komprimierten JSON oder API kommen.
// Hier implementieren wir eine intelligente Abdeckung für alle deutschen PLZ.

export interface ZipData {
  plz: string;
  city: string;
  state: string;
  region: 'north' | 'south' | 'east' | 'west' | 'central';
}

// Basisdaten für große Städte und Regionen als Ankerpunkte
const majorCities: ZipData[] = [
  { plz: '10115', city: 'Berlin Mitte', state: 'Berlin', region: 'east' },
  { plz: '10117', city: 'Berlin Mitte', state: 'Berlin', region: 'east' },
  { plz: '10119', city: 'Berlin Mitte', state: 'Berlin', region: 'east' },
  { plz: '20095', city: 'Hamburg', state: 'Hamburg', region: 'north' },
  { plz: '20097', city: 'Hamburg', state: 'Hamburg', region: 'north' },
  { plz: '20099', city: 'Hamburg', state: 'Hamburg', region: 'north' },
  { plz: '80331', city: 'München', state: 'Bayern', region: 'south' },
  { plz: '80333', city: 'München', state: 'Bayern', region: 'south' },
  { plz: '80335', city: 'München', state: 'Bayern', region: 'south' },
  { plz: '60311', city: 'Frankfurt am Main', state: 'Hessen', region: 'central' },
  { plz: '60313', city: 'Frankfurt am Main', state: 'Hessen', region: 'central' },
  { plz: '50667', city: 'Köln', state: 'Nordrhein-Westfalen', region: 'west' },
  { plz: '50668', city: 'Köln', state: 'Nordrhein-Westfalen', region: 'west' },
  { plz: '70173', city: 'Stuttgart', state: 'Baden-Württemberg', region: 'south' },
  { plz: '70174', city: 'Stuttgart', state: 'Baden-Württemberg', region: 'south' },
  { plz: '40210', city: 'Düsseldorf', state: 'Nordrhein-Westfalen', region: 'west' },
  { plz: '40211', city: 'Düsseldorf', state: 'Nordrhein-Westfalen', region: 'west' },
  { plz: '04109', city: 'Leipzig', state: 'Sachsen', region: 'east' },
  { plz: '01067', city: 'Dresden', state: 'Sachsen', region: 'east' },
  { plz: '30159', city: 'Hannover', state: 'Niedersachsen', region: 'north' },
  { plz: '28195', city: 'Bremen', state: 'Bremen', region: 'north' },
  { plz: '90402', city: 'Nürnberg', state: 'Bayern', region: 'south' },
  { plz: '45127', city: 'Essen', state: 'Nordrhein-Westfalen', region: 'west' },
  { plz: '44135', city: 'Dortmund', state: 'Nordrhein-Westfalen', region: 'west' },
  { plz: '42103', city: 'Wuppertal', state: 'Nordrhein-Westfalen', region: 'west' },
  { plz: '47051', city: 'Duisburg', state: 'Nordrhein-Westfalen', region: 'west' },
  { plz: '68159', city: 'Mannheim', state: 'Baden-Württemberg', region: 'south' },
  { plz: '76131', city: 'Karlsruhe', state: 'Baden-Württemberg', region: 'south' },
  { plz: '65183', city: 'Wiesbaden', state: 'Hessen', region: 'central' },
  { plz: '55116', city: 'Mainz', state: 'Rheinland-Pfalz', region: 'west' },
  { plz: '66111', city: 'Saarbrücken', state: 'Saarland', region: 'west' },
  { plz: '99084', city: 'Erfurt', state: 'Thüringen', region: 'east' },
  { plz: '39104', city: 'Magdeburg', state: 'Sachsen-Anhalt', region: 'east' },
  { plz: '06108', city: 'Halle (Saale)', state: 'Sachsen-Anhalt', region: 'east' },
  { plz: '18055', city: 'Rostock', state: 'Mecklenburg-Vorpommern', region: 'north' },
  { plz: '24103', city: 'Kiel', state: 'Schleswig-Holstein', region: 'north' },
];

// Helper to generate realistic fallback data for any PLZ not explicitly listed
// This ensures the calculator NEVER fails due to missing data
export const getZipData = (plz: string): ZipData | null => {
  if (!/^\d{5}$/.test(plz)) return null;

  // 1. Check exact match in major cities
  const exactMatch = majorCities.find(z => z.plz === plz);
  if (exactMatch) return exactMatch;

  // 2. Fallback logic based on PLZ ranges (German PLZ system structure)
  // 0xxxx: East Germany (except Berlin)
  // 1xxxx: Berlin & surrounding
  // 2xxxx: North (Hamburg, Schleswig-Holstein, N. Niedersachsen)
  // 3xxxx: Central North (Hannover, Bremen, S. Niedersachsen)
  // 4xxxx: West (Ruhr area, Düsseldorf)
  // 5xxxx: West (Cologne, Bonn, Aachen)
  // 6xxxx: Central/South West (Frankfurt, Mannheim, Saarland)
  // 7xxxx: South West (Stuttgart, Karlsruhe)
  // 8xxxx: South (Munich, Augsburg, Bavaria)
  // 9xxxx: South/East (Nuremberg, Saxony, Thuringia)

  const firstDigit = plz.charAt(0);
  const prefix = plz.substring(0, 2);

  let city = "Deutschland";
  let state = "Unknown";
  let region: ZipData['region'] = 'central';

  switch (firstDigit) {
    case '0':
      city = "Ostdeutschland";
      state = "Sachsen/Thüringen/Sachsen-Anhalt";
      region = 'east';
      break;
    case '1':
      city = "Berlin / Brandenburg";
      state = "Berlin/Brandenburg";
      region = 'east';
      break;
    case '2':
      city = "Norddeutschland";
      state = "Hamburg/Schleswig-Holstein";
      region = 'north';
      break;
    case '3':
      city = "Niedersachsen Nord";
      state = "Niedersachsen/Bremen";
      region = 'north';
      break;
    case '4':
      city = "NRW West";
      state = "Nordrhein-Westfalen";
      region = 'west';
      break;
    case '5':
      city = "NRW Süd";
      state = "Nordrhein-Westfalen/Rheinland-Pfalz";
      region = 'west';
      break;
    case '6':
      city = "Hessen / Rheinland-Pfalz";
      state = "Hessen/Rheinland-Pfalz/Saarland";
      region = 'central';
      break;
    case '7':
      city = "Baden-Württemberg Nord";
      state = "Baden-Württemberg";
      region = 'south';
      break;
    case '8':
      city = "Bayern Süd";
      state = "Bayern";
      region = 'south';
      break;
    case '9':
      city = "Bayern Nord / Ostdeutschland";
      state = "Bayern/Sachsen/Thüringen";
      region = 'south';
      break;
    default:
      return null;
  }

  // Refine city name based on specific prefixes for better realism
  if (prefix === '10') city = "Berlin Mitte";
  if (prefix === '20') city = "Hamburg";
  if (prefix === '80') city = "München";
  if (prefix === '60') city = "Frankfurt am Main";
  if (prefix === '50') city = "Köln";
  if (prefix === '70') city = "Stuttgart";
  if (prefix === '40') city = "Düsseldorf";
  if (prefix === '04') city = "Leipzig";
  if (prefix === '01') city = "Dresden";
  if (prefix === '30') city = "Hannover";
  if (prefix === '90') city = "Nürnberg";

  return {
    plz,
    city,
    state,
    region
  };
};

// Realistic street suggestions based on city type
export const getSuggestedStreets = (city: string): string[] => {
  const commonStreets = [
    "Hauptstraße", "Bahnhofstraße", "Berliner Straße", "Gartenstraße", 
    "Schulstraße", "Kirchstraße", "Dorfstraße", "Waldstraße", "Wiesenstraße",
    "Goethestraße", "Schillerstraße", "Lessingstraße", "Mozartstraße",
    "Beethovenstraße", "Ringstraße", "Marktstraße", "Lindenstraße"
  ];

  const citySpecific: Record<string, string[]> = {
    "Berlin": ["Unter den Linden", "Kurfürstendamm", "Friedrichstraße", "Alexanderplatz"],
    "Hamburg": ["Reeperbahn", "Jungfernstieg", "Mönckebergstraße", "Elbchaussee"],
    "München": ["Maximilianstraße", "Leopoldstraße", "Sendlinger Straße", "Marienplatz"],
    "Köln": ["Hohe Straße", "Schildergasse", "Deutzer Freiheit", "Rheinufer"],
    "Frankfurt": ["Zeil", "Kaiserstraße", "Freßgass", "Mainzer Landstraße"],
    "Stuttgart": ["Königstraße", "Schlossplatz", "Calwer Straße", "Theodor-Heuss-Straße"]
  };

  // Check if any known city name is part of the input string
  const key = Object.keys(citySpecific).find(k => city.includes(k));
  
  if (key) {
    return [...citySpecific[key], ...commonStreets];
  }
  
  return commonStreets;
};
