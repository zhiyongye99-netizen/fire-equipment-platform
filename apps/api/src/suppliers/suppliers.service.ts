import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const suppliers = await this.prisma.supplier.findMany({
      where: { review_status: "approved" },
      orderBy: { created_at: "desc" },
      select: { id: true, name: true, short_name: true, logo_url: true, province: true, city: true, _count: { select: { products: true } } },
    });
    return { data: suppliers };
  }
}
