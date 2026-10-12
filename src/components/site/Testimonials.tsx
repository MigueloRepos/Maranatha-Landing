import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Quote, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Testimonial {
  id: string;
  name: string;
  location?: string;
  occasion: string;
  creationType: string;
  quote: string;
  highlight: string;
  rating: number;
  initials: string;
  date?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Sofía & Alejandro",
    location: "Madrid",
    occasion: "Boda campestre",
    creationType: "Torta nupcial de 3 pisos",
    highlight: "Superó todas nuestras expectativas",
    quote:
      "Maranatha convirtió el momento cumbre de nuestra boda en un recuerdo inolvidable. La torta no solo fue la pieza central más elogiada y fotografiada del banquete, sino que la combinación de vainilla francesa y frutos rojos frescos dejó a todos los invitados fascinados.",
    rating: 5,
    initials: "SA",
    date: "Hace 2 meses",
  },
  {
    id: "2",
    name: "Valeria Mendoza",
    location: "Valencia",
    occasion: "1er Cumpleaños de Lucas",
    creationType: "Torta temática celestial",
    highlight: "Pura magia hecha a mano",
    quote:
      "Pedimos una torta personalizada en tonos pastel celeste, blanco y detalles dorados. El nivel de detalle en cada rosa y relieve modelado a mano fue asombroso. El sabor era suave, esponjoso y nada empalagoso. Se nota el amor y la dedicación en cada bocado.",
    rating: 5,
    initials: "VM",
    date: "Hace 3 semanas",
  },
  {
    id: "3",
    name: "Camila Restrepo",
    location: "Barcelona",
    occasion: "Aniversario familiar",
    creationType: "Mesa de dulces artesanales",
    highlight: "Bocados que transportan al cielo",
    quote:
      "Encargamos una selección de macarons franceses y tartaletas de frambuesa silvestre para nuestras bodas de plata. La textura crujiente por fuera y fundente por dentro fue insuperable. Llegaron impecablemente presentados, como joyas comestibles.",
    rating: 5,
    initials: "CR",
    date: "Hace 1 mes",
  },
  {
    id: "4",
    name: "Mariana & Gabriel",
    location: "Sevilla",
    occasion: "Bautizo de Elena",
    creationType: "Creación especial con perlas",
    highlight: "Atención cálida y resultado de ensueño",
    quote:
      "Desde el primer contacto para preparar la solicitud sentimos una calidez única. Escucharon cada detalle que queríamos y lo transformaron en una obra de arte. Nuestros familiares aún recuerdan lo exquisita y delicada que estaba.",
    rating: 5,
    initials: "MG",
    date: "Hace 1 mes",
  },
  {
    id: "5",
    name: "Daniela Morales",
    location: "Zaragoza",
    occasion: "Regalo sorpresa de cumpleaños",
    creationType: "Caja gourmet de dulces",
    highlight: "La sorpresa más dulce y elegante",
    quote:
      "Quería enviar un obsequio especial para el cumpleaños de mi madre. La presentación cuidada con lazo dorado y la frescura de los dulces artesanales la emocionaron hasta las lágrimas. Sin duda la mejor pastelería artesanal que hemos probado.",
    rating: 5,
    initials: "DM",
    date: "Hace 2 semanas",
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = TESTIMONIALS.length;

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay with pause on hover
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(next, 7000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, next]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      next();
    } else if (distance < -50) {
      prev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section
      id="testimonios"
      aria-labelledby="testimonios-title"
      className="relative overflow-hidden bg-gradient-to-b from-background via-secondary/30 to-background py-24 md:py-32"
    >
      {/* Decorative celestial background orbs */}
      <div
        className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-secondary/50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-accent/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow flex items-center justify-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Experiencias
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </p>
          <h2 id="testimonios-title" className="mt-4 text-4xl leading-tight text-foreground md:text-5xl">
            Momentos dulces compartidos
          </h2>
          <div className="hairline-gold mx-auto mt-6" aria-hidden="true" />
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Las palabras de quienes confiaron en Maranatha para acompañar sus instantes más entrañables.
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="relative mx-auto mt-14 max-w-4xl"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Card Frame */}
          <div className="relative overflow-hidden rounded-[2.5rem] border border-gold/40 bg-card p-7 shadow-soft transition-all md:p-12">
            {/* Quote watermark icon */}
            <Quote
              className="absolute right-6 top-6 h-20 w-20 text-secondary/70 -rotate-12 transition-transform md:right-10 md:top-8 md:h-28 md:w-28"
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col justify-between gap-8">
              {/* Rating and Occasion tag */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5" aria-label={`Calificación: ${current.rating} de 5 estrellas`}>
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-gold text-gold transition-transform hover:scale-110" />
                  ))}
                  <span className="ml-1.5 text-xs font-semibold text-muted-foreground">5.0</span>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-secondary/80 px-3.5 py-1 text-xs font-medium text-foreground">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span>{current.occasion}</span>
                </div>
              </div>

              {/* Highlight & Quote */}
              <div className="space-y-4">
                <h3 className="font-display text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                  “{current.highlight}”
                </h3>
                <blockquote className="font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
                  {current.quote}
                </blockquote>
              </div>

              {/* Author & Creation Info */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
                <div className="flex items-center gap-3.5">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-secondary via-accent/30 to-primary/20 font-display text-lg font-semibold text-primary shadow-inner"
                    aria-hidden="true"
                  >
                    {current.initials}
                  </div>
                  <div>
                    <p className="font-display text-lg font-medium text-foreground">{current.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {current.location && `${current.location} • `}
                      <span className="text-primary/90 font-medium">{current.creationType}</span>
                    </p>
                  </div>
                </div>

                {current.date && (
                  <span className="text-xs text-muted-foreground/80 italic">{current.date}</span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-between px-2">
            {/* Slide Indicators */}
            <div className="flex items-center gap-2" role="tablist" aria-label="Indicadores de testimonios">
              {TESTIMONIALS.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={idx === currentIndex}
                  aria-label={`Ver testimonio ${idx + 1} de ${t.name}`}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    idx === currentIndex
                      ? "w-8 bg-primary shadow-sm"
                      : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  }`}
                />
              ))}
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={prev}
                aria-label="Testimonio anterior"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all hover:border-primary hover:bg-muted hover:text-primary active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Testimonio siguiente"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all hover:border-primary hover:bg-muted hover:text-primary active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Small trust badges */}
        <div className="mx-auto mt-16 flex flex-wrap items-center justify-center gap-8 text-center text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            <span>100% Repostería artesanal personalizada</span>
          </div>
          <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/40 sm:inline" />
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" />
            <span>Ingredientes seleccionados de máxima calidad</span>
          </div>
          <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/40 sm:inline" />
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-gold fill-gold" />
            <span>Valoración promedio 5.0 en encargos</span>
          </div>
        </div>
      </div>
    </section>
  );
}
