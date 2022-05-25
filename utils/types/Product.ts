export interface ProductImage {
  alt: string;
  src: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  type: "simple" | "composite";
  featured: boolean;
  sku: string;
  price: number;
  regularPrice: number;
  salePrice: number;
  images: ProductImage[];
}

export default Product;
