"use client";

import Image from "next/image";
import { useState } from "react";

import type { ProductImage } from "@/types/product";

type ProductGalleryProps = {
  images: ProductImage[];
};

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const active = images[activeIndex] ?? images[0];

  if (!active) return null;

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#090909]">
        <Image
          src={active.src}
          alt={active.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-contain object-center p-3"
          placeholder="blur"
          blurDataURL={active.blurDataURL}
          priority
          unoptimized
        />
      </div>

      {/* Thumbnails — only rendered when there are multiple images */}
      {images.length > 1 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.slice(0, 8).map((image, index) => (
            <button
              key={image.src}
              type="button"
              aria-label={index === 0 ? "Ver foto principal" : `Ver foto ${index + 1}`}
              aria-pressed={activeIndex === index}
              onClick={() => setActiveIndex(index)}
              className={[
                "relative aspect-[4/5] overflow-hidden rounded-[0.9rem] border bg-[#090909] transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b40f1d] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                activeIndex === index
                  ? "border-[#b40f1d]/70 ring-1 ring-[#b40f1d]/50"
                  : "border-white/10 hover:border-white/30",
              ].join(" ")}
            >
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
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
