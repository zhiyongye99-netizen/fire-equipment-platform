import { IsString, IsOptional, IsNumber, Min } from "class-validator";
import { Type } from "class-transformer";

export class RecommendDto {
  @IsString()
  scene_id: string;

  @IsOptional()
  @IsString()
  category_id?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  budget_max?: number;

  @IsOptional()
  @IsString()
  region?: string;
}
