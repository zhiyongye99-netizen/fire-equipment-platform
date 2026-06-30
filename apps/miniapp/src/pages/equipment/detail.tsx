import React, { useState, useEffect } from "react";
import { View, Text, Swiper, SwiperItem, ScrollView, Image } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { InquiryModal } from "../../components/InquiryModal";
import { toggleCompareId, subscribeCompare } from "../../utils/compareStore";
import { fetchProductDetail, type DetailProductView } from "../../services/equipment";
import "./detail.scss";

export default function DetailPage() {
  const router = useRouter();
  const productId = router.params.id || "";

  const [product, setProduct] = useState<DetailProductView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isFavorited, setIsFavorited] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeCompare(ids => {
      setCompareIds([...ids]);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setLoadError("");

    if (!productId) {
      setProduct(null);
      setLoadError("缺少产品 ID，无法加载详情");
      setIsLoading(false);
      return () => {
        isMounted = false;
      };
    }

    fetchProductDetail(productId)
      .then(item => {
        if (isMounted) {
          setProduct(item);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProduct(null);
          setLoadError("产品详情加载失败，请稍后重试");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const isCompared = compareIds.includes(productId);

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    Taro.showToast({
      title: !isFavorited ? "已添加到收藏" : "已取消收藏",
      icon: "none"
    });
  };

  const handleToggleCompare = () => {
    if (!productId) {
      Taro.showToast({ title: "缺少产品 ID", icon: "none" });
      return;
    }
    const res = toggleCompareId(productId);
    if (!res.success && res.message) {
      Taro.showToast({ title: res.message, icon: "none" });
    }
  };

  if (isLoading) {
    return (
      <View className="detail-page-container">
        <View className="detail-content">
          <View className="section-card">
            <Text className="section-title">产品详情加载中...</Text>
          </View>
        </View>
      </View>
    );
  }

  if (!product) {
    return (
      <View className="detail-page-container">
        <View className="detail-content">
          <View className="section-card">
            <Text className="section-title">{loadError || "未找到产品详情"}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="detail-page-container">
      <ScrollView className="detail-scroll-body" scrollY>
        {/* 大图轮播 */}
        <Swiper className="image-swiper" circular autoplay indicatorDots indicatorColor="rgba(255,255,255,0.5)" indicatorActiveColor="#ffffff">
          {product.imageLabels.map((label, idx) => (
            <SwiperItem key={idx}>
              {product.coverImage && idx === 0 ? (
                <Image className="swiper-img" src={product.coverImage} mode="aspectFill" />
              ) : (
                <View className="swiper-img placeholder-img">
                  <Text className="placeholder-title">{label}</Text>
                  <Text className="placeholder-sub">图片待上传</Text>
                </View>
              )}
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
              {Object.keys(product.parameters).length === 0 && (
                <View className="param-grid-item">
                  <Text className="param-label">参数状态</Text>
                  <Text className="param-value">核心参数待完善</Text>
                </View>
              )}
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
            {product.materials.length === 0 && (
              <View className="material-item" onClick={() => setIsInquiryOpen(true)}>
                <Text className="doc-icon">📄</Text>
                <Text className="doc-title">资料清单暂未开放，可向供应商索取</Text>
                <Text className="doc-action">索取资料 →</Text>
              </View>
            )}
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
          🚀 在线询价 / 索要资料{product.inquiryCount ? `（${product.inquiryCount}）` : ""}
        </View>
      </View>

      {/* 询价弹窗 */}
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
