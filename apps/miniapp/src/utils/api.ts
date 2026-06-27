import Taro from "@tarojs/taro";
import { getToken } from "./auth";

const BASE_URL = "http://localhost:3000/api";

async function request<T>(
  path: string,
  options?: { method?: "GET" | "POST"; data?: Record<string, unknown> }
): Promise<T> {
  const token = getToken();
  const res = await Taro.request({
    url: `${BASE_URL}${path}`,
    method: options?.method ?? "GET",
    data: options?.data,
    header: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (res.statusCode >= 400) {
    throw new Error(`API error ${res.statusCode}: ${path}`);
  }
  return res.data as T;
}

export interface ApiProduct {
  id: string;
  name: string;
  model_no: string;
  brand: string;
  category_id: string;
  cover_image_url: string | null;
  price_min: string;
  price_max: string;
  description: string;
  review_status: string;
  is_featured: boolean;
  view_count: number;
  inquiry_count: number;
  supplier: { id: string; name: string; short_name: string };
  category: { id: string; name: string; slug: string };
}

export interface ApiProductDetail extends ApiProduct {
  parameters: {
    id: string;
    value: string;
    template: { field_key: string; field_label: string; unit: string | null };
  }[];
  materials: {
    id: string;
    file_name: string;
    file_type: string;
    visibility: string;
  }[];
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
}

export interface ApiListResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number };
}

export const api = {
  auth: {
    wechat: (body: { code: string; nickname?: string; avatarUrl?: string }) =>
      request<{ data: { token: string; user: { id: string; openid: string; role: string; nickname: string | null } } }>("/auth/wechat", {
        method: "POST",
        data: body as Record<string, unknown>,
      }),
  },
  products: {
    list: (params?: { category_id?: string; page?: number; limit?: number }) => {
      const qs = new URLSearchParams();
      if (params?.category_id) qs.set("category_id", params.category_id);
      if (params?.page) qs.set("page", String(params.page));
      if (params?.limit) qs.set("limit", String(params.limit));
      const q = qs.toString();
      return request<ApiListResponse<ApiProduct>>(`/products${q ? `?${q}` : ""}`);
    },
    get: (id: string) => request<{ data: ApiProductDetail }>(`/products/${id}`),
    compare: (ids: string[]) =>
      request<{ data: ApiProductDetail[] }>(`/products/compare?ids=${ids.join(",")}`),
  },
  categories: {
    list: () => request<ApiListResponse<ApiCategory>>("/categories"),
  },
  leads: {
    create: (body: {
      product_id: string;
      contact_name: string;
      contact_phone: string;
      organization?: string;
      remark?: string;
      lead_type?: string;
    }) =>
      request<{ data: { id: string } }>("/leads", {
        method: "POST",
        data: body as Record<string, unknown>,
      }),
  },
};
