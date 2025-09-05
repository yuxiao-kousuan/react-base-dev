# 代理配置使用指南

本项目实现了一套完整的代理转发机制，用于在不同环境下自动转发API请求到对应的服务器。

## 🎯 功能特点

- ✅ **多环境支持**：开发、生产环境
- ✅ **自动路径匹配**：根据URL路径自动选择代理规则
- ✅ **路径重写**：支持URL路径的重写和转换
- ✅ **自定义请求头**：为不同环境添加特定的请求头
- ✅ **配置可视化**：启动时自动显示当前代理配置

## 📁 文件结构

```
src/
├── config/
│   └── proxy.ts      # 代理配置管理
├── utils/
│   └── api/          # API工具类
└── services/
    └── mock.ts       # 使用代理的API服务
```

## ⚙️ 配置说明

### 1. 代理规则配置 (`src/config/proxy.ts`)

```typescript
{
  pathPattern: '/api',           // 匹配的URL路径前缀
  target: 'https://...',         // 目标服务器地址
  changeOrigin: true,            // 改变请求源
  description: 'API服务器代理',   // 描述信息
  secure: true,                  // 是否验证SSL证书
  headers: {                     // 自定义请求头
    'User-Agent': 'React-App-Dev'
  }
}
```

## 🚀 使用方法

### 1. 基础用法

```typescript
import { generateViteProxyConfig } from '@src/config/proxy';

// 获取当前环境的代理配置
const proxyConfig = generateViteProxyConfig();
```

### 2. 在服务中使用

```typescript
// src/services/mock.ts
import { get } from '@src/utils/api/axiosWarpInstance';

const fetchExampleData = (data?: any) => {
    const url = '/api/example';
    return get(url, data);
};
```

## 🔧 配置新的代理规则

### 1. 添加代理规则

在 `src/config/proxy.ts` 中添加新的代理规则：

```typescript
{
  pathPattern: '/api/newservice',
  target: 'https://newservice.example.com',
  changeOrigin: true,
  description: '新服务API代理',
  secure: true
}
```

## 🌍 环境配置

### 开发环境 (development)
- API：代理到本地开发服务器

### 生产环境 (production)
- API：代理到生产服务器

## 📊 代理状态监控

启动开发服务器时，控制台会显示代理配置信息。

## ⚠️ 注意事项

1. **路径匹配顺序**：代理规则按配置顺序匹配，更具体的路径应放在前面
2. **CORS问题**：代理主要解决开发环境的跨域问题，生产环境需要服务端配置CORS
3. **HTTPS证书**：对于自签名证书，可设置 `secure: false`
4. **请求头**：某些API可能需要特定的请求头，可在代理规则中配置

## 🔍 故障排查

### 代理不生效
1. 检查URL路径是否匹配代理规则
2. 查看控制台的代理配置信息
3. 验证代理配置是否正确

### 请求失败
1. 检查目标服务器是否可访问
2. 验证请求头和认证信息
3. 查看网络面板的实际请求

通过这套代理配置机制，可以轻松管理不同环境下的API请求，提高开发效率并简化部署过程。