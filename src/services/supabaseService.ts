/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from "@/lib/supabase";
import { PRODUCTS, CATEGORIES_LIST, type Product } from "@/data/products";

// Helper to fetch products from Supabase or fallback to localStorage / default PRODUCTS
export async function fetchProductsFromSupabase(): Promise<Product[]> {
  try {
    const { data, error } = await supabase.from("products").select("*");
    if (error || !data || data.length === 0) {
      const local = localStorage.getItem("maranatha_admin_products");
      if (local) return JSON.parse(local);
      return PRODUCTS;
    }
    // Map Supabase rows to Product interface
    return data.map((row: any) => ({
      id: row.id || row.title?.toLowerCase().replace(/\s+/g, "-"),
      title: row.title,
      subtitle: row.subtitle || "",
      category: row.category,
      price: row.price,
      portions: row.portions || "",
      leadTime: row.lead_time || "5 a 7 días",
      img: row.image_url || PRODUCTS[0].img,
      alt: row.alt || `Fotografía de ${row.title}`,
      description: row.description || "",
      flavors: typeof row.flavors === "string" ? row.flavors.split(",") : row.flavors || ["Vainilla"],
      features: row.features || ["100% Artesanal"],
      isWeeklyTop: !!row.is_weekly_top,
      weeklyRank: row.weekly_rank || 1,
      weeklyOrdersCount: row.weekly_orders_count || 15,
      isNewDesign: !!row.is_new_design,
      releaseTag: row.release_tag || "Colección",
      isSoldOut: !!row.is_sold_out,
      stockQuantity: row.stock_quantity !== undefined && row.stock_quantity !== null ? row.stock_quantity : 15,
    }));
  } catch {
    const local = localStorage.getItem("maranatha_admin_products");
    if (local) return JSON.parse(local);
    return PRODUCTS;
  }
}

export async function updateProductInventoryInSupabase(productId: string, isSoldOut: boolean, stockQuantity: number) {
  try {
    await supabase
      .from("products")
      .update({
        is_sold_out: isSoldOut,
        stock_quantity: stockQuantity,
      })
      .eq("id", productId);
  } catch (err) {
    console.warn("Supabase inventory update warning:", err);
  }
}

// Helper to fetch categories
export async function fetchCategoriesFromSupabase(): Promise<string[]> {
  try {
    const { data, error } = await supabase.from("categories").select("name");
    if (error || !data || data.length === 0) {
      const local = localStorage.getItem("maranatha_admin_categories");
      if (local) return JSON.parse(local);
      return [...CATEGORIES_LIST];
    }
    return data.map((r: any) => r.name);
  } catch {
    const local = localStorage.getItem("maranatha_admin_categories");
    if (local) return JSON.parse(local);
    return [...CATEGORIES_LIST];
  }
}

// Helper to log WhatsApp orders to Supabase table `whatsapp_orders`
export async function logWhatsAppOrderToSupabase(order: {
  clientName: string;
  clientContact: string;
  itemSummary: string;
  fullMessage: string;
}) {
  try {
    // Also save to localStorage log
    const localLogs = JSON.parse(localStorage.getItem("maranatha_admin_wa_logs") || "[]");
    const newLog = {
      id: `wa-${Date.now()}`,
      clientName: order.clientName,
      clientContact: order.clientContact,
      itemSummary: order.itemSummary,
      timestamp: new Date().toLocaleString(),
      fullMessage: order.fullMessage,
    };
    localStorage.setItem("maranatha_admin_wa_logs", JSON.stringify([newLog, ...localLogs]));

    await supabase.from("whatsapp_orders").insert([
      {
        client_name: order.clientName,
        client_contact: order.clientContact,
        item_summary: order.itemSummary,
        full_message: order.fullMessage,
        created_at: new Date().toISOString(),
      },
    ]);
  } catch (err) {
    // Graceful fallback to localStorage
    console.warn("Supabase insert warning:", err);
  }
}
