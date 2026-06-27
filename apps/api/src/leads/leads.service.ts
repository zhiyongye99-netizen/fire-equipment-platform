import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateLeadDto } from "./dto/create-lead.dto";

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLeadDto, userId: string) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id: dto.supplier_id } });
    if (!supplier) throw new BadRequestException("供应商不存在");

    const inquiry = await this.prisma.inquiry.create({
      data: {
        user_id: userId,
        supplier_id: dto.supplier_id,
        product_id: dto.product_id ?? null,
        inquiry_type: dto.inquiry_type,
        region: dto.region ?? null,
        demand_text: dto.demand_text ?? null,
      },
    });

    await this.prisma.product.updateMany({
      where: { id: dto.product_id ?? "" },
      data: { inquiry_count: { increment: 1 } },
    });

    return { data: inquiry, message: "线索发送成功" };
  }
}
