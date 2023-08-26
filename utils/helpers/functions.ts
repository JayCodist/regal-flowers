import Product from "../types/Product";

export function filterInStockProducts(products: Product[]): Product[] {
  return products.filter(product => product.inStock);
}
