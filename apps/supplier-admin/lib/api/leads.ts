import { apiClient } from "./client";
import type { Lead } from "./types";

type ApiInquiryType = "price_inquiry" | "request_material" | "request_demo";
type ApiInquiryStatus = "pending" | "followed" | "closed";

interface ApiSupplierLead {
  id: string;
  inquiry_type: ApiInquiryType;
  region: string | null;
  demand_text: string | null;
  status: ApiInquiryStatus;
  created_at: string;
  user: { nickname: string | null; phone: string | null } | null;
  product: { name: string } | null;
}

const TYPE_LABEL: Record<ApiInquiryType, Lead["type"]> = {
  price_inquiry: "询价",
  request_material: "索取资料",
  request_demo: "申请演示",
};

const STATUS_LABEL: Record<ApiInquiryStatus, Lead["status"]> = {
  pending: "待跟进",
  followed: "已响应",
  closed: "已关闭",
};

function toLead(item: ApiSupplierLead): Lead {
  return {
    id: item.id,
    userName: item.user?.nickname || "消防用户",
    unitName: "未填写单位",
    phone: item.user?.phone || "未授权查看",
    product: item.product?.name || "未指定产品",
    type: TYPE_LABEL[item.inquiry_type],
    region: item.region || "未填写地区",
    demandText: item.demand_text || "用户暂未填写详细需求",
    status: STATUS_LABEL[item.status],
    createdAt: item.created_at,
    timeline: [{ time: item.created_at, content: "用户提交线索" }],
  };
}

export const leadsApi = {
  /** GET /api/supplier/leads — list all leads received by the current supplier */
  async list(): Promise<Lead[]> {
    const items = await apiClient.get<ApiSupplierLead[]>("/api/supplier/leads");
    return items.map(toLead);
  },
};
