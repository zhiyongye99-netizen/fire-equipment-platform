"use client";

import React, { useState } from "react";
import { Table, Button, Tag, Space, Modal, Form, Input, Select, InputNumber, Typography, Card, message } from "antd";

interface ProductItem {
  key: string;
  name: string;
  model: string;
  category: string;
  priceRange: string;
  status: "草稿" | "审核中" | "已上架" | "已驳回";
  updatedAt: string;
}

const initialProducts: ProductItem[] = [
  {
    key: "1",
    name: "DG54G1 登高平台消防车",
    model: "DG54G1",
    category: "举高喷射消防车",
    priceRange: "450 - 520 万元",
    status: "已上架",
    updatedAt: "2026-06-20"
  },
  {
    key: "2",
    name: "AP40 压缩空气泡沫消防车",
    model: "AP40/CAFS",
    category: "水罐消防车",
    priceRange: "180 - 220 万元",
    status: "已上架",
    updatedAt: "2026-06-22"
  },
  {
    key: "3",
    name: "PM180 大流量抢险排水车",
    model: "PM180-DRAIN",
    category: "排水抢险车",
    priceRange: "120 - 150 万元",
    status: "审核中",
    updatedAt: "2026-06-26"
  },
  {
    key: "4",
    name: "SX60 重型破拆救援车",
    model: "SX60-RESCUE",
    category: "水罐消防车",
    priceRange: "260 - 300 万元",
    status: "草稿",
    updatedAt: "2026-06-27"
  }
];

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleCreateProduct = (isSubmitForReview: boolean) => {
    form.validateFields().then((values) => {
      const minPrice = values.minPrice || 0;
      const maxPrice = values.maxPrice || 0;
      const newProduct: ProductItem = {
        key: Date.now().toString(),
        name: values.name,
        model: values.model || "通用款",
        category: values.category,
        priceRange: minPrice && maxPrice ? `${minPrice} - ${maxPrice} 万元` : "暂无报价",
        status: isSubmitForReview ? "审核中" : "草稿",
        updatedAt: new Date().toISOString().split("T")[0]
      };

      setProducts([newProduct, ...products]);
      message.success(isSubmitForReview ? "新产品已提交审核！" : "产品草稿保存成功！");
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const columns = [
    {
      title: "装备产品名称",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <Typography.Text strong>{text}</Typography.Text>
    },
    {
      title: "规格型号",
      dataIndex: "model",
      key: "model"
    },
    {
      title: "装备分类",
      dataIndex: "category",
      key: "category",
      render: (cat: string) => <Tag color="blue">{cat}</Tag>
    },
    {
      title: "参考价格区间",
      dataIndex: "priceRange",
      key: "priceRange"
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          已上架: "green",
          审核中: "orange",
          草稿: "default",
          已驳回: "red"
        };
        return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
      }
    },
    {
      title: "更新时间",
      dataIndex: "updatedAt",
      key: "updatedAt"
    },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: ProductItem) => (
        <Space size="small">
          <Button type="link" size="small">
            编辑
          </Button>
          {record.status === "草稿" && (
            <Button type="link" size="small" style={{ color: "#fa8c16" }}>
              提交审核
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          📦 企业装备产品管理
        </Typography.Title>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          ➕ 录入新产品
        </Button>
      </div>

      <Card bordered={false} style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <Table columns={columns} dataSource={products} rowKey="key" pagination={{ pageSize: 10 }} />
      </Card>

      {/* 录入新产品 Modal */}
      <Modal
        title="➕ 录入消防装备新产品"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            取消
          </Button>,
          <Button key="draft" onClick={() => handleCreateProduct(false)}>
            保存为草稿
          </Button>,
          <Button key="submit" type="primary" onClick={() => handleCreateProduct(true)}>
            提交审核
          </Button>
        ]}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="产品名称" rules={[{ required: true, message: "请输入产品名称" }]}>
            <Input placeholder="例：DG54G1 登高平台消防车" />
          </Form.Item>

          <Form.Item name="category" label="装备分类" rules={[{ required: true, message: "请选择装备分类" }]}>
            <Select placeholder="请选择消防装备分类">
              <Select.Option value="水罐消防车">水罐消防车</Select.Option>
              <Select.Option value="举高喷射消防车">举高喷射消防车</Select.Option>
              <Select.Option value="排水抢险车">排水抢险车</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="model" label="规格型号">
            <Input placeholder="例：SX5310GXF" />
          </Form.Item>

          <Form.Item label="估算价格区间（万元）">
            <Space size="middle">
              <Form.Item name="minPrice" noStyle>
                <InputNumber placeholder="最低价" min={0} style={{ width: 160 }} addonAfter="万元" />
              </Form.Item>
              <span>至</span>
              <Form.Item name="maxPrice" noStyle>
                <InputNumber placeholder="最高价" min={0} style={{ width: 160 }} addonAfter="万元" />
              </Form.Item>
            </Space>
          </Form.Item>

          <Form.Item name="description" label="产品核心描述与技术优势">
            <Input.TextArea rows={4} placeholder="请输入主要技术参数、适用灭火救援场景说明..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
