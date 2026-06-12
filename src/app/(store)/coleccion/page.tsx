import type { Metadata } from "next";
import Link from "next/link";

import { ZukkaFooter } from "@/components/zukka/zukka-footer";
import { ZukkaNavbar } from "@/components/zukka/zukka-navbar";
import { ZukkaProductCard } from "@/components/zukka/zukka-product-card";
import { COLECCION } from "@/lib/copy";
import { getCollectionProducts } from "@/lib/tiendanube";
import type { Product } from "@/types/product";

/** Known store categories. Hardcoded so the UI is deterministic without an extra API round-trip. */
const CATEGORY_CHIPS: Array<{ id: string; label: string }> = [
  { id: "39313707", label: "Vestidos largos" },
  { id: "39313710", label: "Vestidos cortos" },
  { id: "39313711", label: "Monos" },
];

export const metadata: Metadata = {
  title: "Colección",
  description:
    "Filtrá por marca, tipo, uso y talle. Indumentaria importada original, todo disponible para comprar.",
  openGraph: {
    title: "Colección — ZUKKA",
    description:
      "Filtrá por marca, tipo, uso y talle. Indumentaria importada original, todo disponible para comprar.",
    url: "/coleccion",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/images/zukka-hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "ZUKKA — Colección de indumentaria importada",
      },
    ],
  },
};

type CollectionPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CollectionPage({ searchParams }: CollectionPageProps) {
  const params = await searchParams;
  const selectedFilters = readSelectedFilters(params);
  const rawCategoryId = readParam(params?.categoria);
  // Validate against known category ids — unknown/garbage values behave like no filter.
  const activeCategoryId =
    rawCategoryId && CATEGORY_CHIPS.some((cat) => cat.id === rawCategoryId) ? rawCategoryId : undefined;
  // Fetch filtered at the API level when a category chip is active.
  const products = await getCollectionProducts(activeCategoryId);
  const filterGroups = buildFilterGroups(products);
  const visibleProducts = filterProducts(products, selectedFilters);

  return (
    <div className="min-h-screen bg-black text-white">
      <ZukkaNavbar />
      <main className="border-b border-white/10 bg-[#050505]">
        <section className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="space-y-4">
            <p className="text-[0.68rem] uppercase tracking-[0.32em] text-white/60">{COLECCION.eyebrow}</p>
            <h1 className="max-w-4xl text-3xl font-semibold uppercase leading-[1.05] tracking-[0.08em] text-white sm:text-5xl lg:text-[3.75rem]">
              {COLECCION.h1}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-white/72 sm:text-[0.98rem]">
              {COLECCION.sub}
            </p>
          </div>

          {/* Category chips — server-side filter via `categoria` param; no JS needed */}
          <nav aria-label="Filtrar por categoría" className="flex flex-wrap gap-2">
            <Link
              href="/coleccion"
              aria-current={!activeCategoryId ? "page" : undefined}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b40f1d] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                !activeCategoryId
                  ? "border-[#b40f1d]/60 bg-[#12080a] text-white"
                  : "border-white/12 bg-black/40 text-white/78 hover:border-white/24 hover:text-white"
              }`}
            >
              Todos
            </Link>
            {CATEGORY_CHIPS.map((cat) => {
              const isActive = activeCategoryId === cat.id;
              return (
                <Link
                  key={cat.id}
                  href={isActive ? "/coleccion" : `/coleccion?categoria=${cat.id}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b40f1d] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                    isActive
                      ? "border-[#b40f1d]/60 bg-[#12080a] text-white"
                      : "border-white/12 bg-black/40 text-white/78 hover:border-white/24 hover:text-white"
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </nav>

          {filterGroups.length > 0 ? (
            <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-[#070707] p-4 sm:grid-cols-2 lg:grid-cols-4">
              {filterGroups.map((group) => (
                <div key={group.label} className="space-y-3">
                  <h2 className="text-[0.62rem] uppercase tracking-[0.24em] text-white/48">{group.label}</h2>
                  <div className="flex flex-wrap gap-2">
                    {group.values.map((value) => (
                      <Link
                        key={value}
                        href={buildFilterHref(group.key, value, selectedFilters, activeCategoryId)}
                        className={`rounded-full border px-3 py-1 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b40f1d] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                          selectedFilters[group.key] === value
                            ? "border-[#b40f1d]/60 bg-[#12080a] text-white"
                            : "border-white/12 bg-black/40 text-white/78 hover:border-white/24 hover:text-white"
                        }`}
                      >
                        {value}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {visibleProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product, index) => (
                <ZukkaProductCard key={product.id} product={product} priority={index < 2} position={index + 1} />
              ))}
            </div>
          ) : (
            <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-[#070707] p-6 text-white/72 sm:p-8">
              <h2 className="text-xl font-semibold text-white">{COLECCION.emptyTitle}</h2>
              <p className="text-sm leading-7">{COLECCION.emptyBody}</p>
              <Link
                href="#footer"
                className="inline-flex rounded-full border border-white/14 px-5 py-3 text-sm font-medium text-white transition hover:border-white/28 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b40f1d] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {COLECCION.emptyCta}
              </Link>
            </div>
          )}
        </section>
      </main>
      <ZukkaFooter />
    </div>
  );
}

type FilterKey = "marca" | "tipo" | "uso" | "talle";

type SelectedFilters = Partial<Record<FilterKey, string>>;

function buildFilterGroups(products: Product[]): Array<{ key: FilterKey; label: string; values: string[] }> {
  const groups = [
    { key: "marca", label: "Marca", values: uniqueValues(products.map((product) => product.attributes.brand)) },
    { key: "tipo", label: "Tipo", values: uniqueValues(products.map((product) => product.attributes.garmentType)) },
    { key: "uso", label: "Uso", values: uniqueValues(products.map((product) => product.attributes.usage)) },
    { key: "talle", label: "Talle", values: uniqueValues(products.flatMap((product) => product.attributes.sizes)) },
  ] satisfies Array<{ key: FilterKey; label: string; values: string[] }>;

  return groups.filter((group) => group.values.length > 0);
}

function filterProducts(products: Product[], selectedFilters: SelectedFilters): Product[] {
  return products.filter((product) => {
    const matchesBrand = !selectedFilters.marca || product.attributes.brand === selectedFilters.marca;
    const matchesType = !selectedFilters.tipo || product.attributes.garmentType === selectedFilters.tipo;
    const matchesUsage = !selectedFilters.uso || product.attributes.usage === selectedFilters.uso;
    const matchesSize = !selectedFilters.talle || product.attributes.sizes.includes(selectedFilters.talle);

    return matchesBrand && matchesType && matchesUsage && matchesSize;
  });
}

function readSelectedFilters(searchParams?: Record<string, string | string[] | undefined>): SelectedFilters {
  return {
    marca: readParam(searchParams?.marca),
    tipo: readParam(searchParams?.tipo),
    uso: readParam(searchParams?.uso),
    talle: readParam(searchParams?.talle),
  };
}

function readParam(value: string | string[] | undefined): string | undefined {
  const selectedValue = Array.isArray(value) ? value[0] : value;
  const normalized = selectedValue?.trim();

  return normalized || undefined;
}

function buildFilterHref(
  key: FilterKey,
  value: string,
  selectedFilters: SelectedFilters,
  activeCategoryId?: string,
): string {
  const params = new URLSearchParams();

  // Preserve the active category chip so filter links don't reset it.
  if (activeCategoryId) {
    params.set("categoria", activeCategoryId);
  }

  const nextFilters = { ...selectedFilters, [key]: selectedFilters[key] === value ? undefined : value };

  for (const [filterKey, filterValue] of Object.entries(nextFilters)) {
    if (filterValue) {
      params.set(filterKey, filterValue);
    }
  }

  const query = params.toString();

  return query ? `/coleccion?${query}` : "/coleccion";
}

function uniqueValues(values: Array<string | null | undefined>): string[] {
  return Array.from(new Set(values.map((value) => value?.trim()).filter((value): value is string => Boolean(value)))).sort((a, b) =>
    a.localeCompare(b, "es"),
  );
}
