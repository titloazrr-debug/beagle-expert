import "server-only";

import {
  getAllProducts,
  getProductById,
  getProductsByIds,
} from "@/lib/content/load-products";

/** Catalogue agrégé (fiches MDX + quiz JSON) */
export const products = getAllProducts();

export { getAllProducts, getProductById, getProductsByIds };
