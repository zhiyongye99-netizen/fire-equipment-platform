import { describe, expect, it, vi } from "vitest";
import Taro from "@tarojs/taro";
import { buildLeadPayload, fetchProductCards, mapProductCardItem, mapProductDetail, mapProductForCompare } from "./equipment";
import type { ApiProductDetail } from "../utils/api";

vi.mock("@tarojs/taro", () => ({
  default: {
    getStorageSync: vi.fn(),
    request: vi.fn(),
  },
}));

const apiProduct: ApiProductDetail = {
  id: "prod-1",
  name: "32米举高喷射消防车",
  model_no: "JGP32",
  brand: "中联重科",
  category_id: "cat-1",
  cover_image_url: "https://example.com/product.jpg",
  price_min: "1200000",
  price_max: "1500000",
  description: "适用于高层建筑火灾扑救。",
  review_status: "approved",
  is_featured: true,
  view_count: 32,
  inquiry_count: 8,
  supplier: { id: "sup-1", name: "中联重科股份有限公司", short_name: "中联重科" },
  category: { id: "cat-1", name: "消防车辆", slug: "vehicles" },
  parameters: [
    {
      id: "p-1",
      value: "32",
      template: { field_key: "height", field_label: "最大作业高度", unit: "米" }
    },
    {
      id: "p-2",
      value: "80L/s",
      template: { field_key: "flow", field_label: "额定流量", unit: "L/s" }
    }
  ],
  materials: [{ id: "m-1", file_name: "检验报告.pdf", file_type: "PDF", visibility: "public" }]
};

describe("equipment service mappers", () => {
  it("maps product detail API data to miniapp detail view data", () => {
    const detail = mapProductDetail(apiProduct);

    expect(detail).toMatchObject({
      id: "prod-1",
      supplierId: "sup-1",
      categoryName: "消防车辆",
      supplierName: "中联重科",
      coverImage: "https://example.com/product.jpg",
      priceRange: "¥1200000 - ¥1500000"
    });
    expect(detail.parameters).toEqual({
      最大作业高度: "32米",
      额定流量: "80L/s"
    });
    expect(detail.materials).toEqual([{ title: "检验报告.pdf", type: "PDF" }]);
  });

  it("maps product data for list cards and compare tables", () => {
    expect(mapProductCardItem(apiProduct)).toMatchObject({
      id: "prod-1",
      supplierId: "sup-1",
      supplierName: "中联重科",
      coverImage: "https://example.com/product.jpg",
      priceRange: "¥1200000 - ¥1500000"
    });

    const compare = mapProductForCompare(apiProduct);
    expect(compare.parameters).toMatchObject({
      "分类/领域": "消防车辆",
      供应商: "中联重科",
      价格参考: "¥1200000 - ¥1500000",
      最大作业高度: "32米"
    });
  });

  it("builds the backend lead payload without using the deprecated inquiries shape", () => {
    expect(
      buildLeadPayload({
        supplierId: "sup-1",
        productId: "prod-1",
        contactName: "张三",
        phone: "13800138000",
        organization: "某市消防救援支队",
        remark: "请提供检测报告"
      })
    ).toEqual({
      supplier_id: "sup-1",
      product_id: "prod-1",
      inquiry_type: "price_inquiry",
      region: "某市消防救援支队",
      demand_text: "联系人：张三\n联系电话：13800138000\n单位/地区：某市消防救援支队\n需求备注：请提供检测报告"
    });
  });

  it("requests product list with the backend page_size parameter", async () => {
    vi.mocked(Taro.request).mockResolvedValue({
      statusCode: 200,
      data: { data: [apiProduct], meta: { total: 1, page: 1, page_size: 20, total_pages: 1 } }
    } as never);

    await fetchProductCards();

    expect(Taro.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "http://localhost:3000/api/products?page_size=20"
      })
    );
  });
});
