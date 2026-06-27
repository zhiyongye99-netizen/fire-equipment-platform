import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations"
  },
  datasource: {
    url:
      process.env["DATABASE_URL"] ??
      "postgresql://rabbit-y@localhost:5432/fire_equipment_platform?schema=public"
  }
});
