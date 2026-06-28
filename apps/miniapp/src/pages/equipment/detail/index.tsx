import React, { useState, useEffect } from "react";
import { View, Text, Swiper, SwiperItem, ScrollView } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { InquiryModal } from "../../../components/InquiryModal";
import { toggleCompareId, subscribeCompare } from "../../../utils/compareStore";
import "./index.scss";

interface DetailProduct {
  id: string;
  supplierId?: string;
  name: string;
  priceRange: string;
  hotness: number;
  imageLabels: string[];
  tags: string[];
  fourSpecs: { icon: string; val: string; label: string }[];
  coreParams: { label: string; val: string }[];
  overviewText: string;
}

const MOCK_DETAIL: DetailProduct = {
  id: "prod-101",
  name: "32米举高喷射消防车",
  priceRange: "¥ XXX 万起",
  hotness: 2368,
  imageLabels: ["装备外观", "作业机构", "驾驶室", "消防炮"],
  tags: ["主战消防车", "国六排放", "3C认证"],
  fourSpecs: [
    { icon: "🧭", val: "32米", label: "最大作业高度" },
    { icon: "💧", val: "12000L", label: "水罐容量" },
    { icon: "🔄", val: "80L/s", label: "额定流量" },
    { icon: "☁️", val: "国六", label: "排放标准" }
  ],
  coreParams: [
    { label: "整车尺寸", val: "12000×2550×3850mm" },
    { label: "总质量", val: "31000kg" },
    { label: "发动机功率", val: "360kW" },
    { label: "乘员人数", val: "2+4人" }
  ],
  overviewText: "32米举高喷射消防车是城市高层建筑火灾扑救的主力装备，集灭火、救援、照明等多种功能于一体，适用于高层建筑、石化企业等场所。"
};

export default function DetailPage() {
  const router = useRouter();
  const productId = router.params.id || "prod-101";

  const [product] = useState<DetailProduct>(MOCK_DETAIL);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("车型概述");
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
    <View className="detail-ui-page">
      <ScrollView className="detail-scroll-body" scrollY>
        <View className="hero-swiper-wrap">
          <Swiper
            className="hero-swiper"
            circular
            onChange={e => setCurrentImgIdx(e.detail.current)}
          >
            {product.imageLabels.map((label, idx) => (
              <SwiperItem key={idx}>
                <View className="swiper-img placeholder-img">
                  <Text className="placeholder-title">{label}</Text>
                  <Text className="placeholder-sub">图片待上传</Text>
                </View>
              </SwiperItem>
            ))}
          </Swiper>
          <View className="img-counter-badge">
            {currentImgIdx + 1}/{product.imageLabels.length}
          </View>
        </View>

        <ScrollView className="thumbs-scroll-row" scrollX scrollWithAnimation>
          <View className="thumbs-list">
            {product.imageLabels.map((label, idx) => (
              <View
                key={idx}
                className={`thumb-img ${currentImgIdx === idx ? "active" : ""}`}
                onClick={() => setCurrentImgIdx(idx)}
              >
                <Text className="thumb-label">{label}</Text>
              </View>
            ))}
            <View className="all-photos-chip">
              <Text className="text">全部 8张</Text>
            </View>
          </View>
        </ScrollView>

        <View className="main-content-card">
          <View className="title-header-row">
            <Text className="detail-title">{product.name}</Text>
            <View className="btn-compare-spec" onClick={handleToggleCompare}>
              📋 {isCompared ? "已对比" : "参数对比"}
            </View>
          </View>

          <View className="tags-row">
            {product.tags.map(t => (
              <Text key={t} className="tag-pill">{t}</Text>
            ))}
          </View>

          <View className="price-hotness-row">
            <Text className="price-red">{product.priceRange}</Text>
            <Text className="hotness-text">🔥 关注度 {product.hotness}</Text>
          </View>

          <View className="specs-4grid">
            {product.fourSpecs.map((spec, idx) => (
              <View key={idx} className="spec-box">
                <Text className="spec-icon">{spec.icon}</Text>
                <View className="spec-text-meta">
                  <Text className="spec-val">{spec.val}</Text>
                  <Text className="spec-label">{spec.label}</Text>
                </View>
              </View>
            ))}
          </View>

          <View className="dual-callout-row">
            <View className="callout-card callout-light" onClick={() => setIsInquiryOpen(true)}>
              <Text className="card-title">联系供应商</Text>
              <Text className="card-sub">获取底价方案</Text>
            </View>
            <View className="callout-card callout-blue" onClick={() => setIsInquiryOpen(true)}>
              <Text className="card-title">询底价</Text>
              <Text className="card-sub">已有 256 人询价</Text>
            </View>
          </View>
        </View>

        <View className="section-block-card">
          <View className="sec-header">
            <Text className="sec-title">核心参数</Text>
            <Text className="sec-more">完整参数 &gt;</Text>
          </View>
          <View className="core-params-grid">
            {product.coreParams.map((cp, idx) => (
              <View key={idx} className="core-param-item">
                <Text className="cp-label">{cp.label}</Text>
                <Text className="cp-val">{cp.val}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="section-block-card">
          <View className="sub-tabs-header">
            {["车型概述", "参数配置", "底盘信息", "专用性能", "实拍图片"].map(tab => (
              <Text
                key={tab}
                className={`sub-tab-item ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Text>
            ))}
          </View>
          <View className="tab-body-text">
            <Text className="overview-paragraph">{product.overviewText}</Text>
          </View>
        </View>
      </ScrollView>

      <View className="detail-bottom-fixed-bar">
        <View className="icon-btn" onClick={() => setIsInquiryOpen(true)}>
          <Text className="b-icon">💬</Text>
          <Text className="b-label">咨询</Text>
        </View>
        <View className="icon-btn" onClick={handleToggleFavorite}>
          <Text className="b-icon">{isFavorited ? "⭐" : "☆"}</Text>
          <Text className="b-label">收藏</Text>
        </View>
        <View className={`icon-btn ${isCompared ? "active" : ""}`} onClick={handleToggleCompare}>
          <Text className="b-icon">🔀</Text>
          <Text className="b-label">对比</Text>
        </View>

        <View className="btn-submit-inquiry-blue" onClick={() => setIsInquiryOpen(true)}>
          询底价 <Text className="sub-cnt">已有 256 人询价</Text>
        </View>
      </View>

      <InquiryModal
        isOpen={isInquiryOpen}
        productId={product.id}
        supplierId={product.supplierId}
        productName={product.name}
        onClose={() => setIsInquiryOpen(false)}
      />
    </View>
  );
}
