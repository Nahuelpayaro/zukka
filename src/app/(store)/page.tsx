import type { Metadata } from "next";

import { ZukkaFeaturedCollection } from "@/components/zukka/zukka-featured-collection";
import { ZukkaFooter } from "@/components/zukka/zukka-footer";
import { ZukkaHero } from "@/components/zukka/zukka-hero";
import { ZukkaNavbar } from "@/components/zukka/zukka-navbar";
import { ZukkaTrustStrip } from "@/components/zukka/zukka-trust-strip";
import { getFeaturedProducts } from "@/lib/tiendanube";

export const metadata: Metadata = {
  title: { absolute: "ZUKKA — Indumentaria importada premium" },
  description:
    "Prendas importadas originales, elegidas una por una. Envíos a todo el país. Pagá como quieras en el checkout.",
  openGraph: {
    title: "ZUKKA — Indumentaria importada premium",
    description:
      "Prendas importadas originales, elegidas una por una. Envíos a todo el país.",
    url: "/",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/images/zukka-hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "ZUKKA — Indumentaria importada",
      },
    ],
  },
};

export default async function StorefrontPage() {
  const products = await getFeaturedProducts(6);

  return (
    <div className="min-h-screen bg-black text-white">
      <ZukkaNavbar />
      {/* Flow: hero → marquee band → products. No gap wrappers — sections butt flush. */}
      <main>
        <ZukkaHero />
        <ZukkaTrustStrip />
        <ZukkaFeaturedCollection products={products} />
      </main>
      <ZukkaFooter />
    </div>
  );
}
