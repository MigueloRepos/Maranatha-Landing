import { useState, useId } from "react";
import { ChevronDown, HelpCircle, Sparkles, MessageCircle, Clock, Palette, ShieldCheck, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { WHATSAPP_NUMBER, isWhatsAppConfigured } from "@/config/site";
import { whatsappLink } from "@/lib/order";

export interface FaqItem {
  id: string;
  category: "tiempos" | "personalizacion" | "pedidos" | "entrega";
  question: string;
  answer: string;
  icon?: typeof Clock;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "tiempos-anticipacion",
    category: "tiempos",
    question: "¿Con cuánta anticipación debo hacer mi encargo?",
    answer:
      "Para tortas de celebración estándar recomendamos entre 5 y 10 días de anticipación. Para bodas y grandes montajes de varios pisos aconsejamos reservar con 3 a 6 semanas para asegurar disponibilidad en agenda y realizar el diseño conceptual. Los dulces artesanales y cajas gourmet requieren de 3 a 5 días hábiles. Si tienes una fecha urgente, escríbenos directamente por WhatsApp y comprobaremos el calendario de nuestro obrador.",
    icon: Clock,
  },
  {
    id: "politica-personalizacion",
    category: "personalizacion",
    question: "¿Cómo funciona la política de personalización de los pasteles?",
    answer:
      "Cada creación se diseña exclusivamente a medida. Puedes definir el número de porciones, paleta cromática, texturas decorativas (efecto aterciopelado, glaseado espejo, encaje) y elementos modelados a mano (rosas de azúcar pétalo a pétalo o toques en pan de oro comestible de 24 quilates). Puedes enviarnos bocetos, fotos de referencia o la invitación de tu evento y reinterpretraremos la idea con nuestra estética celestial distintiva.",
    icon: Palette,
  },
  {
    id: "sabores-ingredientes",
    category: "personalizacion",
    question: "¿Qué opciones de sabores y rellenos puedo elegir?",
    answer:
      "Disponemos de combinaciones gourmet diseñadas para ofrecer un equilibrio perfecto: Vainilla Bourbon con ganache de frambuesas silvestres, Chocolate Belga 70% con praliné de avellanas crujiente, Red Velvet sedoso con crema diplomática suave, Limón Meyer con toque de lavanda provenzal, y Bizcocho húmedo de almendras con dulce de leche artesanal. Cada receta se elabora desde cero con mantequilla pura y huevos camperos.",
    icon: Sparkles,
  },
  {
    id: "alergias-intolerancias",
    category: "personalizacion",
    question: "¿Elaboran opciones para celíacos, sin lactosa o dietas especiales?",
    answer:
      "Podemos preparar recetas con harinas sin gluten o postres sin lactosa bajo solicitud previa. Es importante destacar que todas nuestras piezas se hornean en un único taller artesanal donde también se manipulan harinas de trigo, lácteos y frutos secos. Aunque extremamos los protocolos de limpieza, informamos siempre con total transparencia sobre la posible presencia de trazas por seguridad alimentaria.",
    icon: ShieldCheck,
  },
  {
    id: "reserva-pagos",
    category: "pedidos",
    question: "¿Cómo se confirma la reserva y qué métodos de pago aceptan?",
    answer:
      "Una vez preparada tu solicitud mediante nuestro formulario web o por WhatsApp, revisamos los requerimientos y te facilitamos una propuesta cerrada. La fecha queda formalmente reservada tras formalizar un anticipo del 50% (mediante Bizum o transferencia bancaria). El 50% restante se liquida 48 horas antes de la entrega o al momento de la recogida.",
    icon: HelpCircle,
  },
  {
    id: "entrega-transporte",
    category: "entrega",
    question: "¿Realizan entregas a domicilio y montaje en el lugar del evento?",
    answer:
      "Sí. Para bodas, comuniones y grandes celebraciones disponemos de servicio especial de transporte climatizado y montaje en el propio salón o finca, asegurando que cada detalle permanezca intacto. Para pedidos de menor escala, puedes optar por recogida en taller; te entregaremos la pieza en un embalaje reforzado junto con instrucciones específicas para el transporte seguro en tu vehículo.",
    icon: Truck,
  },
  {
    id: "conservacion-corte",
    category: "entrega",
    question: "¿Cómo debo conservar el pastel antes de la celebración y cómo se corta?",
    answer:
      "Recomendamos mantener el pastel refrigerado y retirarlo de la nevera aproximadamente 1 a 2 horas antes de servir (dependiendo de la temperatura ambiental). A temperatura ambiente la crema adquiere su sedosidad idónea y los bizcochos liberan todos sus aromas. Con cada entrega incluimos una guía ilustrada de corte para que obtengas porciones limpias, estéticas y uniformes.",
    icon: ShieldCheck,
  },
  {
    id: "cambios-cancelaciones",
    category: "pedidos",
    question: "¿Puedo realizar cambios de diseño o reprogramar mi encargo?",
    answer:
      "Aceptamos ajustes en sabores, diseño o fecha hasta 5 días antes de la fecha programada. En caso de fuerza mayor o cambios de agenda con más de 7 días de antelación, tu anticipo se mantendrá como saldo a tu favor para cualquier fecha disponible dentro de los 12 meses siguientes.",
    icon: Clock,
  },
];

const CATEGORIES = [
  { id: "todas", label: "Todas las preguntas" },
  { id: "tiempos", label: "Tiempos de entrega" },
  { id: "personalizacion", label: "Personalización y sabores" },
  { id: "pedidos", label: "Pedidos y reservas" },
  { id: "entrega", label: "Entrega y conservación" },
] as const;

export function FaqAccordion() {
  const [openId, setOpenId] = useState<string | null>("tiempos-anticipacion");
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const uid = useId();
  const wa = isWhatsAppConfigured();

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const filteredItems = FAQ_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === "todas" || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-background py-24 md:py-32"
    >
      {/* Background ambient light */}
      <div
        className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-secondary/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-0 bottom-1/4 h-80 w-80 rounded-full bg-accent/30 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-5 md:px-8">
        <ScrollReveal variant="fade-up">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow flex items-center justify-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Dudas y Políticas
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </p>
            <h2 id="faq-title" className="mt-4 text-4xl leading-tight text-foreground md:text-5xl">
              Preguntas frecuentes
            </h2>
            <div className="hairline-gold mx-auto mt-6" aria-hidden="true" />
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Todo lo que necesitas saber sobre nuestros plazos de elaboración, políticas de personalización y el cuidado de cada pieza celestial.
            </p>
          </div>
        </ScrollReveal>

        {/* Category Filter Tabs */}
        <ScrollReveal variant="fade-up" delay={0.15}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-soft scale-105"
                    : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Search Input for fast lookup */}
        <ScrollReveal variant="fade-up" delay={0.25}>
          <div className="mx-auto mt-6 max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar duda (ej. anticipación, sin gluten, bodas, reserva)..."
                className="w-full rounded-full border border-border/80 bg-card px-5 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition-colors focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                  aria-label="Limpiar búsqueda"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Accordion Container */}
        <div className="mt-12">
          {filteredItems.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card/50 p-10 text-center">
              <p className="text-muted-foreground">No encontramos preguntas que coincidan con tu búsqueda.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("todas");
                }}
                className="mt-3 text-sm font-semibold text-primary underline underline-offset-4"
              >
                Ver todas las preguntas frecuentes
              </button>
            </div>
          ) : (
            <StaggerContainer staggerChildren={0.08} className="space-y-4">
              {filteredItems.map((item, idx) => {
                const isOpen = openId === item.id;
                const headerId = `${uid}-header-${idx}`;
                const panelId = `${uid}-panel-${idx}`;
                const IconComponent = item.icon || HelpCircle;

                return (
                  <StaggerItem key={item.id}>
                    <div
                      className={`overflow-hidden rounded-[1.75rem] border transition-all duration-300 ${
                        isOpen
                          ? "border-gold/50 bg-card shadow-soft ring-1 ring-gold/20"
                          : "border-border bg-card/80 hover:border-gold/30 hover:bg-card"
                      }`}
                    >
                      <button
                        type="button"
                        id={headerId}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => toggleItem(item.id)}
                        className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <div className="flex items-center gap-3.5 sm:gap-4">
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                              isOpen
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "bg-secondary text-primary"
                            }`}
                            aria-hidden="true"
                          >
                            <IconComponent className="h-4 w-4" />
                          </span>
                          <span className="font-display text-xl font-medium tracking-tight text-foreground sm:text-2xl">
                            {item.question}
                          </span>
                        </div>

                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted/60 text-muted-foreground transition-transform duration-300 ${
                            isOpen ? "rotate-180 bg-primary/10 text-primary border-primary/30" : ""
                          }`}
                          aria-hidden="true"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={panelId}
                            role="region"
                            aria-labelledby={headerId}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-border/60 px-5 pb-6 pt-4 text-sm leading-relaxed text-muted-foreground md:px-6 sm:text-base sm:pl-[4.5rem]">
                              {item.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          )}
        </div>

        {/* Bottom CTA for unlisted questions */}
        <ScrollReveal variant="fade-up" delay={0.2}>
          <div className="mt-16 rounded-[2rem] border border-gold/40 bg-gradient-to-br from-secondary/80 via-card to-secondary/50 p-6 text-center sm:p-10 shadow-soft">
            <h3 className="font-display text-2xl text-foreground sm:text-3xl">
              ¿Tienes una idea especial o una pregunta diferente?
            </h3>
            <p className="mx-auto mt-2.5 max-w-lg text-sm text-muted-foreground sm:text-base">
              Nos encanta conversar sobre nuevos proyectos. Escríbenos directamente y te asesoraremos personalmente con el cariño que merece tu celebración.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {wa ? (
                <Button asChild variant="pill" size="xl">
                  <a
                    href={whatsappLink(WHATSAPP_NUMBER, "Hola Maranatha, tengo una consulta sobre un encargo personalizado.")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Preguntar por WhatsApp</span>
                  </a>
                </Button>
              ) : (
                <Button asChild variant="pill" size="xl">
                  <a href="#encargos">
                    <span>Preparar solicitud de encargo</span>
                  </a>
                </Button>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
