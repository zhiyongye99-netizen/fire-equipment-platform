"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Table, Button, Tag, Space, Drawer, Timeline, Typography,
  Card, Alert, message, Descriptions, Spin,
} from "antd";
import { leadsApi, ApiError } from "@/lib/api";
import type { Lead, LeadStatus, LeadType } from "@/lib/api";

const TYPE_COLOR: Record<LeadType, string> = {
  询价: "gold",
  申请演示: "purple",
  索取资料: "blue",
};

const STATUS_COLOR: Record<LeadStatus, string> = {
  待跟进: "volcano",
  已响应: "green",
  已关闭: "default",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showFullPhone, setShowFullPhone] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await leadsApi.list();
      setLeads(data);
    } catch (err) {
      setFetchError(err instanceof ApiError ? err.message : "加载线索列表失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleOpenDrawer = (record: Lead) => {
    setSelectedLead(record);
    setShowFullPhone(false);
    setIsDrawerOpen(true);
  };

  const handleUpdateStatus = (newStatus: "已响应" | "已关闭") => {
    if (!selectedLead) return;
    const entry = {
      time: new Date().toLocaleString("zh-CN", { hour12: false }),
      content: newStatus === "已响应" ? "供应商已响应并跟进" : "供应商关闭该线索",
    };
    const updated: Lead = {
      ...selectedLead,
      status: newStatus,
      timeline: [...selectedLead.timeline, entry],
    };
    setSelectedLead(updated);
    setLeads(leads.map((item) => (item.id === updated.id ? updated : item)));
    message.success(`线索状态已更新为【${newStatus}】！`);
  };

  const columns = [
    {
      title: "意向用户 (脱敏)",
      dataIndex: "userName",
      key: "userName",
      render: (text: string) => <Typography.Text strong>{text}</Typography.Text>,
    },
    { title: "关注装备产品", dataIndex: "product", key: "product" },
    {
      title: "线索类型",
      dataIndex: "type",
      key: "type",
      render: (type: LeadType) => <Tag color={TYPE_COLOR[type] ?? "blue"}>{type}</Tag>,
    },
    { title: "所属地区", dataIndex: "region", key: "region" },
    { title: "提交时间", dataIndex: "createdAt", key: "createdAt" },
    {
      title: "处理状态",
      dataIndex: "status",
      key: "status",
      render: (status: LeadStatus) => (
        <Tag color={STATUS_COLOR[status] ?? "default"}>{status}</Tag>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: Lead) => (
        <Button type="primary" size="small" ghost onClick={() => handleOpenDrawer(record)}>
          查看详解与跟进
        </Button>
      ),
    },
  ];

  return (
    <div style={{ paddingBottom: 24 }}>
      <Typography.Title level={3} style={{ marginBottom: 20 }}>
        🎯 采购前意向线索撮合中心
      </Typography.Title>

      <Alert
        description="所有意向线索均为实名消防采购/战训人员留痕提交。手机号等敏感信息默认脱敏，请通过平台安全通道申请解锁。"
        type="warning"
        showIcon
        style={{ marginBottom: 20 }}
      />

      {fetchError && (
        <Alert
          type="error"
          message={fetchError}
          action={<Button size="small" onClick={fetchLeads}>重试</Button>}
          style={{ marginBottom: 16 }}
          showIcon
        />
      )}

      <Card variant="borderless" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <Spin spinning={loading}>
          <Table columns={columns} dataSource={leads} rowKey="id" pagination={{ pageSize: 10 }} />
        </Spin>
      </Card>

      <Drawer
        title={`🎯 采购线索详情 - ${selectedLead?.userName ?? ""}`}
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
                <Tag color={TYPE_COLOR[selectedLead.type] ?? "blue"}>{selectedLead.type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">
                <Space>
                  <Typography.Text code>
                    {showFullPhone
                      ? selectedLead.phone
                      : selectedLead.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")}
                  </Typography.Text>
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

            <Typography.Title level={5} style={{ marginBottom: 16 }}>⏱️ 线索处理跟进时间线</Typography.Title>
            <Timeline
              items={selectedLead.timeline.map((t) => ({ children: `${t.time} - ${t.content}` }))}
              style={{ marginBottom: 32 }}
            />

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <Button danger onClick={() => handleUpdateStatus("已关闭")}>关闭线索</Button>
              <Button type="primary" onClick={() => handleUpdateStatus("已响应")}>标记为已响应并跟进</Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
