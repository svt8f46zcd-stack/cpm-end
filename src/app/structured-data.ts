export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "CPM Energie",
  description: "Unabhängige Energieberatung für Strom und Gas in Deutschland",
  url: "https://cpm-energie.de",
  telephone: "+4930123456789",
  email: "info@cpm-energie.de",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Musterstraße 123",
    addressLocality: "Berlin",
    postalCode: "10115",
    addressCountry: "DE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 52.52,
    longitude: 13.405,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  priceRange: "€",
  sameAs: [
    "https://www.facebook.com/cpmenergie",
    "https://www.linkedin.com/company/cpmenergie",
  ],
  areaServed: {
    "@type": "Country",
    name: "Deutschland",
  },
  serviceType: ["Energieberatung", "Stromtarifvergleich", "Gastarifvergleich"],
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Wie funktioniert die kostenlose Tarifprüfung?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sie geben Ihre Verbrauchsdaten ein, und wir vergleichen alle verfügbaren Tarife in Ihrer Region. Innerhalb von 24 Stunden melden wir uns mit einem persönlichen Angebot bei Ihnen – komplett kostenlos und unverbindlich.",
      },
    },
    {
      "@type": "Question",
      name: "Was kostet mich die Beratung?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Unsere Beratung ist für Sie als Endkunde vollständig kostenlos. Wir werden über eine Provision der Energieversorger vergütet, wenn Sie sich für einen Tarif entscheiden.",
      },
    },
  ],
};
