import { z } from "zod";

export const CREATION_TYPES = ["Tortas de celebración", "Dulces artesanales", "Creaciones especiales"] as const;
export const OCCASIONS = ["Cumpleaños", "Bodas y aniversarios", "Celebraciones familiares", "Regalos especiales", "Otra"] as const;

export const orderSchema = z.object({
  name: z.string().trim().min(2, "Indica tu nombre (mínimo 2 caracteres).").max(80, "Máximo 80 caracteres."),
  contact: z.string().trim().min(5, "Indica un teléfono o correo para responderte.").max(120, "Máximo 120 caracteres."),
  creation: z.enum(["Tortas de celebración", "Dulces artesanales", "Creaciones especiales"]),
  occasion: z.string().max(40).optional().or(z.literal("")),
  date: z
    .string()
    .optional()
    .refine((v) => !v || v >= new Date().toISOString().slice(0, 10), "La fecha no puede ser anterior a hoy."),
  details: z.string().trim().max(800, "Máximo 800 caracteres.").optional().or(z.literal("")),
});

export type OrderInput = z.infer<typeof orderSchema>;

export function buildSummary(o: OrderInput): string {
  const lines = [
    "Hola Maranatha, me gustaría preparar una solicitud:",
    `• Nombre: ${o.name}`,
    `• Contacto: ${o.contact}`,
    `• Tipo de creación: ${o.creation}`,
  ];
  if (o.occasion) lines.push(`• Ocasión: ${o.occasion}`);
  if (o.date) lines.push(`• Fecha deseada: ${o.date.split("-").reverse().join("/")}`);
  if (o.details) lines.push(`• Detalles: ${o.details}`);
  return lines.join("\n");
}

export function buildWhatsAppOrderMessage(o: OrderInput): string {
  const lines = [
    "✨ *Nuevo Pedido para Maranatha - La pastelería del cielo* ✨",
    "",
    `👤 *Cliente:* ${o.name}`,
    `📞 *Contacto:* ${o.contact}`,
    `🎂 *Creación:* ${o.creation}`,
  ];
  if (o.occasion) lines.push(`🎉 *Ocasión:* ${o.occasion}`);
  if (o.date) lines.push(`📅 *Fecha deseada:* ${o.date.split("-").reverse().join("/")}`);
  if (o.details) lines.push(`✍️ *Detalles y preferencias:* ${o.details}`);
  lines.push("");
  lines.push("¡Hola! Me gustaría confirmar la disponibilidad y presupuesto para este encargo celestial. ¡Muchas gracias!");
  return lines.join("\n");
}

export function buildProductWhatsAppMessage(productTitle: string, category: string, price?: string): string {
  return [
    `¡Hola Maranatha! ✨ Me gustaría encargar: *${productTitle}*`,
    `📂 *Categoría:* ${category}`,
    price ? `💰 *Precio orientativo:* ${price}` : "",
    "",
    "¿Tienen disponibilidad en agenda para consultar las fechas de entrega? ¡Muchas gracias! 🎂",
  ].filter(Boolean).join("\n");
}

export function whatsappLink(number: string, text: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

