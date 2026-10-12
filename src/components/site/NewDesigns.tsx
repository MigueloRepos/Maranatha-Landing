import { useState } from "react";
import { Sparkles, ShoppingBag, MessageCircle, Maximize2, Tag, Clock, Users, ArrowRight } from "lucide-react";
import { PRODUCTS, type ProductCategory, CATEGORIES_LIST } from "@/data/products";
import { WHATSAPP_NUMBER } from "@/config/site";
import { buildProductWhatsAppMessage, whatsappLink } from "@/lib/order";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { Lightbox, type LightboxItem } from "@/components/site/Lightbox";

interface NewDesignsProps {
  onSelectProductForOrder?: (productTitle: string) => void;
}

export function NewDesigns({ onSelectProductForOrder }: NewDesignsProps = {}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const newDesigns = PRODUCTS.filter((p) => p.isNewDesign);

  const filteredItems = selectedCategory === "todas"
    ? newDesigns
    : newDesigns.filter((p) => p.category === selectedCategory);

  const lightboxItems: LightboxItem[] = filteredItems.map((p) => ({
    id: p.id,
    title: p.title,
    text: `${p.subtitle} • ${p.price}`,
    img: p.img,
    alt: p.alt,
    badge: p.releaseTag || "Nuevo Diseño",
  }));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section
      id="nuevos-disenos"
      aria-labelledby="nuevos-disenos-title"
      className="relative overflow-hidden bg-background py-24 md:py-32"
    >
      {/* Soft celestial backdrop light */}
      <div
        className="pointer-events-none absolute right-10 top-1/4 h-80 w-80 rounded-full bg-accent/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-10 bottom-1/3 h-80 w-80 rounded-full bg-secondary/50 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <ScrollReveal variant="fade-up">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Colección & Vanguardia
              <Sparkles className="h-4 w-4 text-primary" />
            </p>
            <h2 id="nuevos-disenos-title" className="mt-4 text-4xl leading-tight text-foreground md:text-5xl">
              Nuevos diseños por categoría
            </h2>
            <div className="hairline-gold mx-auto mt-6" aria-hidden="true" />
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Explora las últimas creaciones recién salidas de nuestro taller artesanal. Nuevas técnicas decorativas, paletas en tendencia y perfiles de sabor inéditos.
            </p>
          </div>
        </ScrollReveal>

        {/* Category Tabs */}
        <ScrollReveal variant="fade-up" delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory("todas")}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                selectedCategory === "todas"
                  ? "bg-primary text-primary-foreground shadow-soft scale-105"
                  : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              Todas las novedades
            </button>
            {CATEGORIES_LIST.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-soft scale-105"
                    : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* New Designs Grid */}
        <div className="mt-14">
          <StaggerContainer staggerChildren={0.1} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((product, idx) => {
              const waText = buildProductWhatsAppMessage(product.title, product.category, product.price);
              const waHref = whatsappLink(WHATSAPP_NUMBER, waText);

              return (
                <StaggerItem key={product.id}>
                  <div className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-soft">
                    {/* Image stage */}
                    <div
                      tabIndex={0}
                      role="button"
                      aria-label={`Abrir fotografía de ${product.title} en pantalla completa`}
                      onClick={() => openLightbox(idx)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openLightbox(idx);
                        }
                      }}
                      className="relative aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-[1.5rem] bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <img
                        src={product.img}
                        alt={product.alt}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* New release badge */}
                      <div className="absolute left-3.5 top-3.5 z-10 flex flex-col gap-1.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                          <Tag className="h-3.5 w-3.5 text-gold" />
                          {product.releaseTag || "Nuevo Diseño"}
                        </span>
                      </div>

                      {/* Fullscreen hover prompt */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-background/90 px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-md backdrop-blur-md">
                          <Maximize2 className="h-3.5 w-3.5 text-primary" />
                          Ver en pantalla completa
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mt-5 flex flex-1 flex-col justify-between px-2 pb-1">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                            {product.category}
                          </span>
                          <span className="font-display text-lg font-semibold text-foreground">
                            {product.price}
                          </span>
                        </div>

                        <h3 className="mt-1 font-display text-2xl font-medium text-foreground group-hover:text-primary transition-colors">
                          {product.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">{product.subtitle}</p>

                        {/* Flavors preview */}
                        <div className="mt-3 flex flex-wrap gap-1">
                          {product.flavors.map((flavor) => (
                            <span
                              key={flavor}
                              className="rounded-full bg-secondary/60 px-2 py-0.5 text-[0.7rem] text-muted-foreground"
                            >
                              {flavor}
                            </span>
                          ))}
                        </div>

                        {/* Portion & Time */}
                        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          {product.portions && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
                              <Users className="h-3 w-3 text-primary" />
                              {product.portions}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
                            <Clock className="h-3 w-3 text-primary" />
                            {product.leadTime}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-6 flex flex-col gap-2 pt-4 border-t border-border/70 sm:flex-row">
                        <a
                          href={waHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Encargar nuevo diseño ${product.title} por WhatsApp`}
                          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-soft transition-all hover:bg-emerald-700 hover:scale-[1.02] active:scale-95"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>Pedir por WhatsApp</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectProductForOrder) {
                              onSelectProductForOrder(product.title);
                            } else {
                              const el = document.getElementById("encargos");
                              if (el) el.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                          className="flex items-center justify-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground transition-all hover:border-primary hover:text-primary hover:bg-secondary/40 active:scale-95"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>Personalizar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </div>

      <Lightbox
        items={lightboxItems}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setLightboxIndex}
        onSelectForOrder={onSelectProductForOrder}
      />
    </section>
  );
}
