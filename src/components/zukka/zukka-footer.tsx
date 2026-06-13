import Link from "next/link";

import { FOOTER } from "@/lib/copy";

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
          <p className="text-[0.62rem] uppercase tracking-[0.36em] text-white/54">{FOOTER.eyebrow}</p>
          <p className="max-w-lg break-words text-2xl uppercase tracking-[0.08em] text-white sm:text-3xl sm:tracking-[0.16em]">
            {FOOTER.headline}
          </p>
          <p className="max-w-xl text-sm leading-7 text-white/68">
            {FOOTER.sub}
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
                className="text-xs uppercase tracking-[0.28em] text-white/68 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b40f1d] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                {...(link.external ? { rel: "noreferrer", target: "_blank" } : {})}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
