import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Wie funktioniert die kostenlose Tarifprüfung?",
    answer: "Sie geben Ihre Verbrauchsdaten ein, und wir vergleichen alle verfügbaren Tarife in Ihrer Region. Innerhalb von 24 Stunden melden wir uns mit einem persönlichen Angebot bei Ihnen – komplett kostenlos und unverbindlich.",
  },
  {
    question: "Was kostet mich die Beratung?",
    answer: "Unsere Beratung ist für Sie als Endkunde vollständig kostenlos. Wir werden über eine Provision der Energieversorger vergütet, wenn Sie sich für einen Tarif entscheiden. Für Sie entstehen keine zusätzlichen Kosten.",
  },
  {
    question: "Wie lange dauert der Wechsel des Anbieters?",
    answer: "Der eigentliche Wechsel dauert in der Regel 2-4 Wochen. Wir übernehmen die gesamte Abwicklung inklusive Kündigung Ihres alten Vertrags und Anmeldung beim neuen Anbieter. Sie müssen nichts tun.",
  },
  {
    question: "Gibt es eine Lieferunterbrechung beim Wechsel?",
    answer: "Nein, die Energieversorgung wird niemals unterbrochen. Der Wechsel erfolgt im Hintergrund. Sie erhalten weiterhin Strom und Gas wie gewohnt – nur zu besseren Konditionen.",
  },
  {
    question: "Kann ich auch meinen Gas- und Stromvertrag gleichzeitig wechseln?",
    answer: "Ja, absolut! Wir empfehlen sogar den Kombi-Wechsel, da Sie so oft zusätzliche Rabatte erhalten und nur einen Ansprechpartner haben.",
  },
  {
    question: "Was passiert, wenn mein alter Vertrag noch läuft?",
    answer: "Wir prüfen Ihren bestehenden Vertrag und kündigen ihn zum frühestmöglichen Zeitpunkt. Falls eine Sonderkündigung wegen Preiserhöhung möglich ist, nutzen wir diese Option für Sie.",
  },
  {
    question: "Wie sicher sind meine Daten?",
    answer: "Ihre Daten werden nach höchsten Sicherheitsstandards verschlüsselt übertragen und gespeichert. Wir geben Ihre Daten nicht an Dritte weiter und verwenden sie ausschließlich für Ihre Tarifberatung.",
  },
  {
    question: "Kann ich auch als Mieter den Anbieter wechseln?",
    answer: "Ja, als Mieter können Sie den Stromanbieter frei wählen. Bei Gas hängt es von der Heizungsart ab: Bei Etagenheizung können Sie wechseln, bei Zentralheizung übernimmt dies der Vermieter.",
  },
  {
    question: "Welche Unterlagen benötige ich für den Wechsel?",
    answer: "Für die erste Beratung benötigen wir nur Ihre Verbrauchsdaten. Für den eigentlichen Wechsel reicht eine Vollmacht von Ihnen – wir erledigen den Rest.",
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Häufig gestellte Fragen
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Alles, was Sie über den Tarifwechsel wissen müssen.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </h3>
                <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" />
              </summary>
              <div className="px-6 pb-6">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Haben Sie weitere Fragen?
          </p>
          <a href="#kontakt" className="btn-primary inline-flex items-center gap-2">
            Kontakt aufnehmen
          </a>
        </div>
      </div>
    </section>
  );
}
