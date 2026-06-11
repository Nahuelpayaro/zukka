const archiveNotes = [
  {
    label: "Scene_01",
    title: "After_Hours",
    description: "Soft noise, low light and silhouettes built for the route after the route.",
  },
  {
    label: "Scene_02",
    title: "Backstage_Archive",
    description: "Fragments, fittings and moments that live between arrival and disappearance.",
  },
  {
    label: "Scene_03",
    title: "No_Street_No_Formal",
    description: "The tension point where structure relaxes and the city writes the dress code.",
  },
];

export function ZukkaArchiveTeaser() {
  return (
    <section id="backstage-archive" className="border-b border-white/10 bg-black">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 sm:py-18 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
        <div className="space-y-6 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] p-6 sm:p-8">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.45em] text-[#d6d0c8]">Archive teaser</p>
            <h2 className="text-3xl font-semibold uppercase leading-tight tracking-[0.15em] text-white sm:text-4xl">
              An editorial storefront with backstage memory.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-white/65 sm:text-base">
            ZUKKA doesn&apos;t sit inside borrowed categories. The archive is a moodboard of nocturnal routes, informal encounters and contemporary urban elegance.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-[#0b0b0b] p-5">
              <p className="text-[0.62rem] uppercase tracking-[0.4em] text-white/45">City note</p>
              <p className="mt-3 text-lg uppercase tracking-[0.2em] text-white">Presence, not excess.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-[#0b0b0b] p-5">
              <p className="text-[0.62rem] uppercase tracking-[0.4em] text-white/45">Lighting</p>
              <p className="mt-3 text-lg uppercase tracking-[0.2em] text-white">Controlled and cinematic.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {archiveNotes.map((note, index) => (
            <article
              key={note.title}
              className="group rounded-[1.8rem] border border-white/10 bg-white/[0.025] p-5 transition hover:border-white/20 hover:bg-white/[0.04] sm:p-6"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  <p className="text-[0.65rem] uppercase tracking-[0.38em] text-white/45">{note.label}</p>
                  <h3 className="text-2xl uppercase tracking-[0.18em] text-white">{note.title}</h3>
                  <p className="max-w-xl text-sm leading-7 text-white/62 sm:text-base">{note.description}</p>
                </div>
                <div className="flex h-20 w-20 items-end justify-start rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(180,15,29,0.28),rgba(255,255,255,0.04))] p-3 text-[0.8rem] uppercase tracking-[0.2em] text-white/70">
                  0{index + 1}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
