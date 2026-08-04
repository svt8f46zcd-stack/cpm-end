import { Shield, MapPin, Clock, Zap, Euro, FileCheck } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Unabhängige Beratung",
    description: "Wir arbeiten nicht für Energiekonzerne, sondern ausschließlich für Sie. Unsere Empfehlungen basieren auf objektiven Vergleichen.",
  },
  {
    icon: MapPin,
    title: "Regionale Expertise",
    description: "Als deutscher Anbieter kennen wir den Markt und die regionalen Besonderheiten. Wir finden den besten Tarif für Ihre Region.",
  },
  {
    icon: Clock,
    title: "Null Aufwand beim Wechsel",
    description: "Wir übernehmen die gesamte Abwicklung. Von der Kündigung bis zur Anmeldung – Sie müssen nichts tun außer sparen.",
  },
];

export default function Features() {
  return (
    <section id="vorteile" className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Warum cpm-energie.de?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Wir machen Energie einfach, transparent und günstig. 
            Vertrauen Sie auf unsere Expertise.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-14 h-14 bg-accent-500/10 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-accent-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl">
            <Zap className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white">500€</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">durchschnittliche Ersparnis</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/20 dark:to-accent-800/20 rounded-xl">
            <Euro className="w-8 h-8 text-accent-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white">0€</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Beratungskosten</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
            <FileCheck className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white">100%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">unabhängig</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white">24h</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Rückmeldung</div>
          </div>
        </div>
      </div>
    </section>
  );
}
