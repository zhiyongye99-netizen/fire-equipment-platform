"use client";

import React from "react";
import { Card, Row, Col, Statistic, Table, Tag, Button, Space, Typography } from "antd";
import { useRouter } from "next/navigation";

interface LeadItem {
  key: string;
  user: string;
  product: string;
  type: "询价" | "索取资料" | "申请演示";
  time: string;
  status: "待跟进" | "已响应" | "已跟进" | "已关闭";
}

const mockRecentLeads: LeadItem[] = [
  {
    key: "1",
    user: "张**队长 (江苏省消防救援总队)",
    product: "DG54G1 登高平台消防车",
    type: "询价",
    time: "2026-06-27 14:20",
    status: "待跟进"
  },
  {
    key: "2",
    user: "李**参谋 (浙江省消防救援总队)",
    product: "AP40 压缩空气泡沫消防车",
    type: "索取资料",
    time: "2026-06-27 11:05",
    status: "已响应"
  },
  {
    key: "3",
    user: "王**助理 (上海市消防救援总队)",
    product: "PM180 大流量抢险排水车",
    type: "申请演示",
    time: "2026-06-26 16:45",
    status: "已跟进"
  }
];

export default function DashboardPage() {
  const router = useRouter();

  const columns = [
    {
      title: "意向用户",
      dataIndex: "user",
      key: "user"
    },
    {
      title: "关注装备产品",
      dataIndex: "product",
      key: "product",
      render: (text: string) => <Typography.Text strong>{text}</Typography.Text>
    },
    {
      title: "线索类型",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        const color = type === "询价" ? "gold" : type === "申请演示" ? "purple" : "blue";
        return <Tag color={color}>{type}</Tag>;
      }
    },
    {
      title: "提交时间",
      dataIndex: "time",
      key: "time"
    },
    {
      title: "当前状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color = status === "待跟进" ? "volcano" : status === "已响应" ? "green" : "default";
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: "操作",
      key: "action",
      render: () => (
        <Button type="link" size="small" onClick={() => router.push("/leads")}>
          查看详情
        </Button>
      )
    }
  ];

  return (
    <div style={{ paddingBottom: 24 }}>
      <Typography.Title level={3} style={{ marginBottom: 20 }}>
        📊 企业控制台概览
      </Typography.Title>

      {/* 4个统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <Statistic title="本月装备浏览量" value={1280} suffix="次" valueStyle={{ color: "#1677ff" }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <Statistic title="产品收藏与比选" value={346} suffix="次" valueStyle={{ color: "#722ed1" }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <Statistic title="意向线索总数" value={42} suffix="条" valueStyle={{ color: "#fa8c16" }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <Statistic title="线索及时响应率" value={95.2} precision={1} suffix="%" valueStyle={{ color: "#52c41a" }} />
          </Card>
        </Col>
      </Row>

      {/* 快捷操作 */}
      <Card title="⚡ 快捷操作导航" style={{ marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <Space size="middle" wrap>
          <Button type="primary" onClick={() => router.push("/products")}>
            ➕ 录入新产品
          </Button>
          <Button onClick={() => router.push("/materials")}>
            📤 上传检测/资质资料
          </Button>
          <Button onClick={() => router.push("/leads")}>
            🎯 查看最新采购线索
          </Button>
        </Space>
      </Card>

      {/* 最近线索 */}
      <Card title="🔔 最新采购意向线索" bordered={false} style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <Table columns={columns} dataSource={mockRecentLeads} pagination={false} size="middle" />
      </Card>
    </div>
  );
}
