import React, { useEffect } from "react";
import "./app.scss";
import { wechatLogin } from "./utils/auth";

export default function App({ children }: { children?: React.ReactNode }) {
  useEffect(() => {
    wechatLogin().catch(() => {
      // 静默登录失败不影响浏览，只记录
      console.warn("静默登录失败，以游客身份浏览");
    });
  }, []);

  return children;
}
