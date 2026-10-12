import { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  Search,
  ShoppingBag,
  MessageCircle,
  Maximize2,
  Clock,
  Users,
  Check,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Flame,
  Tag,
} from "lucide-react";
import { PRODUCTS, CATEGORIES_LIST, type ProductCategory, type Product } from "@/data/products";
import { WHATSAPP_NUMBER } from "@/config/site";
import { buildProductWhatsAppMessage, whatsappLink } from "@/lib/order";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { Lightbox, type LightboxItem } from "@/components/site/Lightbox";
import { Button } from "@/components/ui/button";
import { fetchProductsFromSupabase, fetchCategoriesFromSupabase } from "@/services/supabaseService";

interface CartItem {
  product: Product;
  quantity: number;
}

interface ShopPageProps {
  onBackToHome?: () => void;
  onSelectProductForCustomOrder?: (productTitle: string) => void;
}

export function ShopPage({ onBackToHome, onSelectProductForCustomOrder }: ShopPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [portionFilter, setPortionFilter] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [prods, setProds] = useState<Product[]>(PRODUCTS);
  const [cats, setCats] = useState<string[]>(() => [...CATEGORIES_LIST]);

  useEffect(() => {
    fetchProductsFromSupabase().then((data) => {
      if (data && data.length > 0) setProds(data);
    });
    fetchCategoriesFromSupabase().then((data) => {
      if (data && data.length > 0) setCats(data);
    });
  }, []);

  // Filter products based on category, search query, and portion
  const filteredProducts = useMemo(() => {
    return prods.filter((p) => {
      const matchesCategory = selectedCategory === "todas" || p.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.flavors.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesPortion = true;
      if (portionFilter === "small") {
        matchesPortion = !!p.portions?.includes("unidades") || !!p.portions?.includes("Pack") || !!p.portions?.includes("Surtido");
      } else if (portionFilter === "medium") {
        matchesPortion = !!p.portions?.includes("10") || !!p.portions?.includes("15") || !!p.portions?.includes("20");
      } else if (portionFilter === "large") {
        matchesPortion = !!p.portions?.includes("25") || !!p.portions?.includes("30") || !!p.portions?.includes("50");
      }

      return matchesCategory && matchesSearch && matchesPortion;
    });
  }, [prods, selectedCategory, searchQuery, portionFilter]);

  const lightboxItems: LightboxItem[] = filteredProducts.map((p) => ({
    id: p.id,
    title: p.title,
    text: `${p.subtitle} • ${p.price}`,
    img: p.img,
    alt: p.alt,
    badge: p.category,
  }));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Cart operations
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Generate WhatsApp message for entire cart
  const buildMultiOrderWhatsAppLink = () => {
    if (cart.length === 0) return "#";
    const lines = [
      "✨ *Nuevo Pedido desde la Tienda Online de Maranatha* ✨",
      "",
      "¡Hola! Me gustaría encargar la siguiente lista de productos celestiales:",
      "",
    ];

    cart.forEach((item, index) => {
      lines.push(`${index + 1}. *${item.product.title}* (x${item.quantity})`);
      lines.push(`   Categoría: ${item.product.category}`);
      lines.push(`   Precio orientativo: ${item.product.price}`);
    });

    lines.push("");
    lines.push("¿Podrían confirmarme disponibilidad de fechas y cómo formalizar la reserva? ¡Muchas gracias! 🎂");
    return whatsappLink(WHATSAPP_NUMBER, lines.join("\n"));
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      {/* Background ambient orbs */}
      <div
        className="pointer-events-none fixed right-0 top-20 h-96 w-96 rounded-full bg-secondary/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed left-0 bottom-20 h-96 w-96 rounded-full bg-accent/30 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        {/* Navigation Bar / Breadcrumb back to landing */}
        <div className="flex items-center justify-between">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-sm transition-all hover:border-primary hover:text-primary active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver a la portada principal</span>
            </button>
          )}

          {/* Cart toggle floating indicator */}
          {totalCartCount > 0 && (
            <button
              type="button"
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Pedido acumulado ({totalCartCount})</span>
            </button>
          )}
        </div>

        {/* Hero Banner for the Shop */}
        <ScrollReveal variant="fade-up" className="mt-8 text-center">
          <p className="eyebrow flex items-center justify-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Boutique & Catálogo Completo
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </p>
          <h1 className="mt-4 text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
            Tienda Maranatha
          </h1>
          <div className="hairline-gold mx-auto mt-6" aria-hidden="true" />
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Descubre todas nuestras creaciones artesanales organizadas por categorías. Puedes encargar cada producto directamente por WhatsApp o personalizar cada detalle.
          </p>
        </ScrollReveal>

        {/* Controls: Search and Filters */}
        <div className="mt-12 space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory("todas")}
              className={`rounded-full px-5 py-2.5 text-xs font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                selectedCategory === "todas"
                  ? "bg-primary text-primary-foreground shadow-soft scale-105"
                  : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              Todas las categorías ({PRODUCTS.length})
            </button>
            {CATEGORIES_LIST.map((cat) => {
              const count = PRODUCTS.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-5 py-2.5 text-xs font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground shadow-soft scale-105"
                      : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Search bar and Portion subfilters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, sabor o ingrediente (ej. frambuesa, macarons, boda)..."
                className="w-full rounded-full border border-border/80 bg-card py-2.5 pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground font-medium">Tamaño:</span>
              <button
                type="button"
                onClick={() => setPortionFilter("all")}
                className={`rounded-full px-3 py-1.5 transition-colors ${
                  portionFilter === "all" ? "bg-secondary text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setPortionFilter("small")}
                className={`rounded-full px-3 py-1.5 transition-colors ${
                  portionFilter === "small" ? "bg-secondary text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Bocados / Cajas
              </button>
              <button
                type="button"
                onClick={() => setPortionFilter("medium")}
                className={`rounded-full px-3 py-1.5 transition-colors ${
                  portionFilter === "medium" ? "bg-secondary text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                10-20 personas
              </button>
              <button
                type="button"
                onClick={() => setPortionFilter("large")}
                className={`rounded-full px-3 py-1.5 transition-colors ${
                  portionFilter === "large" ? "bg-secondary text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                20+ personas
              </button>
            </div>
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div className="mt-12">
          {filteredProducts.length === 0 ? (
            <div className="rounded-[2.5rem] border border-dashed border-border bg-card/60 p-12 text-center">
              <p className="font-display text-2xl text-foreground">No encontramos creaciones que coincidan</p>
              <p className="mt-2 text-sm text-muted-foreground">Prueba a buscar otro término o limpia los filtros.</p>
              <Button
                type="button"
                variant="pillOutline"
                size="default"
                className="mt-6"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("todas");
                  setPortionFilter("all");
                }}
              >
                Restablecer catálogo
              </Button>
            </div>
          ) : (
            <StaggerContainer staggerChildren={0.08} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product, idx) => {
                const waText = buildProductWhatsAppMessage(product.title, product.category, product.price);
                const waHref = whatsappLink(WHATSAPP_NUMBER, waText);
                const inCart = cart.find((item) => item.product.id === product.id);

                return (
                  <StaggerItem key={product.id}>
                    <article className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-soft">
                      {/* Product Image Stage */}
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

                        {/* Badges */}
                        <div className="absolute left-3.5 top-3.5 z-10 flex flex-col gap-1.5">
                          {product.isWeeklyTop && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-black/60 px-3 py-1 text-xs font-semibold text-gold backdrop-blur-md">
                              <Flame className="h-3 w-3" />
                              Top #{product.weeklyRank || 1} Semanal
                            </span>
                          )}
                          {product.isNewDesign && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-primary/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                              <Tag className="h-3 w-3" />
                              {product.releaseTag || "Nuevo Diseño"}
                            </span>
                          )}
                        </div>

                        {/* Hover Lightbox Indicator */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-background/90 px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-md backdrop-blur-md">
                            <Maximize2 className="h-3.5 w-3.5 text-primary" />
                            Pantalla completa
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
                            <span className="font-display text-xl font-bold text-foreground">
                              {product.price}
                            </span>
                          </div>

                          <h3 className="mt-1 font-display text-2xl font-medium text-foreground group-hover:text-primary transition-colors">
                            {product.title}
                          </h3>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {product.description}
                          </p>

                          {/* Flavors preview */}
                          <div className="mt-3 flex flex-wrap gap-1">
                            {product.flavors.map((flavor) => (
                              <span
                                key={flavor}
                                className="rounded-full bg-secondary/70 px-2.5 py-0.5 text-[0.7rem] text-muted-foreground"
                              >
                                {flavor}
                              </span>
                            ))}
                          </div>

                          {/* Portions & Lead time badges */}
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

                        {/* Actions: Pedir por WhatsApp & Agregar al pedido */}
                        <div className="mt-6 flex flex-col gap-2 pt-4 border-t border-border/70">
                          <div className="flex items-center gap-2">
                            {/* Direct WhatsApp single item order */}
                            <a
                              href={waHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Pedir ${product.title} por WhatsApp`}
                              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-soft transition-all hover:bg-emerald-700 hover:scale-[1.02] active:scale-95"
                            >
                              <MessageCircle className="h-4 w-4" />
                              <span>Pedir por WhatsApp</span>
                            </a>

                            {/* Add to multi-item cart */}
                            <button
                              type="button"
                              onClick={() => addToCart(product)}
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all active:scale-95 ${
                                inCart
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-card text-foreground hover:border-primary hover:text-primary"
                              }`}
                              aria-label={`Añadir ${product.title} a la lista de pedido`}
                            >
                              {inCart ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            </button>
                          </div>

                          {/* Custom Order in Form */}
                          <button
                            type="button"
                            onClick={() => {
                              if (onSelectProductForCustomOrder) {
                                onSelectProductForCustomOrder(product.title);
                              } else if (onBackToHome) {
                                onBackToHome();
                                setTimeout(() => {
                                  document.getElementById("encargos")?.scrollIntoView({ behavior: "smooth" });
                                }, 150);
                              }
                            }}
                            className="text-center py-1 text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
                          >
                            ¿Quieres adaptarlo a medida? Personalizar solicitud
                          </button>
                        </div>
                      </div>
                    </article>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          )}
        </div>
      </div>

      {/* Slide-over / Modal for Consolidated WhatsApp Cart */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
            aria-hidden="true"
          />

          <div className="relative z-10 w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-gold/40 bg-card p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-medium text-foreground">Tu lista de pedido</h3>
                  <p className="text-xs text-muted-foreground">{totalCartCount} piezas seleccionadas</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
                aria-label="Cerrar panel de pedido"
              >
                ✕
              </button>
            </div>

            {/* Cart Items List */}
            <div className="mt-4 max-h-60 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border/80 bg-secondary/30 p-3"
                >
                  <img
                    src={item.product.img}
                    alt={item.product.alt}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.product.title}</p>
                    <p className="text-xs text-muted-foreground">{item.product.price}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-foreground hover:bg-muted/80"
                      aria-label="Reducir cantidad"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-5 text-center text-sm font-semibold text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-foreground hover:bg-muted/80"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="ml-1 text-muted-foreground hover:text-destructive"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp Checkout Action */}
            <div className="mt-6 border-t border-border pt-4">
              <a
                href={buildMultiOrderWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2.5 rounded-full bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-emerald-700 active:scale-95"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Enviar pedido consolidado por WhatsApp</span>
              </a>
              <p className="mt-2.5 text-center text-[0.75rem] text-muted-foreground">
                Te responderemos al instante para coordinar fechas de entrega y detalles especiales.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox for Shop */}
      <Lightbox
        items={lightboxItems}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setLightboxIndex}
        onSelectForOrder={onSelectProductForCustomOrder}
      />
    </div>
  );
}
