import { Zap } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="/" className="flex items-center space-x-2 mb-4">
              <Zap className="w-8 h-8 text-accent-500" />
              <span className="text-xl font-bold">cpm-energie.de</span>
            </a>
            <p className="text-gray-400 max-w-md">
              Ihr unabhängiger Partner für Energieberatung. 
              Wir helfen Ihnen, Strom- und Gaskosten zu senken – 
              kostenlos, transparent und kompetent.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#vorteile" className="hover:text-accent-500 transition-colors">
                  Vorteile
                </a>
              </li>
              <li>
                <a href="#ablauf" className="hover:text-accent-500 transition-colors">
                  Ablauf
                </a>
              </li>
              <li>
                <a href="#kontakt" className="hover:text-accent-500 transition-colors">
                  Kontakt
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Rechtliches</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/impressum" className="hover:text-accent-500 transition-colors">
                  Impressum
                </a>
              </li>
              <li>
                <a href="/datenschutz" className="hover:text-accent-500 transition-colors">
                  Datenschutz
                </a>
              </li>
              <li>
                <a href="/agb" className="hover:text-accent-500 transition-colors">
                  AGB
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} cpm-energie.de. Alle Rechte vorbehalten.
          </p>
          <p className="text-gray-500 text-xs mt-2 md:mt-0">
            Unabhängige Energieberatung für Deutschland
          </p>
        </div>
      </div>
    </footer>
  );
}
