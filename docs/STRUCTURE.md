# 项目目录结构（说明）

本文件说明仓库的目录结构与关键文件，便于团队快速了解项目布局与职责。 ✅

---

```
.
├─ .gitignore
├─ .env.example
├─ README.md
├─ package.json
├─ Dockerfile
├─ docker-compose.yml
├─ docs/
│  ├─ STRUCTURE.md        # 本文件：目录说明
│  └─ MIGRATIONS.md?      # 可选：迁移/种子指南（若需要可补充）
├─ migrations/            # DB migrations 占位（含 .gitkeep）
├─ seeders/               # DB seeders 占位（含 .gitkeep）
├─ src/
│  ├─ index.js            # 启动入口（reads PORT、调用 app）
│  ├─ app.js              # Express app：中间件、路由挂载、错误处理
│  ├─ config/             # 配置（env、常量）
│  ├─ routes/             # 路由定义，按资源拆分
│  ├─ controllers/        # 控制器：解析请求、调用 service，返回 response
│  ├─ services/           # 业务逻辑（可单元测试）
│  ├─ models/             # 数据层（ORM / DAL）
│  ├─ middlewares/        # 通用中间件（日志、404、错误处理）
│  └─ utils/              # 工具（logger 等）
├─ tests/                 # 单元/集成测试（Jest + Supertest）
└─ .github/workflows/     # CI 配置（GitHub Actions）
```

---

## 关键说明
- `src/app.js`：所有中间件（CORS、helmet、body parser、请求日志）与路由都在这里配置。
- 健康检查：`GET /api/health`。
- 空目录（`migrations/`, `seeders/`）当前使用 `.gitkeep` 占位，示例 migration/seed 文件可按需添加。
- `Dockerfile` / `docker-compose.yml`：用于容器化部署测试。`Procfile` 可保留用于 Heroku 风格部署。
- 测试：`npm test`；开发启动：`npm run dev`；生产启动：`npm start`。

---

## 建议与约定（短）
- 路由只做路径与参数校验，控制器负责业务调用，服务层负责与 DB/第三方交互。
- 将敏感配置放在环境变量（`.env`），不要提交到仓库；在仓库保留 `.env.example`。
- 在准备上线前：连接真实 DB、启用生产 logger、配置 CORS 白名单与安全中间件。

---

如需，我可以把此文档补成更细的开发者上手指南（含常用命令、环境变量、示例请求、CI/CD 流程）。要我继续吗？ (是 / 否)
