import React, { useState, useEffect } from "react";
import { View, Text, Input, ScrollView, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { ProductCard, ProductItem } from "../../components/ProductCard";
import { InquiryModal } from "../../components/InquiryModal";
import { toggleCompareId, subscribeCompare } from "../../utils/compareStore";
import { api } from "../../utils/api";
import "./index.scss";

const TOP_TABS = ["车辆", "灭火", "水域", "无人装备"];

const BRANDS = [
  { logoText: "ZOOMLION", name: "中联重科", color: "#70b603" },
  { logoText: "XCMG", name: "徐工消防", color: "#0052d9" },
  { logoText: "SANY", name: "三一应急", color: "#d92d20" },
  { logoText: "HANDZER", name: "海伦哲", color: "#003a8c" },
  { logoText: "INFORE", name: "盈峰环境", color: "#096dd9" },
  { logoText: "JIEDA", name: "捷达消防", color: "#1890ff" },
  { logoText: "ZOO", name: "中卓时代", color: "#d4b106" },
  { logoText: "GLM", name: "上海格拉曼", color: "#002329" }
];

const HOT_SEARCHES = [
  "水罐消防车", "泡沫消防车", "抢险救援车", "云梯消防车",
  "排烟排涝", "主战车型", "国六底盘", "300-500万"
];

const MOCK_PRODUCTS: ProductItem[] = [
  {
    id: "prod-101",
    name: "18吨水罐消防车",
    supplierName: "中联重科",
    specsLine: "💧 水罐: 18吨   🔄 流量: 180L/s   👤 乘员: 6人",
    tags: [
      { text: "主战推荐", color: "red" },
      { text: "高性能比", color: "blue" },
      { text: "实战应用", color: "green" }
    ],
    coverImage: "https://dummyimage.com/240x180/eaecf0/101828&text=18吨水罐车"
  },
  {
    id: "prod-102",
    name: "18吨泡沫消防车",
    supplierName: "徐工消防",
    specsLine: "💧 泡沫: 18吨   🔄 流量: 160L/s   👤 乘员: 6人",
    tags: [
      { text: "高效灭火", color: "red" },
      { text: "徐工消防", color: "blue" },
      { text: "国六底盘", color: "green" }
    ],
    coverImage: "https://dummyimage.com/240x180/d0d5dd/101828&text=18吨泡沫车"
  },
  {
    id: "prod-103",
    name: "32米云梯消防车",
    supplierName: "三一应急",
    specsLine: "⚙ 作业高度: 32m   ⛰ 载重: 400kg   👤 乘员: 3人",
    tags: [
      { text: "高层灭火", color: "red" },
      { text: "三一应急", color: "blue" },
      { text: "实战应用", color: "green" }
    ],
    coverImage: "https://dummyimage.com/240x180/98a2b3/101828&text=32米云梯车"
  },
  {
    id: "prod-104",
    name: "抢险救援消防车",
    supplierName: "捷达消防",
    specsLine: "⚙ 牵引力: 120kN   ⛰ 涉水深度: 1.2m   👤 乘员: 6人",
    tags: [
      { text: "多功能救援", color: "red" },
      { text: "捷达消防", color: "blue" },
      { text: "实战应用", color: "green" }
    ],
    coverImage: "https://dummyimage.com/240x180/667085/ffffff&text=抢险救援车"
  }
];

export default function EquipmentPage() {
  const [activeTopTab, setActiveTopTab] = useState("车辆");
  const [searchKey, setSearchKey] = useState("");
  const [activeHotSearch, setActiveHotSearch] = useState("主战车型");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [inquiryTarget, setInquiryTarget] = useState<ProductItem | null>(null);
  const [products, setProducts] = useState<ProductItem[]>(MOCK_PRODUCTS);

  useEffect(() => {
    const unsubscribe = subscribeCompare(ids => {
      setCompareIds([...ids]);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    api.products.list({ limit: 20 })
      .then((res) => {
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          setProducts(res.data as unknown as ProductItem[]);
        }
      })
      .catch(() => {
        // 静默保底
      });
  }, []);

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

  return (
    <View className="equipment-home-02">
      {/* 顶部 Sticky 栏：一级 Tab 与 搜索 */}
      <View className="sticky-top-header">
        <View className="top-tabs-line">
          {TOP_TABS.map(tab => (
            <View
              key={tab}
              className={`top-tab-btn ${activeTopTab === tab ? "active" : ""}`}
              onClick={() => setActiveTopTab(tab)}
            >
              {tab}
            </View>
          ))}
        </View>

        <View className="search-pill-box">
          <Text className="search-icon">🔍</Text>
          <Input
            className="search-input"
            placeholder="搜索消防车、空呼、破拆、无人船、招标参数"
            value={searchKey}
            onInput={e => setSearchKey(e.detail.value)}
          />
        </View>
      </View>

      <ScrollView className="home-scroll-body" scrollY>
        {/* 并排两大功能卡片 (分类筛选 & 参数对比) */}
        <View className="dual-action-cards">
          <View className="action-card card-filter" onClick={() => Taro.showToast({ title: "条件筛选中", icon: "none" })}>
            <View className="card-left-icon icon-blue-funnel">🍸</View>
            <View className="card-text-group">
              <Text className="card-title">分类筛选</Text>
              <Text className="card-desc">按类型·底盘·功能筛选</Text>
            </View>
            <Text className="card-arrow">&gt;</Text>
          </View>

          <View className="action-card card-compare" onClick={handleGoToCompare}>
            <View className="card-left-icon icon-blue-scale">⚖️</View>
            <View className="card-text-group">
              <Text className="card-title">参数对比</Text>
              <Text className="card-desc">多车型参数对比</Text>
            </View>
            <Text className="card-arrow">&gt;</Text>
          </View>
        </View>

        {/* 品牌推荐区 */}
        <View className="section-container brand-section">
          <View className="sec-title-row">
            <Text className="sec-title">品牌推荐</Text>
            <Text className="sec-more">全部品牌 &gt;</Text>
          </View>

          <View className="brands-grid">
            {BRANDS.map(b => (
              <View key={b.name} className="brand-card-item">
                <Text className="brand-logo-text" style={{ color: b.color }}>{b.logoText}</Text>
                <Text className="brand-name-label">{b.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 热门搜索区 */}
        <View className="section-container hot-section">
          <Text className="sec-title">热门搜索</Text>
          <View className="hot-pills-grid">
            {HOT_SEARCHES.map(kw => (
              <View
                key={kw}
                className={`hot-pill-item ${activeHotSearch === kw ? "active" : ""}`}
                onClick={() => setActiveHotSearch(kw)}
              >
                {kw}
              </View>
            ))}
          </View>
        </View>

        {/* 年度主战车型参考 Banner */}
        <View className="operation-banner-02">
          <View className="banner-content-left">
            <Text className="b-title">年度主战车型参考</Text>
            <Text className="b-sub">精选高性能主战车型，助力科学选型</Text>
            <View className="btn-banner-action">立即查看 &gt;</View>
          </View>
          <Image
            className="banner-img"
            src="https://dummyimage.com/220x130/1677ff/ffffff&text=主战车型"
            mode="aspectFit"
          />
        </View>

        {/* 装备产品列表卡片流 */}
        <View className="products-list-stream">
          {products.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              isCompared={compareIds.includes(p.id)}
              onToggleCompare={handleToggleCompare}
              onInquiry={() => setInquiryTarget(p)}
            />
          ))}
        </View>
      </ScrollView>

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
