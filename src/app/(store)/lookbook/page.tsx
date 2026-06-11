import Link from "next/link";

export default function LookbookPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.45em] text-[#d6d0c8]">Backstage_Archive</p>
          <h1 className="text-4xl font-semibold uppercase tracking-[0.16em] text-white sm:text-5xl">Fragmentos editoriales.</h1>
          <p className="max-w-2xl text-base leading-7 text-white/65">
            Un archivo visual para extender el universo de ZUKKA desde la escena, la ciudad y una estética más cuidada.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
              "Recorridos nocturnos",
              "Pausas urbanas",
              "Encuentros informales",
          ].map((item, index) => (
            <div key={item} className="rounded-[1.5rem] border border-white/10 bg-[#0b0b0b] p-5">
              <p className="text-[0.62rem] uppercase tracking-[0.38em] text-white/45">Scene_0{index + 1}</p>
              <p className="mt-3 text-lg uppercase tracking-[0.2em] text-white">{item}</p>
            </div>
          ))}
        </div>

        <div>
          <Link
            href="/"
            className="inline-flex rounded-full border border-white/15 px-5 py-3 text-xs uppercase tracking-[0.32em] text-white transition hover:border-white/35"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
