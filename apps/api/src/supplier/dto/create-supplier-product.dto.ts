import { IsString, IsOptional, IsNumber, IsPositive, IsBoolean } from "class-validator";

export class CreateSupplierProductDto {
  @IsString()
  name!: string;

  @IsString()
  category_id!: string;

  @IsOptional()
  @IsString()
  model_no?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price_min?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price_max?: number;

  @IsOptional()
  @IsBoolean()
  submit_for_review?: boolean;
}
