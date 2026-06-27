import React, { useState, useEffect } from "react";
import { View, Text, Swiper, SwiperItem, Image, ScrollView } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { InquiryModal } from "../../components/InquiryModal";
import { getCompareIds, toggleCompareId, subscribeCompare } from "../../utils/compareStore";
import "./detail.scss";

interface DetailProduct {
  id: string;
  name: string;
  categoryName: string;
  supplierName: string;
  priceRange: string;
  images: string[];
  tags: string[];
  overview: string;
  parameters: Record<string, string>;
  materials: { title: string; type: string }[];
}

const MOCK_DETAIL: DetailProduct = {
  id: "prod-101",
  name: "大流量排水抢险车 (5000m³/h)",
  categoryName: "防汛排涝",
  supplierName: "捷达消防装备有限公司",
  priceRange: "¥120万 - ¥150万",
  images: [
    "https://dummyimage.com/600x400/eaecf0/101828&text=装备外观大图",
    "https://dummyimage.com/600x400/d0d5dd/101828&text=抽排水泵细节图",
    "https://dummyimage.com/600x400/98a2b3/101828&text=控制面板实拍"
  ],
  tags: ["城市内涝", "强力抽水", "自备动力", "应急抢险"],
  overview: "该车型专为城市地下空间、下沉式立交桥、隧道及农田水利暴雨积水快速抽排设计。配备车载自备柴油动力机组与高效率大流量潜水泵，具备快速部署与连续无故障作业能力。",
  parameters: {
    "额定排涝流量": "5000 m³/h",
    "最大扬程": "30 m",
    "自吸最大深度": "8 m",
    "整车出水接口": "DN300 × 4",
    "车载动力机组功率": "280 kW",
    "整车排放标准": "国六",
    "整备质量": "18000 kg",
    "外形尺寸 (长×宽×高)": "8500 × 2500 × 3400 mm"
  },
  materials: [
    { title: "国家消防装备质量监督检验报告.pdf", type: "PDF" },
    { title: "大流量排涝车操作与使用说明书.pdf", type: "PDF" }
  ]
};

export default function DetailPage() {
  const router = useRouter();
  const productId = router.params.id || "prod-101";

  const [product, setProduct] = useState<DetailProduct>(MOCK_DETAIL);
  const [isFavorited, setIsFavorited] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeCompare(ids => {
      setCompareIds([...ids]);
    });
    return () => unsubscribe();
  }, []);

  const isCompared = compareIds.includes(productId);

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    Taro.showToast({
      title: !isFavorited ? "已添加到收藏" : "已取消收藏",
      icon: "none"
    });
  };

  const handleToggleCompare = () => {
    const res = toggleCompareId(productId);
    if (!res.success && res.message) {
      Taro.showToast({ title: res.message, icon: "none" });
    }
  };

  return (
    <View className="detail-page-container">
      <ScrollView className="detail-scroll-body" scrollY>
        {/* 大图轮播 */}
        <Swiper className="image-swiper" circular autoplay indicatorDots indicatorColor="rgba(255,255,255,0.5)" indicatorActiveColor="#ffffff">
          {product.images.map((img, idx) => (
            <SwiperItem key={idx}>
              <Image className="swiper-img" src={img} mode="aspectFill" />
            </SwiperItem>
          ))}
        </Swiper>

        <View className="detail-content">
          {/* 基本信息区 */}
          <View className="main-info-card">
            <View className="tag-row">
              <Text className="category-tag">{product.categoryName}</Text>
              {product.tags.map(t => (
                <Text key={t} className="sub-tag">{t}</Text>
              ))}
            </View>
            <Text className="product-title">{product.name}</Text>
            
            <View className="price-row">
              <Text className="price-label">预算指导/中标参考：</Text>
              <Text className="price-value">{product.priceRange}</Text>
            </View>

            <View className="supplier-card">
              <View className="supplier-left">
                <Text className="supplier-icon">🏢</Text>
                <View className="supplier-meta">
                  <Text className="supplier-name">{product.supplierName}</Text>
                  <Text className="supplier-verify">✓ 已认证消防装备供应商</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 装备简介 */}
          <View className="section-card">
            <Text className="section-title">装备概述</Text>
            <Text className="overview-text">{product.overview}</Text>
          </View>

          {/* 核心技术参数（低密度卡片式展示） */}
          <View className="section-card">
            <Text className="section-title">核心技术参数</Text>
            <View className="parameters-grid">
              {Object.entries(product.parameters).map(([key, val]) => (
                <View key={key} className="param-grid-item">
                  <Text className="param-label">{key}</Text>
                  <Text className="param-value">{val}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 检测报告与资料下载线索 */}
          <View className="section-card materials-card">
            <Text className="section-title">产品资料与检验证书</Text>
            {product.materials.map((m, idx) => (
              <View key={idx} className="material-item" onClick={() => setIsInquiryOpen(true)}>
                <Text className="doc-icon">📄</Text>
                <Text className="doc-title">{m.title}</Text>
                <Text className="doc-action">索取资料 →</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 底部固定操作栏 */}
      <View className="detail-bottom-bar">
        <View className="icon-action" onClick={handleToggleFavorite}>
          <Text className="action-icon">{isFavorited ? "❤️" : "🤍"}</Text>
          <Text className="action-label">{isFavorited ? "已收藏" : "收藏"}</Text>
        </View>

        <View className={`icon-action ${isCompared ? "active" : ""}`} onClick={handleToggleCompare}>
          <Text className="action-icon">⚖️</Text>
          <Text className="action-label">{isCompared ? "已加入对比" : "+ 对比"}</Text>
        </View>

        <View className="btn-inquiry-main" onClick={() => setIsInquiryOpen(true)}>
          🚀 在线询价 / 索要资料
        </View>
      </View>

      {/* 询价弹窗 */}
      <InquiryModal
        isOpen={isInquiryOpen}
        productId={product.id}
        productName={product.name}
        onClose={() => setIsInquiryOpen(false)}
      />
    </View>
  );
}
