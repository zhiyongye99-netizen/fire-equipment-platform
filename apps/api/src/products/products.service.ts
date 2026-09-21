import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { QueryProductsDto } from "./dto/query-products.dto";

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryProductsDto) {
    const { category_id, keyword, price_min, price_max } = query;
    const page = query.page ?? 1;
    const pageSize = query.page_size ?? query.limit ?? 20;
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = { review_status: "approved" };
    if (category_id) where.category_id = category_id;
    if (keyword) where.name = { contains: keyword, mode: "insensitive" };
    if (price_min !== undefined) where.price_min = { gte: price_min };
    if (price_max !== undefined) where.price_max = { lte: price_max };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ is_featured: "desc" }, { created_at: "desc" }],
        include: { supplier: { select: { id: true, name: true, short_name: true } }, category: { select: { id: true, name: true, slug: true } } },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data: items, meta: { total, page, page_size: pageSize, total_pages: Math.ceil(total / pageSize) } };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        supplier: { select: { id: true, name: true, short_name: true, logo_url: true, province: true, city: true } },
        category: { select: { id: true, name: true, slug: true } },
        parameters: { include: { template: { select: { field_label: true, unit: true, sort_order: true } } }, orderBy: { template: { sort_order: "asc" } } },
        capabilities: { include: { capability: { select: { id: true, name: true } } } },
      },
    });
    if (!product) throw new NotFoundException('产品不存在');
    return { data: product };
  }

  async compare(ids: string[]) {
    const products = await this.prisma.product.findMany({
      where: { id: { in: ids }, review_status: "approved" },
      include: {
        parameters: { include: { template: { select: { field_key: true, field_label: true, unit: true, sort_order: true } } }, orderBy: { template: { sort_order: "asc" } } },
        supplier: { select: { id: true, name: true, short_name: true } },
        category: { select: { id: true, name: true } },
      },
    });
    return { data: products };
  }
}
