/**
 * ZukkaTrustStrip — RSC.
 * Infinite horizontal marquee ticker. No JS — CSS animation only.
 * Respects prefers-reduced-motion via .animate-marquee pause rule in globals.css.
 * Duplicate row carries aria-hidden="true" for seamless visual loop.
 */

const TRUST_ITEMS = [
  "100% originales",
  "Envíos a todo el país",
  "Pagá como quieras en el checkout",
  "Elegidas una por una",
] as const;

/** Single row of claims separated by diamond glyphs */
function ClaimRow() {
  return (
    <>
      {TRUST_ITEMS.map((label) => (
        <span key={label} className="flex shrink-0 items-center gap-6">
          <span className="text-[0.72rem] uppercase tracking-[0.22em] text-white/72">{label}</span>
          <span className="text-[0.62rem] text-[#b40f1d]" aria-hidden="true">◆</span>
        </span>
      ))}
    </>
  );
}

export function ZukkaTrustStrip() {
  return (
    <div
      className="overflow-hidden border-t border-white/8 bg-[#070707] py-4"
      aria-label="Promesas de la tienda"
    >
      {/*
       * Inner track is 200% wide (two copies of the claim row).
       * Animation translates from -50% → 0, so visually content scrolls rightward.
       * width: max-content keeps both copies side-by-side on one line.
       */}
      <div
        className="animate-marquee flex w-max items-center gap-6"
        style={{ animation: "marquee 28s linear infinite" }}
      >
        {/* Primary row */}
        <ClaimRow />
        {/* Duplicate row — purely visual, hidden from AT */}
        <span aria-hidden="true" className="flex items-center gap-6">
          <ClaimRow />
        </span>
      </div>
    </div>
  );
}
