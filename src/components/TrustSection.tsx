import { Shield, Award, Heart, Users } from "lucide-react";

const trustItems = [
  { icon: Shield, title: "Transparent beraten", description: "Nachvollziehbare Informationen statt Druck oder versteckter Versprechen." },
  { icon: Heart, title: "Persönlich erreichbar", description: "Hinter CPM Energie steht ein konkreter Ansprechpartner, nicht nur ein anonymes Formular." },
  { icon: Award, title: "Individuell prüfen", description: "Wir schauen auf deinen aktuellen Tarif und deine Situation, bevor wir eine Alternative empfehlen." },
  { icon: Users, title: "Daten bewusst behandeln", description: "Wir fragen nur Informationen ab, die für die Tarifprüfung und Kontaktaufnahme erforderlich sind." },
];

export default function TrustSection() {
  return (
    <section id="vertrauen" className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-full border border-accent-200 dark:border-accent-800 bg-accent-50 dark:bg-accent-950/40 px-4 py-2 text-sm font-semibold text-accent-700 dark:text-accent-300 mb-5">Persönlich statt anonym</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Vertrauen entsteht nicht durch große Versprechen.</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Du bekommst eine persönliche, nachvollziehbare Beratung und musst nichts sofort entscheiden. Wir prüfen zuerst deine Situation.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item) => (
            <div key={item.title} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/60 p-6">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent-500 to-primary-600 flex items-center justify-center shadow-md mb-4"><item.icon className="w-5 h-5 text-white" /></div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-accent-100 dark:border-accent-900/50 bg-accent-50/70 dark:bg-accent-950/20 p-6 text-center">
          <p className="font-semibold text-gray-900 dark:text-white">Kein Tarifwechsel um jeden Preis.</p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Wenn dein bestehender Tarif bereits sinnvoll ist, sagen wir dir das genauso.</p>
        </div>
      </div>
    </section>
  );
}
