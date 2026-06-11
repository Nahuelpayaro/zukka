import Image from "next/image";
import Link from "next/link";

export function ZukkaHero() {
  return (
    <section
      className="relative overflow-hidden border-b border-white/10 bg-black"
      aria-labelledby="storefront-heading"
    >
      <Image
        src="/images/zukka-hero-bg.jpg"
        alt="Escena editorial ZUKKA con luz roja, copa y bola espejada"
        fill
        priority
        quality={100}
        sizes="100vw"
        className="object-cover object-[68%_center] sm:object-[62%_center] lg:object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.82)_42%,rgba(0,0,0,0.46)_72%,rgba(0,0,0,0.5)_100%)] sm:bg-[linear-gradient(90deg,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.76)_38%,rgba(0,0,0,0.28)_72%,rgba(0,0,0,0.42)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.32)_0%,rgba(0,0,0,0.08)_44%,rgba(0,0,0,0.38)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(180,15,29,0.22),transparent_30%)]" />

      <div className="relative mx-auto flex min-h-[680px] w-full max-w-7xl flex-col justify-end gap-8 px-4 py-12 sm:min-h-[760px] sm:px-6 sm:py-16 lg:min-h-[82vh] lg:justify-center lg:px-8 lg:py-24">
        <div className="max-w-5xl space-y-7">
          <div className="space-y-5">
            <p className="text-[0.72rem] uppercase tracking-[0.34em] text-white/62">Indumentaria importada premium</p>
            <h1 id="storefront-heading" className="max-w-4xl text-[2.35rem] font-semibold uppercase leading-[0.98] tracking-[0.06em] text-white sm:text-[3.4rem] lg:text-[4.6rem]">
              Marcas internacionales. Presencia ZUKKA.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-white/82 sm:text-[1.05rem]">
              Prendas seleccionadas de indumentaria importada para quienes buscan estilo, presencia y una estética urbana más cuidada.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/coleccion"
              className="inline-flex min-w-[14rem] items-center justify-center rounded-full bg-[#b40f1d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#cc1323]"
            >
              Comprar la colección
            </Link>
            <Link
              href="#footer"
              className="inline-flex min-w-[14rem] items-center justify-center rounded-full border border-white/14 bg-transparent px-6 py-3 text-sm font-medium text-white/82 transition hover:border-white/28 hover:text-white"
            >
              Consultar por Instagram
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
