"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    postalCode: "",
    provider: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData);
    alert("Vielen Dank! Wir melden uns innerhalb von 24 Stunden bei Ihnen.");
  };

  return (
    <section id="kontakt" className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Kostenlose Beratung anfordern
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Füllen Sie das Formular aus und unsere Energieexperten melden sich 
              innerhalb von 24 Stunden bei Ihnen –完全 kostenlos und unverbindlich.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-accent-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Telefon</h3>
                  <p className="text-gray-600 dark:text-gray-400">+49 (0) 123 456 7890</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Mo-Fr: 9:00 - 18:00 Uhr</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">E-Mail</h3>
                  <p className="text-gray-600 dark:text-gray-400">beratung@cpm-energie.de</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Wir antworten innerhalb von 24h</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Standort</h3>
                  <p className="text-gray-600 dark:text-gray-400">Deutschlandweit tätig</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Beratung vor Ort oder remote</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Ihr vollständiger Name"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Telefonnummer *
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="+49 ..."
                />
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Postleitzahl *
                </label>
                <input
                  type="text"
                  id="postalCode"
                  required
                  pattern="[0-9]{5}"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="12345"
                />
              </div>

              <div>
                <label htmlFor="provider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Aktueller Energieversorger
                </label>
                <input
                  type="text"
                  id="provider"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="z.B. Stadtwerke München, E.ON, Vattenfall"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ihre Nachricht (optional)
                </label>
                <textarea
                  id="message"
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors resize-none"
                  placeholder="Haben Sie spezielle Fragen oder Anliegen?"
                />
              </div>

              <button type="submit" className="w-full btn-primary flex items-center justify-center space-x-2">
                <Send className="w-5 h-5" />
                <span>Kostenlose Beratung anfordern</span>
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Mit dem Absenden stimmen Sie unserer Datenschutzerklärung zu. 
                Ihre Daten werden vertraulich behandelt.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
