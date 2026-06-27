import { describe, expect, it } from "vitest";
import { platformAdminNavigation } from "./navigation";

describe("platform admin navigation", () => {
  it("registers first phase platform admin routes", () => {
    expect(platformAdminNavigation.map((item) => item.path)).toEqual([
      "/admin/review",
      "/admin/home",
      "/admin/categories",
      "/admin/parameter-templates",
      "/admin/community",
      "/admin/logs"
    ]);
  });
});
