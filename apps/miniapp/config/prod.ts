import type { UserConfigExport } from "@tarojs/cli";

const config: UserConfigExport = {
  env: {
    NODE_ENV: '"production"'
  },
  mini: {
    optimizeMainPackage: {
      enable: true
    }
  }
};

export default config;
