import React from "react";
import { View, Text, Image, ITouchEvent } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";

export interface ProductItem {
  id: string;
  name: string;
  categoryName?: string;
  supplierName?: string;
  coverImage?: string;
  priceRange?: string;
  tags?: { text: string; color: "red" | "blue" | "green" }[];
  scenes?: string;
  specsLine?: string;
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
  // onInquiry prop reserved for future use
}) => {
  const handleCardClick = () => {
    Taro.navigateTo({
      url: `/pages/equipment/detail?id=${product.id}`
    });
  };

  const handleCheckboxClick = (e: ITouchEvent) => {
    e.stopPropagation();
    if (onToggleCompare) {
      onToggleCompare(product.id);
    }
  };

  const handleDetailBtnClick = (e: ITouchEvent) => {
    e.stopPropagation();
    handleCardClick();
  };

  return (
    <View className="product-card-ui" onClick={handleCardClick}>
      <View className="thumbnail-box">
        <Image
          className="product-img"
          src={product.coverImage || "https://dummyimage.com/240x180/eaecf0/667085&text=装备图片"}
          mode="aspectFill"
        />
        <View
          className={`checkbox-overlay ${isCompared ? "checked" : ""}`}
          onClick={handleCheckboxClick}
        >
          {isCompared ? "✓" : ""}
        </View>
      </View>

      <View className="info-box">
        <View className="title-row">
          <Text className="product-title">{product.name}</Text>
          <View className="btn-view-spec" onClick={handleDetailBtnClick}>
            看参数
          </View>
        </View>

        {product.tags && product.tags.length > 0 && (
          <View className="tags-row">
            {product.tags.map((t, idx) => (
              <Text key={idx} className={`tag-badge tag-${t.color || "blue"}`}>
                {t.text}
              </Text>
            ))}
          </View>
        )}

        <View className="meta-row">
          <Text className="supplier-text">{product.supplierName || "中联重科"}</Text>
          <Text className="scene-text">{product.scenes || "城市主战 / 石化园区"}</Text>
        </View>

        <View className="specs-line">
          <Text className="specs-text">{product.specsLine || "⚙ 流量: 180L/s   ⛰ 水罐: 10t   👤 乘员: 6人"}</Text>
        </View>
      </View>
    </View>
  );
};
