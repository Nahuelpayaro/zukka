"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import type { ProductImage } from "@/types/product";

type ProductGalleryProps = {
  images: ProductImage[];
};

/* Minimum horizontal travel (px) to register a swipe instead of a tap */
const SWIPE_THRESHOLD = 40;

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const active = images[activeIndex] ?? images[0];

  if (!active) return null;

  function handleTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null || images.length < 2) return;
    const deltaX = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
    // Swipe left advances, swipe right goes back; wraps at both ends
    const direction = deltaX < 0 ? 1 : -1;
    setActiveIndex((current) => (current + direction + images.length) % images.length);
  }

  return (
    <div className="space-y-4">
      {/* Main image — swipeable on touch devices */}
      <div
        className="relative aspect-[4/5] touch-pan-y overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#090909]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
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
