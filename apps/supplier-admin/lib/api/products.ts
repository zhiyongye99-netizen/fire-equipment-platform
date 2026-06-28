import { apiClient } from "./client";
import type { Product, CreateProductPayload } from "./types";

export const productsApi = {
  /** GET /api/supplier/products — list all products for the current supplier */
  list(): Promise<Product[]> {
    return apiClient.get<Product[]>("/api/supplier/products");
  },

  /** POST /api/supplier/products — create a new product */
  create(payload: CreateProductPayload): Promise<Product> {
    return apiClient.post<Product>("/api/supplier/products", payload);
  },
};
