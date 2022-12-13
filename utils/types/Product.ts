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
export type DesignOptionsMap = Partial<
  Record<DesignOption, "default" | "option">
>;

export interface MinimalProduct {
  key: number;
  name: string;
  subtitle: string;
  sku: string;
  slug: string;
  price: number;
  images: ProductImage;
}

interface Product {
  key: number;
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
  designOptions?: DesignOptionsMap;
  temporaryNotes?: string[];
  description?: string;
  details: string;
  relatedProducts?: MinimalProduct[];
}

export default Product;
