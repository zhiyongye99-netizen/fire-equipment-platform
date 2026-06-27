import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RecommendDto } from "./dto/recommend.dto";

@Injectable()
export class RecommendService {
  constructor(private readonly prisma: PrismaService) {}

  async recommend(dto: RecommendDto) {
    const scene = await this.prisma.scene.findUnique({
      where: { id: dto.scene_id },
      include: { rules: true },
    });
    if (!scene) throw new NotFoundException("场景不存在");

    const requiredCaps = scene.required_capabilities as string[];

    const where: Record<string, unknown> = { review_status: "approved" };
    if (dto.category_id) where.category_id = dto.category_id;
    if (dto.budget_max !== undefined) where.price_max = { lte: dto.budget_max };

    const products = await this.prisma.product.findMany({
      where,
      include: {
        capabilities: { include: { capability: { select: { name: true } } } },
        supplier: { select: { id: true, name: true, short_name: true } },
        category: { select: { id: true, name: true } },
      },
    });

    const rule = scene.rules[0];
    const wHeat = rule?.weight_platform_heat ?? 0.05;

    const scored = products.map((p) => {
      const productCaps = p.capabilities.map((c) => c.capability.name);
      const matched = requiredCaps.filter((c) => productCaps.includes(c)).length;
      const sceneScore = requiredCaps.length > 0 ? matched / requiredCaps.length : 0;
      const heatScore = Math.min(p.view_count / 1000, 1);
      const score = sceneScore * (1 - wHeat) + heatScore * wHeat;
      return { ...p, score: Math.round(score * 100), caps_matched: matched, caps_total: requiredCaps.length };
    });

    scored.sort((a, b) => b.score - a.score);

    return {
      data: scored,
      meta: { scene_name: scene.name, required_capabilities: requiredCaps },
    };
  }
}
