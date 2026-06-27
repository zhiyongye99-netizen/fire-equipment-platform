# apps/miniapp/AGENTS.md

本目录为微信小程序端。

## 规则

- 使用 Taro + React + TypeScript。
- 页面必须符合 docs/02_页面清单.md。
- 不使用浏览器 DOM API。
- 不直接访问数据库。
- 接口统一封装在 src/services/。
- 页面必须考虑未登录、加载中、空状态、错误状态。
- 小程序底部 Tab 第一版建议：首页、消防圈、选装、我的。
- 供应商轻工作台建议放在分包：src/subpackages/supplier/。
- 供应商轻工作台只做查看、提醒、跟进和轻操作，不做复杂批量录入。
- 手机端字号和信息密度必须符合 docs/08_UI设计规则.md。
