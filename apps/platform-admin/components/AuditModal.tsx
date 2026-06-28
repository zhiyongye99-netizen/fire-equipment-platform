"use client";

import React, { useState } from "react";
import { Modal, Input, Form, Typography } from "antd";

interface AuditModalProps {
  open: boolean;
  title: string;
  actionType: "approve" | "reject";
  onCancel: () => void;
  onConfirm: (reason?: string) => Promise<void> | void;
}

export default function AuditModal({ open, title, actionType, onCancel, onConfirm }: AuditModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await onConfirm(values.reason);
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
      okText={actionType === "approve" ? "通过审核" : "确认驳回"}
      okType={actionType === "approve" ? "primary" : "danger"}
      cancelText="取消"
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
      confirmLoading={loading}
    >
      <Typography.Paragraph type="secondary">
        {actionType === "approve"
          ? "确认通过该项目的审核？通过后该信息将在前台实时展示。"
          : "请输入退回/驳回理由。该说明将同步记录在审核日志中并通知申请方。"}
      </Typography.Paragraph>
      <Form form={form} layout="vertical">
        <Form.Item
          name="reason"
          label="操作说明 / 驳回理由"
          rules={[
            {
              required: actionType === "reject",
              message: "驳回审核必须输入具体原因",
            },
          ]}
        >
          <Input.TextArea rows={4} placeholder="请输入具体的审核意见或改进建议..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}
