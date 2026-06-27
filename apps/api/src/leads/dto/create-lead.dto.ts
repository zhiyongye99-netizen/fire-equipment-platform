import { IsString, IsEnum, IsOptional, MaxLength } from "class-validator";

export enum LeadType {
  price_inquiry = "price_inquiry",
  request_material = "request_material",
  request_demo = "request_demo",
}

export class CreateLeadDto {
  @IsString()
  supplier_id: string;

  @IsOptional()
  @IsString()
  product_id?: string;

  @IsEnum(LeadType)
  inquiry_type: LeadType;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  demand_text?: string;
}
