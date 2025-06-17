# React + MobX + TypeScript 待办事项应用

一个使用 React + TypeScript + Vite + Axios + MobX + MobX-React 构建的简单单页面前端应用。

## 🛠️ 技术栈

- **React 18** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript
- **Vite 3** - 快速的构建工具 (兼容 Node v16.20.2)
- **MobX 6** - 状态管理
- **MobX-React 7** - React 与 MobX 的集成
- **Axios** - HTTP 客户端
- **Less** - CSS 预处理器，支持变量、混合、嵌套等功能

## 🚀 快速开始

### 环境要求

- Node.js v16.20.2
- npm 8.19.4

### 安装和运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 📁 项目结构

```
src/
├── components/
│   ├── TodoItem.tsx       # 待办事项组件
│   └── TodoItem.less      # 待办事项样式
├── store/
│   └── AppStore.ts        # MobX 状态管理
├── styles/
│   ├── variables.less     # Less 变量定义
│   ├── mixins.less        # Less 混合和工具函数
│   └── themes.less        # 主题样式
├── App.tsx                # 主应用组件
├── App.less               # 应用样式 (Less)
├── main.tsx              # 应用入口
└── index.less            # 全局样式 (Less)
```

## ✨ 功能特性

- ✅ 添加新的待办事项
- ✅ 标记待办事项为完成/未完成
- ✅ 删除待办事项
- ✅ 实时统计（总数、已完成、未完成）
- ✅ 从外部 API 获取示例数据
- ✅ 响应式设计
- ✅ TypeScript 类型安全
- ✅ MobX 响应式状态管理

## 🔧 MobX 使用说明

本项目展示了 MobX 的核心概念：

- **Observable State**: `todos`, `loading`, `error` 等状态都是可观察的
- **Actions**: `addTodo`, `toggleTodo`, `deleteTodo`, `fetchTodos` 等操作
- **Computed Values**: `uncompletedTodosCount`, `completedTodosCount` 等计算属性
- **Observer Components**: 使用 `observer` HOC 让组件响应状态变化

## 📡 API 集成

应用集成了 JSONPlaceholder API 来演示 Axios 的使用：

- 点击"从 API 获取示例数据"按钮
- 使用 Axios 发送 HTTP 请求
- MobX 管理加载状态和错误处理

## 🎨 样式说明

- 使用 **Less 预处理器** 实现模块化样式管理
- **变量系统**：统一的颜色、尺寸、间距变量
- **混合 (Mixins)**：可复用的样式模块，如按钮、输入框、卡片等
- **嵌套语法**：清晰的样式层次结构
- **响应式设计**：使用 Less 混合实现移动端适配
- **主题支持**：内置暗色主题和高对比度主题
- 渐变背景和卡片式设计
- 平滑的过渡动画效果

### Less 功能特性

- 📁 **模块化组织**：变量、混合、主题分离管理
- 🎨 **变量复用**：颜色、尺寸、间距等统一管理
- 🔧 **混合函数**：按钮、输入框、布局等可复用样式
- 📱 **响应式混合**：简化移动端样式编写
- 🌙 **主题系统**：支持多主题切换

## 📝 版本兼容性

所有依赖版本都经过测试，确保与 Node v16.20.2 和 npm 8.19.4 完全兼容：

- Vite 3.x (而非需要 Node 18+ 的 Vite 4+)
- MobX 6.8.0
- MobX-React 7.6.0
- Axios 1.3.6 