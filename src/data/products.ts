import imgTortas from "@/assets/creacion-tortas.jpg";
import imgDulces from "@/assets/creacion-dulces.jpg";
import imgEspeciales from "@/assets/creacion-especiales.jpg";

export type ProductCategory =
  | "Tortas de celebración"
  | "Dulces artesanales"
  | "Creaciones especiales"
  | "Cajas degustación y regalos";

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  category: ProductCategory;
  price: string;
  portions?: string;
  leadTime: string;
  img: string;
  alt: string;
  description: string;
  flavors: string[];
  features: string[];
  isWeeklyTop?: boolean;
  weeklyRank?: number;
  weeklyOrdersCount?: number;
  isNewDesign?: boolean;
  releaseTag?: string;
  isSoldOut?: boolean;
  stockQuantity?: number;
}

export const PRODUCTS: Product[] = [
  // --- TORTAS DE CELEBRACIÓN ---
  {
    id: "torta-celestial-rosa-oro",
    title: "Torta Celestial Rosa & Oro",
    subtitle: "Rosas modeladas a mano y detalles en pan de oro",
    category: "Tortas de celebración",
    price: "Desde 75€",
    portions: "15 a 20 personas",
    leadTime: "5 a 7 días",
    img: imgTortas,
    alt: "Torta artesanal rosa con flores turquesas y pan de oro",
    description:
      "Nuestra creación insignia para celebraciones inolvidables. Bizcocho húmedo de vainilla con relleno sedoso de frutos rojos y cobertura aterciopelada en tono rosa empolvado, coronada con rosas de azúcar hechas a mano.",
    flavors: ["Vainilla Bourbon", "Ganache de Frambuesas Silvestres", "Crema Suiza"],
    features: ["Flores modeladas pétalo a pétalo", "Pan de oro comestible de 24k", "Estructura reforzada"],
    isWeeklyTop: true,
    weeklyRank: 1,
    weeklyOrdersCount: 28,
  },
  {
    id: "torta-jardin-menta-turquesa",
    title: "Torta Jardín Celestial Menta & Turquesa",
    subtitle: "Nuevo diseño de temporada con cascada floral",
    category: "Tortas de celebración",
    price: "Desde 85€",
    portions: "20 a 25 personas",
    leadTime: "7 días",
    img: imgTortas,
    alt: "Torta de celebración con tonos menta y flores celestiales",
    description:
      "Una reinterpretación fresca y primaveral con sutiles tonalidades turquesa pastel, bizcocho de pistacho siciliano y crema suave de moras silvestres.",
    flavors: ["Pistacho Bronte", "Crema Diplomática", "Confitura de Moras"],
    features: ["Diseño exclusivo de temporada", "Degradado suave en relieve", "100% Artesanal"],
    isNewDesign: true,
    releaseTag: "Colección Temporada",
  },
  {
    id: "torta-bruma-velvet",
    title: "Torta Bruma Celestial Velvet",
    subtitle: "Textura aterciopelada y acabado contemporáneo",
    category: "Tortas de celebración",
    price: "Desde 65€",
    portions: "10 a 14 personas",
    leadTime: "5 días",
    img: imgTortas,
    alt: "Torta velvet de formato íntimo",
    description:
      "Perfecta para cumpleaños y aniversarios íntimos. Cobertura aterciopelada por pulverización de manteca de cacao y bizcocho húmedo de red velvet.",
    flavors: ["Red Velvet Terciopelo", "Crema de Queso Suave", "Vainilla Tahití"],
    features: ["Efecto terciopelo artesanal", "Tamaño ideal para reuniones", "Corte limpio"],
    isWeeklyTop: true,
    weeklyRank: 2,
    weeklyOrdersCount: 19,
  },

  // --- DULCES ARTESANALES ---
  {
    id: "caja-macarons-royale",
    title: "Colección Macarons Royale (Caja de 12)",
    subtitle: "Conchas crujientes de almendra y ganaches puros",
    category: "Dulces artesanales",
    price: "26€",
    portions: "12 unidades",
    leadTime: "3 a 4 días",
    img: imgDulces,
    alt: "Caja surtida de macarons en tonos pastel",
    description:
      "Elaborados según la receta tradicional francesa con almendra pura española. Corazones sedosos de rosa silvestre, maracuyá y chocolate belga.",
    flavors: ["Rosa & Lichi", "Maracuyá Tropical", "Chocolate 70%", "Lavanda & Miel"],
    features: ["Harina de almendra 100% natural", "Sin gluten de forma natural", "Caja con lazo dorado"],
    isWeeklyTop: true,
    weeklyRank: 1,
    weeklyOrdersCount: 34,
  },
  {
    id: "tartaletas-sablee-frambuesa",
    title: "Tartaletas Sablée con Frambuesas Frescas",
    subtitle: "Nuevo diseño: masa crujiente horneada al punto",
    category: "Dulces artesanales",
    price: "24€",
    portions: "Pack de 6 tartaletas",
    leadTime: "3 días",
    img: imgDulces,
    alt: "Tartaletas individuales con frambuesas y crema",
    description:
      "Base de masa sablée de mantequilla pura, crema diplomática con vainilla en rama y una corona de frambuesas frescas seleccionadas a mano.",
    flavors: ["Frambuesa de Temporada", "Crema Diplomática", "Mantequilla Francesa"],
    features: ["Horneado diario", "Fruta fresca del día", "Presentación individual de lujo"],
    isNewDesign: true,
    releaseTag: "Nuevo Lanzamiento",
  },
  {
    id: "petit-fours-espejo",
    title: "Surtido Petit Fours con Glaseado Espejo",
    subtitle: "Joyas comestibles para mesas de postre",
    category: "Dulces artesanales",
    price: "32€",
    portions: "Caja de 16 bocados",
    leadTime: "4 días",
    img: imgDulces,
    alt: "Bandeja surtida de petit fours con glaseados brillantes",
    description:
      "Pequeños bocados de felicidad con brillante glaseado espejo en gamas rosa y turquesa. Ideales para recepciones de bienvenida y mesas dulces.",
    flavors: ["Mango & Pasión", "Chocolate Blanco & Té Matcha", "Caramelo a la Sal"],
    features: ["Glaseado espejo perfecto", "Formato bocado elegante", "Surtido variado"],
    isWeeklyTop: true,
    weeklyRank: 3,
    weeklyOrdersCount: 16,
  },

  // --- CREACIONES ESPECIALES ---
  {
    id: "torta-nupcial-3-pisos",
    title: "Torta Nupcial Cascada de Flores (3 Pisos)",
    subtitle: "Escultura de boda con montaje in situ",
    category: "Creaciones especiales",
    price: "Desde 320€",
    portions: "50 a 70 personas",
    leadTime: "3 a 6 semanas",
    img: imgEspeciales,
    alt: "Torta nupcial de 3 pisos con flores de azúcar y encaje",
    description:
      "La joya de la corona de Maranatha para enlaces nupciales. Tres pisos majestuosos con filigranas doradas, cascada floral de azúcar y degustación previa de sabores incluida.",
    flavors: ["Bizcocho de Almendras & Dulce de Leche", "Vainilla Bourbon & Frutos Rojos"],
    features: ["Transporte climatizado", "Montaje en la finca incluido", "Prueba de sabores previa"],
    isWeeklyTop: true,
    weeklyRank: 1,
    weeklyOrdersCount: 9,
  },
  {
    id: "creacion-aurora-boreal",
    title: "Torta Escultórica Aurora Boreal",
    subtitle: "Nuevo diseño vanguardista con técnica marmolada",
    category: "Creaciones especiales",
    price: "Desde 220€",
    portions: "35 a 45 personas",
    leadTime: "2 a 3 semanas",
    img: imgEspeciales,
    alt: "Torta artística con técnica marmolada y hojas doradas",
    description:
      "Diseño conceptual inspirado en cielos de fantasía. Acabado marmolado en turquesa celestial y oro, con esferas de azúcar soplada y sabores intensos.",
    flavors: ["Chocolate Rubio Caramelizado", "Praliné de Avellanas", "Bizcocho Especiado"],
    features: ["Técnica de aerografía marmolada", "Esferas artesanales", "Pieza de autor exclusiva"],
    isNewDesign: true,
    releaseTag: "Diseño de Autor",
  },
  {
    id: "torta-corona-perlas",
    title: "Torta Corona de Perlas & Encaje",
    subtitle: "Diseño barroco celestial para grandes aniversarios",
    category: "Creaciones especiales",
    price: "Desde 180€",
    portions: "25 a 35 personas",
    leadTime: "10 a 14 días",
    img: imgEspeciales,
    alt: "Torta con guirnaldas de perlas y encaje comestible",
    description:
      "Inspirada en la estética royal celestial de nuestra identidad de marca. Encaje comestible flexible modelado a mano y guirnaldas de perlas brillantes.",
    flavors: ["Zanahoria & Nueces Pecanas", "Ganache de Queso Dulce", "Canela de Ceilán"],
    features: ["Encaje comestible artesanal", "Guirnaldas perladas de azúcar", "Personalización de placa"],
    isWeeklyTop: true,
    weeklyRank: 2,
    weeklyOrdersCount: 12,
  },

  // --- CAJAS DEGUSTACIÓN Y REGALOS ---
  {
    id: "caja-regalo-maranatha-deluxe",
    title: "Caja Regalo Maranatha Deluxe",
    subtitle: "La experiencia de pastelería celestial lista para obsequiar",
    category: "Cajas degustación y regalos",
    price: "38€",
    portions: "Surtido gourmet",
    leadTime: "2 a 3 días",
    img: imgDulces,
    alt: "Caja de regalo de lujo con lazo dorado y surtido de pastelería",
    description:
      "Una presentación de ensueño con 6 macarons surtidos, 4 mini tartaletas y trufas artesanales de chocolate con avellana, empaquetadas en caja rígida con tarjeta personalizada.",
    flavors: ["Surtido selecto Maranatha"],
    features: ["Tarjeta de dedicatoria caligrafiada", "Empaque con lazo de raso", "Ideal para regalo de cumpleaños"],
    isWeeklyTop: true,
    weeklyRank: 1,
    weeklyOrdersCount: 22,
  },
  {
    id: "caja-degustacion-sabores-novios",
    title: "Caja Degustación Sabores de Boda",
    subtitle: "Nuevo pack para novios y grandes aniversarios",
    category: "Cajas degustación y regalos",
    price: "28€",
    portions: "4 porciones completas de cata",
    leadTime: "4 días",
    img: imgDulces,
    alt: "Caja de degustación para novios con cuatro cortes de bizcocho",
    description:
      "Diseñada especialmente para parejas que desean elegir el sabor de su torta de ensueño desde casa. Incluye cuatro cortes de nuestras combinaciones más aclamadas.",
    flavors: ["Las 4 recetas estrella de boda"],
    features: ["Guía de cata y maridaje", "Descuento aplicable al encargo final", "Entrega refrigerada"],
    isNewDesign: true,
    releaseTag: "Pack Especial Novios",
  },
];

export const CATEGORIES_LIST: ProductCategory[] = [
  "Tortas de celebración",
  "Dulces artesanales",
  "Creaciones especiales",
  "Cajas degustación y regalos",
];
