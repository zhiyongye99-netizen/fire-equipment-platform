/**
 * Public API surface for supplier-admin.
 * Import from here rather than from individual modules.
 *
 * Usage:
 *   import { productsApi, leadsApi, profileApi, ApiError } from "@/lib/api";
 */

export { productsApi } from "./products";
export { leadsApi } from "./leads";
export { profileApi } from "./profile";
export { ApiError, setToken, clearToken } from "./client";
export type {
  Product,
  ProductStatus,
  CreateProductPayload,
  Lead,
  LeadType,
  LeadStatus,
  LeadTimelineEntry,
  UpdateLeadStatusPayload,
  SupplierProfile,
  ProfileReviewStatus,
  UpdateProfilePayload,
} from "./types";
