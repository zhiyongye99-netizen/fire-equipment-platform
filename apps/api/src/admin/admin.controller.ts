import { Controller, Get, Post, Body, Param, Query, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AuthGuard } from "../common/guards/auth.guard";
import { ReviewStatus, Prisma } from "@prisma/client";

@Controller("admin")
@UseGuards(AuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // --- 1. 审核中心接口 ---
  @Get("reviews")
  getPendingReviews(@Query("target_type") targetType: string) {
    return this.adminService.getPendingReviews(targetType || "supplier");
  }

  @Post("reviews/action")
  processReview(
    @Body()
    body: {
      target_type: string;
      target_id: string;
      status: ReviewStatus;
      reason?: string;
      reviewer_id?: string;
    }
  ) {
    return this.adminService.processReview(body);
  }

  // --- 2. 操作日志审计接口 ---
  @Get("logs")
  getOperationLogs(@Query("limit") limit?: string) {
    return this.adminService.getOperationLogs(limit ? parseInt(limit, 10) : 50);
  }

  // --- 3. 装备分类与参数模板接口 ---
  @Get("categories")
  getCategories() {
    return this.adminService.getCategories();
  }

  @Post("categories")
  createCategory(
    @Body() body: { name: string; slug: string; parent_id?: string; icon_url?: string; sort_order?: number }
  ) {
    return this.adminService.createCategory(body);
  }

  @Get("parameter-templates")
  getParameterTemplates(@Query("category_id") categoryId?: string) {
    return this.adminService.getParameterTemplates(categoryId);
  }

  @Post("parameter-templates")
  createParameterTemplate(
    @Body()
    body: {
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
    }
  ) {
    return this.adminService.createParameterTemplate(body);
  }

  // --- 4. 社区管理接口 ---
  @Get("community/circles")
  getCircles() {
    return this.adminService.getCircles();
  }

  @Post("community/circles")
  createCircle(
    @Body() body: { name: string; slug: string; description?: string; icon_url?: string; sort_order?: number }
  ) {
    return this.adminService.createCircle(body);
  }

  @Get("community/posts")
  getPosts() {
    return this.adminService.getPosts();
  }

  @Post("community/posts/:id/action")
  updatePostStatus(
    @Param("id") id: string,
    @Body() body: { action: "takedown" | "pin" | "feature"; reason?: string }
  ) {
    return this.adminService.updatePostStatus(id, body.action, body.reason);
  }
}
