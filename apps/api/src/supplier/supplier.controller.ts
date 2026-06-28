import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Req,
  UseGuards,
} from "@nestjs/common";
import { SupplierService } from "./supplier.service";
import { AuthGuard } from "../common/guards/auth.guard";
import { CreateSupplierProductDto } from "./dto/create-supplier-product.dto";
import { UpdateSupplierProfileDto } from "./dto/update-supplier-profile.dto";

interface AuthRequest {
  user: { sub: string; [key: string]: unknown };
  [key: string]: unknown;
}

@Controller("supplier")
@UseGuards(AuthGuard)
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get("products")
  getProducts(@Req() req: AuthRequest) {
    return this.supplierService.getProducts(req.user.sub);
  }

  @Post("products")
  createProduct(
    @Req() req: AuthRequest,
    @Body() dto: CreateSupplierProductDto,
  ) {
    return this.supplierService.createProduct(req.user.sub, dto);
  }

  @Get("leads")
  getLeads(@Req() req: AuthRequest) {
    return this.supplierService.getLeads(req.user.sub);
  }

  @Get("profile")
  getProfile(@Req() req: AuthRequest) {
    return this.supplierService.getProfile(req.user.sub);
  }

  @Put("profile")
  updateProfile(
    @Req() req: AuthRequest,
    @Body() dto: UpdateSupplierProfileDto,
  ) {
    return this.supplierService.updateProfile(req.user.sub, dto);
  }
}
