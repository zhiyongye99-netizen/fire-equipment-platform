import { Controller, Post, Body, Req, UseGuards } from "@nestjs/common";
import { LeadsService } from "./leads.service";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { AuthGuard } from "../common/guards/auth.guard";

interface AuthRequest {
  user: { sub: string; [key: string]: unknown };
}

@Controller("leads")
@UseGuards(AuthGuard)
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  create(@Body() dto: CreateLeadDto, @Req() req: AuthRequest) {
    return this.leadsService.create(dto, req.user.sub);
  }
}
