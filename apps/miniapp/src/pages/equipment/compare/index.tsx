import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { InquiryModal } from "../../../components/InquiryModal";
import { getCompareIds, toggleCompareId, subscribeCompare } from "../../../utils/compareStore";
import "./index.scss";

interface CompareProduct {
  id: string;
  name: string;
  supplierName: string;
  coverImage: string;
  priceRange: string;
  sections: {
    title: string;
    icon: string;
    items: { label: string; val: string; isHighlight?: boolean }[];
  }[];
}

const MOCK_COMPARE_DATA: Record<string, CompareProduct> = {
  "prod-101": {
    id: "prod-101",
    name: "32米举高喷射消防车",
    supplierName: "中联重科",
    coverImage: "https://dummyimage.com/200x150/eaecf0/101828&text=举高车",
    priceRange: "¥380万",
    sections: [
      {
        title: "核心参数",
        icon: "🎯",
        items: [
          { label: "最大作业高度", val: "32米", isHighlight: true },
          { label: "水罐容量", val: "3.5m³" },
          { label: "额定流量", val: "80L/s", isHighlight: true },
          { label: "乘员人数", val: "2+4人" }
        ]
      },
      {
        title: "底盘与动力",
        icon: "🔀",
        items: [
          { label: "底盘品牌", val: "重汽豪沃" },
          { label: "发动机功率", val: "360kW", isHighlight: true },
          { label: "驱动形式", val: "6×4" }
        ]
      },
      {
        title: "服务与合规",
        icon: "🛡️",
        items: [
          { label: "3C认证", val: "✓ 已通过" },
          { label: "维保响应", val: "24小时内" },
          { label: "交付周期", val: "45天", isHighlight: true }
        ]
      }
    ]
  },
  "prod-102": {
    id: "prod-102",
    name: "18吨泡沫消防车",
    supplierName: "中联重科",
    coverImage: "https://dummyimage.com/200x150/d0d5dd/101828&text=泡沫车",
    priceRange: "¥180万",
    sections: [
      {
        title: "核心参数",
        icon: "🎯",
        items: [
          { label: "最大作业高度", val: "—" },
          { label: "水罐容量", val: "12m³", isHighlight: true },
          { label: "额定流量", val: "60L/s" },
          { label: "乘员人数", val: "2+4人" }
        ]
      },
      {
        title: "底盘与动力",
        icon: "🔀",
        items: [
          { label: "底盘品牌", val: "东风天锦" },
          { label: "发动机功率", val: "280kW" },
          { label: "驱动形式", val: "4×2" }
        ]
      },
      {
        title: "服务与合规",
        icon: "🛡️",
        items: [
          { label: "3C认证", val: "✓ 已通过" },
          { label: "维保响应", val: "24小时内" },
          { label: "交付周期", val: "60天" }
        ]
      }
    ]
  },
  "prod-103": {
    id: "prod-103",
    name: "城市主战消防车",
    supplierName: "徐工消防",
    coverImage: "https://dummyimage.com/200x150/98a2b3/101828&text=主战车",
    priceRange: "¥220万",
    sections: [
      {
        title: "核心参数",
        icon: "🎯",
        items: [
          { label: "最大作业高度", val: "—" },
          { label: "水罐容量", val: "5m³" },
          { label: "额定流量", val: "100L/s", isHighlight: true },
          { label: "乘员人数", val: "2+6人", isHighlight: true }
        ]
      },
      {
        title: "底盘与动力",
        icon: "🔀",
        items: [
          { label: "底盘品牌", val: "奔驰Atego" },
          { label: "发动机功率", val: "299kW" },
          { label: "驱动形式", val: "4×2" }
        ]
      },
      {
        title: "服务与合规",
        icon: "🛡️",
        items: [
          { label: "3C认证", val: "✓ 已通过" },
          { label: "维保响应", val: "12小时内", isHighlight: true },
          { label: "交付周期", val: "30天", isHighlight: true }
        ]
      }
    ]
  }
};

const DIMENSION_TABS = [
  { name: "整车参数", icon: "🚛" },
  { name: "灭火能力", icon: "🔥" },
  { name: "底盘信息", icon: "⚙️" },
  { name: "服务保障", icon: "🛡️" }
];

export default function ComparePage() {
  const router = useRouter();
  const [ids, setIds] = useState<string[]>([]);
  const [activeDimension, setActiveDimension] = useState("整车参数");
  const [onlyDiff, setOnlyDiff] = useState(false);
  const [highlightAdvantage, setHighlightAdvantage] = useState(true);
  const [inquiryTarget, setInquiryTarget] = useState<CompareProduct | null>(null);

  useEffect(() => {
    const queryIds = router.params.ids ? router.params.ids.split(",") : getCompareIds();
    setIds(queryIds.filter(Boolean));

    const unsubscribe = subscribeCompare(storeIds => {
      if (!router.params.ids) {
        setIds([...storeIds]);
      }
    });
    return () => unsubscribe();
  }, [router.params.ids]);

  const products = ids.map(id => MOCK_COMPARE_DATA[id] || MOCK_COMPARE_DATA["prod-101"]);

  const handleRemoveProduct = (id: string) => {
    toggleCompareId(id);
  };

  const handleAddProduct = () => {
    Taro.navigateBack();
  };

  if (products.length === 0) {
    return (
      <View className="compare-empty-container">
        <Text className="empty-icon">⚖️</Text>
        <Text className="empty-text">暂无已选对比装备</Text>
        <View className="btn-back-selection" onClick={() => Taro.navigateBack()}>
          返回选装大厅
        </View>
      </View>
    );
  }

  const sectionTitles = products[0]?.sections.map(s => ({ title: s.title, icon: s.icon })) || [];

  return (
    <View className="compare-ui-page">
      <ScrollView className="top-products-scroll" scrollX scrollWithAnimation>
        <View className="top-products-list">
          {products.map(p => (
            <View key={p.id} className="top-prod-card">
              <View className="remove-cross" onClick={() => handleRemoveProduct(p.id)}>✕</View>
              <Image className="card-img" src={p.coverImage} mode="aspectFill" />
              <Text className="card-title">{p.name}</Text>
            </View>
          ))}

          {products.length < 4 && (
            <View className="top-prod-card add-card" onClick={handleAddProduct}>
              <View className="plus-icon">⊕</View>
              <Text className="add-text">添加产品</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="dimension-section">
        <View className="dim-header">
          <View className="left-title">
            <Text className="icon">📋</Text>
            <Text className="title-text">对比维度</Text>
          </View>
          <Text className="count-text">已选 {products.length} 款</Text>
        </View>

        <ScrollView className="dim-tabs-scroll" scrollX scrollWithAnimation>
          <View className="dim-tabs-list">
            {DIMENSION_TABS.map(tab => (
              <View
                key={tab.name}
                className={`dim-tab-item ${activeDimension === tab.name ? "active" : ""}`}
                onClick={() => setActiveDimension(tab.name)}
              >
                <Text className="tab-icon">{tab.icon}</Text>
                <Text className="tab-name">{tab.name}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View className="toggles-row">
          <View className="toggle-item">
            <Text className="toggle-label">仅看不同</Text>
            <View
              className={`toggle-switch ${onlyDiff ? "on" : ""}`}
              onClick={() => setOnlyDiff(!onlyDiff)}
            >
              <View className="handle" />
            </View>
          </View>

          <View className="toggle-item">
            <Text className="toggle-label">高亮优势</Text>
            <View
              className={`toggle-switch ${highlightAdvantage ? "on" : ""}`}
              onClick={() => setHighlightAdvantage(!highlightAdvantage)}
            >
              <View className="handle" />
            </View>
          </View>
        </View>
      </View>

      <ScrollView className="table-scroll-body" scrollY scrollX>
        <View className="table-wrapper">
          {sectionTitles.map((sec, secIdx) => (
            <View key={sec.title} className="section-table-block">
              <View className="sec-header-row">
                <Text className="sec-icon">{sec.icon}</Text>
                <Text className="sec-name">{sec.title}</Text>
              </View>

              {products[0]?.sections[secIdx]?.items.map((item, itemIdx) => (
                <View key={item.label} className="table-row">
                  <View className="param-label-col">{item.label}</View>
                  {products.map(p => {
                    const cellData = p.sections[secIdx]?.items[itemIdx];
                    const isHi = highlightAdvantage && cellData?.isHighlight;
                    return (
                      <View key={p.id} className="param-val-col">
                        <Text className={`val-text ${isHi ? "highlight-blue" : ""}`}>
                          {cellData?.val || "--"}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="compare-bottom-bar">
        <View className="action-btn btn-white">
          <Text className="icon">⭐</Text> 收藏对比
        </View>
        <View className="action-btn btn-white">
          <Text className="icon">📥</Text> 导出对比
        </View>
        <View className="action-btn btn-blue-solid" onClick={() => setInquiryTarget(products[0])}>
          <Text className="icon">🏷️</Text> 询底价
        </View>
      </View>

      <InquiryModal
        isOpen={!!inquiryTarget}
        productId={inquiryTarget?.id || ""}
        productName={inquiryTarget?.name || ""}
        onClose={() => setInquiryTarget(null)}
      />
    </View>
  );
}
