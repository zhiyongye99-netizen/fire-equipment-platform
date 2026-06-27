# API Contract 示例

## GET /products

返回产品列表。

```json
{
  "items": [
    {
      "id": "prod_001",
      "name": "大流量排水抢险车",
      "category": "排涝装备",
      "supplier": "示例供应商",
      "core_parameters": {
        "flow_rate": "3000 m³/h",
        "head": "20 m",
        "deployment_time": "10 min"
      }
    }
  ]
}
```

## POST /recommend

输入场景和条件，返回推荐装备。
