"use client";

import React, { useState, useEffect } from "react";
import { Form, Input, Select, Cascader, Upload, Button, Alert, Typography, Card, Space, message, Spin } from "antd";
import { profileApi, ApiError } from "@/lib/api";
import type { SupplierProfile, UpdateProfilePayload, ProfileReviewStatus } from "@/lib/api";

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
      { value: "suzhou", label: "苏州市" },
    ],
  },
  {
    value: "zhejiang",
    label: "浙江省",
    children: [
      { value: "hangzhou", label: "杭州市" },
      { value: "ningbo", label: "宁波市" },
    ],
  },
  {
    value: "shandong",
    label: "山东省",
    children: [
      { value: "jinan", label: "济南市" },
      { value: "qingdao", label: "青岛市" },
    ],
  },
];

export default function CompanyPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [reviewStatus, setReviewStatus] = useState<ProfileReviewStatus>("待审核");
  const [reviewComment, setReviewComment] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    profileApi
      .get()
      .then((profile: SupplierProfile) => {
        form.setFieldsValue({
          companyName: profile.companyName,
          creditCode: profile.creditCode,
          contactName: profile.contactName,
          contactPhone: profile.contactPhone,
          location: profile.location,
          mainCategories: profile.mainCategories,
          serviceRegions: profile.serviceRegions,
        });
        setReviewStatus(profile.reviewStatus);
        setReviewComment(profile.reviewComment);
      })
      .catch((err: unknown) => {
        setFetchError(err instanceof ApiError ? err.message : "加载企业信息失败，请稍后重试");
      })
      .finally(() => setLoading(false));
  }, [form]);

  const handleFinish = async (values: Record<string, unknown>) => {
    setSubmitting(true);
    try {
      const payload: UpdateProfilePayload = {
        companyName: values.companyName as string,
        creditCode: values.creditCode as string,
        contactName: values.contactName as string,
        contactPhone: values.contactPhone as string,
        location: values.location as string[],
        mainCategories: values.mainCategories as string[],
        serviceRegions: values.serviceRegions as string[],
      };
      const updated = await profileApi.update(payload);
      setReviewStatus(updated.reviewStatus);
      setReviewComment(updated.reviewComment);
      message.success("企业认证主体资料已更新，已提交平台二次复核！");
    } catch (err) {
      message.error(err instanceof ApiError ? err.message : "保存失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ paddingBottom: 24 }}>
      <Typography.Title level={3} style={{ marginBottom: 20 }}>
        🛡️ 供应商主体身份认证与资质
      </Typography.Title>

      {fetchError && (
        <Alert type="error" message={fetchError} showIcon style={{ marginBottom: 16 }} />
      )}

      {!fetchError && reviewStatus === "已通过" && (
        <Alert
          description="您的企业主体资质及三证信息已通过平台客服审核，获得专属【已认证供应商】金标标识，享优先线索撮合权益。"
          type="success"
           style={{ marginBottom: 24 }}
        />
      )}
      {!fetchError && reviewStatus === "待审核" && (
        <Alert
          description="您提交的企业主体资质正在由平台合规部处理，预计在 1 个工作日内完成核验。"
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}
      {!fetchError && reviewStatus === "已驳回" && (
        <Alert
          description={reviewComment ?? "资质审核未通过，请修改后重新提交。"}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Card title="🏢 企业主体基本档案" variant="borderless" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
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
              <Upload beforeUpload={() => false} maxCount={1}>
                <Button>📁 更新营业执照 / 资质文件</Button>
              </Upload>
            </Form.Item>

            <Form.Item style={{ marginTop: 24 }}>
              <Button type="primary" htmlType="submit" size="large" loading={submitting}>
                💾 保存修改并提交复核
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
}
