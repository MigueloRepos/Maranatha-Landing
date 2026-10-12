import { useEffect } from "react";
import { X, Sparkles, Clock, CheckCircle2, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CreationItem {
  id: string;
  title: string;
  text: string;
  img: string;
  alt: string;
  badge: string;
  longDescription: string;
  craftDetails: string[];
  suggestedFlavors: string[];
  idealOccasions: string[];
  leadTime: string;
}

interface CreationsGalleryModalProps {
  creation: CreationItem | null;
  onClose: () => void;
  onSelectForOrder?: (creationTitle: string) => void;
  onOpenLightbox?: () => void;
}

export function CreationsGalleryModal({
  creation,
  onClose,
  onSelectForOrder,
  onOpenLightbox,
}: CreationsGalleryModalProps) {
  useEffect(() => {
    if (!creation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [creation, onClose]);

  if (!creation) return null;

  const handleOrderClick = () => {
    onClose();
    if (onSelectForOrder) {
      onSelectForOrder(creation.title);
    } else {
      const el = document.getElementById("encargos");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-creation-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2.5rem] border border-gold/40 bg-card p-0 shadow-2xl transition-all animate-in zoom-in-95 duration-300">
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar vista detallada"
          className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-background/85 text-foreground backdrop-blur-sm transition-all hover:bg-muted hover:text-primary active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.2fr]">
          {/* High Resolution Image Container */}
          <div
            onClick={onOpenLightbox}
            role={onOpenLightbox ? "button" : undefined}
            tabIndex={onOpenLightbox ? 0 : undefined}
            onKeyDown={(e) => {
              if (onOpenLightbox && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onOpenLightbox();
              }
            }}
            aria-label="Abrir imagen en pantalla completa"
            className={`relative min-h-[300px] sm:min-h-[380px] lg:min-h-full bg-muted overflow-hidden lg:rounded-l-[2.5rem] group ${
              onOpenLightbox ? "cursor-zoom-in" : ""
            }`}
          >
            <img
              src={creation.img}
              alt={creation.alt}
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            {/* Soft gradient bottom overlay on mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-4 left-4 lg:hidden">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                <Sparkles className="h-3 w-3 text-gold" />
                {creation.badge}
              </span>
            </div>

            {onOpenLightbox && (
              <div className="absolute right-3 bottom-3 z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-all group-hover:bg-primary group-hover:border-primary">
                  <Sparkles className="h-3 w-3 text-gold" />
                  Pantalla completa
                </span>
              </div>
            )}
          </div>

          {/* Details & Artisanal Craftsmanship Section */}
          <div className="flex flex-col justify-between p-6 sm:p-8 md:p-10">
            <div className="space-y-6">
              <div>
                <div className="hidden lg:flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-secondary px-3.5 py-1 text-xs font-semibold text-primary">
                    <Sparkles className="h-3 w-3 text-primary" />
                    {creation.badge}
                  </span>
                  <span className="text-xs text-muted-foreground">• Pastelería celestial hecha a mano</span>
                </div>
                <h3
                  id="modal-creation-title"
                  className="mt-2 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl"
                >
                  {creation.title}
                </h3>
                <p className="mt-1 font-script text-xl text-primary">{creation.text}</p>
                <div className="hairline-gold mt-4" aria-hidden="true" />
              </div>

              {/* Extended Artisanal Story */}
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {creation.longDescription}
              </p>

              {/* Craftsmanship points */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Técnicas artesanales
                </h4>
                <ul className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-foreground/90">
                  {creation.craftDetails.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggested Flavor Profiles */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Combinaciones y sabores habituales
                </h4>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {creation.suggestedFlavors.map((flavor, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-border bg-muted/80 px-3 py-1 text-xs text-foreground/80"
                    >
                      {flavor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lead time & Ideal occasions */}
              <div className="rounded-2xl border border-border/80 bg-secondary/40 p-4 text-xs text-muted-foreground space-y-1.5">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>Anticipación recomendada: {creation.leadTime}</span>
                </div>
                <p>
                  <strong className="text-foreground">Ideal para:</strong>{" "}
                  {creation.idealOccasions.join(", ")}.
                </p>
              </div>
            </div>

            {/* Direct Order Action */}
            <div className="mt-8 pt-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-primary" />
                Cada pedido se elabora exclusivamente bajo encargo
              </p>
              <Button
                type="button"
                variant="pill"
                size="xl"
                onClick={handleOrderClick}
                className="w-full sm:w-auto"
              >
                <span>Solicitar este diseño</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
