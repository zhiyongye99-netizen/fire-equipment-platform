import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { InquiryModal } from "../../components/InquiryModal";
import { getCompareIds, toggleCompareId, subscribeCompare } from "../../utils/compareStore";
import "./compare.scss";

interface CompareProduct {
  id: string;
  name: string;
  supplierName: string;
  coverImage: string;
  priceRange: string;
  parameters: Record<string, string>;
}

const MOCK_COMPARE_DATA: Record<string, CompareProduct> = {
  "prod-101": {
    id: "prod-101",
    name: "大流量排水抢险车 (5000m³/h)",
    supplierName: "捷达消防公司",
    coverImage: "https://dummyimage.com/200x150/eaecf0/101828&text=排涝车",
    priceRange: "¥120万-150万",
    parameters: {
      "分类/领域": "防汛排涝",
      "关键指标": "5000 m³/h",
      "最大扬程": "30 m",
      "动力功率": "280 kW",
      "排放标准": "国六",
      "外形尺寸": "8.5×2.5×3.4m"
    }
  },
  "prod-102": {
    id: "prod-102",
    name: "54米举高喷射消防车",
    supplierName: "三一重工",
    coverImage: "https://dummyimage.com/200x150/d0d5dd/101828&text=举高车",
    priceRange: "¥380万-420万",
    parameters: {
      "分类/领域": "消防车辆",
      "关键指标": "54 m",
      "最大扬程": "80 m",
      "动力功率": "360 kW",
      "排放标准": "国六",
      "外形尺寸": "11.8×2.5×3.9m"
    }
  },
  "prod-103": {
    id: "prod-103",
    name: "重载救援无人机",
    supplierName: "晨光智能",
    coverImage: "https://dummyimage.com/200x150/98a2b3/101828&text=无人机",
    priceRange: "¥25万-35万",
    parameters: {
      "分类/领域": "无人装备",
      "关键指标": "50 kg 负载",
      "最大扬程": "10 km 控制",
      "动力功率": "纯电蓄电池",
      "排放标准": "零排放",
      "外形尺寸": "1.8×1.8×0.6m"
    }
  },
  "prod-104": {
    id: "prod-104",
    name: "激流救生冲锋艇",
    supplierName: "威海广泰",
    coverImage: "https://dummyimage.com/200x150/667085/ffffff&text=冲锋艇",
    priceRange: "¥8.5万-12万",
    parameters: {
      "分类/领域": "水域救援",
      "关键指标": "9人 乘载",
      "最大扬程": "--",
      "动力功率": "60 HP 舷外机",
      "排放标准": "汽油机",
      "外形尺寸": "4.7×1.9×0.8m"
    }
  }
};

const ALL_PARAM_KEYS = ["分类/领域", "关键指标", "最大扬程", "动力功率", "排放标准", "外形尺寸"];

export default function ComparePage() {
  const router = useRouter();
  const [ids, setIds] = useState<string[]>([]);
  const [onlyDiff, setOnlyDiff] = useState(false);
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

  // Check if a parameter key has different values across selected products
  const isDifferentParam = (key: string) => {
    if (products.length <= 1) return false;
    const firstVal = products[0]?.parameters[key];
    return products.some(p => p?.parameters[key] !== firstVal);
  };

  const displayedKeys = onlyDiff
    ? ALL_PARAM_KEYS.filter(k => isDifferentParam(k))
    : ALL_PARAM_KEYS;

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

  return (
    <View className="compare-page-container">
      {/* 顶部控制栏 */}
      <View className="compare-top-controls">
        <Text className="title-info">已对比 {products.length} 款装备</Text>
        <View
          className={`toggle-diff-btn ${onlyDiff ? "active" : ""}`}
          onClick={() => setOnlyDiff(!onlyDiff)}
        >
          {onlyDiff ? "✓ 仅看不同参数" : "高亮不同参数"}
        </View>
      </View>

      <ScrollView className="compare-scroll-body" scrollY scrollX>
        <View className="compare-table-wrapper">
          {/* 表头：装备产品卡片固定同行 */}
          <View className="table-header-row">
            <View className="param-label-cell header-cell">装备概览</View>
            {products.map(p => (
              <View key={p.id} className="product-col-cell header-cell">
                <View className="remove-btn" onClick={() => handleRemoveProduct(p.id)}>✕ 移除</View>
                <Image className="col-img" src={p.coverImage} mode="aspectFill" />
                <Text className="col-title">{p.name}</Text>
                <Text className="col-price">{p.priceRange}</Text>
                <View className="col-inquiry-btn" onClick={() => setInquiryTarget(p)}>
                  询价
                </View>
              </View>
            ))}
          </View>

          {/* 参数逐行对比 */}
          {displayedKeys.map(key => {
            const diff = isDifferentParam(key);
            return (
              <View key={key} className={`table-data-row ${diff ? "diff-row" : ""}`}>
                <View className="param-label-cell">
                  {key}
                  {diff && <Text className="diff-dot">•</Text>}
                </View>
                {products.map(p => (
                  <View key={p.id} className="product-col-cell">
                    <Text className="param-val-text">{p.parameters[key] || "--"}</Text>
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* 询价弹窗 */}
      <InquiryModal
        isOpen={!!inquiryTarget}
        productId={inquiryTarget?.id || ""}
        productName={inquiryTarget?.name || ""}
        onClose={() => setInquiryTarget(null)}
      />
    </View>
  );
}
