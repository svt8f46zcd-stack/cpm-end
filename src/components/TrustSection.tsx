import { ShieldCheck, HeartHandshake, UserRoundCheck, LockKeyhole } from "lucide-react";

const portrait = "data:image/webp;base64,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";

const trustItems = [
  { icon: ShieldCheck, title: "Transparent beraten", description: "Du bekommst nachvollziehbare Informationen statt Druck oder versteckter Versprechen." },
  { icon: HeartHandshake, title: "Persönlich erreichbar", description: "Hinter CPM Energie steht ein konkreter Ansprechpartner, nicht nur ein anonymes Formular." },
  { icon: UserRoundCheck, title: "Individuell prüfen", description: "Wir schauen auf deinen aktuellen Tarif und deine Situation, bevor wir eine Alternative empfehlen." },
  { icon: LockKeyhole, title: "Daten bewusst behandeln", description: "Wir fragen nur Informationen ab, die für die Tarifprüfung und Kontaktaufnahme erforderlich sind." },
];

export default function TrustSection() {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-center">
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-accent-400/25 to-primary-600/20 blur-xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 shadow-2xl">
                <img src={portrait} alt="Cristiano Moreira, persönlicher Ansprechpartner von CPM Energie" className="block w-[280px] sm:w-[320px] h-auto object-cover" loading="lazy" />
              </div>
              <div className="absolute -bottom-5 left-5 right-5 rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur border border-gray-200 dark:border-gray-700 shadow-xl px-5 py-4">
                <p className="text-xs uppercase tracking-wider font-semibold text-accent-600 dark:text-accent-400">Ihr persönlicher Ansprechpartner</p>
                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">Cristiano Moreira</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">CPM Energie</p>
              </div>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center rounded-full border border-accent-200 dark:border-accent-800 bg-accent-50 dark:bg-accent-950/40 px-4 py-2 text-sm font-semibold text-accent-700 dark:text-accent-300">
              Persönlich statt anonym
            </div>
            <h2 className="mt-5 text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Vertrauen entsteht nicht durch große Versprechen.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              Deshalb zeigen wir dir direkt, wer hinter der Beratung steht. Du musst nichts sofort entscheiden. Wir prüfen zuerst deine Situation und erklären dir verständlich, ob ein Wechsel für dich sinnvoll sein kann.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-5">
              {trustItems.map((item) => (
                <div key={item.title} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/60 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 dark:bg-accent-950/50 text-accent-600 dark:text-accent-400">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-accent-100 dark:border-accent-900/50 bg-accent-50/70 dark:bg-accent-950/20 p-5">
              <p className="font-semibold text-gray-900 dark:text-white">Kein Tarifwechsel um jeden Preis.</p>
              <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Wenn dein bestehender Tarif bereits sinnvoll ist, sagen wir dir das. Erst wenn sich eine Alternative wirklich lohnt, schauen wir sie gemeinsam an.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
