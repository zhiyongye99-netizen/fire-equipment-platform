"use client";

import React from "react";
import { Layout, Menu, Breadcrumb, Avatar, Space, Tag, Typography } from "antd";
import { usePathname, useRouter } from "next/navigation";

const { Header, Content, Sider } = Layout;

const navItems = [
  { key: "/dashboard", label: "工作台", icon: "📊" },
  { key: "/products", label: "产品管理", icon: "📦" },
  { key: "/materials", label: "资料管理", icon: "📂" },
  { key: "/leads", label: "线索中心", icon: "🎯" },
  { key: "/company", label: "企业认证", icon: "🛡️" }
];

const breadcrumbNameMap: Record<string, string> = {
  "/dashboard": "工作台",
  "/products": "产品管理",
  "/materials": "资料管理",
  "/leads": "线索中心",
  "/company": "企业认证"
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const currentBreadcrumb = breadcrumbNameMap[pathname] || "工作台";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={220} theme="dark" breakpoint="lg" collapsedWidth="0">
        <div style={{
          height: 64,
          margin: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: 6,
          padding: "0 12px"
        }}>
          <Typography.Title level={4} style={{ color: "#fff", margin: 0, fontSize: 16, whiteSpace: "nowrap" }}>
            🔥 消防智采供应商端
          </Typography.Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={navItems.map((item) => ({
            key: item.key,
            icon: <span style={{ marginRight: 8 }}>{item.icon}</span>,
            label: item.label
          }))}
          onClick={({ key }) => router.push(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 4px rgba(0,21,41,0.08)", zIndex: 1 }}>
          <Breadcrumb items={[{ title: "首页" }, { title: currentBreadcrumb }]} />
          <Space size="middle">
            <Tag color="green">已认证供应商</Tag>
            <Space style={{ cursor: "pointer" }}>
              <Avatar style={{ backgroundColor: "#1677ff" }}>徐消防</Avatar>
              <Typography.Text strong style={{ color: "#333" }}>
                徐州重型消防装备有限公司
              </Typography.Text>
            </Space>
          </Space>
        </Header>
        <Content style={{ margin: "24px 24px 0", overflow: "initial", background: "#f5f5f5", minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
