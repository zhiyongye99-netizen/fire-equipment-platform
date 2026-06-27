import { Module } from "@nestjs/common";
import { RecommendController } from "./recommend.controller";
import { RecommendService } from "./recommend.service";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [RecommendController],
  providers: [RecommendService, PrismaService],
})
export class RecommendModule {}
