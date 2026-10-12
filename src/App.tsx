/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Header } from "@/components/site/Header";
import {
  Creations,
  Essence,
  FaqAccordion,
  FinalCta,
  Footer,
  Hero,
  Occasions,
  Testimonials,
  TopWeeklyCreations,
  NewDesigns,
  ShopPage,
} from "@/components/site/Sections";
import { OrderForm, WhatsAppFloat } from "@/components/site/OrderForm";
import { ThumbNav } from "@/components/site/ThumbNav";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLoginModal } from "@/components/admin/AdminLoginModal";
import { supabase } from "@/lib/supabase";

export default function App() {
  const [selectedCreation, setSelectedCreation] = useState<string>("");
  const [view, setView] = useState<"home" | "shop">("home");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Sync hash with view state
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === "#tienda") {
        setView("shop");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setView("home");
      }
    };

    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  const handleNavigateView = (newView: "home" | "shop") => {
    setView(newView);
    if (newView === "shop") {
      window.location.hash = "#tienda";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      if (window.location.hash === "#tienda") {
        window.location.hash = "#inicio";
      }
    }
  };

  const handleSelectCreationForOrder = (creationTitle: string) => {
    setSelectedCreation(creationTitle);
    if (view === "shop") {
      handleNavigateView("home");
    }
    setTimeout(() => {
      const orderSection = document.getElementById("encargos");
      if (orderSection) {
        orderSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  async function handleOpenAdmin() {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setIsAdminOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-secondary selection:text-foreground pb-20 lg:pb-0">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-card focus:px-4 focus:py-2 text-foreground shadow-md ring-2 ring-primary"
      >
        Saltar al contenido
      </a>

      {/* Main Top Header */}
      <Header currentView={view} onNavigateView={handleNavigateView} />

      <main id="contenido">
        {view === "shop" ? (
          /* Dedicated Shop Page (Catálogo online por categorías) */
          <ShopPage
            onBackToHome={() => handleNavigateView("home")}
            onSelectProductForCustomOrder={handleSelectCreationForOrder}
          />
        ) : (
          /* Main Landing Page Experience */
          <>
            {/* Hero Section */}
            <Hero />

            {/* Creaciones más vendidas en la semana según su categoría */}
            <TopWeeklyCreations onSelectProductForOrder={handleSelectCreationForOrder} />

            {/* Nuevos diseños según su categoría */}
            <NewDesigns onSelectProductForOrder={handleSelectCreationForOrder} />

            {/* Creaciones artesanales destacadas con Lightbox y ficha modal */}
            <Creations onSelectCreationForOrder={handleSelectCreationForOrder} />

            {/* Esencia de la marca */}
            <Essence />

            {/* Ideas para ocasiones especiales */}
            <Occasions />

            {/* Testimonios y opiniones */}
            <Testimonials />

            {/* Preguntas frecuentes y políticas de personalización */}
            <FaqAccordion />

            {/* Formulario de encargos con opción de pedido directo por WhatsApp */}
            <OrderForm selectedCreation={selectedCreation} />

            {/* Llamada a la acción final */}
            <FinalCta />
          </>
        )}
      </main>

      {/* Footer with Admin trigger */}
      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* Desktop Floating WhatsApp Button */}
      <WhatsAppFloat />

      {/* Mobile Ergonomic Thumb-First Navigation Menu */}
      <ThumbNav currentView={view} onNavigateView={handleNavigateView} />

      {/* Admin Login Modal (Supabase Auth) */}
      {isLoginModalOpen && (
        <AdminLoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={() => {
            setIsLoginModalOpen(false);
            setIsAdminOpen(true);
          }}
        />
      )}

      {/* Admin Dashboard Modal */}
      {isAdminOpen && <AdminDashboard onClose={() => setIsAdminOpen(false)} />}
    </div>
  );
}
