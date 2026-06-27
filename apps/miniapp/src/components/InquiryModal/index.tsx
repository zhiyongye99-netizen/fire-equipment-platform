import React, { useState } from "react";
import { View, Text, Input, Textarea, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";

interface InquiryModalProps {
  isOpen: boolean;
  productId: string;
  productName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  productId,
  productName,
  onClose,
  onSuccess
}) => {
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!contactName.trim()) {
      Taro.showToast({ title: "请输入联系人姓名", icon: "none" });
      return;
    }
    if (!phone.trim() || !/^1\d{10}$/.test(phone.trim())) {
      Taro.showToast({ title: "请输入有效的手机号码", icon: "none" });
      return;
    }

    setLoading(true);
    try {
      // API call to POST /api/inquiries (mocked or actual request)
      const res = await Taro.request({
        url: "http://localhost:3000/api/inquiries",
        method: "POST",
        data: {
          productId,
          contactName: contactName.trim(),
          phone: phone.trim(),
          organization: organization.trim(),
          remark: remark.trim()
        }
      }).catch(() => null);

      Taro.showToast({ title: "询价线索已提交", icon: "success" });
      if (onSuccess) onSuccess();
      onClose();
    } catch (e) {
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
          <Text className="name">{productName}</Text>
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
          <Text className="field-label"><Text className="required">*</Text>联系电话</Text>
          <Input
            className="field-input"
            type="number"
            maxlength={11}
            placeholder="请输入11位手机号码"
            value={phone}
            onInput={e => setPhone(e.detail.value)}
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
