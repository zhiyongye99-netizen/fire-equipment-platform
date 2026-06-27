import React from "react";
import { View, Text, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";

export interface ProductItem {
  id: string;
  name: string;
  categoryName?: string;
  supplierName?: string;
  coverImage?: string;
  priceRange?: string;
  tags?: string[];
  parameters?: Record<string, string | number>;
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

  const handleCompareClick = (e: any) => {
    e.stopPropagation();
    if (onToggleCompare) {
      onToggleCompare(product.id);
    }
  };

  const handleInquiryClick = (e: any) => {
    e.stopPropagation();
    if (onInquiry) {
      onInquiry(product);
    }
  };

  // Convert key parameters object to array (max 3)
  const paramEntries = product.parameters
    ? Object.entries(product.parameters).slice(0, 3)
    : [];

  return (
    <View className="product-card-container" onClick={handleCardClick}>
      <View className="image-wrapper">
        <Image
          className="product-image"
          src={product.coverImage || "https://dummyimage.com/300x200/eaecf0/667085&text=消防装备"}
          mode="aspectFill"
        />
        {product.categoryName && (
          <View className="category-badge">{product.categoryName}</View>
        )}
      </View>

      <View className="content-wrapper">
        <Text className="product-name">{product.name}</Text>
        
        {product.supplierName && (
          <Text className="supplier-name">厂商：{product.supplierName}</Text>
        )}

        {paramEntries.length > 0 && (
          <View className="parameters-row">
            {paramEntries.map(([key, val]) => (
              <View key={key} className="param-pill">
                <Text className="param-key">{key}：</Text>
                <Text className="param-val">{val}</Text>
              </View>
            ))}
          </View>
        )}

        <View className="footer-row">
          <View className="price-box">
            <Text className="price-label">参考价：</Text>
            <Text className="price-val">{product.priceRange || "询价参考"}</Text>
          </View>

          <View className="action-btns">
            <View
              className={`btn-compare ${isCompared ? "active" : ""}`}
              onClick={handleCompareClick}
            >
              {isCompared ? "✓ 已加入" : "+ 对比"}
            </View>

            <View className="btn-inquiry" onClick={handleInquiryClick}>
              在线询价
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
