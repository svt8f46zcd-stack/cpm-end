import { Search, TrendingUp, Wallet } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "Schritt 1",
    title: "Tarif-Check",
    description: "Wir analysieren Ihren aktuellen Strom- und Gasverbrauch und vergleichen alle verfügbaren Tarife in Ihrer Region.",
  },
  {
    icon: TrendingUp,
    step: "Schritt 2",
    title: "Optimierung",
    description: "Wir finden das beste Angebot für Sie und übernehmen die komplette Abwicklung des Wechsels – schnell und unkompliziert.",
  },
  {
    icon: Wallet,
    step: "Schritt 3",
    title: "Sparen",
    description: "Sie erhalten automatisch den günstigeren Tarif und sparen ab dem ersten Monat – ohne selbst aktiv werden zu müssen.",
  },
];

export default function Process() {
  return (
    <section id="ablauf" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            So einfach funktioniert&apos;s
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            In nur 3 Schritten zu niedrigeren Energiekosten. 
            Ganz ohne Papierkram und Stress.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection Line - Desktop only */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-accent-500 via-primary-500 to-green-500 z-0"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="relative z-10">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                {/* Step Number Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-semibold text-accent-500 uppercase tracking-wide">
                    {step.step}
                  </span>
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-primary-600 rounded-full flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <a
            href="#kontakt"
            className="inline-flex items-center space-x-2 btn-primary text-lg"
          >
            <span>Jetzt kostenlos prüfen lassen</span>
          </a>
        </div>
      </div>
    </section>
  );
}
