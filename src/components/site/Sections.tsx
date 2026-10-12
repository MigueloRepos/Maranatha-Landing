import { useState } from "react";
import { Cake, Gem, Gift, Heart, Eye, Maximize2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE, NAV_LINKS } from "@/config/site";
import { CreationsGalleryModal, type CreationItem } from "@/components/site/CreationsGalleryModal";
import { Lightbox } from "@/components/site/Lightbox";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
export { Testimonials } from "@/components/site/Testimonials";
export { FaqAccordion } from "@/components/site/FaqAccordion";
export { TopWeeklyCreations } from "@/components/site/TopWeeklyCreations";
export { NewDesigns } from "@/components/site/NewDesigns";
export { ShopPage } from "@/components/site/ShopPage";

/*
 * IMÁGENES — sustitución por fotos reales de la marca:
 * - heroImage: ilustración PROVISIONAL. Reemplaza src/assets/hero-placeholder.jpg
 *   por la imagen original de la pastelera (mismo nombre) o cambia este import.
 * - Creaciones: imágenes ilustrativas generadas. Sustituye los archivos
 *   src/assets/creacion-*.jpg por fotos reales manteniendo el nombre.
 */
import heroImage from "@/assets/logo_of.png";
import imgTortas from "@/assets/creacion-tortas.jpg";
import imgDulces from "@/assets/creacion-dulces.jpg";
import imgEspeciales from "@/assets/creacion-especiales.jpg";

const HERO_IS_PLACEHOLDER = false;

function SectionHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <ScrollReveal variant="fade-up">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-4 text-4xl leading-tight text-foreground md:text-5xl">{title}</h2>
        <div className="hairline-gold mx-auto mt-6" aria-hidden="true" />
        {intro && <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{intro}</p>}
      </div>
    </ScrollReveal>
  );
}

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden pt-24 md:pt-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 md:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-28">
        <ScrollReveal variant="fade-up" delay={0.1} className="order-2 text-center lg:order-1 lg:text-left">
          <div>
            <p className="font-script text-3xl text-primary md:text-4xl">{SITE.brand}, {SITE.tagline.toLowerCase()}</p>
            <h1 className="mt-4 text-5xl leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
              Un pedacito de cielo en cada creación
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground lg:mx-0">
              Pastelería artesanal para convertir tus momentos especiales en recuerdos inolvidables
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Button asChild variant="pill" size="xl"><a href="#creaciones">Descubrir creaciones</a></Button>
              <Button asChild variant="pillOutline" size="xl"><a href="#encargos">Hacer un pedido</a></Button>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="scale-up" delay={0.25} className="relative order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none">
          <div>
            <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-secondary/60 blur-2xl" aria-hidden="true" />
            <figure className="overflow-hidden rounded-[2rem] border border-gold/40 bg-card shadow-soft">
              <img
                src={heroImage}
                width={1024}
                height={1024}
                fetchPriority="high"
                referrerPolicy="no-referrer"
                alt="Logotipo oficial de Maranatha, La pastelería del cielo"
                className="aspect-square h-auto w-full object-cover transition-transform duration-500 hover:scale-[1.01]"
              />
            </figure>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export const CREATIONS: CreationItem[] = [
  {
    id: "tortas",
    title: "Tortas de celebración",
    text: "Diseños para hacer más especial tu día",
    img: imgTortas,
    alt: "Torta de celebración rosa con flores turquesa y detalles dorados modelados a mano",
    badge: "Alta Repostería",
    longDescription:
      "Nuestras tortas de celebración son concebidas como piezas escultóricas únicas. Cada piso se hornea con ingredientes de primera selección y se decora minuciosamente a mano con rosas de azúcar modeladas pétalo a pétalo, texturas aterciopeladas y detalles en pan de oro comestible.",
    craftDetails: [
      "Flores de pasta de azúcar modeladas a mano pétalo a pétalo",
      "Pintura con pan de oro comestible y filigranas",
      "Bizcocho húmedo con relleno gourmet multicapa equilibrado",
      "Estructura reforzada y corte limpio y estilizado",
    ],
    suggestedFlavors: [
      "Vainilla Bourbon & Crema Suiza de Frambuesa",
      "Chocolate Belga 70% & Praliné de Avellanas",
      "Red Velvet Terciopelo con Crema Suave",
      "Limón Meyer & Ganache de Lavanda",
    ],
    idealOccasions: ["Bodas", "Aniversarios", "Cumpleaños memorables", "Quinceañeras"],
    leadTime: "5 a 10 días de anticipación",
  },
  {
    id: "dulces",
    title: "Dulces artesanales",
    text: "Pequeños bocados de felicidad",
    img: imgDulces,
    alt: "Macarons rosas, tartaletas de frambuesa fresca y petit fours turquesa",
    badge: "Bocados Gourmet",
    longDescription:
      "Una cuidada selección de petit fours y dulces finos pensados para deslumbrar a tus invitados. Desde macarons con conchas crocantes y corazones sedosos hasta tartaletas con masa sablée y frutas frescas de temporada, cada bocado es una explosión equilibrada de sabor y textura.",
    craftDetails: [
      "Macarons de almendra 100% pura y técnica francesa",
      "Tartaletas artesanales con masa sablée horneada a punto",
      "Glaseados espejo en tonos pasteles celestiales",
      "Presentación en elegantes cajas de obsequio o bandejas de servicio",
    ],
    suggestedFlavors: [
      "Macaron de Frambuesa Silvestre & Rosa",
      "Tartaleta de Lima & Merengue Suizo Tostado",
      "Trufas de Chocolate Blanco & Pistacho Bronte",
      "Bocado Celestial de Maracuyá & Mango",
    ],
    idealOccasions: ["Mesas de postres", "Reuniones íntimas", "Regalos gourmet", "Baby showers"],
    leadTime: "3 a 5 días de anticipación",
  },
  {
    id: "especiales",
    title: "Creaciones especiales",
    text: "Una creación para tu ocasión",
    img: imgEspeciales,
    alt: "Torta de varios pisos con cascada de flores y ornamentos dorados",
    badge: "Diseño a Medida",
    longDescription:
      "Para quienes buscan una pieza totalmente inédita y personalizada. Diseñamos junto a ti la temática, paleta cromática y volumetría, recreando elementos fantásticos, cascadas florales interminables o texturas marmoladas celestiales que capturen la esencia de tu momento.",
    craftDetails: [
      "Diseño conceptual y bocetado a medida de tu evento",
      "Cascadas de flores artesanales en tonalidades pastel",
      "Técnicas mixtas: aerografía, relieves y pan de oro",
      "Asesoría personalizada en montaje y porciones",
    ],
    suggestedFlavors: [
      "Bizcocho de Almendras & Dulce de Leche Artesanal",
      "Maracuyá & Chocolate Rubio Caramelizado",
      "Zanahoria especiada con nueces pecanas",
      "Crema Diplomática & Confitura de Moras",
    ],
    idealOccasions: ["Grandes bodas", "Galas benéficas", "Bautizos", "Eventos temáticos de lujo"],
    leadTime: "7 a 14 días de anticipación",
  },
];

interface CreationsProps {
  onSelectCreationForOrder?: (creationTitle: string) => void;
}

export function Creations({ onSelectCreationForOrder }: CreationsProps = {}) {
  const [selectedCreation, setSelectedCreation] = useState<CreationItem | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <section id="creaciones" className="bg-card py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Creaciones"
          title="Hechas a mano, pensadas para ti"
          intro="Explora cada una de nuestras propuestas artesanales. Haz clic en las fotografías para abrirlas en pantalla completa con el visor lightbox o descubre el detalle de cada diseño."
        />

        <StaggerContainer className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {CREATIONS.map((c, idx) => (
            <StaggerItem key={c.id}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-soft">
                {/* Image Container with Fullscreen Lightbox Trigger */}
                <div
                  tabIndex={0}
                  role="button"
                  aria-label={`Abrir fotografía de ${c.title} en pantalla completa`}
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
                    src={c.img}
                    alt={c.alt}
                    width={896}
                    height={1120}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Badge */}
                  <div className="absolute left-3.5 top-3.5 z-10 pointer-events-none">
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                      <Sparkles className="h-3 w-3 text-gold" />
                      {c.badge}
                    </span>
                  </div>

                  {/* Hover expansion prompt */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-background/90 px-4 py-2 text-xs font-semibold text-foreground shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
                      <Maximize2 className="h-4 w-4 text-primary" />
                      Pantalla completa
                    </span>
                  </div>
                </div>

                {/* Card description & Actions */}
                <div className="mt-5 flex flex-1 flex-col justify-between px-2 pb-2">
                  <div>
                    <h3 className="font-display text-2xl text-foreground group-hover:text-primary transition-colors">
                      {c.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{c.text}</p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3">
                    <button
                      type="button"
                      onClick={() => openLightbox(idx)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80 active:scale-95"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                      Pantalla completa
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedCreation(c)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Ficha artesanal
                    </button>
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Haz clic en cualquier imagen para abrirla en pantalla completa o pulsa en &quot;Ficha artesanal&quot; para consultar sabores y técnicas.
        </p>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <Lightbox
        items={CREATIONS}
        currentIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onIndexChange={setLightboxIndex}
        onSelectForOrder={onSelectCreationForOrder}
      />

      {/* Expandable High-Resolution Modal */}
      <CreationsGalleryModal
        creation={selectedCreation}
        onClose={() => setSelectedCreation(null)}
        onSelectForOrder={onSelectCreationForOrder}
        onOpenLightbox={() => {
          const idx = CREATIONS.findIndex((item) => item.id === selectedCreation?.id);
          setSelectedCreation(null);
          openLightbox(idx >= 0 ? idx : 0);
        }}
      />
    </section>
  );
}

export function Essence() {
  return (
    <section id="esencia" className="py-24 md:py-36">
      <ScrollReveal variant="fade-up">
        <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
          <p className="eyebrow">Nuestra esencia</p>
          <h2 className="mt-4 text-4xl leading-tight text-foreground md:text-6xl">El arte de crear momentos dulces</h2>
          <div className="hairline-gold mx-auto mt-8" aria-hidden="true" />
          <p className="mt-8 font-display text-2xl leading-relaxed text-foreground/80 md:text-3xl">
            En Maranatha creemos que la pastelería es una forma de expresar amor, alegría y gratitud. Cada creación es una
            oportunidad para acompañar esos momentos que merecen recordarse
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}

const OCCASIONS = [
  { icon: Cake, label: "Cumpleaños" },
  { icon: Gem, label: "Bodas y aniversarios" },
  { icon: Heart, label: "Celebraciones familiares" },
  { icon: Gift, label: "Regalos especiales" },
];

export function Occasions() {
  return (
    <section aria-labelledby="ocasiones-title" className="bg-muted/60 py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <ScrollReveal variant="fade-up">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Ideas para tu encargo</p>
            <h2 id="ocasiones-title" className="mt-4 text-4xl text-foreground md:text-5xl">¿Qué momento quieres celebrar?</h2>
            <p className="mt-5 text-muted-foreground">Algunas ocasiones que pueden inspirar tu solicitud.</p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {OCCASIONS.map(({ icon: Icon, label }) => (
            <StaggerItem key={label}>
              <div className="flex flex-col items-center rounded-3xl border border-border bg-card px-4 py-10 text-center transition-transform hover:-translate-y-1 hover:border-gold/40 hover:shadow-soft">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="mt-5 font-display text-xl text-foreground">{label}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="px-5 py-24 md:px-8">
      <ScrollReveal variant="scale-up">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-gold/40 bg-secondary px-6 py-16 text-center md:py-20 shadow-soft">
          <h2 id="cta-title" className="mx-auto max-w-2xl text-4xl leading-tight text-foreground md:text-5xl">
            Tu próximo momento especial comienza aquí
          </h2>
          <Button asChild variant="pill" size="xl" className="mt-10"><a href="#encargos">Preparar mi solicitud</a></Button>
        </div>
      </ScrollReveal>
    </section>
  );
}

export function Footer() {
  const extras = [SITE.address, SITE.hours, SITE.email].filter(Boolean);
  return (
    <footer id="contacto" className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-14 md:flex-row md:items-start md:justify-between md:px-8">
        <div>
          <p className="font-display text-3xl text-foreground">{SITE.brand}</p>
          <p className="font-script text-xl text-primary">{SITE.tagline}</p>
          {extras.length > 0 && (
            <ul className="mt-4 space-y-1 text-sm text-muted-foreground">{extras.map((e) => <li key={e}>{e}</li>)}</ul>
          )}
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Para contactar, prepara tu solicitud desde el <a href="#encargos" className="text-primary underline underline-offset-4">formulario de encargos</a>.
          </p>
        </div>
        <nav aria-label="Pie de página">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm text-muted-foreground">
            {NAV_LINKS.map((l) => <li key={l.href}><a href={l.href} className="hover:text-primary">{l.label}</a></li>)}
          </ul>
        </nav>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {SITE.brand}
      </div>
    </footer>
  );
}
