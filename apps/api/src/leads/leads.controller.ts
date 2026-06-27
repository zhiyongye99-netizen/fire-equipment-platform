import { Controller, Post, Body } from "@nestjs/common";
import { LeadsService } from "./leads.service";
import { CreateLeadDto } from "./dto/create-lead.dto";

@Controller("leads")
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  // TODO: 加 AuthGuard 后从 request 取真实 user_id
  @Post()
  create(@Body() dto: CreateLeadDto) {
    const mockUserId = "guest";
    return this.leadsService.create(dto, mockUserId);
  }
}
