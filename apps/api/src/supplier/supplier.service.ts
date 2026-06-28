import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSupplierProductDto } from "./dto/create-supplier-product.dto";
import { UpdateSupplierProfileDto } from "./dto/update-supplier-profile.dto";
import { ReviewStatus } from "@prisma/client";

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  // ── helpers ──────────────────────────────────────────────────

  private async getSupplierIdByUserId(userId: string): Promise<string> {
    const link = await this.prisma.supplierUser.findFirst({
      where: { user_id: userId },
      select: { supplier_id: true },
    });
    if (!link) throw new ForbiddenException("当前用户未绑定任何供应商");
    return link.supplier_id;
  }

  private maskPhone(phone: string): string {
    return phone.slice(0, 3) + "****" + phone.slice(-4);
  }

  // ── products ──────────────────────────────────────────────────

  async getProducts(userId: string) {
    const supplierId = await this.getSupplierIdByUserId(userId);
    return this.prisma.product.findMany({
      where: { supplier_id: supplierId },
      include: { category: true },
      orderBy: { created_at: "desc" },
    });
  }

  async createProduct(userId: string, dto: CreateSupplierProductDto) {
    const supplierId = await this.getSupplierIdByUserId(userId);
    return this.prisma.product.create({
      data: {
        supplier_id: supplierId,
        category_id: dto.category_id,
        name: dto.name,
        model_no: dto.model_no ?? null,
        brand: dto.brand ?? null,
        description: dto.description ?? null,
        price_min: dto.price_min ?? null,
        price_max: dto.price_max ?? null,
        review_status: dto.submit_for_review ? ReviewStatus.pending : ReviewStatus.draft,
      },
      include: { category: true },
    });
  }

  // ── leads ────────────────────────────────────────────────────

  async getLeads(userId: string) {
    const supplierId = await this.getSupplierIdByUserId(userId);
    const inquiries = await this.prisma.inquiry.findMany({
      where: { supplier_id: supplierId },
      include: {
        user: { select: { id: true, phone: true, nickname: true } },
        product: true,
      },
      orderBy: { created_at: "desc" },
    });

    return inquiries.map((inq) => ({
      ...inq,
      user: inq.user
        ? {
            ...inq.user,
            phone: inq.user.phone ? this.maskPhone(inq.user.phone) : null,
          }
        : null,
    }));
  }

  // ── profile ───────────────────────────────────────────────────

  async getProfile(userId: string) {
    const supplierId = await this.getSupplierIdByUserId(userId);
    return this.prisma.supplier.findUnique({
      where: { id: supplierId },
    });
  }

  async updateProfile(userId: string, dto: UpdateSupplierProfileDto) {
    const supplierId = await this.getSupplierIdByUserId(userId);
    return this.prisma.supplier.update({
      where: { id: supplierId },
      data: dto,
    });
  }
}
