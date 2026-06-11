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
] as const;

/* Repeats per half-track: each half must exceed any viewport width so the
 * -50% -> 0 loop never exposes a gap. 3 claims x 4 reps ~= 4000px. */
const REPS_PER_GROUP = 4;

/** Group of claims repeated enough times to cover the widest viewport */
function ClaimGroup() {
  return (
    // pr-6 mirrors the internal gap so the A->B seam equals one exact period
    <span className="flex shrink-0 items-center gap-6 pr-6">
      {Array.from({ length: REPS_PER_GROUP }).flatMap((_, rep) =>
        TRUST_ITEMS.map((label) => (
          <span key={`${rep}-${label}`} className="flex shrink-0 items-center gap-6">
            <span className="text-[0.72rem] uppercase tracking-[0.22em] text-white/72">{label}</span>
            <span className="text-[0.62rem] text-[#b40f1d]" aria-hidden="true">◆</span>
          </span>
        )),
      )}
    </span>
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
      <div className="animate-marquee flex w-max items-center">
        {/* Primary group */}
        <ClaimGroup />
        {/* Duplicate group — purely visual, hidden from AT */}
        <span aria-hidden="true" className="flex items-center">
          <ClaimGroup />
        </span>
      </div>
    </div>
  );
}
