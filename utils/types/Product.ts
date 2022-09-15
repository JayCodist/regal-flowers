import AddonGroup from "./AddonGroup";

export interface ProductImage {
  alt: string;
  src: string;
  _id: string;
}

export interface ProductVariant {
  name: string;
  price: number;
  class: "regular" | "vip";
}

export type DesignOption = "wrappedBouquet" | "inVase" | "inLargeVase" | "box";

interface Product {
  id: number;
  name: string;
  slug: string;
  type: "simple" | "variable";
  featured: boolean;
  sku: string;
  price: number;
  salePrice: number;
  images: ProductImage[];
  variants: ProductVariant[];
  addonsGroups: AddonGroup[];
  productDescription: string;
  subtitle: string;
  sizes?: string[];
  designOptions?: DesignOption[];
  note?: string;
  description?: string;
  details: string;
}

export default Product;
