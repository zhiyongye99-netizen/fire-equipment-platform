import React from "react";
import { View, Text, Image, type ITouchEvent } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";

export interface ProductItem {
  id: string;
  name: string;
  supplierId?: string;
  categoryName?: string;
  supplierName?: string;
  coverImage?: string;
  priceRange?: string;
  tags?: { text: string; color: "red" | "blue" | "green" }[];
  specsLine?: string;
}

interface ProductCardProps {
  product: ProductItem;
  isCompared?: boolean;
  onToggleCompare?: (id: string) => void;
  onInquiry?: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isCompared = false,
  onToggleCompare,
  onInquiry
}) => {
  const handleCardClick = () => {
    Taro.navigateTo({
      url: `/pages/equipment/detail?id=${product.id}`
    });
  };

  const handleCompareClick = (e: ITouchEvent) => {
    e.stopPropagation();
    if (onToggleCompare) {
      onToggleCompare(product.id);
    }
  };

  const handleDetailBtnClick = (e: ITouchEvent) => {
    e.stopPropagation();
    handleCardClick();
  };

  const handleInquiryClick = (e: ITouchEvent) => {
    e.stopPropagation();
    if (onInquiry) {
      onInquiry(product);
    }
  };

  return (
    <View className="product-card-02" onClick={handleCardClick}>
      <View className="thumbnail-wrapper">
        {product.coverImage ? (
          <Image className="product-img" src={product.coverImage} mode="aspectFill" />
        ) : (
          <View className="product-placeholder">
            <Text className="placeholder-title">装备图片</Text>
          </View>
        )}
      </View>

      <View className="card-right-content">
        <View className="row-top">
          <Text className="product-title">{product.name}</Text>
          <View className="btn-view-param" onClick={handleDetailBtnClick}>
            看参数
          </View>
        </View>

        {product.tags && product.tags.length > 0 && (
          <View className="tags-row">
            {product.tags.map((t, idx) => (
              <Text key={idx} className={`tag-chip tag-${t.color || "blue"}`}>
                {t.text}
              </Text>
            ))}
          </View>
        )}

        <View className="row-specs">
          <Text className="specs-text">{product.specsLine || "核心参数待完善"}</Text>
        </View>

        <View className="row-bottom">
          <View
            className={`compare-check-btn ${isCompared ? "checked" : ""}`}
            onClick={handleCompareClick}
          >
            <Text className="check-box-icon">{isCompared ? "☑" : "☐"}</Text>
            <Text className="check-text">加入对比</Text>
          </View>
        </View>

        {onInquiry && (
          <View className="btn-inquiry" onClick={handleInquiryClick}>
            询价/索资料
          </View>
        )}
      </View>
    </View>
  );
};
