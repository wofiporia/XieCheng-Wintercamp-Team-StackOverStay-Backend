# Project Overview & Developer Guide

本文档整合了项目的快速上手指南、目录结构说明以及移动端数据库与接口设计文档，旨在为开发者提供一站式的项目概览。

---

## 1. 快速启动与测试 (Quick Start)

### 环境准备
- Node.js (>=16)
- Docker & Docker Compose (用于数据库)

### 启动流程

1.  **安装依赖**
    ```bash
    npm install
    ```

2.  **启动数据库**
    本项目使用 PostgreSQL 数据库，通过 Docker 快速启动。
    ```bash
    # 启动数据库容器
    docker-compose up -d postgres
    # 确认容器已启动 (应看到 port 5433)
    docker ps
    ```

3.  **数据库初始化**
    在启动后端服务前，需要执行数据库迁移和数据填充。
    ```bash
    # 创建表结构
    npm run migrate
    # 填充测试数据
    npm run seed
    ```

4.  **启动后端服务**
    ```bash
    # 开发模式 (支持热重载)
    npm run dev
    # 服务将运行在: http://localhost:3000
    ```

### 测试方法

1.  **API 冒烟测试 (推荐)**
    使用内置脚本快速验证所有核心接口的连通性。
    ```bash
    npm run test:api
    ```

2.  **Swagger 在线文档调试**
    启动服务后，访问 [http://localhost:3000/api-docs](http://localhost:3000/api-docs) 进行可视化调试。

3.  **单元/集成测试**
    ```bash
    npm test
    ```

### 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run migrate` | 执行数据库迁移 |
| `npm run migrate:rollback` | 回滚最后一次迁移 |
| `npm run seed` | 填充种子数据 |
| `npm run test:api` | 运行 API 冒烟测试脚本 |
| `npm run swagger:export` | 导出 Swagger JSON 文档 |

---

## 2. 项目目录结构 (Structure)

本节说明仓库的目录结构与关键文件，便于团队快速了解项目布局与职责。

```
.
├─ .gitignore
├─ .env.example
├─ README.md
├─ package.json
├─ Dockerfile
├─ docker-compose.yml
├─ docs/                 # 项目文档
│  ├─ PROJECT_OVERVIEW.md # 本文件：项目总览
│  ├─ IMPLEMENTATION_PLAN.md # 实施计划
│  └─ ...
├─ migrations/           # DB migrations (Knex)
├─ seeders/              # DB seeders (Knex)
├─ scripts/              # 工具脚本 (测试、Swagger导出等)
├─ src/
│  ├─ index.js           # 启动入口（reads PORT、调用 app）
│  ├─ app.js             # Express app：中间件、路由挂载、错误处理
│  ├─ config/            # 配置（env、常量、Swagger配置）
│  ├─ routes/            # 路由定义，按资源拆分
│  ├─ controllers/       # 控制器：解析请求、调用 service，返回 response
│  ├─ services/          # 业务逻辑（可单元测试）
│  ├─ models/            # 数据层（ORM / DAL）
│  ├─ middlewares/       # 通用中间件（日志、404、错误处理）
│  └─ utils/             # 工具（logger, asyncHandler, HttpError 等）
├─ tests/                # 单元/集成测试（Jest + Supertest）
└─ .github/workflows/    # CI 配置（GitHub Actions）
```

### 关键说明
- **入口**：`src/index.js` 启动服务，`src/app.js` 配置 Express 应用（中间件、路由）。
- **配置**：敏感配置放在环境变量（`.env`），仓库保留 `.env.example`。
- **职责划分**：路由层只做路径与参数校验，控制器负责业务调用，服务层负责核心逻辑与 DB 交互。

---

## 3. 移动端数据库与接口设计 (Technical Design)

依据 `docs/IMPLEMENTATION_PLAN.md` 的阶段拆解，本设计用于指导后端如何支撑移动端首页、酒店列表、酒店详情三大流程。

### 3.1 设计目标
1.  **对齐节奏**：支持分阶段上线（基础导航 -> 列表/详情 -> 筛选联动）。
2.  **实时可观察**：接口统一返回结构、错误码与 `x-request-id`。
3.  **一套数据多端共用**：移动端、PC 管理台共用表结构。

### 3.2 数据库设计 (Simplified)

| 表 | 关键字段 | 说明 |
| --- | --- | --- |
| `cities` | `id`, `name`, `country_code`, `lat`, `lng` | 城市数据 |
| `hotels` | `id`, `city_id`, `name`, `star_rating`, `min_price_cache` | 酒店基础数据 |
| `hotel_photos` | `id`, `hotel_id`, `url`, `type` | 酒店图片 |
| `tags` | `id`, `code`, `name`, `type` | 标签/主题 |
| `hotel_tags` | `hotel_id`, `tag_id` | 酒店-标签关联 |
| `quick_filters` | `id`, `tag_id`, `jump_type`, `platform` | 首页快捷筛选配置 |
| `rooms` | `id`, `hotel_id`, `name`, `bed_type` | 房型数据 |
| `rate_plans` | `id`, `room_id`, `name`, `meal_plan` | 售卖方案 (RatePlan) |
| `room_price_calendar` | `rate_plan_id`, `stay_date`, `price`, `inventory` | 每日价格库存日历 |
| `banners` | `id`, `title`, `image_url`, `jump_type` | 首页 Banner |

### 3.3 API 接口详细规范 (API Reference)

> **注意**: 所有接口前缀均为 `/api`。

#### 1. 通用响应结构 (Response Structure)

所有接口统一遵循以下 JSON 返回格式：

```json
{
  "code": 0,          // 业务状态码 (0: 成功, >0: 错误码)
  "message": "ok",    // 状态描述或错误提示
  "data": { ... },    // 业务数据 payload
  "meta": {           // 元数据 (可选，如分页信息)
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

#### 2. 基础数据 (Meta & Config)

**2.1 获取城市列表**
用于首页城市选择或搜索补全。
- **URL**: `GET /meta/cities`
- **Parameters**:
  | 参数 | 类型 | 必填 | 说明 |
  | --- | --- | --- | --- |
  | `keyword` | string | 否 | 城市名搜索 (支持中文/拼音) |
- **Response Example**:
  ```json
  {
    "code": 0,
    "data": [
      {
        "id": 1,
        "name": "上海",
        "countryCode": "CN",
        "lat": 31.2304,
        "lng": 121.4737
      }
    ]
  }
  ```

**2.2 获取首页 Banner**
- **URL**: `GET /banners`
- **Response Example**:
  ```json
  {
    "data": [
      {
        "id": 1,
        "title": "暑期特惠",
        "imageUrl": "https://example.com/banner1.jpg",
        "jump": { "type": "h5", "url": "..." }
      }
    ]
  }
  ```

#### 3. 酒店业务 (Hotels)

**3.1 搜索/筛选酒店列表**
支持多维度组合筛选。
- **URL**: `GET /hotels`
- **Parameters**:
  | 参数 | 类型 | 必填 | 说明 |
  | --- | --- | --- | --- |
  | `cityId` | int | 否 | 城市ID (与 keyword 二选一建议必填) |
  | `keyword` | string | 否 | 酒店名/地址关键词 |
  | `checkIn` | date | 否 | 入住日期 (YYYY-MM-DD)，默认今天 |
  | `checkOut` | date | 否 | 离店日期 (YYYY-MM-DD)，默认明天 |
  | `priceMin` | int | 否 | 最低价限制 |
  | `priceMax` | int | 否 | 最高价限制 |
  | `starMin` | int | 否 | 最低星级 (1-5) |
  | `tags` | string | 否 | 标签 Code，逗号分隔 (如 "luxury,family") |
  | `sort` | string | 否 | 排序 (price_asc, price_desc, rating_desc) |
  | `page` | int | 否 | 页码 (默认 1) |
  | `pageSize` | int | 否 | 每页数量 (默认 10) |

- **Response Example**:
  ```json
  {
    "data": [
      {
        "id": 101,
        "name": "和平饭店",
        "starRating": 5,
        "score": 4.8,
        "thumbnail": "https://...",
        "address": "南京东路 20 号",
        "minPrice": 1200,  // 对应日期的最低起价
        "tags": ["luxury", "history"]
      }
    ],
    "meta": {
      "total": 50,
      "page": 1,
      "pageSize": 10
    }
  }
  ```

**3.2 获取酒店详情**
包含酒店基础信息、设施、图集等。
- **URL**: `GET /hotels/:id`
- **Response Example**:
  ```json
  {
    "data": {
      "id": 101,
      "name": "和平饭店",
      "starRating": 5,
      "description": "历史悠久的豪华酒店...",
      "photos": [
        { "url": "...", "type": "exterior" },
        { "url": "...", "type": "interior" }
      ],
      "facilities": ["wifi", "pool", "gym"]
    }
  }
  ```

**3.3 获取房型与报价**
获取指定日期范围内的房型列表及价格日历。
- **URL**: `GET /hotels/:id/rooms`
- **Parameters**:
  | 参数 | 类型 | 必填 | 说明 |
  | --- | --- | --- | --- |
  | `checkIn` | date | **是** | 入住日期 (YYYY-MM-DD) |
  | `checkOut` | date | 否 | 离店日期 (默认 checkIn + 1) |

- **Response Example**:
  ```json
  {
    "data": [
      {
        "id": 201,
        "name": "豪华江景房",
        "bedType": "大床",
        "maxOccupancy": 2,
        "photos": [...],
        "ratePlans": [
          {
            "id": 3001,
            "name": "含早灵活价",
            "cancelPolicy": "free_cancel",
            "meals": "breakfast",
            "totalPrice": 2400, // checkIn 到 checkOut 的总价
            "avgPrice": 1200,   // 日均价
            "inventory": 5      // 剩余库存
          }
        ]
      }
    ]
  }
  ```

### 3.4 关键数据流
1.  **定位**: App 获取 GPS -> 调用 API 获取最近城市 ID。
2.  **搜索**: 用户输入条件 -> App 调用 `GET /api/hotels` -> 后端查询 DB 返回结果。
3.  **详情**: 用户点击列表项 -> App 调用详情与房型接口 -> 展示详情页与价格。

### 3.5 实施建议
- **服务分层**: 维持 `routes -> controllers -> services -> models` 结构。
- **TypeScript**: 推荐在 `src/types/` 输出 TS 定义以供前后端共享。
- **性能**: 后期对 `room_price_calendar` 进行分区或索引优化。
