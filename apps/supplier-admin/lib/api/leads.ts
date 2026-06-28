import { apiClient } from "./client";
import type { Lead } from "./types";

export const leadsApi = {
  /** GET /api/supplier/leads — list all leads received by the current supplier */
  list(): Promise<Lead[]> {
    return apiClient.get<Lead[]>("/api/supplier/leads");
  },
};
