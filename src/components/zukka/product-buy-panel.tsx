"use client";

import { useState } from "react";

import type { ProductVariant } from "@/types/product";

// Show urgency copy only when stock is between 2 and 5 (inclusive).
// Stock = 1 is covered by the "Pieza única" badge on the page; never show it here.
const LOW_STOCK_MIN = 2;
const LOW_STOCK_MAX = 5;

// Guard: only allow https:// URLs as hrefs to avoid javascript: and other unsafe schemes.
function safeHttpsUrl(url: string | null | undefined): string | null {
  if (url && /^https:\/\//.test(url)) {
    return url;
  }
  return null;
}

type ProductBuyPanelProps = {
  variants: ProductVariant[];
  defaultVariantId: string;
  productCheckoutUrl?: string | null;
  /** Fallback store-level buy URL (e.g. /comprar/) when no variant checkout URL is available. */
  buyActionUrl?: string | null;
  externalUrl?: string | null;
  config?: {
    installmentsCount?: number | null;
  };
};

export function ProductBuyPanel({
  variants,
  defaultVariantId,
  productCheckoutUrl,
  buyActionUrl,
  externalUrl,
  config,
}: ProductBuyPanelProps) {
  const selectableVariants = variants.filter((v) => v.hasOptions && v.name);
  const hasSelectableVariants = selectableVariants.length > 0;

  // When selectable variants exist, start with nothing selected so the user
  // must pick a size before the CTA becomes active.
  // Auto-select only in degraded single-CTA mode (no selectable variants).
  const [selectedId, setSelectedId] = useState<string | null>(
    hasSelectableVariants ? null : (defaultVariantId || null),
  );

  const activeVariant = selectedId !== null
    ? (variants.find((v) => v.id === selectedId) ?? null)
    : null;

  // Fallback chain: variant checkoutUrl → product-level checkoutUrl
  // (first-available-variant URL) → store-level buyActionUrl → externalUrl.
  const activeCheckoutUrl =
    safeHttpsUrl(activeVariant?.checkoutUrl) ??
    safeHttpsUrl(productCheckoutUrl) ??
    safeHttpsUrl(buyActionUrl) ??
    safeHttpsUrl(externalUrl) ??
    null;

  const isUnselected = hasSelectableVariants && selectedId === null;

  const isOutOfStock =
    activeVariant !== null &&
    (activeVariant.available === false ||
      (typeof activeVariant.stock === "number" && activeVariant.stock <= 0));

  const isLowStock =
    !isOutOfStock &&
    activeVariant !== null &&
    typeof activeVariant.stock === "number" &&
    activeVariant.stock >= LOW_STOCK_MIN &&
    activeVariant.stock <= LOW_STOCK_MAX;

  const paymentCopy =
    config?.installmentsCount && config.installmentsCount > 0
      ? `Hasta ${config.installmentsCount} cuotas — pago en el checkout de Tienda Nube.`
      : "Pagás como quieras en el checkout de Tienda Nube.";

  // Shared ghost style for disabled/no-URL states. Never red.
  const ghostCta =
    "cursor-not-allowed border border-white/20 bg-transparent text-white/50";

  return (
    <div className="w-full min-w-0 space-y-4">
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
                  onClick={() => {
                    if (!outOfStock) {
                      setSelectedId(variant.id);
                    }
                  }}
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
        {isUnselected ? (
          // No size selected yet — prompt user; not navigating.
          <button
            type="button"
            disabled
            className={[
              "inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black",
              ghostCta,
            ].join(" ")}
          >
            Seleccioná un talle
          </button>
        ) : isOutOfStock ? (
          // Out of stock — native disabled button, correctly announced by AT.
          <button
            type="button"
            disabled
            className={[
              "inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black",
              ghostCta,
            ].join(" ")}
          >
            Sin stock — consultá disponibilidad
          </button>
        ) : activeCheckoutUrl ? (
          // Happy path — valid https:// URL, render as <a>.
          <a
            href={activeCheckoutUrl}
            target="_blank"
            rel="noreferrer"
            className={[
              "inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black",
              "bg-[#b40f1d] hover:bg-[#cc1323]",
            ].join(" ")}
          >
            Comprar
          </a>
        ) : (
          // No checkout URL available — disabled button, not an href-less anchor.
          <button
            type="button"
            disabled
            className={[
              "inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black",
              ghostCta,
            ].join(" ")}
          >
            Comprar
          </button>
        )}
      </div>

      <p className="text-xs leading-6 text-white/42">{paymentCopy}</p>
    </div>
  );
}
