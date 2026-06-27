import { Controller, Post, Body } from "@nestjs/common";
import { RecommendService } from "./recommend.service";
import { RecommendDto } from "./dto/recommend.dto";

@Controller("recommend")
export class RecommendController {
  constructor(private readonly recommendService: RecommendService) {}

  @Post()
  recommend(@Body() dto: RecommendDto) {
    return this.recommendService.recommend(dto);
  }
}
