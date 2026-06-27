"use client";

import React, { useState } from "react";
import { Card, Typography, Tabs, Table, Button, Space, Switch, message, Image } from "antd";
import { PlusOutlined, SendOutlined } from "@ant-design/icons";

export default function HomePageConfig() {
  const [activeTab, setActiveTab] = useState("banner");

  const mockBanners = [
    {
      id: "b1",
      title: "2026中国国际消防装备与技术博览会展会焦点",
      img_url: "https://via.placeholder.com/600x200?text=Fire+Exhibition+2026",
      link: "/pages/article/detail?id=1",
      sort: 1,
      status: true,
    },
    {
      id: "b2",
      title: "大功率抢险救援车选配指南首发",
      img_url: "https://via.placeholder.com/600x200?text=Rescue+Vehicle+Guide",
      link: "/pages/equipment/detail?id=2",
      sort: 2,
      status: true,
    },
  ];

  const mockChannels = [
    { id: "c1", name: "灭火消防车", icon: "🔥", link: "/pages/equipment/index?cat=fire", sort: 1 },
    { id: "c2", name: "抢险救援车", icon: "🚑", link: "/pages/equipment/index?cat=rescue", sort: 2 },
    { id: "c3", name: "举高消防车", icon: "🏗️", link: "/pages/equipment/index?cat=ladder", sort: 3 },
    { id: "c4", name: "消防无人机", icon: "🛸", link: "/pages/equipment/index?cat=drone", sort: 4 },
  ];

  const bannerColumns = [
    { title: "排序", dataIndex: "sort", key: "sort", width: 80 },
    { title: "标题说明", dataIndex: "title", key: "title" },
    {
      title: "预览图",
      dataIndex: "img_url",
      key: "img_url",
      render: (url: string) => <Image src={url} width={120} height={40} style={{ objectFit: "cover", borderRadius: 4 }} alt="banner" />,
    },
    { title: "跳转页面链接", dataIndex: "link", key: "link" },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (val: boolean) => <Switch defaultChecked={val} onChange={(checked) => message.info(`已${checked ? "上线" : "下线"} Banner`)} />,
    },
    {
      title: "操作",
      key: "action",
      render: () => (
        <Space>
          <Button type="link" size="small">编辑</Button>
          <Button type="link" danger size="small">移除</Button>
        </Space>
      ),
    },
  ];

  const channelColumns = [
    { title: "排序", dataIndex: "sort", key: "sort", width: 80 },
    { title: "图标", dataIndex: "icon", key: "icon", render: (icon: string) => <span style={{ fontSize: 20 }}>{icon}</span> },
    { title: "频道名称", dataIndex: "name", key: "name" },
    { title: "跳转路径", dataIndex: "link", key: "link" },
    {
      title: "操作",
      key: "action",
      render: () => (
        <Space>
          <Button type="link" size="small">编辑</Button>
        </Space>
      ),
    },
  ];

  const handlePublish = () => {
    message.success("首页配置已成功实时推送发布至微信小程序端！");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          首页内容与看板配置
        </Typography.Title>
        <Button type="primary" icon={<SendOutlined />} onClick={handlePublish}>
          一键发布生效至小程序
        </Button>
      </div>
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "banner",
              label: "轮播图 (Banner) 配置看板",
              children: (
                <div>
                  <Button type="dashed" icon={<PlusOutlined />} style={{ marginBottom: 16, width: "100%" }}>
                    添加轮播图 Banner
                  </Button>
                  <Table dataSource={mockBanners} columns={bannerColumns} rowKey="id" pagination={false} />
                </div>
              ),
            },
            {
              key: "channel",
              label: "金刚区 / 频道入口配置看板",
              children: (
                <div>
                  <Table dataSource={mockChannels} columns={channelColumns} rowKey="id" pagination={false} />
                </div>
              ),
            },
            {
              key: "featured",
              label: "精选装备 / 热门供应商推荐位",
              children: <Typography.Paragraph type="secondary">配置规则：每周根据平台询价热度与大招标中选率自动推选，亦可手动置顶拖拽指定优质车型。</Typography.Paragraph>,
            },
          ]}
        />
      </Card>
    </div>
  );
}
