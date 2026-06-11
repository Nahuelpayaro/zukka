import Link from "next/link";

import { ZukkaWhatsAppButton } from "./zukka-whatsapp-button";

const footerLinks = [
  { label: "Inicio", href: "#top" },
  { label: "Colección", href: "/coleccion" },
  {
    label: "Instagram",
    href: "https://www.instagram.com/zukkaofficial/",
    external: true,
  },
];

export function ZukkaFooter() {
  return (
    <footer className="border-t border-white/10 bg-black" id="footer">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-14">
        <div className="space-y-4">
          <p className="text-[0.62rem] uppercase tracking-[0.36em] text-white/54">ZUKKA / Tienda premium</p>
          <p className="max-w-lg text-2xl uppercase tracking-[0.16em] text-white sm:text-3xl">
            Originales, importadas y elegidas a mano. Envíos a todo el país.
          </p>
          <p className="max-w-xl text-sm leading-7 text-white/68">
            Prendas importadas seleccionadas por la dueña. Acceso directo a cada producto vía checkout de Tienda Nube.
          </p>

          {/* WhatsApp contact — always visible; interactive only when env var is set */}
          <div className="pt-1">
            <ZukkaWhatsAppButton />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs uppercase tracking-[0.28em] text-white/68 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                {...(link.external ? { rel: "noreferrer", target: "_blank" } : {})}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/38">Selección premium conectada a Tienda Nube</p>
        </div>
      </div>
    </footer>
  );
}
