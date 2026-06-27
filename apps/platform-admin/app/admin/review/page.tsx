"use client";

import React, { useState } from "react";
import { Table, Tabs, Tag, Button, Space, Card, Typography, message } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import AuditModal from "@/components/AuditModal";
import { maskPhone, maskUnifiedCode } from "@/lib/utils";

export default function ReviewPage() {
  const [activeTab, setActiveTab] = useState("supplier");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");

  // 模拟数据源
  const mockSuppliers = [
    {
      id: "sup-1",
      name: "三一重工消防装备有限公司",
      unified_code: "91430000183849301X",
      contact_name: "张经理",
      contact_phone: "13912345678",
      created_at: "2026-06-25 10:30",
    },
    {
      id: "sup-2",
      name: "徐工应急救援装备制造中心",
      unified_code: "913203007384910293",
      contact_name: "李主管",
      contact_phone: "18688889999",
      created_at: "2026-06-26 14:15",
    },
  ];

  const mockProducts = [
    {
      id: "prod-1",
      name: "大流量重型灭火消防车 Sx500",
      supplier_name: "三一重工消防装备有限公司",
      category_name: "灭火消防车",
      price_range: "￥2,800,000 ~ ￥3,500,000",
      created_at: "2026-06-26 16:00",
    },
  ];

  const handleOpenAudit = (record: any, type: "approve" | "reject") => {
    setCurrentRecord(record);
    setActionType(type);
    setModalOpen(true);
  };

  const handleAuditConfirm = async (reason?: string) => {
    message.success(`已成功执行【${actionType === "approve" ? "审核通过" : "审核驳回"}】动作！`);
    if (reason) {
      console.log("审核说明日志记录:", reason);
    }
    setModalOpen(false);
  };

  const supplierColumns = [
    { title: "企业名称", dataIndex: "name", key: "name" },
    {
      title: "统一社会信用代码",
      dataIndex: "unified_code",
      key: "unified_code",
      render: (code: string) => maskUnifiedCode(code),
    },
    { title: "联系人", dataIndex: "contact_name", key: "contact_name" },
    {
      title: "联系电话 (脱敏)",
      dataIndex: "contact_phone",
      key: "contact_phone",
      render: (phone: string) => maskPhone(phone),
    },
    { title: "申请时间", dataIndex: "created_at", key: "created_at" },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            size="small"
            onClick={() => handleOpenAudit(record, "approve")}
          >
            通过
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            size="small"
            onClick={() => handleOpenAudit(record, "reject")}
          >
            驳回
          </Button>
        </Space>
      ),
    },
  ];

  const productColumns = [
    { title: "装备名称", dataIndex: "name", key: "name" },
    { title: "所属供应商", dataIndex: "supplier_name", key: "supplier_name" },
    { title: "装备分类", dataIndex: "category_name", key: "category_name" },
    { title: "参考价格区间", dataIndex: "price_range", key: "price_range" },
    { title: "提交时间", dataIndex: "created_at", key: "created_at" },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            size="small"
            onClick={() => handleOpenAudit(record, "approve")}
          >
            通过
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            size="small"
            onClick={() => handleOpenAudit(record, "reject")}
          >
            驳回
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={3} style={{ marginBottom: 16 }}>
        审核中心
      </Typography.Title>
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "supplier",
              label: "供应商入驻认证审核",
              children: <Table dataSource={mockSuppliers} columns={supplierColumns} rowKey="id" />,
            },
            {
              key: "product",
              label: "新装备上线审核",
              children: <Table dataSource={mockProducts} columns={productColumns} rowKey="id" />,
            },
            {
              key: "material",
              label: "检测报告/认证证书审核",
              children: <Typography.Paragraph type="secondary">当前暂无待审核的第三方检测资料。</Typography.Paragraph>,
            },
            {
              key: "content",
              label: "文章与资讯审核",
              children: <Typography.Paragraph type="secondary">当前暂无待审核的供应商宣传资讯。</Typography.Paragraph>,
            },
          ]}
        />
      </Card>

      {modalOpen && (
        <AuditModal
          open={modalOpen}
          title={`审核处理: ${currentRecord?.name || ""}`}
          actionType={actionType}
          onCancel={() => setModalOpen(false)}
          onConfirm={handleAuditConfirm}
        />
      )}
    </div>
  );
}
