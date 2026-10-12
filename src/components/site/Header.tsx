import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, SITE } from "@/config/site";

interface HeaderProps {
  currentView?: "home" | "shop";
  onNavigateView?: (view: "home" | "shop") => void;
}

export function Header({ currentView = "home", onNavigateView }: HeaderProps = {}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleLinkClick = (href: string) => {
    setOpen(false);
    if (href === "#tienda") {
      if (onNavigateView) onNavigateView("shop");
    } else {
      if (onNavigateView) onNavigateView("home");
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? "border-b border-border bg-background/85 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:h-20 md:px-8">
        <a
          href="#inicio"
          onClick={() => handleLinkClick("#inicio")}
          className="flex flex-col leading-none"
          aria-label={`${SITE.brand}, ${SITE.tagline}. Ir al inicio`}
        >
          <span className="font-display text-2xl tracking-wide text-foreground">{SITE.brand}</span>
          <span className="font-script text-base text-primary">{SITE.tagline}</span>
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-sm text-muted-foreground">
            {NAV_LINKS.map((l) => {
              const isActive = (l.href === "#tienda" && currentView === "shop") || (l.href === "#inicio" && currentView === "home");
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => handleLinkClick(l.href)}
                    className={`transition-colors hover:text-primary ${
                      isActive ? "text-primary font-semibold" : ""
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="pill" size="default" className="hidden sm:inline-flex px-5">
            <a href="#encargos">Hacer un pedido</a>
          </Button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground hover:bg-muted lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Menú móvil" className="border-t border-border bg-background lg:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-5 py-4">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => handleLinkClick(l.href)} className="block py-3 font-display text-2xl text-foreground hover:text-primary">
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-3">
              <Button asChild variant="pill" size="xl" className="w-full">
                <a href="#encargos" onClick={() => setOpen(false)}>Hacer un pedido</a>
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
