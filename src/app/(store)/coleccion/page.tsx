import Link from "next/link";

import { ZukkaFooter } from "@/components/zukka/zukka-footer";
import { ZukkaNavbar } from "@/components/zukka/zukka-navbar";
import { ZukkaProductCard } from "@/components/zukka/zukka-product-card";
import { getCollectionProducts } from "@/lib/tiendanube";
import type { Product } from "@/types/product";

type CollectionPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CollectionPage({ searchParams }: CollectionPageProps) {
  const selectedFilters = readSelectedFilters(await searchParams);
  const products = await getCollectionProducts();
  const filterGroups = buildFilterGroups(products);
  const visibleProducts = filterProducts(products, selectedFilters);

  return (
    <div className="min-h-screen bg-black text-white">
      <ZukkaNavbar />
      <main className="border-b border-white/10 bg-[#050505]">
        <section className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="space-y-4">
            <p className="text-[0.68rem] uppercase tracking-[0.32em] text-white/60">Colección importada</p>
            <h1 className="max-w-4xl text-3xl font-semibold uppercase leading-[1.05] tracking-[0.08em] text-white sm:text-5xl lg:text-[3.75rem]">
              Selección premium lista para comprar.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-white/72 sm:text-[0.98rem]">
              Recorré indumentaria importada por marca, tipo de prenda, uso y talle. ZUKKA muestra solo los filtros con datos reales de Tienda Nube.
            </p>
          </div>

          {filterGroups.length > 0 ? (
            <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-[#070707] p-4 sm:grid-cols-2 lg:grid-cols-4">
              {filterGroups.map((group) => (
                <div key={group.label} className="space-y-3">
                  <h2 className="text-[0.62rem] uppercase tracking-[0.24em] text-white/48">{group.label}</h2>
                  <div className="flex flex-wrap gap-2">
                    {group.values.map((value) => (
                      <Link
                        key={value}
                        href={buildFilterHref(group.key, value, selectedFilters)}
                        className={`rounded-full border px-3 py-1 text-xs transition ${
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
              <h2 className="text-xl font-semibold text-white">No hay productos disponibles ahora.</h2>
              <p className="text-sm leading-7">Volvé a intentar en unos minutos o consultanos por Instagram.</p>
              <Link
                href="#footer"
                className="inline-flex rounded-full border border-white/14 px-5 py-3 text-sm font-medium text-white transition hover:border-white/28"
              >
                Consultar disponibilidad
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

function buildFilterHref(key: FilterKey, value: string, selectedFilters: SelectedFilters): string {
  const params = new URLSearchParams();
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
