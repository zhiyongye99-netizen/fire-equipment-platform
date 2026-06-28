"use client";

import React from "react";
import { Card, Typography, Table, Tag, Tooltip } from "antd";

export default function LogsPage() {
  const mockLogs = [
    {
      id: "log-1",
      operator_id: "超级管理员 (Admin)",
      action: "REVIEW_SUPPLIER_APPROVED",
      target_type: "supplier",
      target_id: "sup-1 (三一重工消防装备)",
      detail: JSON.stringify({ status: "approved", note: "五证齐全，企业资质核验通过" }),
      ip: "192.168.1.101",
      created_at: "2026-06-27 11:20:15",
    },
    {
      id: "log-2",
      operator_id: "超级管理员 (Admin)",
      action: "POST_TAKEDOWN",
      target_type: "post",
      target_id: "post-2",
      detail: JSON.stringify({ reason: "涉嫌未经证实的恶意抹黑宣传，不符合消防规范" }),
      ip: "192.168.1.101",
      created_at: "2026-06-27 10:45:00",
    },
    {
      id: "log-3",
      operator_id: "系统自动切面 (AOP)",
      action: "HOME_CONFIG_PUBLISHED",
      target_type: "config",
      target_id: "home_banner_2026",
      detail: JSON.stringify({ action: "publish_to_miniapp" }),
      ip: "127.0.0.1",
      created_at: "2026-06-27 09:15:22",
    },
  ];

  const columns = [
    { title: "时间戳", dataIndex: "created_at", key: "created_at", width: 180 },
    { title: "操作人", dataIndex: "operator_id", key: "operator_id", width: 160 },
    {
      title: "动作代码 (Action)",
      dataIndex: "action",
      key: "action",
      render: (act: string) => (
        <Tag color={act.includes("APPROVED") ? "green" : act.includes("TAKEDOWN") ? "red" : "blue"}>
          {act}
        </Tag>
      ),
    },
    { title: "对象类型", dataIndex: "target_type", key: "target_type", width: 120 },
    { title: "目标对象 ID / 名称", dataIndex: "target_id", key: "target_id" },
    {
      title: "操作详情与审计说明 (Detail)",
      dataIndex: "detail",
      key: "detail",
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <code>{text}</code>
        </Tooltip>
      ),
    },
    { title: "IP 地址", dataIndex: "ip", key: "ip", width: 140 },
  ];

  return (
    <div>
      <Typography.Title level={3} style={{ marginBottom: 16 }}>
        操作日志与审核流审计
      </Typography.Title>
      <Card title="全站高危动作、内容下架与审核留痕追踪">
        <Table dataSource={mockLogs} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
}
