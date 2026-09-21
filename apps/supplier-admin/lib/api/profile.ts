import { apiClient } from "./client";
import type { SupplierProfile, UpdateProfilePayload } from "./types";

type ApiReviewStatus = "draft" | "pending" | "approved" | "rejected" | "archived";

interface ApiSupplierProfile {
  id: string;
  name: string;
  unified_code: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  province: string | null;
  city: string | null;
  review_status: ApiReviewStatus;
}

const REVIEW_STATUS_LABEL: Record<ApiReviewStatus, SupplierProfile["reviewStatus"]> = {
  draft: "待审核",
  pending: "待审核",
  approved: "已通过",
  rejected: "已驳回",
  archived: "已驳回",
};

function toProfile(item: ApiSupplierProfile): SupplierProfile {
  return {
    id: item.id,
    companyName: item.name,
    creditCode: item.unified_code ?? "",
    contactName: item.contact_name ?? "",
    contactPhone: item.contact_phone ?? "",
    location: [item.province, item.city].filter((value): value is string => Boolean(value)),
    mainCategories: [],
    serviceRegions: [],
    reviewStatus: REVIEW_STATUS_LABEL[item.review_status],
    reviewComment: null,
  };
}

export const profileApi = {
  /** GET /api/supplier/profile — fetch current supplier profile */
  async get(): Promise<SupplierProfile> {
    const item = await apiClient.get<ApiSupplierProfile>("/api/supplier/profile");
    return toProfile(item);
  },

  /** PUT /api/supplier/profile — update supplier profile */
  async update(payload: UpdateProfilePayload): Promise<SupplierProfile> {
    const [province, city] = payload.location;
    const item = await apiClient.put<ApiSupplierProfile>("/api/supplier/profile", {
      name: payload.companyName,
      unified_code: payload.creditCode,
      contact_name: payload.contactName,
      contact_phone: payload.contactPhone,
      province,
      city,
    });
    return toProfile(item);
  },
};
