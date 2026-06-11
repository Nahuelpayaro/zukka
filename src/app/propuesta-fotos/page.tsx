import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Propuesta · Fotos de catálogo con IA | ZUKKA",
  description:
    "Propuesta para generar fotos de catálogo profesionales a partir de fotos de celular.",
  robots: { index: false, follow: false },
};

const steps = [
  {
    number: "01",
    title: "Sacás la foto en el local",
    detail:
      "Con el celular, como siempre. Prenda colgada, frente y espalda. No hace falta nada más.",
  },
  {
    number: "02",
    title: "El sistema genera las fotos",
    detail:
      "La prenda aparece puesta en una modelo, con fondo e iluminación de estudio, en formato catálogo. Frente y espalda, listas en minutos.",
  },
  {
    number: "03",
    title: "Directo a la tienda",
    detail:
      "Las fotos quedan con calidad y estética uniformes para publicar en la tienda online.",
  },
];

const modelProfiles = [
  {
    name: "Sofía",
    style: "Prendas clásicas y elegantes",
    detail: "Morena, pelo recogido, expresión serena.",
  },
  {
    name: "Valentina",
    style: "Prendas casuales y juveniles",
    detail: "Rubia oscura, pelo suelto, sonrisa natural.",
  },
  {
    name: "Luna",
    style: "Prendas de noche y fiesta",
    detail: "Pelo negro lacio, look editorial sofisticado.",
  },
];

function ComparisonCard({
  label,
  before,
  after,
}: {
  label: string;
  before: string;
  after: string;
}) {
  return (
    <div className="space-y-4">
      <p className="text-[0.7rem] uppercase tracking-[0.3em] text-white/55">{label}</p>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <figure className="space-y-2">
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10">
            <Image
              src={before}
              alt={`Foto original de celular — ${label}`}
              fill
              sizes="(max-width: 640px) 45vw, 320px"
              className="object-cover"
            />
          </div>
          <figcaption className="text-center text-xs text-white/55">
            Foto de celular
          </figcaption>
        </figure>
        <figure className="space-y-2">
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-[#b40f1d]/40 ring-1 ring-[#b40f1d]/25">
            <Image
              src={after}
              alt={`Foto de catálogo generada — ${label}`}
              fill
              sizes="(max-width: 640px) 45vw, 320px"
              className="object-cover"
            />
          </div>
          <figcaption className="text-center text-xs font-medium text-white/80">
            Foto de catálogo
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

export default function PropuestaFotosPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="space-y-5">
        <p className="text-[0.72rem] uppercase tracking-[0.34em] text-white/62">
          ZUKKA · Propuesta
        </p>
        <h1 className="max-w-3xl text-[2.1rem] font-semibold uppercase leading-[1.02] tracking-[0.05em] text-white sm:text-[3rem]">
          De la foto del probador a la foto de catálogo
        </h1>
        <p className="max-w-2xl text-base leading-8 text-white/80">
          Hoy las fotos de la tienda se hacen a mano, una por una. Esta propuesta
          automatiza ese trabajo: vos mandás la foto del celular y el sistema
          devuelve la foto profesional con modelo, lista para publicar.
        </p>
      </header>

      <section className="mt-16 space-y-8" aria-labelledby="antes-despues">
        <h2
          id="antes-despues"
          className="text-xl font-semibold uppercase tracking-[0.08em] text-white"
        >
          El resultado, con una prenda real del local
        </h2>
        <div className="grid gap-10 md:grid-cols-2 md:gap-8">
          <ComparisonCard
            label="Vestido rojo · Frente"
            before="/images/propuesta/43-frente-celular.jpeg"
            after="/images/propuesta/43-frente-modelo.png"
          />
          <ComparisonCard
            label="Vestido rojo · Espalda"
            before="/images/propuesta/43-trasera-celular.jpeg"
            after="/images/propuesta/43-trasera-modelo.png"
          />
        </div>
      </section>

      <section className="mt-16 space-y-8" aria-labelledby="como-funciona">
        <h2
          id="como-funciona"
          className="text-xl font-semibold uppercase tracking-[0.08em] text-white"
        >
          Cómo funciona
        </h2>
        <ol className="grid gap-6 sm:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.number}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
            >
              <span className="text-sm font-semibold text-[#cc1323]">{step.number}</span>
              <h3 className="mt-2 text-base font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">{step.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 space-y-8" aria-labelledby="modelos">
        <h2
          id="modelos"
          className="text-xl font-semibold uppercase tracking-[0.08em] text-white"
        >
          Tres modelos, una estética
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-white/70">
          Cada tipo de prenda tiene su modelo asignada, siempre con el mismo fondo,
          la misma luz y el mismo encuadre. El catálogo completo queda uniforme,
          como una producción de estudio.
        </p>
        <div className="grid gap-6 sm:grid-cols-3">
          {modelProfiles.map((profile) => (
            <div
              key={profile.name}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
            >
              <h3 className="text-base font-semibold text-white">{profile.name}</h3>
              <p className="mt-1 text-sm font-medium text-[#cc1323]">{profile.style}</p>
              <p className="mt-2 text-sm leading-6 text-white/70">{profile.detail}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:max-w-md">
          {["/images/propuesta/ejemplo-1.png", "/images/propuesta/ejemplo-2.png"].map(
            (src) => (
              <div
                key={src}
                className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10"
              >
                <Image
                  src={src}
                  alt="Ejemplo de foto de catálogo generada"
                  fill
                  sizes="(max-width: 640px) 45vw, 220px"
                  className="object-cover"
                />
              </div>
            )
          )}
        </div>
      </section>

      <section className="mt-16 space-y-6" aria-labelledby="inversion">
        <h2
          id="inversion"
          className="text-xl font-semibold uppercase tracking-[0.08em] text-white"
        >
          La inversión
        </h2>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-3xl font-semibold text-white">USD 10</p>
              <p className="mt-1 text-sm text-white/70">
                Carga única de créditos. Sin suscripción ni costo mensual.
              </p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-white">~250 fotos</p>
              <p className="mt-1 text-sm text-white/70">
                Lo que rinden esos créditos. El catálogo actual completo usa
                cerca de la mitad.
              </p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-white">12 meses</p>
              <p className="mt-1 text-sm text-white/70">
                Validez de los créditos. Lo que sobra queda para los productos
                nuevos del año.
              </p>
            </div>
          </div>
          <p className="mt-6 border-t border-white/10 pt-5 text-sm leading-7 text-white/70">
            Es un sistema prepago: nunca se puede gastar más de lo cargado. Cada
            foto generada cuesta alrededor de 4 centavos de dólar.
          </p>
        </div>
      </section>

      <footer className="mt-16 border-t border-white/10 pt-8">
        <p className="text-sm leading-7 text-white/60">
          Las imágenes de esta página fueron generadas con el sistema propuesto, a
          partir de fotos reales sacadas en el local.
        </p>
      </footer>
    </main>
  );
}
