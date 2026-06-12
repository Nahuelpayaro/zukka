import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductBuyPanel } from "@/components/zukka/product-buy-panel";
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
  const attributeRows = buildAttributeRows(product);
  const defaultVariantId = product.variants[0]?.id ?? "";
  const installmentsCountProp = installmentsCount ?? undefined;

  return (
    <div className="min-h-screen bg-black text-white">
      <ZukkaNavbar />
      <main className="border-b border-white/10 bg-[#050505]">
        <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:px-8 lg:py-16">
          <div className="space-y-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#090909]">
              <Image
                src={product.images[0]?.src ?? product.image.src}
                alt={product.images[0]?.alt ?? product.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-contain object-center p-3"
                placeholder="blur"
                blurDataURL={product.images[0]?.blurDataURL ?? product.image.blurDataURL}
                priority
                unoptimized
              />
            </div>

            {product.images.length > 1 ? (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {product.images.slice(1, 5).map((image) => (
                  <div key={image.src} className="relative aspect-[4/5] overflow-hidden rounded-[0.9rem] border border-white/10 bg-[#090909]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 768px) 33vw, 180px"
                      className="object-contain object-center p-2"
                      placeholder="blur"
                      blurDataURL={image.blurDataURL}
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-7 lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/12 bg-[#0c0c0c] px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-white/78">
                  {product.category}
                </span>
                <span className="rounded-full border border-[#b40f1d]/45 bg-[#12080a] px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-white">
                  {availabilityLabel}
                </span>
              </div>

              <h1 className="text-3xl font-semibold uppercase leading-[1.03] tracking-[0.06em] text-white sm:text-5xl">
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

            {attributeRows.length > 0 ? (
              <div className="grid gap-3 rounded-[1.25rem] border border-white/10 bg-[#070707] p-4 sm:grid-cols-2">
                {attributeRows.map((row) => (
                  <div key={row.label} className="space-y-1 rounded-xl border border-white/10 bg-black/35 px-3 py-3">
                    <h2 className="text-[0.62rem] uppercase tracking-[0.22em] text-white/44">{row.label}</h2>
                    <p className="text-sm font-medium text-white/86">{row.value}</p>
                  </div>
                ))}
              </div>
            ) : null}

            <ProductBuyPanel
              variants={product.variants}
              defaultVariantId={defaultVariantId}
              productCheckoutUrl={product.checkoutUrl}
              buyActionUrl={product.buyActionUrl}
              externalUrl={product.externalUrl}
              config={{ installmentsCount: installmentsCountProp }}
            />

            {/* WhatsApp secondary contact — visible, config-gated interactive state */}
            <ZukkaWhatsAppButton productName={product.name} />

            <Link
              href="/coleccion"
              className="inline-flex items-center justify-center rounded-full border border-white/14 px-6 py-3 text-sm font-medium text-white/82 transition hover:border-white/28 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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

function buildAttributeRows(product: Product): Array<{ label: string; value: string }> {
  return [
    { label: "Marca", value: product.attributes.brand },
    { label: "Tipo", value: product.attributes.garmentType },
    { label: "Uso", value: product.attributes.usage },
    { label: "Talle", value: product.attributes.sizes.join(" / ") || null },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value));
}
