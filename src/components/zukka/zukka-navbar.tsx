import Link from "next/link";

const navigation = [
  { label: "Colección", href: "/coleccion" },
  { label: "Contacto", href: "#footer" },
];

export function ZukkaNavbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/94 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="space-y-1" id="top">
          <span className="block text-2xl font-semibold tracking-[0.34em] text-white sm:text-[1.7rem]">
            ZUKKA
          </span>
          <span className="block text-[0.62rem] uppercase tracking-[0.28em] text-white/56">Indumentaria importada</span>
        </Link>

        <nav className="hidden items-center gap-3 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm text-white/72 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/coleccion"
          className="inline-flex items-center rounded-full bg-[#b40f1d] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#cc1323]"
        >
          Ver colección
        </Link>
      </div>
    </header>
  );
}
