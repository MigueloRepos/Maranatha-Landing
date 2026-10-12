import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ShoppingBag, Sparkles } from "lucide-react";

export interface LightboxItem {
  id: string;
  title: string;
  text: string;
  img: string;
  alt: string;
  badge?: string;
}

interface LightboxProps {
  items: LightboxItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  onSelectForOrder?: (title: string) => void;
}

export function Lightbox({
  items,
  currentIndex,
  isOpen,
  onClose,
  onIndexChange,
  onSelectForOrder,
}: LightboxProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  const total = items.length;
  const current = items[currentIndex];

  const next = useCallback(() => {
    setIsZoomed(false);
    onIndexChange((currentIndex + 1) % total);
  }, [currentIndex, onIndexChange, total]);

  const prev = useCallback(() => {
    setIsZoomed(false);
    onIndexChange((currentIndex - 1 + total) % total);
  }, [currentIndex, onIndexChange, total]);

  // Reset zoom on item change or close
  useEffect(() => {
    setIsZoomed(false);
  }, [currentIndex, isOpen]);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        next();
      } else if (e.key === "ArrowLeft") {
        prev();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, next, prev, onClose]);

  if (!isOpen || !current) return null;

  const handleOrder = () => {
    onClose();
    if (onSelectForOrder) {
      onSelectForOrder(current.title);
    } else {
      const el = document.getElementById("encargos");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Lightbox pantalla completa: ${current.title}`}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-black/95 text-white backdrop-blur-2xl transition-all duration-300 animate-in fade-in"
    >
      {/* Top Header Controls Bar */}
      <div className="relative z-20 flex items-center justify-between px-4 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-white/10 px-3.5 py-1 text-xs font-medium text-white backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-gold" />
            {current.badge || "Creación artesanal"}
          </span>
          <span className="text-xs font-medium text-white/70">
            {currentIndex + 1} de {total}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Toggle */}
          <button
            type="button"
            onClick={() => setIsZoomed(!isZoomed)}
            aria-label={isZoomed ? "Reducir tamaño" : "Ampliar zoom"}
            className="hidden sm:inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {isZoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar vista de pantalla completa"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:text-primary active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden p-3 sm:p-6 md:p-8">
        {/* Navigation Left Arrow */}
        <button
          type="button"
          onClick={prev}
          aria-label="Fotografía anterior"
          className="absolute left-3 sm:left-6 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Backdrop click to close */}
        <div
          className="absolute inset-0 -z-10"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Central Display Image */}
        <div
          className={`relative max-h-[78vh] max-w-[94vw] transition-transform duration-300 ${
            isZoomed
              ? "scale-125 cursor-zoom-out sm:scale-150"
              : "cursor-zoom-in"
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <img
            src={current.img}
            alt={current.alt}
            className="max-h-[78vh] w-auto max-w-full rounded-2xl border border-gold/30 object-contain shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          />
        </div>

        {/* Navigation Right Arrow */}
        <button
          type="button"
          onClick={next}
          aria-label="Fotografía siguiente"
          className="absolute right-3 sm:right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Bottom Info and Action Bar */}
      <div className="relative z-20 border-t border-white/10 bg-black/60 px-4 py-4 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-2xl font-medium tracking-wide text-white sm:text-3xl">
              {current.title}
            </h3>
            <p className="text-xs sm:text-sm text-white/70">
              {current.text} • <span className="text-gold">Hecho a mano en Maranatha</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOrder}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Pedir esta creación</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
