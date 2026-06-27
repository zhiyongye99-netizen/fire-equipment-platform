import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const categories = await this.prisma.equipmentCategory.findMany({
      where: { parent_id: null },
      orderBy: { sort_order: "asc" },
      include: {
        children: {
          orderBy: { sort_order: "asc" },
        },
      },
    });
    return { data: categories };
  }
}
