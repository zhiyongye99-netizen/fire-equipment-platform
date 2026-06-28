import { apiClient } from "./client";
import type { SupplierProfile, UpdateProfilePayload } from "./types";

export const profileApi = {
  /** GET /api/supplier/profile — fetch current supplier profile */
  get(): Promise<SupplierProfile> {
    return apiClient.get<SupplierProfile>("/api/supplier/profile");
  },

  /** PUT /api/supplier/profile — update supplier profile */
  update(payload: UpdateProfilePayload): Promise<SupplierProfile> {
    return apiClient.put<SupplierProfile>("/api/supplier/profile", payload);
  },
};
