# 消防车辆装备采购前决策平台 V5

## 一句话说明

这是一个面向消防车辆装备采购前调研、选型、比选、资料收集、供应商线索撮合的微信小程序 + 后台系统开发输入包。

## 第一阶段 MVP

必须先跑通：

1. 装备分类库
2. 产品参数库
3. 产品详情页
4. 参数对比页
5. 供应商 PC 后台
6. 平台审核后台
7. 小程序选装链路
8. 询价/索资料线索

## 技术建议

- 小程序：Taro + React + TypeScript
- 供应商后台：Next.js + React + Ant Design
- 平台后台：Next.js + React + Ant Design
- 后端：NestJS + TypeScript
- 数据库：PostgreSQL + Prisma
- 文件存储：腾讯云 COS / 阿里云 OSS
- 版本管理：Git，main + develop + feature 分支

## 开发铁律

先结构，再数据，再接口，再页面，最后 UI 优化。

不要一开始做支付、自动生成正式招标文件、二手交易、大规模 AI 商机预测。第一版只做采购前辅助。
