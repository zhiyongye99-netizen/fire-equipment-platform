"use client";

import React, { useState } from "react";
import { Table, Button, Tag, Space, Drawer, Timeline, Typography, Card, Alert, message, Descriptions } from "antd";

interface TimelineItem {
  time: string;
  content: string;
}

interface LeadDetailItem {
  key: string;
  userName: string;
  unitName: string;
  phone: string;
  product: string;
  type: "询价" | "索取资料" | "申请演示";
  region: string;
  demandText: string;
  status: "待跟进" | "已响应" | "已关闭";
  createdAt: string;
  timeline: TimelineItem[];
}

const initialLeads: LeadDetailItem[] = [
  {
    key: "1",
    userName: "张**队长",
    unitName: "江苏省消防救援总队装备运输大队",
    phone: "138****8888",
    product: "DG54G1 登高平台消防车",
    type: "询价",
    region: "江苏省 - 南京市",
    demandText: "拟于今年第四季度采购 2 台 50 米以上登高平台消防车，需了解整车最新中标参考价及高压供水泵选配参数。",
    status: "待跟进",
    createdAt: "2026-06-27 14:20",
    timeline: [
      { time: "2026-06-27 14:20", content: "用户通过微信小程序提交采购询价线索" }
    ]
  },
  {
    key: "2",
    userName: "李**参谋",
    unitName: "浙江省消防救援总队战训处",
    phone: "139****6666",
    product: "AP40 压缩空气泡沫消防车",
    type: "索取资料",
    region: "浙江省 - 杭州市",
    demandText: "希望索取 AP40 泡沫车完整检测报告及 CAFS 系统的日常维保手册，用于采购前技术论证参考。",
    status: "已响应",
    createdAt: "2026-06-27 11:05",
    timeline: [
      { time: "2026-06-27 11:05", content: "用户提交资料索取申请" },
      { time: "2026-06-27 11:30", content: "供应商营销经理已线上开放检测报告下载权限" }
    ]
  },
  {
    key: "3",
    userName: "王**助理",
    unitName: "上海市消防救援总队水上支队",
    phone: "135****9999",
    product: "PM180 大流量抢险排水车",
    type: "申请演示",
    region: "上海市 - 浦东新区",
    demandText: "计划针对汛期内涝救援举办防汛演练，申请厂商安排 1 台大流量排涝抢险车进行现场实操演示。",
    status: "已关闭",
    createdAt: "2026-06-25 09:30",
    timeline: [
      { time: "2026-06-25 09:30", content: "用户提交线下演示申请" },
      { time: "2026-06-25 14:00", content: "双方沟通演练时间冲突，线索已由供应商协商关闭" }
    ]
  }
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<LeadDetailItem[]>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<LeadDetailItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showFullPhone, setShowFullPhone] = useState(false);

  const handleOpenDrawer = (record: LeadDetailItem) => {
    setSelectedLead(record);
    setShowFullPhone(false);
    setIsDrawerOpen(true);
  };

  const handleUpdateStatus = (newStatus: "已响应" | "已关闭") => {
    if (!selectedLead) return;

    const updatedTimeline = [
      ...selectedLead.timeline,
      {
        time: new Date().toLocaleString("zh-CN", { hour12: false }),
        content: newStatus === "已响应" ? "供应商更新线索状态为：已响应并跟进" : "供应商关闭该线索"
      }
    ];

    const updated = {
      ...selectedLead,
      status: newStatus,
      timeline: updatedTimeline
    };

    setSelectedLead(updated);
    setLeads(leads.map((item) => (item.key === updated.key ? updated : item)));
    message.success(`线索状态已更新为【${newStatus}】！`);
  };

  const columns = [
    {
      title: "意向用户 (脱敏)",
      dataIndex: "userName",
      key: "userName",
      render: (text: string) => <Typography.Text strong>{text}</Typography.Text>
    },
    {
      title: "关注装备产品",
      dataIndex: "product",
      key: "product"
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
      title: "所属地区",
      dataIndex: "region",
      key: "region"
    },
    {
      title: "提交时间",
      dataIndex: "createdAt",
      key: "createdAt"
    },
    {
      title: "处理状态",
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
      render: (_: unknown, record: LeadDetailItem) => (
        <Button type="primary" size="small" ghost onClick={() => handleOpenDrawer(record)}>
          查看详解与跟进
        </Button>
      )
    }
  ];

  return (
    <div style={{ paddingBottom: 24 }}>
      <Typography.Title level={3} style={{ marginBottom: 20 }}>
        🎯 采购前意向线索撮合中心
      </Typography.Title>

      <Alert
        message="🔒 消防用户隐私安全保护规则"
        description="所有意向线索均为实名消防采购/战训人员留痕提交。用户手机号等敏感联系方式默认实行【脱敏保护】，跟进时请通过平台安全通道或申请解锁完整联系方式。"
        type="warning"
        showIcon
        style={{ marginBottom: 20 }}
      />

      <Card variant="borderless" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <Table columns={columns} dataSource={leads} rowKey="key" pagination={{ pageSize: 10 }} />
      </Card>

      {/* 线索详解 Drawer 抽屉 */}
      <Drawer
        title={`🎯 采购线索详情 - ${selectedLead?.userName || ""}`}
        width={560}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        {selectedLead && (
          <div>
            <Descriptions title="基本意向信息" column={1} bordered size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="意向用户">{selectedLead.userName}</Descriptions.Item>
              <Descriptions.Item label="采购单位">{selectedLead.unitName}</Descriptions.Item>
              <Descriptions.Item label="所在区域">{selectedLead.region}</Descriptions.Item>
              <Descriptions.Item label="意向装备">{selectedLead.product}</Descriptions.Item>
              <Descriptions.Item label="线索类型">
                <Tag color="blue">{selectedLead.type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">
                <Space>
                  <Typography.Text code>{showFullPhone ? "13812345678" : selectedLead.phone}</Typography.Text>
                  {!showFullPhone && (
                    <Button type="link" size="small" onClick={() => setShowFullPhone(true)}>
                      🔓 申请查看解密号码
                    </Button>
                  )}
                </Space>
              </Descriptions.Item>
            </Descriptions>

            <Typography.Title level={5}>📋 详细采购需求描述</Typography.Title>
            <Card type="inner" style={{ marginBottom: 24, background: "#fafafa" }}>
              <Typography.Paragraph style={{ margin: 0 }}>{selectedLead.demandText}</Typography.Paragraph>
            </Card>

            <Typography.Title level={5} style={{ marginBottom: 16 }}>
              ⏱️ 线索处理跟进时间线
            </Typography.Title>
            <Timeline items={selectedLead.timeline.map((t) => ({ children: `${t.time} - ${t.content}` }))} style={{ marginBottom: 32 }} />

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <Button danger onClick={() => handleUpdateStatus("已关闭")}>
                关闭线索
              </Button>
              <Button type="primary" onClick={() => handleUpdateStatus("已响应")}>
                标记为已响应并跟进
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
