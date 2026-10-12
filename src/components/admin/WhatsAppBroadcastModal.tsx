/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { MessageCircle, Copy, Check, X, Send, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Product } from "@/data/products";
import { whatsappLink } from "@/lib/order";

interface WhatsAppLog {
  id: string;
  clientName: string;
  clientContact: string;
  itemSummary: string;
  timestamp: string;
  fullMessage: string;
}

interface WhatsAppBroadcastModalProps {
  product: Product;
  clients: WhatsAppLog[];
  onClose: () => void;
}

export function WhatsAppBroadcastModal({ product, clients, onClose }: WhatsAppBroadcastModalProps) {
  const [copied, setCopied] = useState(false);

  // Extract unique phone numbers / contacts
  const uniqueClients = Array.from(
    new Map(clients.map((c) => [c.clientContact, c])).values()
  );

  const defaultMessage = `✨ *¡Nuevo Diseño en Maranatha´s Cake Shop!* ✨\n\n¡Hola! Te escribimos de Maranatha para anunciarte nuestro nuevo diseño exclusivo:\n\n🎂 *${product.title}*\n💎 *Categoría:* ${product.category}\n💰 *Precio:* ${product.price}\n📝 *Descripción:* ${product.description || product.subtitle}\n\n¡Ya disponible para encargo! ¿Te gustaría apartar el tuyo? 🌟`;

  const [message, setMessage] = useState(defaultMessage);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert("No se pudo copiar al portapapeles.");
    }
  }

  // Helper to extract clean phone number digits if possible
  function getCleanPhone(contact: string): string | null {
    const digits = contact.replace(/\D/g, "");
    if (digits.length >= 8) return digits;
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Difusión de nuevo diseño por WhatsApp"
      className="fixed inset-0 z-[250] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-2xl rounded-[2.5rem] border border-border bg-card p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 text-muted-foreground hover:text-foreground text-xl font-bold"
          aria-label="Cerrar"
        >
          ✕
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-soft">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Difusión de Nuevo Diseño
            </h2>
            <p className="text-xs text-muted-foreground">
              Anuncia el nuevo diseño <span className="font-semibold text-primary">{product.title}</span> a tus clientes registrados en WhatsApp
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-muted/50 p-5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Mensaje de Anuncio (Personalizable)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={7}
            className="w-full rounded-2xl border border-input bg-card p-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Clientes registrados con teléfono: <strong className="text-foreground">{uniqueClients.length}</strong>
            </span>
            <Button type="button" variant="pillOutline" size="sm" onClick={handleCopy} className="gap-2">
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? "Mensaje copiado" : "Copiar mensaje"}</span>
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>Lista de Clientes Registrados en WhatsApp Orders</span>
          </h3>

          {uniqueClients.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No hay clientes registrados en la tabla de WhatsApp todavía. Los pedidos realizados desde el formulario se registrarán aquí automáticamente.
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {uniqueClients.map((client) => {
                const phone = getCleanPhone(client.clientContact);
                const waLink = phone ? whatsappLink(phone, message) : null;

                return (
                  <div
                    key={client.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4 shadow-sm"
                  >
                    <div>
                      <p className="font-semibold text-sm text-foreground">{client.clientName}</p>
                      <p className="text-xs text-muted-foreground">Contacto: {client.clientContact}</p>
                      <p className="text-[11px] text-muted-foreground/80 mt-0.5">Último interés: {client.itemSummary}</p>
                    </div>

                    {waLink ? (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-soft transition-all hover:bg-emerald-700 active:scale-95"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Enviar WhatsApp</span>
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        Contacto por correo (teléfono no disponible)
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-3 border-t border-border pt-4">
          <Button type="button" variant="pill" size="xl" onClick={onClose}>
            Finalizar y Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
