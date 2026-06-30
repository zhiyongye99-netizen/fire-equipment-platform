import { api, type ApiProduct, type ApiProductDetail } from "../utils/api";

export interface EquipmentCardItem {
  id: string;
  name: string;
  supplierId?: string;
  categoryName?: string;
  supplierName?: string;
  coverImage?: string;
  priceRange?: string;
  tags?: { text: string; color: "red" | "blue" | "green" }[];
  specsLine?: string;
}

export interface DetailProductView {
  id: string;
  supplierId: string;
  name: string;
  categoryName: string;
  supplierName: string;
  priceRange: string;
  coverImage?: string;
  imageLabels: string[];
  tags: string[];
  overview: string;
  parameters: Record<string, string>;
  materials: { title: string; type: string }[];
  inquiryCount: number;
}

export interface CompareProductView {
  id: string;
  supplierId: string;
  name: string;
  supplierName: string;
  imageLabel: string;
  coverImage?: string;
  priceRange: string;
  parameters: Record<string, string>;
}

export interface LeadFormValues {
  supplierId: string;
  productId: string;
  contactName: string;
  phone: string;
  organization?: string;
  remark?: string;
}

function compactText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

export function formatPriceRange(product: Pick<ApiProduct, "price_min" | "price_max">): string {
  const min = compactText(product.price_min);
  const max = compactText(product.price_max);

  if (min && max && min !== max) return `¥${min} - ¥${max}`;
  if (min || max) return `¥${min || max}`;
  return "价格待询";
}

function getSupplierName(product: ApiProduct): string {
  return compactText(product.supplier?.short_name) || compactText(product.supplier?.name) || "供应商待完善";
}

function appendUnit(value: string, unit?: string | null): string {
  const cleanUnit = compactText(unit);
  if (!value || !cleanUnit || value.includes(cleanUnit)) return value || "--";
  return `${value}${cleanUnit}`;
}

function mapParameters(product: ApiProductDetail): Record<string, string> {
  return product.parameters.reduce<Record<string, string>>((result, item) => {
    const label = compactText(item.template?.field_label);
    if (!label) return result;

    result[label] = appendUnit(compactText(item.value), item.template?.unit);
    return result;
  }, {});
}

function getSpecsLine(parameters: Record<string, string>): string {
  return Object.entries(parameters)
    .slice(0, 3)
    .map(([label, value]) => `${label} ${value}`)
    .join(" / ");
}

export function mapProductCardItem(product: ApiProductDetail | ApiProduct): EquipmentCardItem {
  const parameters = "parameters" in product ? mapParameters(product) : {};

  return {
    id: product.id,
    name: product.name,
    supplierId: product.supplier?.id,
    categoryName: product.category?.name,
    supplierName: getSupplierName(product),
    coverImage: product.cover_image_url || undefined,
    priceRange: formatPriceRange(product),
    tags: [
      product.category?.name ? { text: product.category.name, color: "blue" } : null,
      product.is_featured ? { text: "重点推荐", color: "red" } : null,
    ].filter((tag): tag is { text: string; color: "red" | "blue" | "green" } => Boolean(tag)),
    specsLine: getSpecsLine(parameters) || "核心参数待完善",
  };
}

export function mapProductDetail(product: ApiProductDetail): DetailProductView {
  const parameters = mapParameters(product);
  const categoryName = product.category?.name || "装备分类待完善";
  const supplierName = getSupplierName(product);

  return {
    id: product.id,
    supplierId: product.supplier?.id || "",
    name: product.name,
    categoryName,
    supplierName,
    priceRange: formatPriceRange(product),
    coverImage: product.cover_image_url || undefined,
    imageLabels: product.cover_image_url ? ["装备图片"] : ["装备外观", "装备细节", "资料图片"],
    tags: [categoryName, product.brand || product.model_no, product.is_featured ? "重点推荐" : ""].map(compactText).filter(Boolean),
    overview: compactText(product.description) || "该装备说明暂未完善，可通过询价/索资料向供应商进一步确认。",
    parameters,
    materials: (product.materials || []).map(item => ({
      title: item.file_name,
      type: item.file_type || "资料",
    })),
    inquiryCount: product.inquiry_count || 0,
  };
}

export function mapProductForCompare(product: ApiProductDetail): CompareProductView {
  const parameters = mapParameters(product);
  const categoryName = product.category?.name || "未分类";
  const supplierName = getSupplierName(product);

  return {
    id: product.id,
    supplierId: product.supplier?.id || "",
    name: product.name,
    supplierName,
    imageLabel: categoryName,
    coverImage: product.cover_image_url || undefined,
    priceRange: formatPriceRange(product),
    parameters: {
      "分类/领域": categoryName,
      供应商: supplierName,
      价格参考: formatPriceRange(product),
      ...parameters,
    },
  };
}

export async function fetchProductCards(): Promise<EquipmentCardItem[]> {
  const res = await api.products.list({ page_size: 20 });
  return res.data.map(mapProductCardItem);
}

export async function fetchProductDetail(id: string): Promise<DetailProductView> {
  const res = await api.products.get(id);
  return mapProductDetail(res.data);
}

export async function fetchCompareProducts(ids: string[]): Promise<CompareProductView[]> {
  if (ids.length === 0) return [];
  const res = await api.products.compare(ids);
  const productById = new Map(res.data.map(product => [product.id, mapProductForCompare(product)]));
  return ids.map(id => productById.get(id)).filter((product): product is CompareProductView => Boolean(product));
}

export function buildLeadPayload(values: LeadFormValues) {
  const organization = compactText(values.organization);
  const remark = compactText(values.remark);
  const lines = [
    `联系人：${compactText(values.contactName)}`,
    `联系电话：${compactText(values.phone)}`,
    organization ? `单位/地区：${organization}` : "",
    remark ? `需求备注：${remark}` : "",
  ].filter(Boolean);

  return {
    supplier_id: values.supplierId,
    product_id: values.productId,
    inquiry_type: "price_inquiry" as const,
    region: organization || undefined,
    demand_text: lines.join("\n"),
  };
}

export function createLead(values: LeadFormValues) {
  return api.leads.create(buildLeadPayload(values));
}
