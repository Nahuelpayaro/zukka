import { ZukkaFeaturedCollection } from "@/components/zukka/zukka-featured-collection";
import { ZukkaFooter } from "@/components/zukka/zukka-footer";
import { ZukkaHero } from "@/components/zukka/zukka-hero";
import { ZukkaNavbar } from "@/components/zukka/zukka-navbar";
import { getFeaturedProducts } from "@/lib/tiendanube";

export default async function StorefrontPage() {
  const products = await getFeaturedProducts(6);

  return (
    <div className="min-h-screen bg-black text-white">
      <ZukkaNavbar />
      <main>
        <ZukkaHero />
        <ZukkaFeaturedCollection products={products} />
      </main>
      <ZukkaFooter />
    </div>
  );
}
