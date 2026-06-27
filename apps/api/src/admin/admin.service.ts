import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ReviewStatus, Prisma } from "@prisma/client";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // --- 1. 审核中心 ---
  async getPendingReviews(targetType: string) {
    if (targetType === "supplier") {
      return this.prisma.supplier.findMany({
        where: { review_status: ReviewStatus.pending },
        orderBy: { created_at: "desc" },
      });
    } else if (targetType === "product") {
      return this.prisma.product.findMany({
        where: { review_status: ReviewStatus.pending },
        include: { supplier: true, category: true },
        orderBy: { created_at: "desc" },
      });
    } else if (targetType === "article") {
      return this.prisma.article.findMany({
        where: { review_status: ReviewStatus.pending },
        orderBy: { created_at: "desc" },
      });
    } else if (targetType === "post") {
      return this.prisma.post.findMany({
        where: { review_status: ReviewStatus.pending },
        include: { user: true, circle: true },
        orderBy: { created_at: "desc" },
      });
    }
    return [];
  }

  async processReview(dto: {
    target_type: string;
    target_id: string;
    status: ReviewStatus;
    reason?: string;
    reviewer_id?: string;
  }) {
    const { target_type, target_id, status, reason, reviewer_id } = dto;

    if (status === ReviewStatus.rejected && !reason) {
      throw new BadRequestException("驳回审核必须填写原因");
    }

    // 更新目标实体的审核状态
    if (target_type === "supplier") {
      await this.prisma.supplier.update({
        where: { id: target_id },
        data: { review_status: status, verified_at: status === ReviewStatus.approved ? new Date() : null },
      });
    } else if (target_type === "product") {
      await this.prisma.product.update({
        where: { id: target_id },
        data: { review_status: status },
      });
    } else if (target_type === "article") {
      await this.prisma.article.update({
        where: { id: target_id },
        data: { review_status: status, published_at: status === ReviewStatus.approved ? new Date() : null },
      });
    } else if (target_type === "post") {
      await this.prisma.post.update({
        where: { id: target_id },
        data: { review_status: status },
      });
    }

    // 写入审核记录及操作日志
    const reviewRecord = await this.prisma.reviewRecord.create({
      data: {
        target_type,
        target_id,
        status,
        reason,
        reviewer_id,
      },
    });

    await this.prisma.operationLog.create({
      data: {
        operator_id: reviewer_id ?? "admin",
        action: `REVIEW_${target_type.toUpperCase()}_${status.toUpperCase()}`,
        target_type,
        target_id,
        detail: { status, reason },
      },
    });

    return reviewRecord;
  }

  // --- 2. 操作日志 ---
  async getOperationLogs(limit = 50) {
    return this.prisma.operationLog.findMany({
      take: limit,
      orderBy: { created_at: "desc" },
    });
  }

  // --- 3. 装备分类与参数模板 ---
  async getCategories() {
    return this.prisma.equipmentCategory.findMany({
      include: { children: true, templates: true },
      orderBy: { sort_order: "asc" },
    });
  }

  async createCategory(dto: { name: string; slug: string; parent_id?: string; icon_url?: string; sort_order?: number }) {
    return this.prisma.equipmentCategory.create({
      data: dto,
    });
  }

  async getParameterTemplates(categoryId?: string) {
    return this.prisma.parameterTemplate.findMany({
      where: categoryId ? { category_id: categoryId } : undefined,
      include: { category: true },
      orderBy: { sort_order: "asc" },
    });
  }

  async createParameterTemplate(dto: {
    category_id: string;
    field_key: string;
    field_label: string;
    field_type: string;
    unit?: string;
    options?: Prisma.InputJsonValue;
    sort_order?: number;
    is_required?: boolean;
    is_filterable?: boolean;
    is_comparable?: boolean;
  }) {
    return this.prisma.parameterTemplate.create({
      data: dto,
    });
  }

  // --- 4. 社区管理 ---
  async getCircles() {
    return this.prisma.circle.findMany({
      orderBy: { sort_order: "asc" },
    });
  }

  async createCircle(dto: { name: string; slug: string; description?: string; icon_url?: string; sort_order?: number }) {
    return this.prisma.circle.create({
      data: dto,
    });
  }

  async getPosts() {
    return this.prisma.post.findMany({
      include: { user: true, circle: true, comments: true },
      orderBy: { created_at: "desc" },
    });
  }

  async updatePostStatus(id: string, action: "takedown" | "pin" | "feature", reason?: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException("帖子不存在");

    let updated;
    if (action === "takedown") {
      updated = await this.prisma.post.update({
        where: { id },
        data: { review_status: ReviewStatus.rejected },
      });
    } else {
      updated = post;
    }

    await this.prisma.operationLog.create({
      data: {
        operator_id: "admin",
        action: `POST_${action.toUpperCase()}`,
        target_type: "post",
        target_id: id,
        detail: { reason },
      },
    });

    return updated;
  }
}
