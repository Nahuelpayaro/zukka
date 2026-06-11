import type { Product } from "@/types/product";

import { FEATURED_COLLECTION } from "@/lib/copy";
import { ZukkaProductCard } from "./zukka-product-card";

type ZukkaFeaturedCollectionProps = {
  products: Product[];
};

export function ZukkaFeaturedCollection({ products }: ZukkaFeaturedCollectionProps) {
  return (
    <section id="featured-selection" className="border-b border-white/10 bg-[#050505]">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <p className="text-[0.68rem] uppercase tracking-[0.32em] text-white/60">{FEATURED_COLLECTION.eyebrow}</p>
            <h2 className="max-w-3xl text-3xl font-semibold uppercase leading-[1.05] tracking-[0.08em] text-white sm:text-4xl lg:text-[2.75rem]">
              {FEATURED_COLLECTION.h2}
            </h2>
          </div>
          <div className="max-w-xl space-y-2">
            <p className="text-sm leading-7 text-white/72 sm:text-[0.96rem]">
              {FEATURED_COLLECTION.sub}
            </p>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <ZukkaProductCard key={product.id} product={product} priority={index === 0} position={index + 1} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-white/10 bg-[#070707] p-8 text-white/72">
            No hay productos para mostrar en este momento.
          </div>
        )}
      </div>
    </section>
  );
}
