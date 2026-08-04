"use client";

import { Zap, CheckCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-accent-500/10 text-accent-600 dark:text-accent-500 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Zap className="w-4 h-4" />
              <span>Kostenlose Energieberatung</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              Schluss mit zu hohen{" "}
              <span className="text-accent-500">Strom-</span> und{" "}
              <span className="text-primary-600">Gaspreisen</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              Wir optimieren Ihre Tarife kostenlos! Unabhängige Beratung für 
              Privat- und Geschäftskunden in Deutschland. Sparen Sie bis zu 
              500€ pro Jahr ohne Aufwand.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#kontakt" className="btn-primary text-center">
                Jetzt Beratung anfordern
              </a>
              <a href="#vorteile" className="btn-secondary text-center">
                Mehr erfahren
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm">Kostenlos & unverbindlich</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm">Unabhängige Beratung</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm">Bis zu 500€ sparen</span>
              </div>
            </div>
          </div>

          {/* Right Content - Form Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Kostenlose Tarifprüfung
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Füllen Sie das Formular aus und wir melden uns innerhalb von 24 Stunden.
            </p>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Ihr vollständiger Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Telefonnummer *
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="+49 ..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Postleitzahl *
                </label>
                <input
                  type="text"
                  required
                  pattern="[0-9]{5}"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="12345"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Aktueller Versorger
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="z.B. Stadtwerke München"
                />
              </div>
              <button type="submit" className="w-full btn-primary">
                Kostenlos prüfen lassen
              </button>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
              Ihre Daten sind sicher. Wir geben keine Informationen an Dritte weiter.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
