"use client";

import React, { useState } from "react";
import { Card, Typography, Tree, Button, Space, Modal, Form, Input, InputNumber, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function CategoriesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const treeData = [
    {
      title: "消防车辆 (Trucks)",
      key: "cat-1",
      children: [
        { title: "灭火消防车", key: "cat-1-1" },
        { title: "举高消防车", key: "cat-1-2" },
        { title: "专勤消防车", key: "cat-1-3" },
        { title: "战勤保障消防车", key: "cat-1-[4]" },
      ],
    },
    {
      title: "灭火救援装备 (Equipment)",
      key: "cat-2",
      children: [
        { title: "消防水枪/水炮", key: "cat-2-1" },
        { title: "个人防护装备 (PPE)", key: "cat-2-2" },
        { title: "破拆救援器材", key: "cat-2-3" },
      ],
    },
  ];

  const handleAddSubCategory = () => {
    form.resetFields();
    setModalOpen(true);
  };

  const handleSaveCategory = async () => {
    try {
      const values = await form.validateFields();
      message.success(`成功新增装备分类【${values.name}】！`);
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          装备多级分类管理
        </Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddSubCategory}>
          新建顶级/子级分类
        </Button>
      </div>
      <Card title="全站消防装备多级分类树 (支持前端选装导航与对比)">
        <Tree
          showLine
          defaultExpandAll
          treeData={treeData}
          titleRender={(nodeData: Record<string, unknown>) => (
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "space-between", width: 400 }}>
              <span>{nodeData.title}</span>
              <Space size="small">
                <Button type="link" icon={<EditOutlined />} size="small" onClick={() => message.info(`编辑 ${nodeData.title}`)} />
                <Button type="link" danger icon={<DeleteOutlined />} size="small" onClick={() => message.info(`删除 ${nodeData.title}`)} />
              </Space>
            </div>
          )}
        />
      </Card>

      <Modal
        open={modalOpen}
        title="新增装备分类"
        onCancel={() => setModalOpen(false)}
        onOk={handleSaveCategory}
        okText="保存分类"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="分类名称" rules={[{ required: true, message: "请输入分类名称" }]}>
            <Input placeholder="例：大流量排水抢险车" />
          </Form.Item>
          <Form.Item name="slug" label="英文/拼音 Slug (路由识别)" rules={[{ required: true, message: "请输入 Slug" }]}>
            <Input placeholder="例：drainage-truck" />
          </Form.Item>
          <Form.Item name="sort_order" label="排序权重" initialValue={0}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
