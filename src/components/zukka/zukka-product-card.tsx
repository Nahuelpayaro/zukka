import Image from "next/image";
import Link from "next/link";

import { PRODUCT_BADGES, PRODUCT_META } from "@/lib/copy";
import type { Product } from "@/types/product";

type ZukkaProductCardProps = {
  product: Product;
  priority?: boolean;
  position?: number;
};

export function ZukkaProductCard({ product, priority = false, position = 1 }: ZukkaProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: product.currency || "ARS",
    maximumFractionDigits: 0,
  }).format(product.price);
  const formattedCompareAtPrice =
    typeof product.compareAtPrice === "number" && product.compareAtPrice > product.price
      ? new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: product.currency || "ARS",
          maximumFractionDigits: 0,
        }).format(product.compareAtPrice)
      : null;

  const isExternal = product.href.startsWith("http");
  // attributes.sizes is already filtered/normalized by tiendanube.ts; render only when non-empty.
  const sizeLabel =
    product.attributes.sizes.length > 0
      ? `${PRODUCT_META.sizePrefix} ${product.attributes.sizes.join(", ")}`
      : null;
  const hasRealImage = !product.image.src.startsWith("data:image/svg+xml");
  const isUniquePiece = product.totalStock === 1 && product.availability !== "out_of_stock";
  const categoryLabel = product.category?.trim() ? product.category.replaceAll("_", " ") : "Prenda importada";
  const availabilityLabel =
    product.availability === "out_of_stock"
      ? "Sin stock"
      : product.availability === "available"
        ? "Disponible"
        : "Consultar stock";
  const availabilityClassName =
    product.availability === "out_of_stock"
      ? "border-white/12 bg-white/6 text-white/72"
      : product.availability === "available"
        ? "border-[#b40f1d]/45 bg-[#12080a] text-white"
        : "border-white/12 bg-[#0c0c0c] text-white/86";
  const priceLabel = product.price > 0 ? formattedPrice : "Consultar precio";

  return (
    <article className="group overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#060606] transition hover:border-white/22 hover:bg-[#080808]">
      <Link
        href={product.href}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b40f1d] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        aria-label={`Ver ${product.name}`}
        {...(isExternal ? { rel: "noreferrer", target: "_blank" } : {})}
      >
        <div className="p-3 sm:p-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1rem] border border-white/10 bg-[#090909]">
            <Image
              src={product.image.src}
              alt={product.image.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`transition duration-700 group-hover:scale-[1.02] ${hasRealImage ? "object-contain object-center p-3 opacity-[0.98]" : "object-cover opacity-100"}`}
              placeholder="blur"
              blurDataURL={product.image.blurDataURL}
              priority={priority}
              unoptimized
            />
            {!hasRealImage ? (
              <>
                <div className="absolute inset-[1.35rem] border border-white/[0.05]" />
                <div className="absolute left-[18%] top-[18%] h-[55%] w-[42%] bg-white/[0.02]" />
                <div className="absolute left-[26%] top-[27%] h-[24%] w-[22%] border border-[#b40f1d]/40" />
              </>
            ) : null}
          </div>
        </div>

        <div className="space-y-4 border-t border-white/10 px-4 pb-5 pt-4 sm:px-5 sm:pb-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em] ${availabilityClassName}`}>
                {availabilityLabel}
              </span>
              {isUniquePiece ? (
                <span className="rounded-full border border-[#b40f1d]/40 bg-[#0e0608] px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-[#ff8a94]">
                  {PRODUCT_BADGES.uniquePiece}
                </span>
              ) : null}
            </div>
            <span className="text-[0.62rem] uppercase tracking-[0.22em] text-white/36">{String(position).padStart(2, "0")}</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
            <div className="space-y-1.5">
              <p className="text-[0.76rem] leading-5 text-white/58">{product.attributes.brand ?? categoryLabel}</p>
              <h3 className="text-lg font-medium leading-6 text-white">{product.name}</h3>
              {sizeLabel ? (
                <p className="text-[0.68rem] uppercase tracking-[0.14em] text-white/42">{sizeLabel}</p>
              ) : null}
            </div>
            <div className="space-y-1 text-left sm:text-right">
              <p className="text-lg font-semibold tracking-[0.01em] text-white">{priceLabel}</p>
              {formattedCompareAtPrice ? <p className="text-sm text-white/40 line-through">{formattedCompareAtPrice}</p> : null}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-full bg-white px-4 py-3 text-sm font-semibold text-black transition group-hover:bg-[#b40f1d] group-hover:text-white">
            <span>Ver producto</span>
            <span aria-hidden="true">→</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
