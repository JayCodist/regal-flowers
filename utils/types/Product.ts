import { DesignOption } from "../constants";
import AddonGroup from "./AddonGroup";

export interface ProductImage {
  alt: string;
  src: string;
}

export interface ProductVariant {
  name: string;
  price: number;
  class: "regular" | "vip";
  design: DesignOption[];
  sku: string;
}

export type DesignOptionName =
  | "wrappedBouquet"
  | "inVase"
  | "inLargeVase"
  | "box";

export type DesignOptionsMap = Partial<
  Record<DesignOptionName, "default" | "option">
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
  longDescription: string;
  subtitle: string;
  sizes?: string[];
  designOptions?: DesignOptionsMap;
  temporaryNotes?: string[];
  description: string;
  details: string;
  relatedProducts?: MinimalProduct[];
  class: "regular" | "vip";
  designNote: string;
  design: string;
  inStock: boolean;
  pageDescription: string;
  info1: string;
  info2: string;
}

export interface Gift {
  name: string;
  image: string;
  description: string;
  slug: string;
}

export default Product;
