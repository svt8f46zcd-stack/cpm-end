import { Shield, Award, Heart, Users } from "lucide-react";

const trustItems = [
  {
    icon: Shield,
    title: "100% Unabhängig",
    description: "Wir arbeiten nicht für Energiekonzerne, sondern ausschließlich für Sie.",
  },
  {
    icon: Award,
    title: "Ausgezeichnete Beratung",
    description: "Bewertet mit 4,9/5 Sternen von über 2.000 zufriedenen Kunden.",
  },
  {
    icon: Heart,
    title: "Persönlicher Service",
    description: "Ihr persönlicher Berater begleitet Sie durch den gesamten Prozess.",
  },
  {
    icon: Users,
    title: "Über 10.000 Wechsel",
    description: "Vertrauen Sie auf unsere langjährige Expertise im Energiemarkt.",
  },
];

export default function TrustSection() {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Warum uns über 10.000 Kunden vertrauen
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Transparenz, Kompetenz und echte Ersparnisse – das ist unser Versprechen an Sie.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustItems.map((item, index) => (
            <div key={index} className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <item.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 p-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-accent-500 mb-2">10.000+</div>
            <div className="text-gray-600 dark:text-gray-400">Erfolgreiche Wechsel</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">500€</div>
            <div className="text-gray-600 dark:text-gray-400">Ø Ersparnis pro Jahr</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-green-500 mb-2">4,9/5</div>
            <div className="text-gray-600 dark:text-gray-400">Kundenbewertung</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-purple-500 mb-2">15+</div>
            <div className="text-gray-600 dark:text-gray-400">Jahre Erfahrung</div>
          </div>
        </div>
      </div>
    </section>
  );
}
