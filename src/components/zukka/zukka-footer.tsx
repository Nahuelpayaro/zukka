import Link from "next/link";

const footerLinks = [
  { label: "Inicio", href: "#top" },
  { label: "Productos", href: "#featured-selection" },
  { label: "Instagram", href: "https://instagram.com" },
];

export function ZukkaFooter() {
  return (
    <footer className="border-t border-white/10 bg-black" id="footer">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-14">
        <div className="space-y-4">
          <p className="text-[0.62rem] uppercase tracking-[0.36em] text-white/54">ZUKKA / Tienda premium</p>
          <p className="max-w-lg text-2xl uppercase tracking-[0.16em] text-white sm:text-3xl">
            Comprá indumentaria importada seleccionada por ZUKKA.
          </p>
          <p className="max-w-xl text-sm leading-7 text-white/68">
            Marcas internacionales, prendas seleccionadas y acceso directo para ver cada producto en detalle.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {footerLinks.map((link) => {
              const isExternal = link.href.startsWith("http");

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs uppercase tracking-[0.28em] text-white/68 transition hover:text-white"
                  {...(isExternal ? { rel: "noreferrer", target: "_blank" } : {})}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/38">Selección premium conectada a Tienda Nube</p>
        </div>
      </div>
    </footer>
  );
}
