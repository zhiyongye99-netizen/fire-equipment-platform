# 07_API接口文档

## 首页

- GET /api/articles
- GET /api/home/banners
- GET /api/home/channels

## 装备与产品

- GET /api/equipment/categories
- GET /api/products?page=1&page_size=20
- GET /api/products/:id
- POST /api/products/compare
- POST /api/favorites
- DELETE /api/favorites/:id

产品列表分页返回：

- data：产品列表。
- meta.total：总条数。
- meta.page：当前页码。
- meta.page_size：每页条数。
- meta.total_pages：总页数。

## 询价线索

- POST /api/leads
- GET /api/me/inquiries
- GET /api/supplier/leads
- GET /api/supplier/leads/:id
- POST /api/supplier/leads/:id/follow-up

## 消防圈

- GET /api/circles
- GET /api/posts
- POST /api/posts
- POST /api/comments
- POST /api/posts/:id/like

## 供应商后台

- GET /api/supplier/company
- PUT /api/supplier/company
- GET /api/supplier/products
- POST /api/supplier/products
- PUT /api/supplier/products/:id
- POST /api/supplier/products/:id/submit-review
- POST /api/supplier/materials

## 平台后台

- GET /api/admin/reviews
- POST /api/admin/reviews/:id/approve
- POST /api/admin/reviews/:id/reject
- GET /api/admin/logs

## 统一规则

1. 所有写接口必须鉴权。
2. 供应商接口必须校验企业归属。
3. 审核接口必须校验管理员权限。
4. 错误信息不得泄露数据库内部错误。
