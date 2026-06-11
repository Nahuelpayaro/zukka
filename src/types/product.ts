export type ProductImage = {
  src: string;
  alt: string;
  blurDataURL: string;
  width: number;
  height: number;
};

export type ProductVariant = {
  id: string;
  name: string | null;
  hasOptions: boolean;
  price: number;
  compareAtPrice?: number | null;
  stock?: number | null;
  available: boolean | null;
  checkoutUrl?: string | null;
};

export type ProductAttributes = {
  brand?: string | null;
  garmentType?: string | null;
  usage?: string | null;
  sizes: string[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  currency: string;
  compareAtPrice?: number | null;
  category: string;
  mood: string;
  href: string;
  externalUrl?: string | null;
  checkoutUrl?: string | null;
  buyActionUrl?: string | null;
  image: ProductImage;
  images: ProductImage[];
  description?: string | null;
  variants: ProductVariant[];
  attributes: ProductAttributes;
  availability: "available" | "out_of_stock" | "unknown";
};
