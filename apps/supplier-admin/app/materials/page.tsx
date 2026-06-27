"use client";

import React, { useState } from "react";
import { Table, Button, Tag, Space, Modal, Form, Select, Upload, Alert, Typography, Card, message } from "antd";

interface MaterialItem {
  key: string;
  filename: string;
  type: "国家检测报告" | "CCC认证证书" | "使用说明书" | "彩页宣传册";
  relatedProduct: string;
  privacyLevel: "公开展示" | "申请后可见" | "仅认证用户可见" | "不公开/仅审核";
  status: "已通过" | "审核中" | "已拒绝";
  uploadedAt: string;
}

const initialMaterials: MaterialItem[] = [
  {
    key: "1",
    filename: "DG54G1登高车国家消防装备质量检验报告.pdf",
    type: "国家检测报告",
    relatedProduct: "DG54G1 登高平台消防车",
    privacyLevel: "申请后可见",
    status: "已通过",
    uploadedAt: "2026-06-15"
  },
  {
    key: "2",
    filename: "AP40压缩空气泡沫车3C强制认证证书.pdf",
    type: "CCC认证证书",
    relatedProduct: "AP40 压缩空气泡沫消防车",
    privacyLevel: "公开展示",
    status: "已通过",
    uploadedAt: "2026-06-18"
  },
  {
    key: "3",
    filename: "PM180大流量排水抢险车操作说明书V2.0.pdf",
    type: "使用说明书",
    relatedProduct: "PM180 大流量抢险排水车",
    privacyLevel: "仅认证用户可见",
    status: "审核中",
    uploadedAt: "2026-06-25"
  }
];

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<MaterialItem[]>(initialMaterials);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleUploadMaterial = () => {
    form.validateFields().then((values) => {
      const fileObj = values.fileList && values.fileList[0];
      const filename = fileObj ? fileObj.name : "新上传产品检测资料.pdf";

      const newMaterial: MaterialItem = {
        key: Date.now().toString(),
        filename,
        type: values.type || "国家检测报告",
        relatedProduct: values.relatedProduct,
        privacyLevel: values.privacyLevel,
        status: "审核中",
        uploadedAt: new Date().toISOString().split("T")[0]
      };

      setMaterials([newMaterial, ...materials]);
      message.success("资料提交成功，已进入平台审核队列！");
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const columns = [
    {
      title: "资料文件名称",
      dataIndex: "filename",
      key: "filename",
      render: (text: string) => <Typography.Text strong>{text}</Typography.Text>
    },
    {
      title: "资料类型",
      dataIndex: "type",
      key: "type",
      render: (type: string) => <Tag color="blue">{type}</Tag>
    },
    {
      title: "关联装备产品",
      dataIndex: "relatedProduct",
      key: "relatedProduct"
    },
    {
      title: "可见范围与控制级别",
      dataIndex: "privacyLevel",
      key: "privacyLevel",
      render: (level: string) => {
        const colorMap: Record<string, string> = {
          公开展示: "green",
          申请后可见: "orange",
          仅认证用户可见: "purple",
          "不公开/仅审核": "red"
        };
        return <Tag color={colorMap[level] || "default"}>{level}</Tag>;
      }
    },
    {
      title: "审核状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color = status === "已通过" ? "green" : status === "审核中" ? "gold" : "red";
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: "上传时间",
      dataIndex: "uploadedAt",
      key: "uploadedAt"
    },
    {
      title: "操作",
      key: "action",
      render: () => (
        <Space size="small">
          <Button type="link" size="small">
            预览
          </Button>
          <Button type="link" size="small" danger>
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          📂 企业检测报告与资质资料管理
        </Typography.Title>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          📤 上传新资料
        </Button>
      </div>

      {/* 可见范围 Alert 提示 */}
      <Alert
        message="🛡️ 商业隐私与数据安全保护说明"
        description="平台严格执行分级资料体系：敏感检测原件、技术说明书建议设为【申请后可见】或【仅认证用户可见】。未经企业授权，平台绝不向公众或竞品暴露底线商务资质。"
        type="info"
        showIcon
        style={{ marginBottom: 20 }}
      />

      <Card bordered={false} style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <Table columns={columns} dataSource={materials} rowKey="key" pagination={{ pageSize: 10 }} />
      </Card>

      {/* 上传资料 Modal */}
      <Modal
        title="📤 上传装备产品检测/资质文件"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleUploadMaterial}
        okText="确认上传并提交审核"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={{ privacyLevel: "申请后可见", type: "国家检测报告" }} style={{ marginTop: 16 }}>
          <Form.Item name="relatedProduct" label="关联装备产品" rules={[{ required: true, message: "请选择关联的产品" }]}>
            <Select placeholder="请选择该资料对应的装备产品">
              <Select.Option value="DG54G1 登高平台消防车">DG54G1 登高平台消防车</Select.Option>
              <Select.Option value="AP40 压缩空气泡沫消防车">AP40 压缩空气泡沫消防车</Select.Option>
              <Select.Option value="PM180 大流量抢险排水车">PM180 大流量抢险排水车</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="type" label="资料文件类型" rules={[{ required: true, message: "请选择资料类型" }]}>
            <Select>
              <Select.Option value="国家检测报告">国家检测报告</Select.Option>
              <Select.Option value="CCC认证证书">CCC认证证书</Select.Option>
              <Select.Option value="使用说明书">使用说明书</Select.Option>
              <Select.Option value="彩页宣传册">彩页宣传册</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="privacyLevel" label="可见范围（数据访问控制）" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="公开展示">公开展示（所有人可下载）</Select.Option>
              <Select.Option value="申请后可见">申请后可见（需采购方提交索取申请，企业同意后开放）</Select.Option>
              <Select.Option value="仅认证用户可见">仅认证用户可见（仅限平台实名消防用户）</Select.Option>
              <Select.Option value="不公开/仅审核">不公开/仅平台审核（保密核查）</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="fileList" label="选择文件上传" valuePropName="fileList" getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}>
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button>📁 选择本地 PDF / 图档文件</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
