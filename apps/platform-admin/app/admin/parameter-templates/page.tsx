"use client";

import React, { useState } from "react";
import { Card, Typography, Row, Col, Table, Tag, Button, Space, Modal, Form, Input, Select, Switch, message, Divider, Flex } from "antd";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";

export default function ParameterTemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState("灭火消防车");
  const [modalOpen, setModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [form] = Form.useForm();

  const categories = ["灭火消防车", "举高消防车", "专勤消防车", "破拆救援器材", "个人防护装备"];

  const mockTemplates = [
    { id: "p1", field_key: "tank_capacity", field_label: "水罐额定载质量", field_type: "number", unit: "吨", is_required: true, is_filterable: true, is_comparable: true },
    { id: "p2", field_key: "pump_flow", field_label: "消防泵额定流量", field_type: "number", unit: "L/s", is_required: true, is_filterable: true, is_comparable: true },
    { id: "p3", field_key: "chassis_brand", field_label: "底盘品牌/型号", field_type: "select", options: "重汽豪沃, 斯堪尼亚, 奔驰唯雅诺", is_required: true, is_filterable: true, is_comparable: true },
    { id: "p4", field_key: "monitor_reach", field_label: "水炮有效射程", field_type: "number", unit: "米", is_required: false, is_filterable: false, is_comparable: true },
  ];

  const columns = [
    { title: "参数字段 Label", dataIndex: "field_label", key: "field_label" },
    { title: "变量 Key", dataIndex: "field_key", key: "field_key" },
    {
      title: "数据类型",
      dataIndex: "field_type",
      key: "field_type",
      render: (type: string) => <Tag color="blue">{type.toUpperCase()}</Tag>,
    },
    { title: "计量单位", dataIndex: "unit", key: "unit", render: (u: string) => u || "-" },
    {
      title: "必填/筛选/对比属性",
      key: "attrs",
      render: (_: unknown, r: Record<string, unknown>) => (
        <Space>
          {Boolean(r.is_required) && <Tag color="red">必填</Tag>}
          {Boolean(r.is_filterable) && <Tag color="green">可筛选</Tag>}
          {Boolean(r.is_comparable) && <Tag color="orange">核心对比项</Tag>}
        </Space>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: () => (
        <Button type="link" danger size="small">删除</Button>
      ),
    },
  ];

  const handleAddTemplate = async () => {
    try {
      const values = await form.validateFields();
      message.success(`已为【${selectedCategory}】新增参数模板项【${values.field_label}】！`);
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          装备参数模板生成器
        </Typography.Title>
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => setPreviewOpen(true)}>
            预览前台表单与对比表
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setModalOpen(true); }}>
            添加参数字段
          </Button>
        </Space>
      </div>

      <Row gutter={16}>
        <Col span={6}>
          <Card title="装备分类列表">
            <Flex vertical style={{ width: "100%" }} gap={4}>
              {categories.map((item) => (
                <div
                  key={item}
                  onClick={() => setSelectedCategory(item)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: selectedCategory === item ? "#e6f7ff" : "#fafafa",
                    padding: "10px 16px",
                    borderRadius: 6,
                    border: selectedCategory === item ? "1px solid #91caff" : "1px solid #f0f0f0",
                    transition: "all 0.2s",
                  }}
                >
                  <Typography.Text strong={selectedCategory === item} style={{ color: selectedCategory === item ? "#1890ff" : undefined }}>
                    {item}
                  </Typography.Text>
                </div>
              ))}
            </Flex>
          </Card>
        </Col>
        <Col span={18}>
          <Card title={`已配置参数字段（关联分类：${selectedCategory}）`}>
            <Table dataSource={mockTemplates} columns={columns} rowKey="id" pagination={false} />
          </Card>
        </Col>
      </Row>

      {/* 新增字段 Modal */}
      <Modal
        open={modalOpen}
        title={`为【${selectedCategory}】增加参数字段`}
        onCancel={() => setModalOpen(false)}
        onOk={handleAddTemplate}
        okText="添加字段"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="field_label" label="参数名称 (中文展示)" rules={[{ required: true }]}>
            <Input placeholder="例：最大作业高度" />
          </Form.Item>
          <Form.Item name="field_key" label="参数变量 Key (唯一代码)" rules={[{ required: true }]}>
            <Input placeholder="例：max_working_height" />
          </Form.Item>
          <Form.Item name="field_type" label="字段输入类型" initialValue="number">
            <Select>
              <Select.Option value="number">数字带单位 (Number)</Select.Option>
              <Select.Option value="text">纯文本 (Text)</Select.Option>
              <Select.Option value="select">下拉单选 (Select)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="unit" label="计量单位 (选填)">
            <Input placeholder="例：米 / kg / L/min" />
          </Form.Item>
          <Form.Item name="is_filterable" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="支持在小程序选装时筛选" unCheckedChildren="不支持筛选" />
          </Form.Item>
          <Form.Item name="is_comparable" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="在多车型对比表中重点高亮" unCheckedChildren="非核心对比" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 预览 Modal */}
      <Modal
        open={previewOpen}
        title={`前台数据表单与对比表实时预览 (${selectedCategory})`}
        footer={<Button type="primary" onClick={() => setPreviewOpen(false)}>关闭预览</Button>}
        onCancel={() => setPreviewOpen(false)}
        width={700}
      >
        <Typography.Paragraph type="secondary">此效果即为供应商在 PC 端录入该车型时所看到的动态表单及消防用户对比参数表：</Typography.Paragraph>
        <Divider />
        <Form layout="vertical">
          {mockTemplates.map((tpl) => (
            <Form.Item key={tpl.id} label={`${tpl.field_label} ${tpl.unit ? `(${tpl.unit})` : ""}`} required={tpl.is_required}>
              {tpl.field_type === "select" ? (
                <Select placeholder="请选择底盘品牌">
                  {tpl.options?.split(",").map((opt: string) => (
                    <Select.Option key={opt} value={opt.trim()}>{opt.trim()}</Select.Option>
                  ))}
                </Select>
              ) : (
                <Input placeholder={`请输入${tpl.field_label}`} addonAfter={tpl.unit || null} />
              )}
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </div>
  );
}
