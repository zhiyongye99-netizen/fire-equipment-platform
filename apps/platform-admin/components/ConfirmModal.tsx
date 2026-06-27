"use client";

import React, { useState } from "react";
import { Modal, Typography, Input, Form } from "antd";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  content: string;
  danger?: boolean;
  requireReason?: boolean;
  onCancel: () => void;
  onConfirm: (reason?: string) => Promise<void> | void;
}

export default function ConfirmModal({
  open,
  title,
  content,
  danger = true,
  requireReason = true,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      let reason: string | undefined;
      if (requireReason) {
        const values = await form.validateFields();
        reason = values.reason;
      }
      setLoading(true);
      await onConfirm(reason);
      form.resetFields();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title={title}
      okText="确认高危操作"
      okType={danger ? "danger" : "primary"}
      cancelText="取消"
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
      confirmLoading={loading}
    >
      <Typography.Paragraph type="danger" style={{ fontWeight: 500 }}>
        {content}
      </Typography.Paragraph>
      {requireReason && (
        <Form form={form} layout="vertical">
          <Form.Item
            name="reason"
            label="二次确认操作说明"
            rules={[{ required: true, message: "高危操作必须填写操作确认原因" }]}
          >
            <Input.TextArea rows={3} placeholder="请务必注明下架或禁言的具体规则依据..." />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}
