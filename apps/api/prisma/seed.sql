-- 消防装备智选平台 样例数据
-- 运行: psql -d fire_equipment_platform -f apps/api/prisma/seed.sql

-- 1. 能力标签
INSERT INTO capabilities (id, name, description, created_at) VALUES
  ('cap-001', '高压供水', '能提供高压水流用于高层灭火', NOW()),
  ('cap-002', '举高救援', '具备高空作业和救援能力', NOW()),
  ('cap-003', '高空破拆', '在高处进行破拆作业', NOW()),
  ('cap-004', '大流量排水', '快速大流量排水排涝', NOW()),
  ('cap-005', '快速部署', '能在短时间内完成快速展开', NOW()),
  ('cap-006', '人员救援', '水域人员搜救能力', NOW())
ON CONFLICT DO NOTHING;

-- 2. 装备分类（一级）
INSERT INTO equipment_categories (id, name, slug, sort_order, created_at, updated_at) VALUES
  ('cat-v', '车辆', 'vehicle', 1, NOW(), NOW()),
  ('cat-f', '灭火', 'fire-suppression', 2, NOW(), NOW()),
  ('cat-w', '水域', 'water-rescue', 3, NOW(), NOW()),
  ('cat-u', '无人装备', 'unmanned', 4, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 装备分类（二级）
INSERT INTO equipment_categories (id, name, slug, parent_id, sort_order, created_at, updated_at) VALUES
  ('cat-tanker', '水罐消防车', 'tanker-truck', 'cat-v', 1, NOW(), NOW()),
  ('cat-aerial', '举高喷射消防车', 'aerial-truck', 'cat-v', 2, NOW(), NOW()),
  ('cat-drain', '排水抢险车', 'drain-truck', 'cat-v', 3, NOW(), NOW()),
  ('cat-hose', '消防水带', 'fire-hose', 'cat-f', 1, NOW(), NOW()),
  ('cat-boat', '橡皮艇', 'rubber-boat', 'cat-w', 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 3. 参数模板
INSERT INTO parameter_templates (id, category_id, field_key, field_label, field_type, unit, sort_order, is_required, is_filterable, is_comparable, created_at, updated_at) VALUES
  ('tpl-001', 'cat-tanker', 'water_capacity', '水箱容量', 'number', 'L', 1, true, true, true, NOW(), NOW()),
  ('tpl-002', 'cat-tanker', 'pump_flow', '泵流量', 'number', 'L/min', 2, true, true, true, NOW(), NOW()),
  ('tpl-003', 'cat-tanker', 'pump_pressure', '泵压力', 'number', 'MPa', 3, false, false, true, NOW(), NOW()),
  ('tpl-004', 'cat-aerial', 'max_height', '最大工作高度', 'number', 'm', 1, true, true, true, NOW(), NOW()),
  ('tpl-005', 'cat-aerial', 'max_flow', '最大喷射流量', 'number', 'L/min', 2, false, false, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 4. 供应商
INSERT INTO suppliers (id, name, short_name, unified_code, province, city, contact_name, contact_phone, review_status, verified_at, created_at, updated_at) VALUES
  ('sup-001', '示例消防装备有限公司', '示例装备', '91110000AAA01X', '北京', '北京', '张经理', '010-12345678', 'approved', NOW(), NOW(), NOW()),
  ('sup-002', '消防科技股份有限公司', '消防科技', '91310000BBB02X', '上海', '上海', '李经理', '021-87654321', 'approved', NOW(), NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 5. 产品
INSERT INTO products (id, supplier_id, category_id, name, model_no, brand, price_min, price_max, description, review_status, is_featured, view_count, inquiry_count, created_at, updated_at) VALUES
  ('prod-001', 'sup-001', 'cat-tanker', '18吨水罐消防车', 'XHR-18T', '示例品牌', 800000, 1200000, '适用于城市火灾扑救，水箱容量18000升，配备高压泵组。', 'approved', true, 128, 12, NOW(), NOW()),
  ('prod-002', 'sup-001', 'cat-aerial', '32米举高喷射消防车', 'GS-32M', '示例品牌', 2500000, 3500000, '最大工作高度32米，适用于高层建筑火灾扑救与救援。', 'approved', true, 256, 28, NOW(), NOW()),
  ('prod-003', 'sup-002', 'cat-drain', '大流量排水抢险车', 'PW-8000', '消防科技', 1500000, 2000000, '最大排水流量8000升/分钟，适用于城市内涝抢险救援。', 'approved', false, 64, 6, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 6. 产品参数值
INSERT INTO product_parameters (id, product_id, template_id, value, created_at, updated_at) VALUES
  ('pp-001', 'prod-001', 'tpl-001', '18000', NOW(), NOW()),
  ('pp-002', 'prod-001', 'tpl-002', '3000', NOW(), NOW()),
  ('pp-003', 'prod-001', 'tpl-003', '1.0', NOW(), NOW()),
  ('pp-004', 'prod-002', 'tpl-004', '32', NOW(), NOW()),
  ('pp-005', 'prod-002', 'tpl-005', '2000', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 7. 产品能力标签
INSERT INTO product_capabilities (id, product_id, capability_id, created_at) VALUES
  ('pc-001', 'prod-001', 'cap-001', NOW()),
  ('pc-002', 'prod-002', 'cap-001', NOW()),
  ('pc-003', 'prod-002', 'cap-002', NOW()),
  ('pc-004', 'prod-002', 'cap-003', NOW()),
  ('pc-005', 'prod-003', 'cap-004', NOW()),
  ('pc-006', 'prod-003', 'cap-005', NOW())
ON CONFLICT DO NOTHING;

-- 8. 场景
INSERT INTO scenes (id, name, slug, category, required_capabilities, created_at, updated_at) VALUES
  ('scene-001', '高层建筑火灾', 'high-rise-fire', '火灾类', ARRAY['高压供水','举高救援','高空破拆'], NOW(), NOW()),
  ('scene-002', '城市内涝', 'urban-flood', '水域排涝类', ARRAY['大流量排水','快速部署'], NOW(), NOW()),
  ('scene-003', '水域救援', 'water-rescue-scene', '水域类', ARRAY['快速部署','人员救援'], NOW(), NOW()),
  ('scene-004', '地下空间火灾', 'underground-fire', '火灾类', ARRAY['高压供水','快速部署'], NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 9. 推荐规则
INSERT INTO recommendation_rules (id, scene_id, preferred_equipment, forbidden_equipment, weight_scene_match, weight_param_match, weight_bid_freq, weight_supplier_rel, weight_platform_heat, created_at, updated_at) VALUES
  ('rule-001', 'scene-001', ARRAY['云梯消防车','举高喷射消防车','高压水罐车'], ARRAY[]::text[], 0.4, 0.25, 0.2, 0.1, 0.05, NOW(), NOW()),
  ('rule-002', 'scene-002', ARRAY['大流量排水抢险车','移动泵站','排水机器人'], ARRAY[]::text[], 0.4, 0.25, 0.2, 0.1, 0.05, NOW(), NOW()),
  ('rule-003', 'scene-003', ARRAY['橡皮艇','气垃船','水域救援车'], ARRAY[]::text[], 0.4, 0.25, 0.2, 0.1, 0.05, NOW(), NOW()),
  ('rule-004', 'scene-004', ARRAY['排烟消防车','小屢室破拆车'], ARRAY[]::text[], 0.4, 0.25, 0.2, 0.1, 0.05, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 10. 消防圈
INSERT INTO circles (id, name, slug, description, sort_order, created_at, updated_at) VALUES
  ('circle-001', '装备交流', 'equipment-talk', '分享装备使用心得与采购经验', 1, NOW(), NOW()),
  ('circle-002', '战训研讨', 'training-discussion', '战术训练与救援技术探讨', 2, NOW(), NOW()),
  ('circle-003', '招采动态', 'procurement-news', '各地招标采购信息汇总', 3, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 11. 资讯文章
INSERT INTO articles (id, title, content, summary, channel, review_status, is_featured, view_count, published_at, created_at, updated_at) VALUES
  ('art-001', '2025年全国消防装备采购趋势分析', '随着城市化进程加快，消防装备采购向智能化、无人化方向发展。本文对近年招标数据进行统计分析。', '2025年消防装备采购趋势分析报告', '招采动态', 'approved', true, 1024, NOW(), NOW(), NOW()),
  ('art-002', '高层建筑灭火救援装备配置指引', '高层建筑火灾扑救需配备举高类消防车、高压水罐车。本文详述配置要点。', '高层建筑消防装备配置要点', '战训案例', 'approved', true, 856, NOW(), NOW(), NOW()),
  ('art-003', '城市内涝排水抢险装备选型手册', '城市内涝救援的核心是快速大流量排水。不同地形条件对排水装备选型要求各异。', '排水抢险装备选型指南', '装备资讯', 'approved', false, 512, NOW(), NOW(), NOW())
ON CONFLICT DO NOTHING;
