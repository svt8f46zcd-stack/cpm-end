"use client";

import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <Zap className="w-8 h-8 text-accent-500" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              cpm-energie.de
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#vorteile" className="text-gray-700 dark:text-gray-300 hover:text-accent-500 transition-colors">
              Vorteile
            </a>
            <a href="#ablauf" className="text-gray-700 dark:text-gray-300 hover:text-accent-500 transition-colors">
              Ablauf
            </a>
            <a href="#kontakt" className="text-gray-700 dark:text-gray-300 hover:text-accent-500 transition-colors">
              Kontakt
            </a>
            <a href="#kontakt" className="btn-primary text-sm">
              Beratung anfordern
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              <a href="#vorteile" className="text-gray-700 dark:text-gray-300 hover:text-accent-500 transition-colors">
                Vorteile
              </a>
              <a href="#ablauf" className="text-gray-700 dark:text-gray-300 hover:text-accent-500 transition-colors">
                Ablauf
              </a>
              <a href="#kontakt" className="text-gray-700 dark:text-gray-300 hover:text-accent-500 transition-colors">
                Kontakt
              </a>
              <a href="#kontakt" className="btn-primary text-center text-sm">
                Beratung anfordern
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
