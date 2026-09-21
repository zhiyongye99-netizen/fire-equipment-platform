import { apiClient } from "./client";
import type { Product, CreateProductPayload } from "./types";

type ApiReviewStatus = "draft" | "pending" | "approved" | "rejected" | "archived";

interface ApiSupplierProduct {
  id: string;
  name: string;
  model_no: string | null;
  brand: string | null;
  category: { id: string; name: string } | null;
  price_min: string | number | null;
  price_max: string | number | null;
  description: string | null;
  review_status: ApiReviewStatus;
  updated_at: string;
}

const STATUS_LABEL: Record<ApiReviewStatus, Product["status"]> = {
  draft: "草稿",
  pending: "审核中",
  approved: "已上架",
  rejected: "已驳回",
  archived: "已下架",
};

function toNumber(value: string | number | null): number | null {
  if (value == null) return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toProduct(item: ApiSupplierProduct): Product {
  return {
    id: item.id,
    name: item.name,
    model: item.model_no ?? "-",
    category: item.category?.name ?? "未分类",
    minPrice: toNumber(item.price_min),
    maxPrice: toNumber(item.price_max),
    description: item.description,
    status: STATUS_LABEL[item.review_status],
    updatedAt: item.updated_at,
  };
}

export const productsApi = {
  /** GET /api/supplier/products — list all products for the current supplier */
  async list(): Promise<Product[]> {
    const items = await apiClient.get<ApiSupplierProduct[]>("/api/supplier/products");
    return items.map(toProduct);
  },

  /** POST /api/supplier/products — create a new product */
  async create(payload: CreateProductPayload): Promise<Product> {
    const item = await apiClient.post<ApiSupplierProduct>("/api/supplier/products", {
      name: payload.name,
      category_id: payload.categoryId,
      model_no: payload.modelNo,
      brand: payload.brand,
      price_min: payload.minPrice,
      price_max: payload.maxPrice,
      description: payload.description,
      submit_for_review: payload.submitForReview,
    });
    return toProduct(item);
  },
};
