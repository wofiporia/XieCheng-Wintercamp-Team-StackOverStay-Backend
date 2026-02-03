# 易宿酒店预订平台 — React Native 移动端实现计划

> 基于《第五期前端训练营-大作业考核说明》整理，开发周期：1/29 - 2/26（约 4 周）

---

## 一、项目现状与目标

### 1.1 当前状态

- **技术栈**：React Native 0.76 + React 18.3 + TypeScript
- **代码**：仅默认脚手架，无业务页面与路由
- **范围**：本计划聚焦 **用户端移动端（React Native）**；商户端 PC 管理系统需单独规划（React + Node 服务端）

### 1.2 大作业目标（移动端必须实现）

| 模块 | 必须功能点 |
|------|------------|
| **酒店查询页（首页）** | 顶部 Banner（可点击跳详情）、定位、关键字搜索、日历（入住日期）、筛选（星级/价格）、快捷标签 |
| **酒店列表页** | 城市/日期筛选头、详细筛选区、上滑自动加载列表 |
| **酒店详情页** | 酒店大图左右滑动、基础信息（名称/设施/地址）、房型价格列表（价格从低到高） |

### 1.3 评分对标（总分 100）

- **功能完成度（60）**：各页面逻辑与体验亮点
- **技术复杂度（10）**：数据结构、价格实时更新、长列表优化
- **用户体验（10）**：视觉、布局、兼容性
- **代码质量（10）**：结构、表结构、规范、README、组件复用
- **项目创新性（10）**：新技术或自发设计的体验提升b

---

## 二、技术选型建议（移动端）

| 类别 | 推荐方案 | 说明 |
|------|----------|------|
| 导航 | React Navigation 6.x | 栈 + Tab，满足首页/列表/详情/个人等 |
| 状态管理 | Zustand 或 React Query + 本地 state | 轻量；列表/详情用 React Query 做服务端状态 |
| 请求 | Axios + React Query | 封装 API、缓存、分页、错误处理 |
| UI 组件 | React Native Paper / 自定义 | 统一风格，减少造轮子 |
| 日历 | react-native-calendars | 入住/离店选择 |
| 长列表 | FlatList + 分页 | 上滑加载，可配合 getItemLayout 优化 |
| 图片轮播 | react-native-snap-carousel 或 ScrollView | 详情页大图左右滑动 |
| 定位 | react-native-geolocation 或 expo-location | 首页“当前城市” |

与后端约定：RESTful API，JSON；价格、房态等关键数据由服务端实时计算返回。

---

## 三、四周开发节奏（甘特式）

```
Week1 (1/29-2/4)   基础架构 + 首页框架 + 联调准备
Week2 (2/5-2/11)   列表页 + 详情页 + 长列表与价格
Week3 (2/12-2/18)  筛选/搜索/日历完善 + 与 PC 端联调 + 体验打磨
Week4 (2/19-2/26)  自测、修 Bug、README/答辩材料、提交
```

---

## 四、分阶段实现计划（含具体步骤与 Commit 信息）

> 每项任务下列出：**具体要干什么**、**涉及文件**、**完成后 Commit 提交信息**。主分支上每个 commit 应有明确含义，便于体现开发过程。  
> **Commit 写法规范**（格式、类型、范围、示例）见 [Commit 提交规范](./COMMIT_CONVENTION.md)。

---

### 阶段一：基础架构与联调准备（第 1 周，1/29 - 2/4）

**目标**：可运行的多页面骨架、统一请求与路由、与后端约定接口格式。

**分工说明**：同学 A 做 1.1～1.5（先提交）；同学 B 在 A 提交后做 1.6、1.7，只改列表/详情页。

---

#### 任务 1.1：安装并配置 React Navigation（Stack + Bottom Tabs）

**负责人：同学 A**

**具体要干什么：**

1. 安装依赖：`@react-navigation/native`、`@react-navigation/native-stack`、`@react-navigation/bottom-tabs`、`react-native-screens`、`react-native-safe-area-context`。
2. 在 `App.tsx` 中包裹 `NavigationContainer`，创建根导航。
3. 创建 Bottom Tabs：Tab1「首页」、Tab2「酒店列表」；可选 Tab3「我的」。
4. 每个 Tab 对应一个 Stack，Stack 内先放一个占位屏（如 `HomeScreen`、`HotelListScreen`），仅显示标题和简单文案。
5. 配置 Tab 的 `options`（如 `title`、`tabBarLabel`），保证 Android/iOS 均可切换 Tab。

**涉及文件：**

- `package.json`（新增依赖）
- `App.tsx`（改为导航入口）
- 新建：`src/navigation/RootNavigator.tsx`（或 `AppNavigator.tsx`）、`src/navigation/types.ts`（路由 param 类型）
- 新建：`src/screens/HomeScreen.tsx`、`src/screens/HotelListScreen.tsx`（占位页）

**完成后 Commit 提交信息：**

```
feat(nav): 接入 React Navigation，配置 Stack + Bottom Tabs 与首页/列表占位页
```

---

#### 任务 1.2：目录规范与占位文件

**负责人：同学 A**

**具体要干什么：**

1. 在项目根目录下创建 `src`，并创建子目录：`screens`、`components`、`services`、`stores`、`types`、`constants`、`navigation`（若 1.1 已建则跳过）。
2. 在 `src/constants/` 下新建 `index.ts`，导出如 `API_BASE_URL`、`PAGE_SIZE` 等常量（可先写占位值）。
3. 在 `src/types/` 下新建 `index.ts`，导出空类型或占位类型，便于后续 1.4 补充。
4. 确保现有屏幕、导航均从 `src/` 引用，无散落在根目录的业务逻辑。

**涉及文件：**

- 新建目录结构及 `src/constants/index.ts`、`src/types/index.ts`
- 如有需要：移动或调整 1.1 中创建的 `screens`、`navigation` 至统一从 `src` 引用

**完成后 Commit 提交信息：**

```
chore(structure): 建立 src 目录规范与 constants/types 占位
```

---

#### 任务 1.3：封装 API 层（Axios + baseURL + 拦截器）

**负责人：同学 A**

**具体要干什么：**

1. 安装 `axios`（若用 React Query 可同时安装 `@tanstack/react-query`）。
2. 新建 `src/services/api.ts`：创建 axios 实例，`baseURL` 从 `src/constants` 或环境变量读取，超时时间设置（如 10s）。
3. 请求拦截器：可统一加 `Content-Type: application/json`、后续可加 token。
4. 响应拦截器：统一处理 2xx 返回 `response.data`；4xx/5xx 可统一抛错或转成业务错误格式，便于上层 Toast/弹窗。
5. 新建 `src/services/hotel.ts`（或 `api/hotel.ts`）：封装 `getHotelList(params)`、`getHotelDetail(id)`、`getBanners()` 等函数，内部调用上述 axios 实例；接口 URL 与后端约定一致（可先写 Mock 路径）。

**涉及文件：**

- `package.json`（axios、可选 react-query）
- `src/constants/index.ts`（补充 API_BASE_URL）
- 新建：`src/services/api.ts`、`src/services/hotel.ts`

**完成后 Commit 提交信息：**

```
feat(api): 封装 Axios 实例与酒店列表/详情/Banner 接口
```

---

#### 任务 1.4：接口字段约定与类型定义

**负责人：同学 A**

**具体要干什么：**

1. 在 `src/types/api.d.ts`（或 `types/hotel.ts`）中定义：`HotelListItem`、`HotelDetail`、`RoomType`、`BannerItem`、`ListParams`、`ListResult<T>` 等。
2. 字段需包含：酒店 id、名称（中英）、地址、星级、图片列表、房型数组（房型名、价格、床型等）、Banner 的跳转 id 等；列表分页：`page`、`pageSize`、`total`。
3. 在 `src/services/hotel.ts` 中为上述请求函数注明返回类型（如 `Promise<ListResult<HotelListItem>>`）。
4. 若有与后端/PC 端共享的文档，在 `docs/` 下新增 `api.md` 或补充链接，写明列表/详情/Banner 的请求方法、路径、入参、出参。

**涉及文件：**

- 新建/修改：`src/types/api.d.ts` 或 `src/types/hotel.ts`、`src/types/index.ts`
- `src/services/hotel.ts`（补充类型）
- 可选：`docs/api.md`（接口文档）

**完成后 Commit 提交信息：**

```
feat(types): 定义酒店列表/详情/房型/Banner 接口类型与 API 文档
```

---

#### 任务 1.5：首页骨架（Banner/搜索/日期/快捷标签占位）

**负责人：同学 A**

**具体要干什么：**

1. 在 `src/screens/HomeScreen.tsx` 中实现静态布局（从上到下）：顶部 Banner 占位（一块带背景色的 View 或 Image，可写“Banner”文案）；搜索框（TextInput 占位，点击暂无逻辑）；入住日期占位（一段文字如“选择日期”，点击暂无逻辑）；星级/价格筛选占位（两行文字或按钮）；快捷标签（横向 ScrollView，若干“经济型”“高档”等标签）。
2. Banner 区域可加 `onPress`，用 `navigation.navigate('HotelDetail', { hotelId: 'xxx' })` 跳转到详情占位页（详情页需能接收 `hotelId`）。
3. 搜索框点击可 `navigation.navigate('HotelList', { keyword: '' })`，列表页从 params 读 keyword 并展示在筛选头（占位即可）。
4. 样式可先用 StyleSheet 写死宽度/高度，保证在模拟器上不错位。

**涉及文件：**

- `src/screens/HomeScreen.tsx`
- `src/navigation/` 中注册详情栈并支持 `hotelId` 参数（若尚未注册）
- 新建：`src/screens/HotelDetailScreen.tsx`（仅占位：显示 hotelId）

**完成后 Commit 提交信息：**

```
feat(home): 首页骨架 Banner/搜索/日期/筛选/快捷标签占位及跳转列表与详情
```

---

#### 任务 1.6：列表页骨架（筛选头 + 空列表占位）

**负责人：同学 B**

**具体要干什么：**

1. 在 `src/screens/HotelListScreen.tsx` 顶部做筛选头：左侧城市（如“上海”）、右侧日期（如“入住日期”），用 Text 占位，点击可先弹 Alert 或后续接弹层。
2. 下方为“详细筛选”占位（一行文字或若干筛选项占位）。
3. 再下方用 FlatList，`data={[]}` 或少量占位项，`ListEmptyComponent` 显示“暂无酒店”或占位图；不要求真实分页。
4. 从 `route.params` 读取 `keyword`、`city`、`checkIn` 等（若有），在筛选头展示。

**涉及文件：**

- `src/screens/HotelListScreen.tsx`
- `src/navigation/` 中列表页路由 params 类型（若未在 1.1 定义）

**完成后 Commit 提交信息：**

```
feat(list): 酒店列表页骨架，筛选头与空列表占位
```

---

#### 任务 1.7：详情页骨架（大图 + 信息 + 房型占位）

**负责人：同学 B**

**具体要干什么：**

1. 在 `src/screens/HotelDetailScreen.tsx` 顶部做横向 ScrollView，`pagingEnabled`，内部 2～3 张占位图（或同色块），表示“酒店大图左右滑动”。
2. 中间区域：酒店名称、设施、地址三块文案占位（可写“酒店名称”“设施”“地址”）。
3. 底部：房型列表占位（2～3 条固定文案，如“房型A ￥299”“房型B ￥399”），无需接接口。
4. 从 `route.params` 读取 `hotelId`，在标题或顶部显示（便于联调确认）。

**涉及文件：**

- `src/screens/HotelDetailScreen.tsx`
- 导航类型中确保 `HotelDetail` 的 params 含 `hotelId: string`

**完成后 Commit 提交信息：**

```
feat(detail): 酒店详情页骨架，大图/信息/房型占位
```

---

**阶段一总览 Commit（若合并提交可选用）：**

```
feat(w1): 完成基础架构：导航、目录、API 封装、类型定义与三页骨架
```

---

### 阶段二：核心页面与数据流（第 2 周，2/5 - 2/11）

**目标**：首页、列表、详情主要功能实现，列表分页与详情房型价格展示。

**分工说明**：同学 A 负责首页相关（2.1～2.6）；同学 B 负责列表页与详情页（2.7～2.12）。A 不改 HotelListScreen/HotelDetailScreen，B 不改 HomeScreen/services/types。

---

#### 任务 2.1：首页 — Banner 接口数据 + 点击跳转详情

**负责人：同学 A**

**具体要干什么：**

1. 在首页调用 `getBanners()`，用 state 或 React Query 存结果；Banner 区域用 FlatList 横向或 ScrollView 展示多张图。
2. 每张 Banner 可点击，`onPress` 里取该条目的 `hotelId`（或 link），`navigation.navigate('HotelDetail', { hotelId })`。
3. 无数据时显示占位图或“暂无推荐”；加载中显示简单 loading。

**涉及文件：** `src/screens/HomeScreen.tsx`、`src/services/hotel.ts`（已有 getBanners）、可选 `src/components/BannerCarousel.tsx`

**完成后 Commit 提交信息：**

```
feat(home): Banner 接接口并支持点击跳转酒店详情
```

---

#### 任务 2.2：首页 — 定位与当前城市展示

**负责人：同学 A**

**具体要干什么：**

1. 安装定位依赖（如 `react-native-geolocation` 或按 RN 文档用 Geolocation API）；在首页 mount 时请求定位权限并获取经纬度。
2. 用逆地理接口或后端提供的「根据经纬度查城市」接口得到城市名/code，存到全局 store 或 context（如 `SearchStore` / `SearchContext`），首页顶部展示“当前：上海”等文案。
3. 若权限被拒或接口失败，展示默认城市（如“上海”）并可选“重新定位”按钮。

**涉及文件：** `src/screens/HomeScreen.tsx`、`src/stores/searchStore.ts` 或 `src/context/SearchContext.tsx`、`src/services/geo.ts`（可选）、`src/constants/index.ts`（默认城市）

**完成后 Commit 提交信息：**

```
feat(home): 定位获取当前城市并写入搜索条件
```

---

#### 任务 2.3：首页 — 关键字搜索跳转列表

**负责人：同学 A**

**具体要干什么：**

1. 首页搜索框：输入关键字后，点击“搜索”或键盘确认，将 keyword 与当前城市、入住日期（若有）一并带入列表页：`navigation.navigate('HotelList', { keyword, city, checkIn })`。
2. 列表页从 `route.params` 读取并作为请求参数；若从 Tab 直接进列表，则使用 store 中的默认城市与日期。

**涉及文件：** `src/screens/HomeScreen.tsx`、`src/screens/HotelListScreen.tsx`、`src/services/hotel.ts`（列表接口支持 keyword）

**完成后 Commit 提交信息：**

```
feat(home): 关键字搜索跳转列表并传递 keyword/city/checkIn
```

---

#### 任务 2.4：首页 — 日历选择入住日期

**负责人：同学 A**

**具体要干什么：**

1. 安装 `react-native-calendars`，在首页“入住日期”占位处点击弹出 Calendar 组件（Modal 或新屏）；选择日期后关闭并更新 store/params 中的 `checkIn`（可扩展 `checkOut`）。
2. 展示已选日期文案（如“2025-02-01”）；列表请求时带上 `checkIn`。

**涉及文件：** `src/screens/HomeScreen.tsx`、`src/components/DatePickerModal.tsx`（可选）、`src/stores/searchStore.ts` 或 context

**完成后 Commit 提交信息：**

```
feat(home): 接入日历组件选择入住日期并同步到搜索条件
```

---

#### 任务 2.5：首页 — 星级与价格筛选

**负责人：同学 A**

**具体要干什么：**

1. 首页增加星级选择（如 3/4/5 星多选或单选）和价格区间（如两个输入框或滑块），选择后写入 store/context（如 `starLevel`、`priceMin`、`priceMax`）。
2. 点击“查酒店”或“搜索”进入列表时，将上述参数通过 params 或 store 传给列表页；列表请求时带上对应 query。

**涉及文件：** `src/screens/HomeScreen.tsx`、`src/stores/searchStore.ts`、`src/screens/HotelListScreen.tsx`、`src/services/hotel.ts`

**完成后 Commit 提交信息：**

```
feat(home): 星级与价格筛选并带入列表请求
```

---

#### 任务 2.6：首页 — 快捷标签带条件进列表

**负责人：同学 A**

**具体要干什么：**

1. 定义快捷标签配置（如 `[{ id: 'economy', label: '经济型', starLevel: 3, priceMax: 300 }]`），首页横向展示；点击某标签后，将对应筛选条件写入 store 并 `navigation.navigate('HotelList', { ... })`。
2. 列表页用同一套 params 请求，展示结果。

**涉及文件：** `src/screens/HomeScreen.tsx`、`src/constants/tags.ts` 或内联配置、`src/screens/HotelListScreen.tsx`

**完成后 Commit 提交信息：**

```
feat(home): 快捷标签配置与点击带条件进入列表
```

---

#### 任务 2.7：列表页 — 城市/日期筛选头与弹层修改

**负责人：同学 B**

**具体要干什么：**

1. 列表页顶部固定：左侧展示当前城市（可点击），右侧展示入住日期（可点击）；点击城市弹出城市选择（列表或简单几项），点击日期弹出与首页一致的日历。
2. 选择后更新当前页请求参数并重新请求第一页列表（page=1），清空原列表再赋值新数据。

**涉及文件：** `src/screens/HotelListScreen.tsx`、`src/components/CityPicker.tsx`、`src/components/DatePickerModal.tsx`（复用或单独）

**完成后 Commit 提交信息：**

```
feat(list): 城市与入住日期筛选头及弹层修改
```

---

#### 任务 2.8：列表页 — 详细筛选区域（星级/价格/设施）

**负责人：同学 B**

**具体要干什么：**

1. 在筛选头下方增加“星级”“价格”“设施”等筛选项（与首页条件统一数据结构）；展开/收起可做 Accordion 或固定一行。
2. 选择后更新请求参数并重新拉取第一页；与 2.7 共用同一套请求逻辑。

**涉及文件：** `src/screens/HotelListScreen.tsx`、`src/components/FilterBar.tsx`（可选）

**完成后 Commit 提交信息：**

```
feat(list): 详细筛选区域（星级/价格/设施）与列表联动
```

---

#### 任务 2.9：列表页 — 接口分页与上滑加载更多

**负责人：同学 B**

**具体要干什么：**

1. 列表页使用 `getHotelList({ city, checkIn, keyword, starLevel, priceMin, priceMax, page, pageSize })`，首次加载 page=1，结果存 state（如 `list`、`page`、`hasMore`、`loading`）。
2. FlatList 的 `data={list}`，`onEndReached` 中若 `!loading && hasMore` 则请求 `page+1`，将新数据 append 到 `list`；`keyExtractor` 用 `item.id`。
3. 列表项展示：缩略图、酒店名、星级、最低价等（与类型定义一致）。

**涉及文件：** `src/screens/HotelListScreen.tsx`、`src/services/hotel.ts`、`src/components/HotelListItem.tsx`（可选）

**完成后 Commit 提交信息：**

```
feat(list): 酒店列表分页请求与上滑加载更多
```

---

#### 任务 2.10：详情页 — 酒店大图左右滑动

**负责人：同学 B**

**具体要干什么：**

1. 详情页请求 `getHotelDetail(hotelId)`，取返回的图片数组；用横向 ScrollView（`pagingEnabled`）或轮播组件展示，每张图占满宽度，可左右滑动。
2. 无图时用占位图；加载中可显示骨架或 loading。

**涉及文件：** `src/screens/HotelDetailScreen.tsx`、`src/services/hotel.ts`、可选 `src/components/ImageCarousel.tsx`

**完成后 Commit 提交信息：**

```
feat(detail): 酒店详情大图接接口并支持左右滑动
```

---

#### 任务 2.11：详情页 — 基础信息（名称/设施/地址）

**负责人：同学 B**

**具体要干什么：**

1. 使用详情接口返回的 `name`、`nameEn`、`facilities`、`address` 等，在详情页中部区域展示；设施可为标签列表，地址可带“复制”或“地图”按钮（可选）。
2. 样式：标题、副标题、设施标签、地址单行或两行。

**涉及文件：** `src/screens/HotelDetailScreen.tsx`、`src/types/api.d.ts`（字段与接口一致）

**完成后 Commit 提交信息：**

```
feat(detail): 详情页展示酒店名称/设施/地址
```

---

#### 任务 2.12：详情页 — 房型价格列表（按价格从低到高）

**负责人：同学 B**

**具体要干什么：**

1. 从详情接口取 `roomTypes` 数组，前端按 `price` 升序排序（若后端已排序则不再 sort）；用 FlatList 或 map 渲染每条：房型名、床型、价格、可选“预订”按钮（仅 UI）。
2. 价格以接口为准，不缓存在前端，满足“价格实时更新”。

**涉及文件：** `src/screens/HotelDetailScreen.tsx`、`src/types/api.d.ts`（RoomType）

**完成后 Commit 提交信息：**

```
feat(detail): 房型价格列表按价格从低到高展示
```

---

**阶段二总览 Commit（若合并提交可选用）：**

```
feat(w2): 首页/列表/详情核心功能与列表分页、详情房型价格
```

---

### 阶段三：联调、筛选与体验（第 3 周，2/12 - 2/18）

**目标**：与 PC 端/后端联调，价格与房态实时一致；筛选、搜索、日历闭环；体验优化。

**分工说明**：3.1、3.7 的 API/拦截器由同学 A 改；3.2、3.5、3.6 由同学 B 改列表/详情；3.3、3.4 涉及两人时先约定再改，避免同时动同一文件。

---

#### 任务 3.1：与 Node 后端/PC 管理端联调

**负责人：同学 A**

**具体要干什么：**

1. 将 `API_BASE_URL` 指向真实后端；确认酒店列表、详情、Banner、城市/筛选参数与后端接口一致。
2. 与 PC 端同学约定：商户在 PC 录入/审核/发布/下线后，移动端列表与详情能正确展示/隐藏、价格与房态一致。
3. 联调过程中修正类型定义（`src/types`）与请求参数（如 cityCode、date 格式）；必要时在 `docs/api.md` 更新字段说明。

**涉及文件：** `src/constants/index.ts`、`src/services/hotel.ts`、`src/types/`、`docs/api.md`

**完成后 Commit 提交信息：**

```
fix(api): 联调后端与 PC 端，统一接口字段与上下线表现
```

---

#### 任务 3.2：价格与房态实时（不缓存价格）

**负责人：同学 B**

**具体要干什么：**

1. 列表页每次进入或筛选变化时重新请求列表，不依赖本地缓存的价格字段；详情页进入时必请求最新详情，房型价格以接口为准。
2. 若使用 React Query，设置列表/详情的 `staleTime` 较短或 0，避免长时间使用旧价格；或不用缓存，每次 onFocus 拉取。

**涉及文件：** `src/screens/HotelListScreen.tsx`、`src/screens/HotelDetailScreen.tsx`、可选 `src/services/hotel.ts`（React Query 配置）

**完成后 Commit 提交信息：**

```
fix(data): 列表与详情价格以接口实时为准，不缓存价格
```

---

#### 任务 3.3：筛选与搜索闭环

**负责人：同学 A（首页与 store）+ 同学 B（列表页读 store/params 并刷新）**

**具体要干什么：**

1. 首页与列表页共用同一套筛选条件（城市、入住日期、关键字、星级、价格区间、设施）；从首页带过去的 params 与列表页本地修改的筛选，都写入同一请求。
2. 在列表页修改筛选后，首页再次进入时可选：沿用列表页当前条件或沿用 store 中上次首页选择（按产品约定二选一即可）。

**涉及文件：** `src/screens/HomeScreen.tsx`、`src/screens/HotelListScreen.tsx`、`src/stores/searchStore.ts` 或 context

**完成后 Commit 提交信息：**

```
fix(filter): 首页与列表筛选条件统一，搜索与筛选闭环
```

---

#### 任务 3.4：日历入住/离店与列表刷新

**负责人：同学 A（日历与 store）+ 同学 B（列表页监听日期并刷新）**

**具体要干什么：**

1. 日历支持选择入住、离店（若后端支持离店参数）；选择后更新 store/params，列表页监听到日期变化则重新请求第一页并清空原列表。
2. 日期格式与后端约定一致（如 YYYY-MM-DD）；展示时格式化为本地可读格式。

**涉及文件：** `src/screens/HomeScreen.tsx`、`src/screens/HotelListScreen.tsx`、`src/components/DatePickerModal.tsx`、`src/services/hotel.ts`

**完成后 Commit 提交信息：**

```
feat(calendar): 入住/离店选择与日期变化触发列表刷新
```

---

#### 任务 3.5：长列表优化

**负责人：同学 B**

**具体要干什么：**

1. FlatList 使用 `keyExtractor={(item) => item.id}`（或稳定唯一 key）；若列表项高度固定，实现 `getItemLayout` 避免测量。
2. 避免在 `renderItem` 里创建新的内联函数，用 useCallback 或提取组件；图片使用合适尺寸或缩略图，避免大图撑爆内存。

**涉及文件：** `src/screens/HotelListScreen.tsx`、`src/components/HotelListItem.tsx`

**完成后 Commit 提交信息：**

```
perf(list): 长列表 keyExtractor/getItemLayout 与渲染优化
```

---

#### 任务 3.6：加载与空态

**负责人：同学 B**

**具体要干什么：**

1. 列表页：首屏 loading（骨架或 Spinner）、空列表时 `ListEmptyComponent` 显示“暂无酒店”或插图；加载更多时底部 loading；请求失败时“加载失败，点击重试”。
2. 详情页：全屏 loading 或骨架；无数据或失败时提示“加载失败”和重试按钮。

**涉及文件：** `src/screens/HotelListScreen.tsx`、`src/screens/HotelDetailScreen.tsx`、可选 `src/components/Loading.tsx`、`src/components/EmptyState.tsx`

**完成后 Commit 提交信息：**

```
feat(ux): 列表与详情 loading、空态与错误重试
```

---

#### 任务 3.7：错误与无网提示

**负责人：同学 A（api.ts 拦截器/Toast）+ 同学 B（列表/详情页内重试按钮）**

**具体要干什么：**

1. 在 API 响应拦截器或各请求处，对 4xx/5xx 或网络错误统一处理：弹 Toast 或 Alert（如“网络异常，请重试”）；可选检测无网时提示“请检查网络”。
2. 列表/详情页错误态可提供“重试”按钮，重新发起请求。

**涉及文件：** `src/services/api.ts`、`src/screens/HotelListScreen.tsx`、`src/screens/HotelDetailScreen.tsx`、可选 `src/components/Toast.tsx` 或使用社区库

**完成后 Commit 提交信息：**

```
feat(ux): 统一错误与无网提示及重试
```

---

**阶段三总览 Commit（若合并提交可选用）：**

```
feat(w3): 联调、筛选闭环、长列表优化与加载/空态/错误提示
```

---

### 阶段四：收尾与答辩准备（第 4 周，2/19 - 2/26 20:00）

**目标**：修 Bug、补文档、整理 Git、准备答辩与提交物。

**分工说明**：4.1 两人各自测自己负责的页面；4.2 同学 A 整理首页与公共组件、同学 B 整理列表/详情组件；4.3 同学 A 写架构与运行说明、同学 B 写列表/详情功能说明；4.4～4.6 一起做。

---

#### 任务 4.1：全流程自测

**负责人：同学 A + 同学 B**（各自负责的页面各自修 Bug）

**具体要干什么：**

1. 在至少一种设备（Android 或 iOS 模拟器/真机）上完整走通：首页 Banner/搜索/日历/筛选/标签 → 列表筛选与分页 → 详情大图/信息/房型价格。
2. 记录并修复发现的 Bug；在 README 中注明“已在 xx 设备/系统上测试通过”。

**涉及文件：** 各页面与导航、`README.md`

**完成后 Commit 提交信息：**

```
test: 全流程自测并修复问题，README 注明已测环境
```

---

#### 任务 4.2：代码整理（组件复用与规范）

**负责人：同学 A（首页及公共组件）+ 同学 B（列表/详情相关组件）**

**具体要干什么：**

1. 将重复 UI 抽成组件（如 `HotelListItem`、`FilterChip`、`ImageCarousel`、`EmptyState`）；统一放在 `src/components/` 并按功能或页面分子目录（可选）。
2. 跑通 ESLint、Prettier，修复告警；统一命名（如组件 PascalCase、文件与组件名一致）。

**涉及文件：** `src/components/`、各引用处、`.eslintrc.js`、`.prettierrc.js`

**完成后 Commit 提交信息：**

```
chore(code): 组件抽取与复用，ESLint/Prettier 规范
```

---

#### 任务 4.3：README 完善

**负责人：同学 A（项目介绍、架构、运行方式、目录说明）+ 同学 B（列表/详情功能说明）**

**具体要干什么：**

1. 在项目根目录 `README.md` 中补充：项目名称（易宿酒店预订平台）、简介、技术栈（React Native、导航、请求库等）、目录结构说明、如何安装依赖与运行（`npm install`、`npm start`、`npm run android`/`ios`）、环境要求（Node 版本、Android Studio/Xcode 等）、与 PC 端/后端的关系及接口文档链接。
2. 可选：截图或演示 GIF、分工说明。

**涉及文件：** `README.md`

**完成后 Commit 提交信息：**

```
docs(readme): 补充项目说明、运行方式与目录结构
```

---

#### 任务 4.4：Git 提交与主分支意义

**负责人：同学 A + 同学 B**（各自按规范提交）

**具体要干什么：**

1. 检查主分支（如 `main`）上的 commit 历史：每个 commit 信息应表达一次“完整小目标”（参考上文各任务的 Commit 提交信息），避免“fix”“update”等无意义描述。
2. 若此前有大量未分拆的修改，可用 `git rebase -i` 或新分支整理后再合并；保证最终提交记录能体现“架构 → 首页 → 列表 → 详情 → 联调 → 体验 → 收尾”的过程。

**涉及文件：** 无（仅 Git 操作）

**建议 Commit 习惯：** 每完成本计划中的“一个任务”就提交一次，并使用该任务对应的提交信息。

---

#### 任务 4.5：提交物准备

**负责人：同学 A + 同学 B**（一起准备）

**具体要干什么：**

1. 按要求准备：题目名称、介绍、分工、代码地址（如 GitHub 仓库链接）、线上演示地址（若有）、汇报文档或 PPT。
2. 截止时间 2/26 20:00 前提交到指定入口（按训练营通知）。

**涉及文件：** 可选 `docs/submission.md` 或仓库 Wiki、外部文档/PPT

**完成后 Commit 提交信息（若将提交说明放入仓库）：**

```
chore: 大作业提交物说明与链接
```

---

#### 任务 4.6：答辩准备

**负责人：同学 A + 同学 B**（全员参与讲解）

**具体要干什么：**

1. 准备汇报内容：成员分工、项目灵感、亮点、技术说明、难点突破、成果展示；确保每位成员都有讲解部分。
2. 可提前录演示视频或准备 PPT，答辩时配合讲解。

**涉及文件：** 汇报文档/PPT、演示脚本（可选）

**无单独 Commit**：可与 4.5 一并或仅本地准备。

---

**阶段四总览 Commit（若合并提交可选用）：**

```
chore(w4): 自测、代码规范、README、提交物与答辩准备
```

---

**截止时间**：2/26 20:00 前完成提交。

---

## 五、与 PC 端及后端的协作边界

- **移动端（本仓库）**：只消费接口；不实现登录/注册（若大作业要求用户端登录可再加一屏）。
- **PC 端**：负责商户/管理员登录、酒店信息录入、审核/发布/下线；与后端同一套数据。
- **后端（Node.js）**：提供酒店列表（分页、筛选、搜索）、酒店详情（含房型价格）、Banner 等 API；价格与可售状态由服务端计算，保证实时性。

建议与 PC 端共用同一份接口文档与类型定义（可放在共享仓库或各自维护一份）。

---

## 六、风险与应对

| 风险 | 应对 |
|------|------|
| 后端或 PC 端未就绪 | 第 1 周用 Mock（如 JSON 文件或 Mock 服务）先做移动端逻辑与 UI |
| 长列表卡顿 | 使用 FlatList、避免在 render 中创建新对象、必要时 getItemLayout |
| 日期/时区 | 与后端约定统一使用 ISO 或时间戳，前端展示时格式化为本地日期 |
| 设备兼容 | 至少保证 Android 或 iOS 其一完整可用，在 README 中说明已测设备 |

---

## 七、建议分工示例（2–3 人）

- **同学 A**：导航与架构（第 1 周）+ 首页（Banner/搜索/日历/筛选/标签）+ 与后端接口约定。
- **同学 B**：列表页（筛选头、详细筛选、分页长列表）+ 长列表优化与数据态。
- **同学 C**：详情页（大图轮播、基础信息、房型价格列表）+ 联调与体验（加载态、错误提示）。

可根据实际人数合并或拆分；确保每人都有开发量，避免只做文档或 PPT。

**双人协同（两人都用 Cursor）时**：请按 [开发分工文档](./DEV_DIVISION.md) 划分各自负责的文件与任务，减少同时改同一文件导致的冲突，并便于给各自 AI 划定工作范围。

---

## 八、检查清单（提交前自检）

- [ ] 首页：Banner、定位、关键字搜索、日历、星级/价格筛选、快捷标签均可用且影响列表/详情。
- [ ] 列表页：城市/日期筛选头、详细筛选、上滑加载更多。
- [ ] 详情页：大图可左右滑动、名称/设施/地址、房型按价格从低到高。
- [ ] 价格来自接口且与后端/PC 端一致（实时）。
- [ ] 至少一种设备上完整跑通。
- [ ] README 含运行方式与说明。
- [ ] Git 主分支提交记录清晰、有过程感。

按本计划执行即可在 2/26 前完成移动端大作业要求，并与 PC 端、Node 后端配合完成“易宿酒店预订平台”整体交付。

---

## 九、Commit 提交信息速查表（按执行顺序）

按任务完成后依次提交，主分支上每个 commit 对应一项可交付结果，便于体现开发过程。  
格式与类型说明见 [Commit 提交规范](./COMMIT_CONVENTION.md)。

| 阶段 | 序号 | 建议 Commit 提交信息 |
|------|------|----------------------|
| **阶段一** | 1.1 | `feat(nav): 接入 React Navigation，配置 Stack + Bottom Tabs 与首页/列表占位页` |
| | 1.2 | `chore(structure): 建立 src 目录规范与 constants/types 占位` |
| | 1.3 | `feat(api): 封装 Axios 实例与酒店列表/详情/Banner 接口` |
| | 1.4 | `feat(types): 定义酒店列表/详情/房型/Banner 接口类型与 API 文档` |
| | 1.5 | `feat(home): 首页骨架 Banner/搜索/日期/筛选/快捷标签占位及跳转列表与详情` |
| | 1.6 | `feat(list): 酒店列表页骨架，筛选头与空列表占位` |
| | 1.7 | `feat(detail): 酒店详情页骨架，大图/信息/房型占位` |
| **阶段二** | 2.1 | `feat(home): Banner 接接口并支持点击跳转酒店详情` |
| | 2.2 | `feat(home): 定位获取当前城市并写入搜索条件` |
| | 2.3 | `feat(home): 关键字搜索跳转列表并传递 keyword/city/checkIn` |
| | 2.4 | `feat(home): 接入日历组件选择入住日期并同步到搜索条件` |
| | 2.5 | `feat(home): 星级与价格筛选并带入列表请求` |
| | 2.6 | `feat(home): 快捷标签配置与点击带条件进入列表` |
| | 2.7 | `feat(list): 城市与入住日期筛选头及弹层修改` |
| | 2.8 | `feat(list): 详细筛选区域（星级/价格/设施）与列表联动` |
| | 2.9 | `feat(list): 酒店列表分页请求与上滑加载更多` |
| | 2.10 | `feat(detail): 酒店详情大图接接口并支持左右滑动` |
| | 2.11 | `feat(detail): 详情页展示酒店名称/设施/地址` |
| | 2.12 | `feat(detail): 房型价格列表按价格从低到高展示` |
| **阶段三** | 3.1 | `fix(api): 联调后端与 PC 端，统一接口字段与上下线表现` |
| | 3.2 | `fix(data): 列表与详情价格以接口实时为准，不缓存价格` |
| | 3.3 | `fix(filter): 首页与列表筛选条件统一，搜索与筛选闭环` |
| | 3.4 | `feat(calendar): 入住/离店选择与日期变化触发列表刷新` |
| | 3.5 | `perf(list): 长列表 keyExtractor/getItemLayout 与渲染优化` |
| | 3.6 | `feat(ux): 列表与详情 loading、空态与错误重试` |
| | 3.7 | `feat(ux): 统一错误与无网提示及重试` |
| **阶段四** | 4.1 | `test: 全流程自测并修复问题，README 注明已测环境` |
| | 4.2 | `chore(code): 组件抽取与复用，ESLint/Prettier 规范` |
| | 4.3 | `docs(readme): 补充项目说明、运行方式与目录结构` |
| | 4.5 | `chore: 大作业提交物说明与链接` |

**可选阶段总览提交（每周末或阶段结束时使用）：**

- `feat(w1): 完成基础架构：导航、目录、API 封装、类型定义与三页骨架`
- `feat(w2): 首页/列表/详情核心功能与列表分页、详情房型价格`
- `feat(w3): 联调、筛选闭环、长列表优化与加载/空态/错误提示`
- `chore(w4): 自测、代码规范、README、提交物与答辩准备`
