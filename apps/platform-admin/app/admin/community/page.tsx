"use client";

import React, { useState } from "react";
import { Card, Typography, Tabs, Table, Tag, Button, Space, message } from "antd";
import { PushpinOutlined, DeleteOutlined, StopOutlined, StarOutlined } from "@ant-design/icons";
import ConfirmModal from "@/components/ConfirmModal";
import { maskPhone } from "@/lib/utils";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Record<string, unknown>>({}); 
  const [actionType, setActionType] = useState<"takedown" | "ban">("takedown");

  const mockPosts = [
    {
      id: "post-1",
      user_name: "大队长老张",
      user_phone: "13800112233",
      circle_name: "战训实操与装备评测",
      title: "关于高层建筑破拆通风装备在极寒条件下的性能实测心得",
      like_count: 42,
      created_at: "2026-06-27 08:30",
    },
    {
      id: "post-2",
      user_name: "匿名用户9527",
      user_phone: "15999998888",
      circle_name: "招采违规举报与防坑",
      title: "某某低价劣质水带供应商假冒合格证宣传违规贴",
      like_count: 105,
      created_at: "2026-06-27 09:10",
    },
  ];

  const handleActionClick = (record: Record<string, unknown>, type: "takedown" | "ban") => {
    setCurrentPost(record);
    setActionType(type);
    setConfirmOpen(true);
  };

  const handleConfirmAction = async (reason?: string) => {
    message.success(`已成功对项目【${currentPost?.title || currentPost?.user_name}】执行【${actionType === "takedown" ? "违规下架" : "用户禁言"}】操作！`);
    if (reason) {
      console.log("二次确认理由落库日志:", reason);
    }
    setConfirmOpen(false);
  };

  const postColumns = [
    { title: "发布用户", dataIndex: "user_name", key: "user_name" },
    {
      title: "用户手机 (脱敏)",
      dataIndex: "user_phone",
      key: "user_phone",
      render: (phone: string) => maskPhone(phone),
    },
    { title: "所属圈子", dataIndex: "circle_name", key: "circle_name", render: (c: string) => <Tag color="blue">{c}</Tag> },
    { title: "帖子标题", dataIndex: "title", key: "title" },
    { title: "点赞数", dataIndex: "like_count", key: "like_count" },
    { title: "发布时间", dataIndex: "created_at", key: "created_at" },
    {
      title: "治理动作",
      key: "action",
      render: (_: unknown, record: Record<string, unknown>) => (
        <Space>
          <Button icon={<PushpinOutlined />} size="small" onClick={() => message.success("已成功置顶该帖！")}>置顶</Button>
          <Button icon={<StarOutlined />} size="small" onClick={() => message.success("已加精该实战经验帖！")}>加精</Button>
          <Button danger icon={<DeleteOutlined />} size="small" onClick={() => handleActionClick(record, "takedown")}>下架</Button>
          <Button type="primary" danger icon={<StopOutlined />} size="small" onClick={() => handleActionClick(record, "ban")}>禁言用户</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={3} style={{ marginBottom: 16 }}>
        消防圈与资讯治理
      </Typography.Title>
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "posts",
              label: "帖子风控审计与治理",
              children: <Table dataSource={mockPosts} columns={postColumns} rowKey="id" />,
            },
            {
              key: "circles",
              label: "消防圈圈子分类维护",
              children: <Typography.Paragraph type="secondary">当前包含：【战训实操与装备评测】、【水域救援研讨】、【招采违规举报与防坑】等专业圈子。</Typography.Paragraph>,
            },
          ]}
        />
      </Card>

      {confirmOpen && (
        <ConfirmModal
          open={confirmOpen}
          title={actionType === "takedown" ? "高危动作：下架帖子" : "高危动作：账号封禁与禁言"}
          content={actionType === "takedown" ? `确认下架帖子《${currentPost?.title}》？下架后前台不可见。` : `确认封禁用户【${currentPost?.user_name}】？禁言后该账号30天内无法发布任何研讨。`}
          requireReason={true}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleConfirmAction}
        />
      )}
    </div>
  );
}
