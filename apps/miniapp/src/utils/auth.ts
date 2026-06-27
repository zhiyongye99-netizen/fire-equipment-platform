import Taro from "@tarojs/taro";
import { api } from "./api";

const TOKEN_KEY = "FIRE_E_TOKEN";
const USER_KEY = "FIRE_E_USER";

export interface AuthUser {
  id: string;
  openid: string;
  role: string;
  nickname: string | null;
}

export async function wechatLogin(): Promise<AuthUser> {
  // 1. 调用 wx.login 拿 code
  const loginRes = await Taro.login();
  // 2. 用 code 换 token
  const res = await api.auth.wechat({ code: loginRes.code });
  // 3. 存储 token 和用户信息
  Taro.setStorageSync(TOKEN_KEY, res.data.token);
  Taro.setStorageSync(USER_KEY, res.data.user);
  return res.data.user;
}

export function getToken(): string | null {
  return (Taro.getStorageSync(TOKEN_KEY) as string | undefined) || null;
}

export function getUser(): AuthUser | null {
  return (Taro.getStorageSync(USER_KEY) as AuthUser | undefined) || null;
}

export function logout(): void {
  Taro.removeStorageSync(TOKEN_KEY);
  Taro.removeStorageSync(USER_KEY);
}
