/**
 * ZukkaTrustStrip — RSC.
 * Renders the three confirmed trust claims only. No unverified country-of-origin
 * or brand claims. Copy locked to spec-approved strings.
 */

const TRUST_ITEMS = [
  { icon: "✓", label: "100% originales" },
  { icon: "✓", label: "Envíos a todo el país" },
  { icon: "✓", label: "Pagá como quieras en el checkout" },
] as const;

export function ZukkaTrustStrip() {
  return (
    <div className="border-t border-white/8 bg-[#070707]">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap justify-center gap-x-8 gap-y-4 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        {TRUST_ITEMS.map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-[0.75rem] font-semibold text-[#b40f1d]" aria-hidden="true">
              {icon}
            </span>
            <span className="text-[0.72rem] uppercase tracking-[0.22em] text-white/72">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
