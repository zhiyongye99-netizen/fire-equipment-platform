"use client";

import React, { useState } from "react";
import { Form, Input, Select, Cascader, Upload, Button, Alert, Typography, Card, Space, message } from "antd";

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

const provinceOptions: Option[] = [
  {
    value: "jiangsu",
    label: "江苏省",
    children: [
      { value: "xuzhou", label: "徐州市" },
      { value: "nanjing", label: "南京市" },
      { value: "suzhou", label: "苏州市" }
    ]
  },
  {
    value: "zhejiang",
    label: "浙江省",
    children: [
      { value: "hangzhou", label: "杭州市" },
      { value: "ningbo", label: "宁波市" }
    ]
  },
  {
    value: "shandong",
    label: "山东省",
    children: [
      { value: "jinan", label: "济南市" },
      { value: "qingdao", label: "青岛市" }
    ]
  }
];

export default function CompanyPage() {
  const [form] = Form.useForm();
  const [reviewStatus, setReviewStatus] = useState<"已通过" | "待审核" | "已驳回">("已通过");

  const handleFinish = () => {
    message.success("企业认证主体资料已更新，已提交平台二次复核！");
    setReviewStatus("待审核");
  };

  return (
    <div style={{ paddingBottom: 24 }}>
      <Typography.Title level={3} style={{ marginBottom: 20 }}>
        🛡️ 供应商主体身份认证与资质
      </Typography.Title>

      {/* 审核状态 Alert Banner */}
      {reviewStatus === "已通过" && (
        <Alert
          title="✅ 企业身份认证成功（已通过平台核验）"
          description="您的企业主体资质及三证信息已通过平台客服审核，获得专属【已认证供应商】金标标识，享优先线索撮合权益。"
          type="success"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {reviewStatus === "待审核" && (
        <Alert
          title="⏳ 企业资质变更复核中"
          description="您提交的新变更企业主体资质正在由平台合规部处理，预计在 1 个工作日内完成核验。"
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {reviewStatus === "已驳回" && (
        <Alert
          title="❌ 企业资质认证未通过"
          description="原因：营业执照复印件加盖公章模糊，请重新上传清晰清晰扫描件。"
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Card title="🏢 企业主体基本档案" variant="borderless" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            companyName: "徐州重型消防装备有限公司",
            creditCode: "91320300MA1X888888",
            contactName: "徐经理",
            contactPhone: "138****8888",
            location: ["jiangsu", "xuzhou"],
            mainCategories: ["水罐消防车", "举高喷射消防车", "排水抢险车"],
            serviceRegions: ["huadong", "huabei", "quanguo"]
          }}
          onFinish={handleFinish}
          style={{ maxWidth: 800 }}
        >
          <Form.Item
            name="companyName"
            label="企业官方全称"
            rules={[{ required: true, message: "请输入企业营业执照上的全称" }]}
          >
            <Input placeholder="请输入企业法定名称" />
          </Form.Item>

          <Form.Item
            name="creditCode"
            label="统一社会信用代码"
            rules={[{ required: true, message: "请输入18位统一社会信用代码" }]}
          >
            <Input placeholder="例：91320300MA..." />
          </Form.Item>

          <Form.Item label="企业官方对接人" style={{ marginBottom: 0 }}>
            <Space size="middle" style={{ display: "flex" }}>
              <Form.Item
                name="contactName"
                rules={[{ required: true, message: "请输入对接人姓名" }]}
                style={{ flex: 1 }}
              >
                <Input placeholder="联系人姓名" />
              </Form.Item>

              <Form.Item
                name="contactPhone"
                rules={[{ required: true, message: "请输入联系电话" }]}
                style={{ flex: 1 }}
              >
                <Input placeholder="联系电话" />
              </Form.Item>
            </Space>
          </Form.Item>

          <Form.Item
            name="location"
            label="企业总部所在省市"
            rules={[{ required: true, message: "请选择省市" }]}
          >
            <Cascader options={provinceOptions} placeholder="请选择省/市" />
          </Form.Item>

          <Form.Item
            name="mainCategories"
            label="主营消防装备品类（多选）"
            rules={[{ required: true, message: "请至少选择一个主营品类" }]}
          >
            <Select mode="multiple" placeholder="请选择主营装备">
              <Select.Option value="水罐消防车">水罐消防车</Select.Option>
              <Select.Option value="举高喷射消防车">举高喷射消防车</Select.Option>
              <Select.Option value="排水抢险车">排水抢险车</Select.Option>
              <Select.Option value="无人灭火机器人">无人灭火机器人</Select.Option>
              <Select.Option value="消防员个人防护装备">消防员个人防护装备</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="serviceRegions"
            label="售后与维保服务覆盖区域（多选）"
            rules={[{ required: true, message: "请选择覆盖区域" }]}
          >
            <Select mode="multiple" placeholder="请选择覆盖区域">
              <Select.Option value="quanguo">全国覆盖</Select.Option>
              <Select.Option value="huadong">华东地区（江浙沪皖）</Select.Option>
              <Select.Option value="huabei">华北地区</Select.Option>
              <Select.Option value="huanan">华南地区</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="企业营业执照及法定资质证明上传">
            <Upload beforeUpload={() => false} maxCount={1} defaultFileList={[{ uid: "-1", name: "企业营业执照正本扫描件(已加盖公章).pdf", status: "done" }]}>
              <Button>📁 更新营业执照 / 资质文件文件</Button>
            </Upload>
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" size="large">
              💾 保存修改并提交复核
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
