import React, { useState, useEffect } from "react";
import { View, Text, Input, ScrollView, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { ProductCard, ProductItem } from "../../components/ProductCard";
import { InquiryModal } from "../../components/InquiryModal";
import { toggleCompareId, subscribeCompare } from "../../utils/compareStore";
import { api, ApiProduct } from "../../utils/api";
import "./index.scss";

const TOP_TABS = ["消防车辆", "器材装备", "智能装备", "维保服务"];

const GRID_ACTIONS = [
  { name: "分类筛选", icon: "🍸", type: "filter" },
  { name: "参数对比", icon: "⚖️", type: "compare" },
  { name: "招采参考", icon: "📋", type: "bidding" },
  { name: "价格调研", icon: "💰", type: "price" },
  { name: "中标案例", icon: "🏆", type: "cases" },
  { name: "标准要求", icon: "🛡️", type: "standards" },
  { name: "新品速览", icon: "🆕", type: "new" },
  { name: "供应商", icon: "👥", type: "suppliers" }
];

const FILTER_GROUPS = [
  {
    title: "车辆类型",
    options: ["灭火消防车", "抢险救援车", "举高消防车", "排烟排涝", "保障车辆"]
  },
  {
    title: "应用场景",
    options: ["城市主战", "高层灭火", "石化园区", "森林消防"]
  },
  {
    title: "预算区间",
    options: ["100-300万", "300-500万", "500-800万", "500万以上"]
  },
  {
    title: "底盘排放",
    options: ["国六", "国五", "新能源", "不限"]
  }
];

const MOCK_PRODUCTS: ProductItem[] = [
  {
    id: "prod-101",
    name: "18吨大流量泡沫消防车",
    categoryName: "消防车辆",
    supplierName: "中联重科",
    scenes: "城市主战 / 石化园区",
    specsLine: "⚙ 流量: 180L/s   ⛰ 水罐: 10t / 泡沫: 2t   👤 乘员: 6人",
    tags: [
      { text: "主战推荐", color: "red" },
      { text: "中标参考", color: "blue" },
      { text: "实战应用", color: "green" }
    ],
    coverImage: "https://dummyimage.com/240x180/eaecf0/101828&text=18吨泡沫车"
  },
  {
    id: "prod-102",
    name: "城市主战抢险救援消防车",
    categoryName: "消防车辆",
    supplierName: "徐工消防",
    scenes: "城市抢险 / 山地救援",
    specsLine: "⚙ 牵引力: 120kN   ⛰ 绞盘: 10t   👤 乘员: 6人",
    tags: [
      { text: "高效救援", color: "red" },
      { text: "中标参考", color: "blue" },
      { text: "实战应用", color: "green" }
    ],
    coverImage: "https://dummyimage.com/240x180/d0d5dd/101828&text=抢险救援车"
  },
  {
    id: "prod-103",
    name: "32米云梯消防车",
    categoryName: "消防车辆",
    supplierName: "中联重科",
    scenes: "高层建筑 / 商业综合体",
    specsLine: "⚙ 最大作业高度: 32m   ⛰ 额定载荷: 400kg   👤 乘员: 3人",
    tags: [
      { text: "高层灭火", color: "red" },
      { text: "中标参考", color: "blue" },
      { text: "实战应用", color: "green" }
    ],
    coverImage: "https://dummyimage.com/240x180/98a2b3/101828&text=32米云梯车"
  },
  {
    id: "prod-104",
    name: "大流量排涝抢险车",
    categoryName: "防汛排涝",
    supplierName: "盈峰环境",
    scenes: "城市内涝 / 防汛抢险",
    specsLine: "⚙ 流量: 2000m³/h   ⛰ 扬程: 15m   👤 乘员: 2人",
    tags: [
      { text: "排涝抢险", color: "red" },
      { text: "中标参考", color: "blue" },
      { text: "实战应用", color: "green" }
    ],
    coverImage: "https://dummyimage.com/240x180/667085/ffffff&text=排涝车"
  }
];

export default function EquipmentPage() {
  const [activeTopTab, setActiveTopTab] = useState("消防车辆");
  const [searchKey, setSearchKey] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({
    "车辆类型": "灭火消防车",
    "应用场景": "城市主战",
    "预算区间": "300-500万",
    "底盘排放": "国六"
  });
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [inquiryTarget, setInquiryTarget] = useState<ApiProduct | null>(null);
  const [products, setProducts] = useState<ApiProduct[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeCompare(ids => {
      setCompareIds([...ids]);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    Taro.showLoading({ title: "加载中..." });
    api.products.list({ limit: 20 })
      .then((res) => {
        setProducts(res.data);
        Taro.hideLoading();
      })
      .catch(() => {
        Taro.hideLoading();
        Taro.showToast({ title: "加载失败，请重试", icon: "none" });
      });
  }, []);

  const handleFilterClick = (groupTitle: string, opt: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [groupTitle]: opt
    }));
  };

  const handleToggleCompare = (id: string) => {
    const res = toggleCompareId(id);
    if (!res.success && res.message) {
      Taro.showToast({ title: res.message, icon: "none" });
    }
  };

  const handleGoToCompare = () => {
    if (compareIds.length === 0) {
      Taro.showToast({ title: "请先勾选需要对比的装备", icon: "none" });
      return;
    }
    Taro.navigateTo({
      url: `/pages/equipment/compare?ids=${compareIds.join(",")}`
    });
  };

  const handleGridActionClick = (type: string) => {
    if (type === "compare") {
      handleGoToCompare();
    } else {
      Taro.showToast({ title: `功能准备中`, icon: "none" });
    }
  };

  return (
    <View className="equipment-ui-page">
      {/* 顶部标题与搜索 */}
      <View className="header-sticky">
        <View className="page-header-title">
          <Text className="emblem">🛡️</Text>
          <Text className="title-text">消防装备智选</Text>
        </View>
        <View className="search-bar-wrap">
          <Text className="search-icon">🔍</Text>
          <Input
            className="search-input"
            placeholder="搜泡沫消防车、空呼、破拆、无人机、招标参数"
            value={searchKey}
            onInput={e => setSearchKey(e.detail.value)}
          />
        </View>

        {/* 一级大类 Tab */}
        <View className="top-tabs-row">
          {TOP_TABS.map(tab => (
            <View
              key={tab}
              className={`top-tab-item ${activeTopTab === tab ? "active" : ""}`}
              onClick={() => setActiveTopTab(tab)}
            >
              {tab}
            </View>
          ))}
        </View>
      </View>

      <ScrollView className="scroll-content-body" scrollY>
        {/* 8金刚位功能入口网格 */}
        <View className="grid-8-container">
          {GRID_ACTIONS.map(item => (
            <View
              key={item.name}
              className="grid-item"
              onClick={() => handleGridActionClick(item.type)}
            >
              <View className="icon-circle">{item.icon}</View>
              <Text className="item-name">{item.name}</Text>
            </View>
          ))}
        </View>

        {/* 多维筛选条件 Block */}
        <View className="filter-block-container">
          {FILTER_GROUPS.map(group => (
            <View key={group.title} className="filter-group-row">
              <Text className="group-title">{group.title}</Text>
              <View className="options-wrap">
                {group.options.map(opt => (
                  <View
                    key={opt}
                    className={`opt-chip ${selectedFilters[group.title] === opt ? "active" : ""}`}
                    onClick={() => handleFilterClick(group.title, opt)}
                  >
                    {opt}
                  </View>
                ))}
                {group.title === "应用场景" && (
                  <Text className="more-btn">更多 ∨</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* 年度主战车型 Banner */}
        <View className="operation-banner">
          <View className="banner-text-left">
            <Text className="banner-title">年度主战车型参考</Text>
            <Text className="banner-sub">精选性价比车型，助力科学选型</Text>
            <View className="btn-view-banner">立即查看 🚀</View>
          </View>
          <Image
            className="banner-truck-img"
            src="https://dummyimage.com/200x120/1677ff/ffffff&text=主战消防车"
            mode="aspectFit"
          />
        </View>

        {/* 产品卡片 Stream */}
        <View className="products-list-wrap">
          {products.map(p => (
            <ProductCard
              key={p.id}
              product={p as unknown as ProductItem}
              isCompared={compareIds.includes(p.id)}
              onToggleCompare={handleToggleCompare}
              onInquiry={target => setInquiryTarget(p)}
            />
          ))}
        </View>
      </ScrollView>

      {/* 底部浮动控制栏 */}
      <View className="floating-action-bar">
        <View
          className={`compare-pill ${compareIds.length > 0 ? "active" : ""}`}
          onClick={handleGoToCompare}
        >
          <Text className="scale-icon">⚖️</Text>
          <Text className="pill-text">已加入对比 <Text className="num">{compareIds.length}</Text> ∧</Text>
        </View>

        <View className="consult-pill" onClick={() => setInquiryTarget(products[0] ?? null)}>
          <Text className="headset-icon">🎧</Text>
          <Text className="pill-text">咨询</Text>
        </View>
      </View>

      {/* 询价线索弹窗 */}
      <InquiryModal
        isOpen={!!inquiryTarget}
        productId={inquiryTarget?.id || ""}
        productName={inquiryTarget?.name || ""}
        onClose={() => setInquiryTarget(null)}
      />
    </View>
  );
}
