import React, { useState, useEffect } from "react";
import { View, Text, Input, ScrollView, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { ProductCard, ProductItem } from "../../components/ProductCard";
import { InquiryModal } from "../../components/InquiryModal";
import { getCompareIds, toggleCompareId, subscribeCompare, clearCompareIds } from "../../utils/compareStore";
import "./index.scss";

// Mock categories & brands & scene data aligned with docs
const CATEGORIES = ["全部", "消防车辆", "灭火装备", "水域救援", "防汛排涝", "无人装备", "通信指挥", "个人防护"];
const BRANDS = ["捷达消防", "三一重工", "威海广泰", "中联重科", "晨光装备", "徐工消防"];
const HOT_KEYWORDS = ["大流量排涝车", "举高喷射车", "水域救生艇", "消防无人机", "脉冲水枪"];
const SCENES = [
  { id: "scene-1", name: "高层建筑火灾", desc: "主攻高压供水与举高破拆救援", icon: "🏢" },
  { id: "scene-2", name: "城市内涝排涝", desc: "适用于地下空间与道路强力排水", icon: "🌊" },
  { id: "scene-3", name: "激流/水域救援", desc: "快速冲锋救生与人员转移", icon: "🚤" },
  { id: "scene-4", name: "危化品泄漏救援", desc: "防爆洗消与远程检测管控", icon: "☣️" }
];

const MOCK_PRODUCTS: ProductItem[] = [
  {
    id: "prod-101",
    name: "大流量排水抢险车 (5000m³/h)",
    categoryName: "防汛排涝",
    supplierName: "捷达消防装备有限公司",
    priceRange: "¥120万 - ¥150万",
    tags: ["城市内涝", "强力抽水", "自备动力"],
    parameters: { "排涝流量": "5000m³/h", "最大扬程": "30m", "自吸深度": "8m" }
  },
  {
    id: "prod-102",
    name: "54米举高喷射消防车",
    categoryName: "消防车辆",
    supplierName: "三一重工消防装备部",
    priceRange: "¥380万 - ¥420万",
    tags: ["高层灭火", "无线遥控", "大流量水炮"],
    parameters: { "工作高度": "54m", "水炮流量": "80L/s", "乘员人数": "2+4人" }
  },
  {
    id: "prod-103",
    name: "工业级重载救援无人机",
    categoryName: "无人装备",
    supplierName: "晨光智能装备科技",
    priceRange: "¥25万 - ¥35万",
    tags: ["物资投送", "热成像探照", "抗风6级"],
    parameters: { "最大负载": "50kg", "续航时间": "45min", "控制距离": "10km" }
  },
  {
    id: "prod-104",
    name: "硬底铝合金激流救生冲锋艇",
    categoryName: "水域救援",
    supplierName: "威海广泰特种装备",
    priceRange: "¥8.5万 - ¥12万",
    tags: ["激流冲锋", "防撞耐磨", "9人载员"],
    parameters: { "艇长": "4.7m", "船外机功率": "60HP", "乘载人数": "9人" }
  }
];

export default function EquipmentPage() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null);
  const [searchKey, setSearchKey] = useState("");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductItem[]>(MOCK_PRODUCTS);
  const [recommendPackage, setRecommendPackage] = useState<any>(null);

  // Inquiry Modal state
  const [inquiryTarget, setInquiryTarget] = useState<ProductItem | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeCompare(ids => {
      setCompareIds([...ids]);
    });
    return () => unsubscribe();
  }, []);

  // Handle Scene recommendation switch
  const handleSelectScene = (sceneId: string) => {
    if (activeSceneId === sceneId) {
      setActiveSceneId(null);
      setRecommendPackage(null);
      setProducts(MOCK_PRODUCTS);
    } else {
      setActiveSceneId(sceneId);
      const sceneObj = SCENES.find(s => s.id === sceneId);
      // Mock API call to POST /api/recommend
      setRecommendPackage({
        sceneName: sceneObj?.name,
        matchScore: "95%",
        requiredCapabilities: ["大流量抽排", "快速响应", "防洪自吸"],
        reason: "根据消防救援战训需求，为您智能匹配最佳装备推荐组合方案。"
      });
      // Filter or sort products for recommendation
      setProducts(MOCK_PRODUCTS);
    }
  };

  const handleToggleCompare = (id: string) => {
    const res = toggleCompareId(id);
    if (!res.success && res.message) {
      Taro.showToast({ title: res.message, icon: "none" });
    }
  };

  const handleGoToCompare = () => {
    if (compareIds.length === 0) return;
    Taro.navigateTo({
      url: `/pages/equipment/compare?ids=${compareIds.join(",")}`
    });
  };

  return (
    <View className="equipment-page-container">
      {/* 顶部搜索栏 */}
      <View className="top-search-bar">
        <View className="search-input-box">
          <Text className="search-icon">🔍</Text>
          <Input
            className="search-input"
            placeholder="搜索装备名称、型号、厂商或参数..."
            value={searchKey}
            onInput={e => setSearchKey(e.detail.value)}
          />
          {searchKey && (
            <Text className="clear-icon" onClick={() => setSearchKey("")}>✕</Text>
          )}
        </View>
      </View>

      {/* 分类横滑 Bar */}
      <ScrollView className="category-scroll-bar" scrollX scrollWithAnimation>
        <View className="category-list">
          {CATEGORIES.map(cat => (
            <View
              key={cat}
              className={`category-item ${activeCategory === cat ? "active" : ""}`}
              onClick={() => {
                setActiveCategory(cat);
                setActiveSceneId(null);
              }}
            >
              {cat}
            </View>
          ))}
        </View>
      </ScrollView>

      <ScrollView className="page-scroll-body" scrollY>
        {/* 场景任务选装推荐卡片栏 (SceneSelector) */}
        <View className="section-block scene-section">
          <View className="section-header">
            <Text className="section-title">⚡ 场景任务精准选装推荐</Text>
            <Text className="section-subtitle">基于救援战训场景匹配装备方案</Text>
          </View>
          <ScrollView className="scene-scroll-row" scrollX scrollWithAnimation>
            <View className="scene-list">
              {SCENES.map(scene => (
                <View
                  key={scene.id}
                  className={`scene-card ${activeSceneId === scene.id ? "active" : ""}`}
                  onClick={() => handleSelectScene(scene.id)}
                >
                  <Text className="scene-icon">{scene.icon}</Text>
                  <Text className="scene-name">{scene.name}</Text>
                  <Text className="scene-desc">{scene.desc}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* 若选中场景，展示推荐套件包信息 */}
          {recommendPackage && (
            <View className="recommend-package-banner">
              <View className="banner-top">
                <Text className="package-title">🎯 【{recommendPackage.sceneName}】推荐装备方案</Text>
                <Text className="score-tag">匹配度 {recommendPackage.matchScore}</Text>
              </View>
              <Text className="package-reason">{recommendPackage.reason}</Text>
              <View className="capabilities-row">
                <Text className="cap-label">必须能力：</Text>
                {recommendPackage.requiredCapabilities.map((cap: string) => (
                  <Text key={cap} className="cap-tag">{cap}</Text>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* 品牌 Strip 横滑 */}
        <View className="section-block brand-section">
          <Text className="sub-section-title">推荐厂商 / 品牌</Text>
          <ScrollView className="brand-scroll-row" scrollX scrollWithAnimation>
            <View className="brand-list">
              {BRANDS.map(b => (
                <View key={b} className="brand-chip">
                  <Text className="brand-name">{b}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 热门搜索词 */}
        <View className="section-block hot-section">
          <View className="hot-keywords-row">
            <Text className="hot-label">🔥 热门搜：</Text>
            {HOT_KEYWORDS.map(kw => (
              <Text
                key={kw}
                className="keyword-pill"
                onClick={() => setSearchKey(kw)}
              >
                {kw}
              </Text>
            ))}
          </View>
        </View>

        {/* 产品装备列表 Stream */}
        <View className="section-block products-section">
          <View className="section-header">
            <Text className="section-title">装备列表 ({products.length})</Text>
          </View>
          <View className="product-stream">
            {products.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                isCompared={compareIds.includes(p.id)}
                onToggleCompare={handleToggleCompare}
                onInquiry={target => setInquiryTarget(target)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 底部悬浮对比条 CompareFloatingBar */}
      {compareIds.length > 0 && (
        <View className="compare-floating-bar">
          <View className="floating-info">
            <Text className="count-text">已选 <Text className="highlight">{compareIds.length}</Text>/4 款装备</Text>
            <Text className="clear-btn" onClick={() => clearCompareIds()}>清空</Text>
          </View>
          <View className="btn-go-compare" onClick={handleGoToCompare}>
            开始对比 →
          </View>
        </View>
      )}

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
