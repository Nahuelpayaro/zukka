const stripItems = [
  "Nocturnal routes",
  "Urban pauses",
  "Informal encounters",
  "Backstage energy",
];

export function ZukkaEditorialStrip() {
  return (
    <section id="editorial-strip" className="border-b border-white/10 bg-[#090909]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p className="text-xs uppercase tracking-[0.42em] text-white/45">Editorial territory</p>
        <div className="flex flex-wrap gap-3">
          {stripItems.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 px-4 py-2 text-[0.7rem] uppercase tracking-[0.32em] text-white/78"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
