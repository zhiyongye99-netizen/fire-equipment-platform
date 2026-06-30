import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { InquiryModal } from "../../components/InquiryModal";
import { getCompareIds, toggleCompareId, subscribeCompare } from "../../utils/compareStore";
import { fetchCompareProducts, type CompareProductView } from "../../services/equipment";
import "./compare.scss";

export default function ComparePage() {
  const router = useRouter();
  const [ids, setIds] = useState<string[]>([]);
  const [products, setProducts] = useState<CompareProductView[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [onlyDiff, setOnlyDiff] = useState(false);
  const [inquiryTarget, setInquiryTarget] = useState<CompareProductView | null>(null);

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

  useEffect(() => {
    let isMounted = true;

    if (ids.length === 0) {
      setProducts([]);
      setLoadError("");
      setIsLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setIsLoading(true);
    setLoadError("");

    fetchCompareProducts(ids)
      .then(items => {
        if (isMounted) {
          setProducts(items);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProducts([]);
          setLoadError("参数对比数据加载失败，请稍后重试");
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
  }, [ids]);

  const handleRemoveProduct = (id: string) => {
    toggleCompareId(id);
    setIds(current => current.filter(item => item !== id));
  };

  const allParamKeys = Array.from(
    new Set(products.flatMap(product => Object.keys(product.parameters)))
  );

  // Check if a parameter key has different values across selected products
  const isDifferentParam = (key: string) => {
    if (products.length <= 1) return false;
    const firstVal = products[0]?.parameters[key];
    return products.some(p => p?.parameters[key] !== firstVal);
  };

  const displayedKeys = onlyDiff
    ? allParamKeys.filter(k => isDifferentParam(k))
    : allParamKeys;

  if (ids.length === 0) {
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

  if (isLoading) {
    return (
      <View className="compare-empty-container">
        <Text className="empty-icon">⚖️</Text>
        <Text className="empty-text">参数对比数据加载中...</Text>
      </View>
    );
  }

  if (loadError || products.length === 0) {
    return (
      <View className="compare-empty-container">
        <Text className="empty-icon">⚖️</Text>
        <Text className="empty-text">{loadError || "未找到可对比的已审核装备"}</Text>
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
                {p.coverImage ? (
                  <Image className="col-img" src={p.coverImage} mode="aspectFill" />
                ) : (
                  <View className="col-img placeholder-img">
                    <Text>{p.imageLabel}</Text>
                  </View>
                )}
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
        supplierId={inquiryTarget?.supplierId || ""}
        productName={inquiryTarget?.name || ""}
        onClose={() => setInquiryTarget(null)}
      />
    </View>
  );
}
