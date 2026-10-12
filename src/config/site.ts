/**
 * Configuración central de Maranatha.
 * Los datos comerciales están VACÍOS a propósito: no se conocen.
 * Rellénalos solo con información real; los campos vacíos se ocultan en la web.
 */
export const SITE = {
  brand: "Maranatha",
  tagline: "La pastelería del cielo",
  address: "Calle Mayor 45, 28013 Madrid, España",
  hours: "Lunes a Sábado de 09:00 a 20:00",
  email: "hola@maranathapasteleria.com",
  instagram: "@maranatha.pasteleria",
  facebook: "maranathapasteleria",
};

/** Número de WhatsApp en formato internacional sin "+" ni espacios (p. ej. "34612345678"). */
export const WHATSAPP_NUMBER = "34612345678";

export const isWhatsAppConfigured = () => /^\d{8,15}$/.test(WHATSAPP_NUMBER);

export const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#tienda", label: "Tienda" },
  { href: "#mas-vendidas", label: "Más vendidas" },
  { href: "#nuevos-disenos", label: "Nuevos diseños" },
  { href: "#creaciones", label: "Creaciones" },
  { href: "#testimonios", label: "Testimonios" },
  { href: "#faq", label: "Preguntas frecuentes" },
  { href: "#encargos", label: "Encargos" },
  { href: "#contacto", label: "Contacto" },
];
