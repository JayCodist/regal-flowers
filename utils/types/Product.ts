import AddonGroup from "./AddonGroup";

export interface ProductImage {
  alt: string;
  src: string;
}

export interface ProductVariant {
  name: string;
  price: number;
  class: "regular" | "vip";
}

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
}

export default Product;
