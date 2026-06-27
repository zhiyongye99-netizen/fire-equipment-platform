import { defineConfig, type UserConfigExport } from "@tarojs/cli";
import devConfig from "./dev";
import prodConfig from "./prod";

const baseConfig: UserConfigExport = {
  projectName: "消防智采",
  date: "2026-06-27",
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: "src",
  outputRoot: "dist",
  framework: "react",
  compiler: "webpack5",
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      }
    }
  }
};

export default defineConfig(async (merge, { command }) => {
  if (command === "build") {
    return merge({}, baseConfig, prodConfig);
  }

  return merge({}, baseConfig, devConfig);
});
