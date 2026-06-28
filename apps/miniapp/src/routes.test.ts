import { describe, expect, it } from "vitest";
import { miniappPages, supplierSubPackagePages } from "./routes";

describe("miniapp routes", () => {
  it("keeps the first phase miniapp pages and supplier workbench routes registered", () => {
    expect(miniappPages).toEqual([
      "pages/home/index",
      "pages/community/index",
      "pages/equipment/index",
      "pages/equipment/detail",
      "pages/equipment/compare",
      "pages/mine/index"
    ]);
    expect(supplierSubPackagePages).toContain("index");
    expect(supplierSubPackagePages).toContain("leads");
  });
});
