import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductBuyPanel } from "@/components/zukka/product-buy-panel";
import { ProductGallery } from "@/components/zukka/product-gallery";
import { ZukkaFooter } from "@/components/zukka/zukka-footer";
import { ZukkaNavbar } from "@/components/zukka/zukka-navbar";
import { ZukkaTrustStrip } from "@/components/zukka/zukka-trust-strip";
import { ZukkaWhatsAppButton } from "@/components/zukka/zukka-whatsapp-button";
import { installmentsCount } from "@/lib/config";
import { PRODUCT_BADGES } from "@/lib/copy";
import { getProductBySlug } from "@/lib/tiendanube";
import type { Product } from "@/types/product";

/** Static brand fallback used when a product has no images. */
const BRAND_OG_IMAGE = "/images/zukka-hero-bg.jpg";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: { absolute: "Producto no encontrado — ZUKKA" } };
  }

  const rawImage = product.images[0]?.src ?? product.image?.src;
  const ogImage = rawImage && !rawImage.startsWith("data:") ? rawImage : BRAND_OG_IMAGE;
  const ogImageAlt = product.images[0]?.alt ?? product.image?.alt ?? `${product.name} — ZUKKA`;
  const description =
    product.description?.slice(0, 155) ||
    `${product.name} — indumentaria importada original. Comprá ahora en ZUKKA con envíos a todo el país.`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: `${product.name} — ZUKKA`,
      description,
      url: `/producto/${slug}`,
      locale: "es_AR",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 800,
          height: 1000,
          alt: ogImageAlt,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const priceLabel = formatPrice(product.price, product.currency);
  const compareAtLabel =
    typeof product.compareAtPrice === "number" && product.compareAtPrice > product.price
      ? formatPrice(product.compareAtPrice, product.currency)
      : null;
  const availabilityLabel = getAvailabilityLabel(product.availability);
  const isUniquePiece = product.totalStock === 1 && product.availability !== "out_of_stock";
  const description = product.description ?? "";
  const defaultVariantId = product.variants[0]?.id ?? "";
  const installmentsCountProp = installmentsCount ?? undefined;

  return (
    <div className="min-h-screen bg-black text-white">
      <ZukkaNavbar />
      <main className="border-b border-white/10 bg-[#050505]">
        <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:px-8 lg:py-16">
          <ProductGallery
            images={product.images.length > 0 ? product.images : [product.image]}
          />

          <div className="min-w-0 space-y-7 lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/12 bg-[#0c0c0c] px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-white/78">
                  {product.category}
                </span>
                <span className="rounded-full border border-[#b40f1d]/45 bg-[#12080a] px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-white">
                  {availabilityLabel}
                </span>
              </div>

              <h1 className="break-words text-xl font-semibold uppercase leading-[1.15] tracking-[0.04em] text-white sm:text-2xl lg:text-3xl">
                {product.name}
              </h1>

              <div className="space-y-1">
                <div className="flex flex-wrap items-baseline gap-3">
                  <p className="text-2xl font-semibold text-white sm:text-3xl">{priceLabel}</p>
                  {isUniquePiece ? (
                    <span className="rounded-full border border-[#b40f1d]/40 bg-[#0e0608] px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-[#ff8a94]">
                      {PRODUCT_BADGES.uniquePiece}
                    </span>
                  ) : null}
                </div>
                {compareAtLabel ? <p className="text-base text-white/42 line-through">{compareAtLabel}</p> : null}
              </div>
            </div>

            {description ? <p className="text-sm leading-7 text-white/72 sm:text-base sm:leading-8">{description}</p> : null}

            <ProductBuyPanel
              variants={product.variants}
              defaultVariantId={defaultVariantId}
              productId={product.id}
              buyActionUrl={product.buyActionUrl}
              externalUrl={product.externalUrl}
              config={{ installmentsCount: installmentsCountProp }}
            />

            {/* WhatsApp secondary contact — visible, config-gated interactive state */}
            <ZukkaWhatsAppButton productName={product.name} />

            <Link
              href="/coleccion"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/14 px-6 py-3 text-sm font-medium text-white/82 transition hover:border-white/28 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto"
            >
              Volver a la colección
            </Link>
          </div>
        </section>
      </main>
      <ZukkaTrustStrip />
      <ZukkaFooter />
    </div>
  );
}

function formatPrice(price: number, currency: string): string {
  if (price <= 0) {
    return "Consultar precio";
  }

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency || "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

function getAvailabilityLabel(availability: Product["availability"]): string {
  if (availability === "out_of_stock") {
    return "Sin stock";
  }

  if (availability === "available") {
    return "Disponible";
  }

  return "Consultar stock";
}

