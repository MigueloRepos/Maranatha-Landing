import { useState, useEffect, type FormEvent } from "react";
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  FolderPlus,
  Flame,
  Sparkles,
  BarChart3,
  MessageCircle,
  Eye,
  Check,
  X,
  Package,
  Layers,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { PRODUCTS, CATEGORIES_LIST, type Product, type ProductCategory } from "@/data/products";
import { Button } from "@/components/ui/button";
import { fetchProductsFromSupabase, fetchCategoriesFromSupabase } from "@/services/supabaseService";
import { supabase } from "@/lib/supabase";
import { WhatsAppBroadcastModal } from "./WhatsAppBroadcastModal";

interface AdminDashboardProps {
  onClose: () => void;
}

interface WhatsAppOrderLog {
  id: string;
  clientName: string;
  clientContact: string;
  itemSummary: string;
  timestamp: string;
  fullMessage: string;
}

export function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"categories" | "bestsellers" | "newdesigns" | "analytics" | "whatsapp">("bestsellers");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setUserEmail(data.user.email);
      }
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    onClose();
  }

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem("maranatha_admin_categories");
    return saved ? JSON.parse(saved) : [...CATEGORIES_LIST];
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("maranatha_admin_products");
    return saved ? JSON.parse(saved) : PRODUCTS;
  });

  const [whatsappLogs, setWhatsappLogs] = useState<WhatsAppOrderLog[]>(() => {
    const saved = localStorage.getItem("maranatha_admin_wa_logs");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "log-1",
            clientName: "Sofía Mendoza",
            clientContact: "+34 600 123 456",
            itemSummary: "Torta Celestial Rosa & Oro (x1)",
            timestamp: "Hace 2 horas",
            fullMessage: "✨ *Nuevo Pedido para Maranatha*\n\n👤 *Cliente:* Sofía Mendoza\n📞 *Contacto:* +34 600 123 456\n🎂 *Creación:* Torta Celestial Rosa & Oro\n🎉 *Ocasión:* Cumpleaños\n📅 *Fecha deseada:* 25/10/2026\n✍️ *Detalles:* Con tonos dorados extra y dedicatoria.",
          },
        ];
  });

  // Fetch from Supabase on mount
  useEffect(() => {
    async function loadSupabaseData() {
      try {
        const remoteCats = await fetchCategoriesFromSupabase();
        if (remoteCats && remoteCats.length > 0) setCategories(remoteCats);

        const remoteProds = await fetchProductsFromSupabase();
        if (remoteProds && remoteProds.length > 0) setProducts(remoteProds);

        const { data: waData, error: waError } = await supabase.from("whatsapp_orders").select("*").order("created_at", { ascending: false });
        if (!waError && waData && waData.length > 0) {
          const formattedLogs: WhatsAppOrderLog[] = waData.map((row: any) => ({
            id: row.id || `wa-${Math.random()}`,
            clientName: row.client_name,
            clientContact: row.client_contact,
            itemSummary: row.item_summary,
            timestamp: new Date(row.created_at || Date.now()).toLocaleString(),
            fullMessage: row.full_message,
          }));
          setWhatsappLogs(formattedLogs);
        }
      } catch (err) {
        console.warn("Supabase load warning:", err);
      }
    }
    loadSupabaseData();
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("maranatha_admin_categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("maranatha_admin_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("maranatha_admin_wa_logs", JSON.stringify(whatsappLogs));
  }, [whatsappLogs]);

  // Modal form states for Category
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Modal form states for Product (Bestsellers or New Designs)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormType, setProductFormType] = useState<"bestsellers" | "newdesigns">("bestsellers");
  const [broadcastingProduct, setBroadcastingProduct] = useState<Product | null>(null);

  // Form fields for product
  const [formTitle, setFormTitle] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formCategory, setFormCategory] = useState<ProductCategory>(categories[0] as ProductCategory);
  const [formPrice, setFormPrice] = useState("Desde 75€");
  const [formPortions, setFormPortions] = useState("15 a 20 personas");
  const [formLeadTime, setFormLeadTime] = useState("5 a 7 días");
  const [formDescription, setFormDescription] = useState("");
  const [formFlavors, setFormFlavors] = useState("Vainilla Bourbon, Ganache de Frambuesa");
  const [formIsTop, setFormIsTop] = useState(false);
  const [formWeeklyRank, setFormWeeklyRank] = useState(1);
  const [formWeeklyOrders, setFormWeeklyOrders] = useState(15);
  const [formIsNew, setFormIsNew] = useState(false);
  const [formReleaseTag, setFormReleaseTag] = useState("Nuevo Lanzamiento");

  // Open product modal for create or edit
  const openProductModal = (type: "bestsellers" | "newdesigns", product?: Product) => {
    setProductFormType(type);
    if (product) {
      setEditingProduct(product);
      setFormTitle(product.title);
      setFormSubtitle(product.subtitle);
      setFormCategory(product.category);
      setFormPrice(product.price);
      setFormPortions(product.portions || "");
      setFormLeadTime(product.leadTime);
      setFormDescription(product.description);
      setFormFlavors(product.flavors.join(", "));
      setFormIsTop(!!product.isWeeklyTop);
      setFormWeeklyRank(product.weeklyRank || 1);
      setFormWeeklyOrders(product.weeklyOrdersCount || 10);
      setFormIsNew(!!product.isNewDesign);
      setFormReleaseTag(product.releaseTag || "Nuevo Diseño");
    } else {
      setEditingProduct(null);
      setFormTitle("");
      setFormSubtitle("");
      setFormCategory(categories[0] as ProductCategory);
      setFormPrice("Desde 75€");
      setFormPortions("15 a 20 personas");
      setFormLeadTime("5 a 7 días");
      setFormDescription("");
      setFormFlavors("Vainilla Bourbon, Chocolate Belga");
      setFormIsTop(type === "bestsellers");
      setFormWeeklyRank(1);
      setFormWeeklyOrders(12);
      setFormIsNew(type === "newdesigns");
      setFormReleaseTag("Colección Especial");
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const flavorsArray = formFlavors.split(",").map((f) => f.trim()).filter(Boolean);

    const updatedProduct: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      title: formTitle,
      subtitle: formSubtitle,
      category: formCategory,
      price: formPrice,
      portions: formPortions,
      leadTime: formLeadTime,
      img: editingProduct ? editingProduct.img : PRODUCTS[0].img, // fallback to existing image
      alt: `Fotografía de ${formTitle}`,
      description: formDescription,
      flavors: flavorsArray.length > 0 ? flavorsArray : ["Vainilla", "Chocolate"],
      features: ["100% Artesanal", "Ingredientes de primera selección"],
      isWeeklyTop: productFormType === "bestsellers" ? true : formIsTop,
      weeklyRank: productFormType === "bestsellers" ? formWeeklyRank : undefined,
      weeklyOrdersCount: productFormType === "bestsellers" ? formWeeklyOrders : undefined,
      isNewDesign: productFormType === "newdesigns" ? true : formIsNew,
      releaseTag: productFormType === "newdesigns" ? formReleaseTag : undefined,
    };

    if (editingProduct) {
      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p)));
    } else {
      setProducts((prev) => [updatedProduct, ...prev]);
      if (productFormType === "newdesigns") {
        setBroadcastingProduct(updatedProduct);
      }
    }

    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Category handlers
  const handleSaveCategory = (e: FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    if (editingCategory) {
      setCategories((prev) => prev.map((c) => (c === editingCategory ? newCategoryName.trim() : c)));
      // Also update products with this category
      setProducts((prev) =>
        prev.map((p) => (p.category === editingCategory ? { ...p, category: newCategoryName.trim() as ProductCategory } : p))
      );
      setEditingCategory(null);
    } else {
      if (!categories.includes(newCategoryName.trim())) {
        setCategories((prev) => [...prev, newCategoryName.trim()]);
      }
    }
    setNewCategoryName("");
  };

  const handleDeleteCategory = (catToDelete: string) => {
    if (categories.length <= 1) {
      alert("Debes mantener al menos una categoría.");
      return;
    }
    if (window.confirm(`¿Eliminar la categoría "${catToDelete}"?`)) {
      setCategories((prev) => prev.filter((c) => c !== catToDelete));
    }
  };

  // Analytics computed metrics
  const totalProducts = products.length;
  const bestsellersCount = products.filter((p) => p.isWeeklyTop).length;
  const newDesignsCount = products.filter((p) => p.isNewDesign).length;
  const totalOrdersCount = products.reduce((sum, p) => sum + (p.weeklyOrdersCount || 5), 0);

  // Most viewed mock metric (sorted by weekly orders * 12)
  const mostViewedProducts = [...products].sort((a, b) => (b.weeklyOrdersCount || 10) - (a.weeklyOrdersCount || 10)).slice(0, 5);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Panel de Administración Maranatha"
      className="fixed inset-0 z-[200] flex flex-col bg-background text-foreground overflow-y-auto animate-in fade-in duration-300"
    >
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 px-5 py-4 backdrop-blur-md md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-medium tracking-tight text-foreground">
                Panel de Administración Maranatha
              </h1>
              <p className="text-xs text-muted-foreground">
                Gestión de categorías, creaciones, estadísticas y pedidos de WhatsApp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {userEmail && (
              <span className="hidden sm:inline-block text-xs font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                {userEmail}
              </span>
            )}
            <Button
              type="button"
              variant="pillOutline"
              size="default"
              onClick={handleLogout}
              className="gap-2 text-destructive border-destructive/40 hover:bg-destructive hover:text-destructive-foreground"
            >
              <span>Cerrar sesión</span>
            </Button>
            <Button
              type="button"
              variant="pillOutline"
              size="default"
              onClick={onClose}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              <span>Cerrar Panel</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 md:px-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border pb-6">
          <button
            type="button"
            onClick={() => setActiveTab("bestsellers")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
              activeTab === "bestsellers"
                ? "bg-primary text-primary-foreground shadow-soft"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <Flame className="h-4 w-4" />
            <span>Más Vendidas ({bestsellersCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("newdesigns")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
              activeTab === "newdesigns"
                ? "bg-primary text-primary-foreground shadow-soft"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Nuevos Diseños ({newDesignsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
              activeTab === "categories"
                ? "bg-primary text-primary-foreground shadow-soft"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Categorías ({categories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("analytics")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
              activeTab === "analytics"
                ? "bg-primary text-primary-foreground shadow-soft"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Estadísticas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("whatsapp")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
              activeTab === "whatsapp"
                ? "bg-primary text-primary-foreground shadow-soft"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageCircle className="h-4 w-4 text-emerald-500" />
            <span>Mensajes WhatsApp ({whatsappLogs.length})</span>
          </button>
        </div>

        {/* TAB 1: BESTSELLERS */}
        {activeTab === "bestsellers" && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-medium text-foreground">Creaciones más vendidas</h2>
                <p className="text-sm text-muted-foreground">Sube, edita o elimina las piezas estrella de la semana.</p>
              </div>
              <Button
                type="button"
                variant="pill"
                size="default"
                onClick={() => openProductModal("bestsellers")}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Subir nueva más vendida</span>
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products
                .filter((p) => p.isWeeklyTop)
                .map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col justify-between rounded-[2rem] border border-border bg-card p-5 shadow-sm transition-all hover:border-gold/50"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold text-primary">
                          Top #{product.weeklyRank || 1} Semanal
                        </span>
                        <span className="font-display text-lg font-bold text-foreground">{product.price}</span>
                      </div>
                      <h3 className="mt-3 font-display text-2xl font-medium text-foreground">{product.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{product.subtitle}</p>
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full bg-muted px-2.5 py-1">📂 {product.category}</span>
                        {product.weeklyOrdersCount && (
                          <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1 font-medium">
                            🔥 {product.weeklyOrdersCount} pedidos
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-2 border-t border-border pt-4">
                      <Button
                        type="button"
                        variant="pillOutline"
                        size="sm"
                        onClick={() => openProductModal("bestsellers", product)}
                        className="gap-1.5"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>Editar</span>
                      </Button>
                      <Button
                        type="button"
                        variant="pillOutline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="gap-1.5 text-destructive hover:border-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Eliminar</span>
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 2: NEW DESIGNS */}
        {activeTab === "newdesigns" && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-medium text-foreground">Nuevos diseños de temporada</h2>
                <p className="text-sm text-muted-foreground">Administra las novedades y colecciones recién lanzadas.</p>
              </div>
              <Button
                type="button"
                variant="pill"
                size="default"
                onClick={() => openProductModal("newdesigns")}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Subir nuevo diseño</span>
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products
                .filter((p) => p.isNewDesign)
                .map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col justify-between rounded-[2rem] border border-border bg-card p-5 shadow-sm transition-all hover:border-gold/50"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full border border-primary/30 bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                          ✨ {product.releaseTag || "Nuevo Diseño"}
                        </span>
                        <span className="font-display text-lg font-bold text-foreground">{product.price}</span>
                      </div>
                      <h3 className="mt-3 font-display text-2xl font-medium text-foreground">{product.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{product.subtitle}</p>
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full bg-muted px-2.5 py-1">📂 {product.category}</span>
                        <span className="rounded-full bg-muted px-2.5 py-1">⏱️ {product.leadTime}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-2 border-t border-border pt-4">
                      <Button
                        type="button"
                        variant="pillOutline"
                        size="sm"
                        onClick={() => openProductModal("newdesigns", product)}
                        className="gap-1.5"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>Editar</span>
                      </Button>
                      <Button
                        type="button"
                        variant="pillOutline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="gap-1.5 text-destructive hover:border-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Eliminar</span>
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES */}
        {activeTab === "categories" && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-medium text-foreground">Gestión de Categorías</h2>
                <p className="text-sm text-muted-foreground">Crea nuevas categorías, edita sus nombres o elimínalas.</p>
              </div>
            </div>

            {/* Create / Edit Category Form */}
            <form onSubmit={handleSaveCategory} className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="w-full sm:flex-1">
                <label htmlFor="cat-name" className="text-xs font-semibold text-muted-foreground">
                  {editingCategory ? `Editando categoría: "${editingCategory}"` : "Nueva categoría"}
                </label>
                <input
                  id="cat-name"
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Ej. Tartas Nupciales, Postres Veganos..."
                  required
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                <Button type="submit" variant="pill" size="default" className="w-full sm:w-auto gap-1.5">
                  <FolderPlus className="h-4 w-4" />
                  <span>{editingCategory ? "Actualizar categoría" : "Crear categoría"}</span>
                </Button>
                {editingCategory && (
                  <Button
                    type="button"
                    variant="pillOutline"
                    size="default"
                    onClick={() => {
                      setEditingCategory(null);
                      setNewCategoryName("");
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>

            {/* Categories List Table */}
            <div className="rounded-[2rem] border border-border bg-card overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="p-4 sm:p-5">Nombre de la Categoría</th>
                    <th className="p-4 sm:p-5">Productos Asociados</th>
                    <th className="p-4 sm:p-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm text-foreground">
                  {categories.map((cat) => {
                    const count = products.filter((p) => p.category === cat).length;
                    return (
                      <tr key={cat} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4 sm:p-5 font-display text-lg font-medium">{cat}</td>
                        <td className="p-4 sm:p-5">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
                            <Package className="h-3.5 w-3.5" />
                            {count} productos
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 text-right space-x-2">
                          <Button
                            type="button"
                            variant="pillOutline"
                            size="sm"
                            onClick={() => {
                              setEditingCategory(cat);
                              setNewCategoryName(cat);
                            }}
                          >
                            Editar
                          </Button>
                          <Button
                            type="button"
                            variant="pillOutline"
                            size="sm"
                            onClick={() => handleDeleteCategory(cat)}
                            className="text-destructive hover:border-destructive hover:bg-destructive/10"
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ANALYTICS / STATISTICS */}
        {activeTab === "analytics" && (
          <div className="mt-8 space-y-8">
            <div>
              <h2 className="font-display text-3xl font-medium text-foreground">Estadísticas y Rendimiento</h2>
              <p className="text-sm text-muted-foreground">Métricas de productos más vendidos por categoría y productos más vistos.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Catálogo</p>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="font-display text-4xl font-bold text-foreground">{totalProducts}</span>
                  <Package className="h-6 w-6 text-primary" />
                </div>
              </div>

              <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Más Vendidas (Semana)</p>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="font-display text-4xl font-bold text-foreground">{bestsellersCount}</span>
                  <Flame className="h-6 w-6 text-primary" />
                </div>
              </div>

              <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nuevos Diseños</p>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="font-display text-4xl font-bold text-foreground">{newDesignsCount}</span>
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
              </div>

              <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pedidos Estimados</p>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="font-display text-4xl font-bold text-foreground">{totalOrdersCount}</span>
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Products Most Viewed & Sold by Category */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Most Viewed Products */}
              <div className="rounded-[2.5rem] border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2 border-b border-border pb-4">
                  <Eye className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-2xl font-medium text-foreground">Productos más vistos</h3>
                </div>
                <ul className="mt-4 divide-y divide-border">
                  {mostViewedProducts.map((p, idx) => (
                    <li key={p.id} className="flex items-center justify-between py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary font-semibold text-primary text-xs">
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-foreground">{p.title}</p>
                          <p className="text-xs text-muted-foreground">{p.category}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-primary bg-secondary px-3 py-1 rounded-full">
                        {(p.weeklyOrdersCount || 10) * 14} visitas
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bestsellers by Category Breakdown */}
              <div className="rounded-[2.5rem] border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2 border-b border-border pb-4">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-2xl font-medium text-foreground">Ventas por Categoría</h3>
                </div>
                <div className="mt-6 space-y-4">
                  {categories.map((cat) => {
                    const catProducts = products.filter((p) => p.category === cat);
                    const catOrders = catProducts.reduce((sum, p) => sum + (p.weeklyOrdersCount || 5), 0);
                    const percentage = Math.min(100, Math.round((catOrders / Math.max(1, totalOrdersCount)) * 100));

                    return (
                      <div key={cat} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-foreground">{cat}</span>
                          <span className="text-xs text-muted-foreground">{catOrders} pedidos ({percentage}%)</span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: WHATSAPP ORDER MESSAGES */}
        {activeTab === "whatsapp" && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-medium text-foreground">Mensajes de Pedidos por WhatsApp</h2>
                <p className="text-sm text-muted-foreground">Registro de solicitudes e interacciones enviadas por los clientes.</p>
              </div>

              {whatsappLogs.length > 0 && (
                <Button
                  type="button"
                  variant="pillOutline"
                  size="sm"
                  onClick={() => {
                    if (window.confirm("¿Vaciar todo el historial de mensajes de WhatsApp?")) {
                      setWhatsappLogs([]);
                    }
                  }}
                  className="text-destructive hover:border-destructive hover:bg-destructive/10"
                >
                  Limpiar historial
                </Button>
              )}
            </div>

            {whatsappLogs.length === 0 ? (
              <div className="rounded-[2.5rem] border border-dashed border-border bg-card/60 p-12 text-center">
                <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-3 font-display text-2xl text-foreground">No hay mensajes registrados</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Los pedidos enviados mediante el botón de WhatsApp aparecerán guardados en este registro.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {whatsappLogs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-[2rem] border border-border bg-card p-6 shadow-sm transition-all hover:border-gold/40"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                          <MessageCircle className="h-5 w-5 fill-emerald-600/10" />
                        </div>
                        <div>
                          <p className="font-display text-xl font-medium text-foreground">{log.clientName}</p>
                          <p className="text-xs text-muted-foreground">{log.clientContact}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
                          {log.itemSummary}
                        </span>
                        <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                      </div>
                    </div>

                    <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-muted/60 p-4 font-sans text-xs leading-relaxed text-foreground/90">
                      {log.fullMessage}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* PRODUCT CREATE / EDIT MODAL */}
      {isProductModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[250] flex items-center justify-center p-4"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsProductModalOpen(false)}
            aria-hidden="true"
          />

          <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2.5rem] border border-gold/40 bg-card p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="font-display text-2xl font-medium text-foreground">
                {editingProduct ? "Editar Creación" : productFormType === "bestsellers" ? "Subir Nueva Más Vendida" : "Subir Nuevo Diseño"}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-6 space-y-5">
              <div>
                <label className="text-xs font-semibold text-foreground">Título del producto *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ej. Torta Celestial Menta & Oro"
                  required
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Subtítulo / Eslogan</label>
                <input
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="Ej. Rosas modeladas a mano"
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground">Categoría *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">Precio *</label>
                  <input
                    type="text"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="Ej. Desde 75€ o 26€"
                    required
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground">Porciones / Formato</label>
                  <input
                    type="text"
                    value={formPortions}
                    onChange={(e) => setFormPortions(e.target.value)}
                    placeholder="Ej. 15 a 20 personas o Caja de 12"
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">Tiempo de anticipación</label>
                  <input
                    type="text"
                    value={formLeadTime}
                    onChange={(e) => setFormLeadTime(e.target.value)}
                    placeholder="Ej. 5 a 7 días"
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Sabores (separados por coma)</label>
                <input
                  type="text"
                  value={formFlavors}
                  onChange={(e) => setFormFlavors(e.target.value)}
                  placeholder="Ej. Vainilla Bourbon, Ganache de Frambuesa"
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              {productFormType === "bestsellers" && (
                <div className="grid grid-cols-2 gap-4 rounded-2xl bg-muted/50 p-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Posición Top Semanal</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={formWeeklyRank}
                      onChange={(e) => setFormWeeklyRank(Number(e.target.value))}
                      className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">Pedidos en la semana</label>
                    <input
                      type="number"
                      min={1}
                      value={formWeeklyOrders}
                      onChange={(e) => setFormWeeklyOrders(Number(e.target.value))}
                      className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm text-foreground"
                    />
                  </div>
                </div>
              )}

              {productFormType === "newdesigns" && (
                <div>
                  <label className="text-xs font-semibold text-foreground">Etiqueta de Lanzamiento</label>
                  <input
                    type="text"
                    value={formReleaseTag}
                    onChange={(e) => setFormReleaseTag(e.target.value)}
                    placeholder="Ej. Colección Temporada, Diseño de Autor"
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-foreground">Descripción detallada</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe la elaboración artesanal, texturas y experiencia..."
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                <Button
                  type="button"
                  variant="pillOutline"
                  size="default"
                  onClick={() => setIsProductModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="pill" size="default">
                  {editingProduct ? "Guardar cambios" : "Publicar creación"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {broadcastingProduct && (
        <WhatsAppBroadcastModal
          product={broadcastingProduct}
          clients={whatsappLogs}
          onClose={() => setBroadcastingProduct(null)}
        />
      )}
    </div>
  );
}
