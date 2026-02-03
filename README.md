# StackOverStay Backend

StackOverStay 酒店预订平台后端服务 (Node.js + Express + PostgreSQL)。

## 项目概览

详细的项目文档、快速启动指南、API 文档和目录结构说明，请参阅：

👉 [**PROJECT_OVERVIEW.md**](docs/PROJECT_OVERVIEW.md)

## 快速开始

```bash
# 安装依赖
npm install

# 启动数据库 (Docker)
docker-compose up -d

# 初始化数据库
npm run migrate
npm run seed

# 启动服务
npm run dev
```

## 测试

```bash
# 运行 API 冒烟测试
npm run test:api

# 运行单元/集成测试
npm test
```
