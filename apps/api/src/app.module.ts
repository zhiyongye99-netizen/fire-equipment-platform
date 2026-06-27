import { Module, ValidationPipe } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { HealthController } from "./health.controller";
import { CategoriesModule } from "./categories/categories.module";
import { ProductsModule } from "./products/products.module";
import { SuppliersModule } from "./suppliers/suppliers.module";
import { LeadsModule } from "./leads/leads.module";
import { RecommendModule } from "./recommend/recommend.module";
import { AdminModule } from "./admin/admin.module";

@Module({
  imports: [
    CategoriesModule,
    ProductsModule,
    SuppliersModule,
    LeadsModule,
    RecommendModule,
    AdminModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true, transform: true }),
    },
  ],
})
export class AppModule {}
