import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-accent-500/10 rounded-full mb-6">
            <span className="text-6xl font-bold text-accent-500">404</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Seite nicht gefunden
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Die von Ihnen gesuchte Seite existiert leider nicht oder wurde verschoben.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary text-center">
            Zur Startseite
          </Link>
          <Link href="#kontakt" className="btn-secondary text-center">
            Kontakt aufnehmen
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Benötigen Sie Hilfe?{" "}
            <a href="mailto:info@cpm-energie.de" className="text-accent-500 hover:underline">
              info@cpm-energie.de
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
