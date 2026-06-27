import { describe, expect, it } from "vitest";
import { supplierAdminNavigation } from "./navigation";

describe("supplier admin navigation", () => {
  it("registers first phase supplier admin routes", () => {
    expect(supplierAdminNavigation.map((item) => item.path)).toEqual([
      "/dashboard",
      "/company",
      "/products",
      "/materials",
      "/leads"
    ]);
  });
});
