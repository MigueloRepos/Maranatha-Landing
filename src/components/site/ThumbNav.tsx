import { useEffect, useState } from "react";
import { Sparkles, Cake, ShoppingBag, Store, MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER, isWhatsAppConfigured } from "@/config/site";
import { whatsappLink } from "@/lib/order";

interface ThumbNavProps {
  currentView?: "home" | "shop";
  onNavigateView?: (view: "home" | "shop") => void;
}

export function ThumbNav({ currentView = "home", onNavigateView }: ThumbNavProps = {}) {
  const [activeSection, setActiveSection] = useState<string>("inicio");
  const wa = isWhatsAppConfigured();

  // Track active section via scroll position
  useEffect(() => {
    if (currentView === "shop") {
      setActiveSection("tienda");
      return;
    }

    const sectionIds = ["inicio", "tienda", "mas-vendidas", "nuevos-disenos", "creaciones", "testimonios", "faq", "encargos", "contacto"];
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const offset = windowHeight * 0.35;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollY + offset >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentView]);

  const handleNavClick = (id: string, href: string) => {
    if (id === "tienda") {
      if (onNavigateView) onNavigateView("shop");
    } else {
      if (onNavigateView) onNavigateView("home");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  const navItems = [
    {
      id: "inicio",
      href: "#inicio",
      label: "Inicio",
      icon: Sparkles,
      active: currentView === "home" && (activeSection === "inicio" || !activeSection),
    },
    {
      id: "tienda",
      href: "#tienda",
      label: "Tienda",
      icon: Store,
      active: currentView === "shop",
    },
    {
      id: "creaciones",
      href: "#creaciones",
      label: "Creaciones",
      icon: Cake,
      active: currentView === "home" && (activeSection === "creaciones" || activeSection === "mas-vendidas" || activeSection === "nuevos-disenos"),
    },
    {
      id: "encargos",
      href: "#encargos",
      label: "Pedir",
      icon: ShoppingBag,
      active: activeSection === "encargos",
      isPrimary: true,
    },
  ];

  return (
    <nav
      aria-label="Navegación móvil ergonómica"
      className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-sm lg:hidden pointer-events-auto"
      style={{ paddingBottom: "max(0.25rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center justify-between rounded-full border border-gold/40 bg-card/95 p-1.5 shadow-[0_12px_36px_-8px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          if (item.isPrimary) {
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id, item.href);
                }}
                className="group relative flex flex-1 flex-col items-center justify-center rounded-full bg-primary px-3 py-2 text-primary-foreground shadow-soft transition-all duration-200 active:scale-95"
                aria-label="Hacer un encargo"
              >
                <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="mt-0.5 text-[0.65rem] font-semibold leading-none tracking-tight">
                  {item.label}
                </span>
              </a>
            );
          }

          return (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.id, item.href);
              }}
              className={`flex flex-1 flex-col items-center justify-center rounded-full py-1.5 transition-all duration-200 active:scale-95 ${
                item.active
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-current={item.active ? "page" : undefined}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  item.active ? "bg-secondary text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="mt-0.5 text-[0.65rem] leading-none">{item.label}</span>
            </a>
          );
        })}

        {/* WhatsApp Action with direct order text */}
        {wa ? (
          <a
            href={whatsappLink(WHATSAPP_NUMBER, "¡Hola Maranatha! Me gustaría consultar para hacer un pedido de pastelería artesanal.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 flex-col items-center justify-center rounded-full py-1.5 text-muted-foreground transition-all duration-200 hover:text-[#25D366] active:scale-95"
            aria-label="Escribir a Maranatha por WhatsApp"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition-colors">
              <MessageCircle className="h-4 w-4 fill-emerald-600/10" />
            </div>
            <span className="mt-0.5 text-[0.65rem] leading-none">WhatsApp</span>
          </a>
        ) : (
          <a
            href="#contacto"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("contacto", "#contacto");
            }}
            className={`flex flex-1 flex-col items-center justify-center rounded-full py-1.5 transition-all duration-200 active:scale-95 ${
              activeSection === "contacto"
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                activeSection === "contacto" ? "bg-secondary text-primary" : "text-muted-foreground"
              }`}
            >
              <MessageCircle className="h-4 w-4" />
            </div>
            <span className="mt-0.5 text-[0.65rem] leading-none">Contacto</span>
          </a>
        )}
      </div>
    </nav>
  );
}
