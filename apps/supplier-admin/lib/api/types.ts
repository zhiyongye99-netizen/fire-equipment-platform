/**
 * Shared TypeScript types that mirror the backend API response shapes.
 * Keep these in sync with the backend as the API evolves.
 */

// ─── Products ────────────────────────────────────────────────────────────────

export type ProductStatus = "草稿" | "审核中" | "已上架" | "已驳回" | "已下架";

export interface Product {
  id: string;
  name: string;
  model: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  description: string | null;
  status: ProductStatus;
  updatedAt: string; // ISO date string
}

export interface CreateProductPayload {
  name: string;
  modelNo?: string;
  brand?: string;
  categoryId: string;
  minPrice?: number;
  maxPrice?: number;
  description?: string;
  /** true = submit for review, false = save as draft */
  submitForReview: boolean;
}

// ─── Leads ─────────────────────────────────────────────────────────────────

export type LeadType = "询价" | "索取资料" | "申请演示";
export type LeadStatus = "待跟进" | "已响应" | "已关闭";

export interface LeadTimelineEntry {
  time: string;
  content: string;
}

export interface Lead {
  id: string;
  userName: string;
  unitName: string;
  phone: string;
  product: string;
  type: LeadType;
  region: string;
  demandText: string;
  status: LeadStatus;
  createdAt: string;
  timeline: LeadTimelineEntry[];
}

export interface UpdateLeadStatusPayload {
  status: LeadStatus;
}

// ─── Supplier Profile ────────────────────────────────────────────────────────

export type ProfileReviewStatus = "已通过" | "待审核" | "已驳回";

export interface SupplierProfile {
  id: string;
  companyName: string;
  creditCode: string;
  contactName: string;
  contactPhone: string;
  location: string[]; // e.g. ["jiangsu", "xuzhou"]
  mainCategories: string[];
  serviceRegions: string[];
  reviewStatus: ProfileReviewStatus;
  reviewComment: string | null;
}

export interface UpdateProfilePayload {
  companyName: string;
  creditCode: string;
  contactName: string;
  contactPhone: string;
  location: string[];
  mainCategories: string[];
  serviceRegions: string[];
}
