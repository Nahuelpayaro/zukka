"use client";

import { useState } from "react";

import type { ProductVariant } from "@/types/product";

const LOW_STOCK_THRESHOLD = 3;

type ProductBuyPanelProps = {
  variants: ProductVariant[];
  defaultVariantId: string;
  productCheckoutUrl?: string | null;
  externalUrl?: string | null;
  config?: {
    installmentsCount?: number | null;
  };
};

export function ProductBuyPanel({
  variants,
  defaultVariantId,
  productCheckoutUrl,
  externalUrl,
  config,
}: ProductBuyPanelProps) {
  const selectableVariants = variants.filter((v) => v.hasOptions && v.name);
  const hasSelectableVariants = selectableVariants.length > 0;

  const [selectedId, setSelectedId] = useState<string>(defaultVariantId);

  const activeVariant = variants.find((v) => v.id === selectedId) ?? variants[0];

  // Fallback chain: variant.checkoutUrl -> product.checkoutUrl -> externalUrl
  const activeCheckoutUrl =
    activeVariant?.checkoutUrl ?? productCheckoutUrl ?? externalUrl ?? null;

  const isOutOfStock =
    activeVariant?.available === false ||
    (typeof activeVariant?.stock === "number" && activeVariant.stock <= 0);

  const isLowStock =
    !isOutOfStock &&
    typeof activeVariant?.stock === "number" &&
    activeVariant.stock > 0 &&
    activeVariant.stock <= LOW_STOCK_THRESHOLD;

  const paymentCopy =
    config?.installmentsCount && config.installmentsCount > 0
      ? `Hasta ${config.installmentsCount} cuotas — pago en el checkout de Tienda Nube.`
      : "Pagás como quieras en el checkout de Tienda Nube.";

  return (
    <div className="space-y-4">
      {hasSelectableVariants ? (
        <div className="space-y-3 rounded-[1.25rem] border border-white/10 bg-[#070707] p-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/72">
            Talle
          </h2>
          <div className="flex flex-wrap gap-2">
            {selectableVariants.map((variant) => {
              const isSelected = variant.id === selectedId;
              const outOfStock =
                variant.available === false ||
                (typeof variant.stock === "number" && variant.stock <= 0);

              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedId(variant.id)}
                  disabled={outOfStock}
                  aria-pressed={isSelected}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                    isSelected
                      ? "border border-[#b40f1d] bg-[#12080a] text-white"
                      : "border border-white/14 bg-black/40 text-white/72 hover:border-white/28 hover:text-white",
                    outOfStock ? "cursor-not-allowed opacity-40" : "cursor-pointer",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {variant.name}
                </button>
              );
            })}
          </div>

          {isLowStock && activeVariant?.stock ? (
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#b40f1d]">
              Últimas {activeVariant.stock} unidades
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-3">
        {isOutOfStock ? (
          <span
            aria-disabled="true"
            className="inline-flex cursor-not-allowed items-center justify-center rounded-full border border-white/20 bg-transparent px-6 py-3 text-sm font-semibold text-white/50"
          >
            Sin stock — consultá disponibilidad
          </span>
        ) : (
          <a
            href={activeCheckoutUrl ?? undefined}
            target="_blank"
            rel="noreferrer"
            aria-disabled={!activeCheckoutUrl ? "true" : undefined}
            onClick={!activeCheckoutUrl ? (e) => e.preventDefault() : undefined}
            className={[
              "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black",
              activeCheckoutUrl
                ? "bg-[#b40f1d] hover:bg-[#cc1323]"
                : "cursor-not-allowed bg-[#b40f1d]/40",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            Comprar
          </a>
        )}
      </div>

      <p className="text-xs leading-6 text-white/42">{paymentCopy}</p>
    </div>
  );
}
