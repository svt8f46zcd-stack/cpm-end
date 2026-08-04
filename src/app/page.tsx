import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Process from "@/components/Process";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Process />
      <ContactForm />
      <Footer />
    </main>
  );
}
