import React, { useState } from "react";
import { View, Text, Input, Textarea, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { api } from "../../utils/api";
import { getToken, wechatLogin } from "../../utils/auth";
import "./index.scss";

interface InquiryModalProps {
  isOpen: boolean;
  productId: string;
  supplierId?: string;
  productName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  productId,
  supplierId,
  productName,
  onClose,
  onSuccess
}) => {
  const [contactName, setContactName] = useState("");
  const [region, setRegion] = useState("");
  const [organization, setOrganization] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!contactName.trim()) {
      Taro.showToast({ title: "请输入联系人姓名", icon: "none" });
      return;
    }
    if (!supplierId) {
      Taro.showToast({ title: "供应商信息缺失，暂不能提交", icon: "none" });
      return;
    }

    setLoading(true);
    try {
      if (!getToken()) {
        const user = await wechatLogin();
        if (!user) {
          Taro.showToast({ title: "请先完成微信登录后再提交", icon: "none" });
          return;
        }
      }

      const demandText = [
        `联系人：${contactName.trim()}`,
        organization.trim() ? `单位：${organization.trim()}` : "",
        remark.trim() ? `需求：${remark.trim()}` : "",
      ].filter(Boolean).join("\n");

      await api.leads.create({
        supplier_id: supplierId,
        product_id: productId || undefined,
        inquiry_type: "price_inquiry",
        region: region.trim() || undefined,
        demand_text: demandText || undefined,
      });

      Taro.showToast({ title: "询价线索已提交", icon: "success" });
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      Taro.showToast({ title: "提交失败，请稍后再试", icon: "none" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="inquiry-modal-overlay" onClick={onClose}>
      <View className="inquiry-modal-content" onClick={e => e.stopPropagation()}>
        <View className="modal-header">
          <Text className="modal-title">在线询价 / 索要资料</Text>
          <View className="close-btn" onClick={onClose}>✕</View>
        </View>

        <View className="product-info-box">
          <Text className="label">意向装备：</Text>
          <Text className="name">{productName || "全选装备"}</Text>
        </View>

        <View className="form-group">
          <Text className="field-label"><Text className="required">*</Text>联系人姓名</Text>
          <Input
            className="field-input"
            placeholder="请输入您的姓名/称呼"
            value={contactName}
            onInput={e => setContactName(e.detail.value)}
          />
        </View>

        <View className="form-group">
          <Text className="field-label">所在地区</Text>
          <Input
            className="field-input"
            placeholder="如：江苏徐州 / 广东广州"
            value={region}
            onInput={e => setRegion(e.detail.value)}
          />
        </View>

        <View className="form-group">
          <Text className="field-label">单位/消防支队名称</Text>
          <Input
            className="field-input"
            placeholder="如：某某市消防救援支队/装备处"
            value={organization}
            onInput={e => setOrganization(e.detail.value)}
          />
        </View>

        <View className="form-group">
          <Text className="field-label">采购意向/备注需求</Text>
          <Textarea
            className="field-textarea"
            placeholder="例：预计采购数量、希望获取产品检测报告等"
            value={remark}
            onInput={e => setRemark(e.detail.value)}
          />
        </View>

        <View className="modal-actions">
          <Button className="btn-cancel" onClick={onClose}>取消</Button>
          <Button className="btn-submit" loading={loading} onClick={handleSubmit}>确认提交线索</Button>
        </View>
      </View>
    </View>
  );
};
