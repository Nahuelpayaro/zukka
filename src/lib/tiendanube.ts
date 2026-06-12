import "server-only";

import type { Product, ProductAttributes, ProductImage, ProductVariant } from "@/types/product";

type TiendanubeImage = {
  src?: string | null;
  url?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
};

type TiendanubeVariant = {
  id?: string | number | null;
  values?: Array<{ es?: string; en?: string } | string> | null;
  price?: string | number | null;
  promotional_price?: string | number | null;
  stock?: string | number | null;
  available?: boolean | null;
};

type TiendanubeCategory = {
  name?: { es?: string; en?: string } | string | null;
};

type TiendanubeTag = { name?: { es?: string; en?: string } | string | null } | string;

type TiendanubeProduct = {
  id?: string | number | null;
  name?: { es?: string; en?: string } | string | null;
  handle?: { es?: string; en?: string } | string | null;
  description?: { es?: string; en?: string } | string | null;
  canonical_url?: string | null;
  images?: TiendanubeImage[] | null;
  variants?: TiendanubeVariant[] | null;
  categories?: TiendanubeCategory[] | null;
  tags?: TiendanubeTag[] | string | null;
  brand?: { name?: string | null } | string | null;
  vendor?: string | null;
  currency?: string | null;
  stock?: string | number | null;
  published?: boolean | null;
  available?: boolean | null;
};

const FALLBACK_PRODUCTS: Product[] = [
  createFallbackProduct({
    id: "night-route-shirt",
    name: "Night Route Shirt",
    price: 78000,
    category: "Selección ZUKKA",
    mood: "Selección ZUKKA",
    accent: "#B40F1D",
    availability: "available",
  }),
  createFallbackProduct({
    id: "backstage-bomber",
    name: "Backstage Bomber",
    price: 129000,
    category: "Selección ZUKKA",
    mood: "Selección ZUKKA",
    accent: "#B40F1D",
    availability: "available",
  }),
  createFallbackProduct({
    id: "no-street-trouser",
    name: "No Street No Formal Trouser",
    price: 92000,
    category: "Selección ZUKKA",
    mood: "Selección ZUKKA",
    accent: "#B40F1D",
    availability: "available",
  }),
];

/** Category id for the "Destacados" category in Tienda Nube. */
const DESTACADOS_CATEGORY_ID = "39313706";

export async function getFeaturedProducts(limit = 3): Promise<Product[]> {
  // Prefer the curated "Destacados" category; fall back to first N products.
  const categoryProducts = await fetchTiendanubeProductsByCategory(DESTACADOS_CATEGORY_ID, limit);

  if (categoryProducts.length > 0) {
    return categoryProducts;
  }

  const remoteProducts = await fetchTiendanubeProducts(limit);

  if (remoteProducts.length > 0) {
    return remoteProducts;
  }

  return FALLBACK_PRODUCTS.slice(0, limit);
}

export async function getCollectionProducts(categoryId?: string): Promise<Product[]> {
  const remoteProducts = categoryId
    ? await fetchTiendanubeProductsByCategory(categoryId, 48)
    : await fetchTiendanubeProducts(48);

  if (remoteProducts.length > 0) {
    return remoteProducts;
  }

  return categoryId ? [] : FALLBACK_PRODUCTS;
}

export type StoreCategory = { id: string; name: string };

export async function getCategories(): Promise<StoreCategory[]> {
  const storeId = process.env.TIENDANUBE_STORE_ID;
  const accessToken = process.env.TIENDANUBE_ACCESS_TOKEN;

  if (!storeId || !accessToken) {
    return [];
  }

  try {
    const response = await fetch(
      `https://api.tiendanube.com/v1/${storeId}/categories`,
      {
        headers: {
          Authentication: `bearer ${accessToken}`,
          "Content-Type": "application/json",
          "User-Agent": "ZUKKA Storefront (nahuelpayaro)",
        },
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as unknown;

    if (!Array.isArray(payload)) {
      return [];
    }

    return payload
      .map((item: unknown) => {
        if (!item || typeof item !== "object") {
          return null;
        }

        const cat = item as { id?: unknown; name?: unknown };
        const id = String(cat.id ?? "");
        const name = readLocalizedValue(cat.name as TiendanubeProduct["name"]) ?? "";

        if (!id || !name) {
          return null;
        }

        return { id, name } satisfies StoreCategory;
      })
      .filter((cat): cat is StoreCategory => cat !== null);
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const normalizedSlug = decodeURIComponent(slug).trim();

  if (!normalizedSlug) {
    return null;
  }

  const remoteProducts = await fetchTiendanubeProducts(100);
  const remoteProduct = remoteProducts.find((product) => product.slug === normalizedSlug);

  if (remoteProduct) {
    return remoteProduct;
  }

  return FALLBACK_PRODUCTS.find((product) => product.slug === normalizedSlug) ?? null;
}

async function fetchTiendanubeProductsByCategory(categoryId: string, limit: number): Promise<Product[]> {
  const storeId = process.env.TIENDANUBE_STORE_ID;
  const accessToken = process.env.TIENDANUBE_ACCESS_TOKEN;

  if (!storeId || !accessToken) {
    return [];
  }

  try {
    const response = await fetch(
      `https://api.tiendanube.com/v1/${storeId}/products?category_id=${encodeURIComponent(categoryId)}&per_page=${limit}&published=true`,
      {
        headers: {
          Authentication: `bearer ${accessToken}`,
          "Content-Type": "application/json",
          "User-Agent": "ZUKKA Storefront (nahuelpayaro)",
        },
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as unknown;

    if (!Array.isArray(payload)) {
      return [];
    }

    return payload
      .map((item, index) => mapTiendanubeProduct(item, index))
      .filter((product): product is Product => product !== null)
      .slice(0, limit);
  } catch {
    return [];
  }
}

async function fetchTiendanubeProducts(limit: number): Promise<Product[]> {
  const storeId = process.env.TIENDANUBE_STORE_ID;
  const accessToken = process.env.TIENDANUBE_ACCESS_TOKEN;

  if (!storeId || !accessToken) {
    return [];
  }

  try {
    const response = await fetch(
      `https://api.tiendanube.com/v1/${storeId}/products?per_page=${limit}&published=true`,
      {
        headers: {
          Authentication: `bearer ${accessToken}`,
          "Content-Type": "application/json",
          "User-Agent": "ZUKKA Storefront (nahuelpayaro)",
        },
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as unknown;

    if (!Array.isArray(payload)) {
      return [];
    }

    return payload
      .map((item, index) => mapTiendanubeProduct(item, index))
      .filter((product): product is Product => product !== null)
      .slice(0, limit);
  } catch {
    return [];
  }
}

function mapTiendanubeProduct(input: unknown, index: number): Product | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const product = input as TiendanubeProduct;
  const id = String(product.id ?? `zukka-${index + 1}`);
  const name = readLocalizedValue(product.name) ?? `ZUKKA Piece ${index + 1}`;
  const slug = readLocalizedValue(product.handle) ?? id;
  const category = readCategory(product.categories?.[0]) ?? "Selección ZUKKA";
  const images = mapImages(product.images, name, category);
  const externalUrl = product.canonical_url ?? null;
  const variants = mapVariants(product.variants, product.currency ?? "ARS", externalUrl);
  const attributes = inferProductAttributes(product, name, category, variants);
  const variant = product.variants?.[0];
  const price = variants[0]?.price ?? toNumber(variant?.promotional_price) ?? toNumber(variant?.price) ?? 0;
  const availability = resolveAvailability(product, variant, price);
  // Product-level checkoutUrl: points to the first available variant's checkout
  // URL (not a true product-level URL). Used as a fallback when the panel has
  // no selected variant or when variants is empty.
  const checkoutUrl = buildCheckoutUrl(externalUrl, variants.find((item) => item.available !== false)?.id ?? variants[0]?.id);
  const buyActionUrl = buildBuyActionUrl(externalUrl);
  // Sum stock from raw variants BEFORE the price filter so zero-price draft
  // variants don't silently inflate or hide the real stock count.
  const totalStock = computeRawTotalStock(product.variants);

  return {
    id,
    slug,
    name,
    price,
    currency: product.currency ?? "ARS",
    compareAtPrice: variants[0]?.compareAtPrice ?? toNumber(variant?.price),
    category,
    mood: "Selección ZUKKA",
    href: `/producto/${encodeURIComponent(slug)}`,
    externalUrl,
    checkoutUrl,
    buyActionUrl,
    image: images[0],
    images,
    description: cleanProductDescription(readLocalizedValue(product.description)),
    variants,
    attributes,
    availability,
    totalStock,
  };
}

function mapImages(images: TiendanubeImage[] | null | undefined, name: string, category: string): ProductImage[] {
  const mappedImages = images?.map((image) => mapImage(image, name, category)).filter(Boolean) ?? [];

  return mappedImages.length > 0 ? mappedImages : [createGeneratedImage(name, category, "#B40F1D")];
}

function mapVariants(variants: TiendanubeVariant[] | null | undefined, currency: string, productUrl: string | null = null): ProductVariant[] {
  return (variants ?? [])
    .map((variant, index) => {
      const regularPrice = toNumber(variant.price) ?? 0;
      const promotionalPrice = toNumber(variant.promotional_price);
      const price = promotionalPrice && promotionalPrice > 0 ? promotionalPrice : regularPrice;
      const stock = toNumber(variant.stock);
      const id = String(variant.id ?? `variant-${index + 1}`);

      return {
        id,
        name: readVariantName(variant.values),
        hasOptions: hasVariantOptions(variant.values),
        price,
        compareAtPrice: regularPrice > price ? regularPrice : null,
        stock,
        available: typeof variant.available === "boolean" ? variant.available : stock === null ? null : stock > 0,
        checkoutUrl: buildCheckoutUrl(productUrl, id),
      } satisfies ProductVariant;
    })
    // Drop zero-price placeholder variants (e.g. Tienda Nube draft rows with
    // no price set). If this removes ALL variants the panel falls back to the
    // product-level CTA chain (productCheckoutUrl → buyActionUrl → externalUrl).
    .filter((variant) => variant.price > 0);
}

function mapImage(
  image: TiendanubeImage | null | undefined,
  name: string,
  category: string,
): ProductImage {
  const src = image?.src ?? image?.url;

  if (!src) {
    return createGeneratedImage(name, category, "#B40F1D");
  }

  return {
    src,
    alt: image?.alt ?? `${name} — ${category}`,
    blurDataURL: createBlurDataURL("#080808", "#B40F1D"),
    width: image?.width ?? 900,
    height: image?.height ?? 1200,
  };
}

function createFallbackProduct({
  id,
  name,
  price,
  category,
  mood,
  accent,
  availability,
}: {
  id: string;
  name: string;
  price: number;
  category: string;
  mood: string;
  accent: string;
  availability: Product["availability"];
}): Product {
  return {
    id,
    slug: id,
    name,
    price,
    currency: "ARS",
    compareAtPrice: null,
    category,
    mood,
    href: `/producto/${id}`,
    externalUrl: null,
    checkoutUrl: null,
    buyActionUrl: null,
    image: createGeneratedImage(name, category, accent),
    images: [createGeneratedImage(name, category, accent)],
    description: "Prenda seleccionada por ZUKKA. Consultá disponibilidad y opciones de compra.",
    variants: [],
    attributes: { sizes: [] },
    availability,
    totalStock: null,
  };
}

function inferProductAttributes(
  product: TiendanubeProduct,
  name: string,
  category: string,
  variants: ProductVariant[],
): ProductAttributes {
  const categories = (product.categories ?? []).map(readCategory).filter((value): value is string => Boolean(value));
  const tags = readTags(product.tags);
  const searchableValues = [...tags, ...categories, name];
  const brandFromField = readBrandField(product.brand) ?? normalizeAttributeValue(product.vendor);

  return {
    brand: brandFromField ?? readPrefixedValue(searchableValues, ["marca", "brand"]),
    garmentType:
      readPrefixedValue(searchableValues, ["tipo", "prenda", "garment", "type"]) ??
      inferGarmentType(searchableValues),
    usage:
      readPrefixedValue(searchableValues, ["uso", "ocasion", "ocasión", "occasion"]) ??
      inferUsage(searchableValues),
    sizes: inferSizes(tags, variants),
  };
}

function readTags(tags: TiendanubeProduct["tags"]): string[] {
  if (!tags) {
    return [];
  }

  const values = Array.isArray(tags) ? tags : tags.split(",");

  return values
    .map((tag) => {
      if (typeof tag === "string") {
        return tag.trim();
      }

      return readLocalizedValue(tag.name)?.trim() ?? null;
    })
    .filter((value): value is string => Boolean(value));
}

function readBrandField(brand: TiendanubeProduct["brand"]): string | null {
  if (typeof brand === "string") {
    return normalizeAttributeValue(brand);
  }

  return normalizeAttributeValue(brand?.name);
}

function readPrefixedValue(values: string[], keys: string[]): string | null {
  for (const value of values) {
    const [rawKey, ...rawValue] = value.split(/[:=]/);

    if (!rawKey || rawValue.length === 0) {
      continue;
    }

    const key = normalizeSearchText(rawKey);

    if (keys.some((candidate) => normalizeSearchText(candidate) === key)) {
      const normalized = normalizeAttributeValue(rawValue.join(":"));

      if (normalized) {
        return normalized;
      }
    }
  }

  return null;
}

function inferGarmentType(values: string[]): string | null {
  const source = normalizeSearchText(values.join(" "));
  const candidates: Array<[string, string[]]> = [
    ["Remera", ["remera", "t shirt", "t-shirt", "tee"]],
    ["Camisa", ["camisa", "shirt"]],
    ["Campera", ["campera", "bomber", "jacket", "chaqueta"]],
    ["Buzo", ["buzo", "hoodie", "sweater", "sudadera"]],
    ["Pantalón", ["pantalon", "trouser", "pant", "jean"]],
    ["Vestido", ["vestido", "dress"]],
    ["Falda", ["falda", "skirt"]],
    ["Top", ["top"]],
  ];

  return findCandidateLabel(source, candidates);
}

function inferUsage(values: string[]): string | null {
  const source = normalizeSearchText(values.join(" "));
  const candidates: Array<[string, string[]]> = [
    ["Noche", ["noche", "night", "after hours"]],
    ["Urbano", ["urbano", "urban", "street", "ciudad"]],
    ["Evento", ["evento", "event", "salida"]],
    ["Casual", ["casual", "diario", "daily"]],
    ["Formal", ["formal", "oficina", "office"]],
  ];

  return findCandidateLabel(source, candidates);
}

function inferSizes(tags: string[], variants: ProductVariant[]): string[] {
  const taggedSizes = tags
    .map((tag) => readPrefixedValue([tag], ["talle", "size"]))
    .filter((value): value is string => Boolean(value));
  const variantSizes = variants
    .filter((variant) => variant.hasOptions && variant.name)
    .map((variant) => normalizeSizeLabel(variant.name))
    .filter((value): value is string => Boolean(value));

  return uniqueValues([...taggedSizes, ...variantSizes]);
}

function normalizeSizeLabel(value: string | null): string | null {
  const normalized = normalizeAttributeValue(value);

  if (!normalized || !isMeaningfulVariantLabel(normalized)) {
    return null;
  }

  return normalized;
}

function isMeaningfulVariantLabel(value: string): boolean {
  const normalized = normalizeSearchText(value);

  return !["default", "default title", "unico", "único", "sin variante", "variante"].includes(normalized);
}

function findCandidateLabel(source: string, candidates: Array<[string, string[]]>): string | null {
  for (const [label, keywords] of candidates) {
    if (keywords.some((keyword) => source.includes(normalizeSearchText(keyword)))) {
      return label;
    }
  }

  return null;
}

function uniqueValues(values: string[]): string[] {
  return Array.from(new Set(values.map(normalizeAttributeValue).filter((value): value is string => Boolean(value))));
}

function normalizeAttributeValue(value: string | null | undefined): string | null {
  const normalized = value?.replaceAll("_", " ").replaceAll("-", " ").replace(/\s+/g, " ").trim();

  return normalized || null;
}

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveAvailability(
  product: TiendanubeProduct,
  variant: TiendanubeVariant | null | undefined,
  price: number,
): Product["availability"] {
  if (variant?.available === false || product.available === false) {
    return "out_of_stock";
  }

  const variantStock = toNumber(variant?.stock);
  const productStock = toNumber(product.stock);

  if (typeof variantStock === "number") {
    return variantStock > 0 ? "available" : "out_of_stock";
  }

  if (typeof productStock === "number") {
    return productStock > 0 ? "available" : "out_of_stock";
  }

  if (price > 0 && product.published !== false) {
    return "unknown";
  }

  return "out_of_stock";
}

function createGeneratedImage(name: string, category: string, accent: string): ProductImage {
  return {
    src: createPosterDataURL(name, category, accent),
    alt: `${name} — ${category}`,
    blurDataURL: createBlurDataURL("#050505", accent),
    width: 900,
    height: 1200,
  };
}

function createPosterDataURL(name: string, category: string, accent: string): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200">
      <rect width="900" height="1200" rx="40" fill="#080808" />
      <rect x="52" y="52" width="796" height="1096" rx="26" fill="none" stroke="rgba(255,255,255,0.12)" />
      <rect x="92" y="92" width="716" height="760" rx="22" fill="#090909" stroke="rgba(255,255,255,0.08)" />
      <rect x="132" y="132" width="636" height="680" rx="16" fill="none" stroke="rgba(255,255,255,0.12)" />
      <rect x="170" y="192" width="308" height="410" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" />
      <rect x="544" y="160" width="140" height="240" fill="#0b0b0b" stroke="rgba(255,255,255,0.08)" />
      <rect x="196" y="262" width="170" height="236" fill="none" stroke="${accent}" stroke-opacity="0.72" />
      <rect x="92" y="888" width="716" height="4" fill="${accent}" />
      <text x="120" y="968" fill="#ffffff" font-family="Geist, Arial, Helvetica, sans-serif" font-size="74" font-weight="700" letter-spacing="8">ZUKKA</text>
      <text x="120" y="1028" fill="#9a9a9a" font-family="Geist, Arial, Helvetica, sans-serif" font-size="28" letter-spacing="5">${escapeSvg(
        category.toUpperCase(),
      )}</text>
      <text x="120" y="1096" fill="#ffffff" font-family="Geist, Arial, Helvetica, sans-serif" font-size="44">${escapeSvg(
        name,
      )}</text>
      <text x="120" y="1136" fill="${accent}" font-family="Geist, Arial, Helvetica, sans-serif" font-size="22" letter-spacing="3">DISPONIBLE AHORA</text>
      <text x="580" y="1136" fill="#787878" font-family="Geist, Arial, Helvetica, sans-serif" font-size="22" letter-spacing="3">TIENDA OFICIAL</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function createBlurDataURL(primary: string, accent: string): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32">
      <defs>
        <linearGradient id="blur" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${primary}" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
      </defs>
      <rect width="24" height="32" fill="url(#blur)" rx="4" />
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeSvg(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function readLocalizedValue(
  value: TiendanubeProduct["name"] | TiendanubeProduct["handle"] | TiendanubeProduct["description"],
): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  return value.es ?? value.en ?? null;
}

function readVariantName(values: TiendanubeVariant["values"]): string | null {
  const labels = (values ?? [])
    .map((value) => {
      if (typeof value === "string") {
        return value.trim();
      }

      return value?.es?.trim() || value?.en?.trim() || null;
    })
    .filter((value): value is string => Boolean(value));

  return labels.length > 0 ? labels.join(" / ") : null;
}

function hasVariantOptions(values: TiendanubeVariant["values"]): boolean {
  const name = readVariantName(values);

  return name !== null && isMeaningfulVariantLabel(name);
}

function buildCheckoutUrl(productUrl: string | null, variantId: string | undefined): string | null {
  if (!productUrl || !variantId) {
    return null;
  }

  try {
    const url = new URL(productUrl);
    return `${url.origin}/checkout/v3/start/${variantId}/`;
  } catch {
    return null;
  }
}

function buildBuyActionUrl(productUrl: string | null): string | null {
  if (!productUrl) {
    return null;
  }

  try {
    const url = new URL(productUrl);
    return `${url.origin}/comprar/`;
  } catch {
    return null;
  }
}

function cleanProductDescription(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const withoutTags = value.replace(/<[^>]*>/g, " ");
  const decoded = decodeHtmlEntities(withoutTags);
  const normalized = decoded.replace(/\s+/g, " ").trim();

  return normalized || null;
}

function decodeHtmlEntities(value: string): string {
  return value
    .replaceAll("&ntilde;", "ñ")
    .replaceAll("&Ntilde;", "Ñ")
    .replaceAll("&aacute;", "á")
    .replaceAll("&eacute;", "é")
    .replaceAll("&iacute;", "í")
    .replaceAll("&oacute;", "ó")
    .replaceAll("&uacute;", "ú")
    .replaceAll("&Aacute;", "Á")
    .replaceAll("&Eacute;", "É")
    .replaceAll("&Iacute;", "Í")
    .replaceAll("&Oacute;", "Ó")
    .replaceAll("&Uacute;", "Ú")
    .replaceAll("&uuml;", "ü")
    .replaceAll("&Uuml;", "Ü")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&nbsp;", " ");
}

function readCategory(category: TiendanubeCategory | null | undefined): string | null {
  if (!category?.name) {
    return null;
  }

  if (typeof category.name === "string") {
    return category.name.trim() || null;
  }

  return category.name.es?.trim() || category.name.en?.trim() || null;
}

function computeRawTotalStock(rawVariants: TiendanubeVariant[] | null | undefined): number | null {
  if (!rawVariants || rawVariants.length === 0) {
    return null;
  }

  let total = 0;

  for (const variant of rawVariants) {
    const stock = toNumber(variant.stock);

    if (typeof stock !== "number") {
      // Any variant with unknown stock makes total unknown.
      return null;
    }

    total += stock;
  }

  return total;
}

function computeTotalStock(variants: ProductVariant[]): number | null {
  if (variants.length === 0) {
    return null;
  }

  let total = 0;

  for (const variant of variants) {
    if (typeof variant.stock !== "number") {
      // Any variant with unknown stock makes total unknown.
      return null;
    }

    total += variant.stock;
  }

  return total;
}

function toNumber(value: string | number | null | undefined): number | null {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}
