import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Process from "@/components/Process";
import TariffCalculator from "@/components/tariff-calculator/TariffCalculator";
import TrustSection from "@/components/TrustSection";
import FAQSection from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { localBusinessSchema, faqSchema } from "./structured-data";

export default function Home() {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <main className="min-h-screen">
        <Header />
        <Hero />
        <TrustSection />
        <TariffCalculator compact={false} />
        <Features />
        <Process />
        <FAQSection />
        <ContactForm />
        <Footer />
      </main>
    </>
  );
}
