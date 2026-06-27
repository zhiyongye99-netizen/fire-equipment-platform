import { miniappPages, supplierSubPackagePages } from "./routes";

export default defineAppConfig({
  pages: [...miniappPages],
  subPackages: [
    {
      root: "subpackages/supplier",
      pages: [...supplierSubPackagePages]
    }
  ],
  window: {
    navigationBarTitleText: "消防智采",
    navigationBarBackgroundColor: "#ffffff",
    navigationBarTextStyle: "black",
    backgroundColor: "#f5f7fa"
  },
  tabBar: {
    color: "#667085",
    selectedColor: "#d92d20",
    backgroundColor: "#ffffff",
    list: [
      {
        pagePath: "pages/home/index",
        text: "首页"
      },
      {
        pagePath: "pages/community/index",
        text: "消防圈"
      },
      {
        pagePath: "pages/equipment/index",
        text: "选装"
      },
      {
        pagePath: "pages/mine/index",
        text: "我的"
      }
    ]
  }
});
