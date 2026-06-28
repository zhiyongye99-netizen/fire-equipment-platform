"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Table, Button, Tag, Space, Modal, Form, Input,
  Select, InputNumber, Typography, Card, message, Spin, Alert,
} from "antd";
import { productsApi, ApiError } from "@/lib/api";
import type { Product, ProductStatus } from "@/lib/api";

const STATUS_COLOR: Record<ProductStatus, string> = {
  已上架: "green",
  审核中: "orange",
  草稿: "default",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await productsApi.list();
      setProducts(data);
    } catch (err) {
      setFetchError(err instanceof ApiError ? err.message : "加载产品列表失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleCreateProduct = async (submitForReview: boolean) => {
    let values: Record<string, unknown>;
    try {
      values = await form.validateFields();
    } catch {
      return;
    }
    setSubmitting(true);
    try {
      await productsApi.create({
        name: values.name as string,
        category: values.category as string,
        model: values.model as string | undefined,
        minPrice: values.minPrice as number | undefined,
        maxPrice: values.maxPrice as number | undefined,
        description: values.description as string | undefined,
        submitForReview,
      });
      message.success(submitForReview ? "新产品已提交审核！" : "产品草稿保存成功！");
      setIsModalOpen(false);
      form.resetFields();
      fetchProducts();
    } catch (err) {
      message.error(err instanceof ApiError ? err.message : "操作失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  const priceRange = (p: Product) =>
    p.minPrice != null && p.maxPrice != null
      ? `${p.minPrice} - ${p.maxPrice} 万元`
      : "暂无报价";

  const columns = [
    {
      title: "装备产品名称",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <Typography.Text strong>{text}</Typography.Text>,
    },
    { title: "规格型号", dataIndex: "model", key: "model" },
    {
      title: "装备分类",
      dataIndex: "category",
      key: "category",
      render: (cat: string) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: "参考价格区间",
      key: "priceRange",
      render: (_: unknown, record: Product) => priceRange(record),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: ProductStatus) => (
        <Tag color={STATUS_COLOR[status] ?? "default"}>{status}</Tag>
      ),
    },
    { title: "更新时间", dataIndex: "updatedAt", key: "updatedAt" },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: Product) => (
        <Space size="small">
          <Button type="link" size="small">编辑</Button>
          {record.status === "草稿" && (
            <Button type="link" size="small" style={{ color: "#fa8c16" }}>
              提交审核
            </Button>
          )}
        </Space>
      ),
    },
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

      {fetchError && (
        <Alert
          type="error"
          message={fetchError}
          action={<Button size="small" onClick={fetchProducts}>重试</Button>}
          style={{ marginBottom: 16 }}
          showIcon
        />
      )}

      <Card variant="borderless" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <Spin spinning={loading}>
          <Table columns={columns} dataSource={products} rowKey="id" pagination={{ pageSize: 10 }} />
        </Spin>
      </Card>

      <Modal
        title="➕ 录入消防装备新产品"
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
        footer={[
          <Button key="cancel" onClick={() => { setIsModalOpen(false); form.resetFields(); }}>
            取消
          </Button>,
          <Button key="draft" loading={submitting} onClick={() => handleCreateProduct(false)}>
            保存为草稿
          </Button>,
          <Button key="submit" type="primary" loading={submitting} onClick={() => handleCreateProduct(true)}>
            提交审核
          </Button>,
        ]}
        destroyOnHidden
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
