"use client";

import React, { useState } from "react";
import { Layout, Menu, Typography, Avatar, Dropdown } from "antd";
import {
  AuditOutlined,
  HomeOutlined,
  AppstoreOutlined,
  SettingOutlined,
  TeamOutlined,
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";

const { Header, Sider, Content } = Layout;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const router = Router();
  const pathname = usePathname();

  function Router() {
    return useRouter();
  }

  const menuItems = [
    { key: "/admin/review", icon: <AuditOutlined />, label: "审核中心" },
    { key: "/admin/home", icon: <HomeOutlined />, label: "首页内容配置" },
    { key: "/admin/categories", icon: <AppstoreOutlined />, label: "装备分类管理" },
    { key: "/admin/parameter-templates", icon: <SettingOutlined />, label: "参数模板管理" },
    { key: "/admin/community", icon: <TeamOutlined />, label: "社区与资讯治理" },
    { key: "/admin/logs", icon: <FileTextOutlined />, label: "操作日志审计" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} theme="dark">
        <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold", fontSize: collapsed ? 14 : 16 }}>
          {collapsed ? "消防智采" : "消防智采运营后台"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0f0f0" }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            平台运营决策与治理工作台
          </Typography.Title>
          <Dropdown
            menu={{
              items: [
                { key: "logout", icon: <LogoutOutlined />, label: "退出登录", onClick: () => router.push("/login") },
              ],
            }}
          >
            <div style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: "#1890ff" }} />
              <span style={{ fontWeight: 500 }}>超级管理员 (Admin)</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: 16, background: "#fff", borderRadius: 8, padding: 24, minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
