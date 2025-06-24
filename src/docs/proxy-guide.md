# 代理配置使用指南

本项目实现了一套完整的代理转发机制，用于在不同环境下自动转发API请求到对应的服务器。

## 🎯 功能特点

- ✅ **多环境支持**：开发、测试、预发布、生产环境
- ✅ **自动路径匹配**：根据URL路径自动选择代理规则
- ✅ **路径重写**：支持URL路径的重写和转换
- ✅ **自定义请求头**：为不同环境添加特定的请求头
- ✅ **配置可视化**：启动时自动显示当前代理配置
- ✅ **测试工具**：内置代理配置测试和健康检查

## 📁 文件结构

```
src/
├── config/
│   ├── proxy.ts      # 代理配置管理
│   └── api.ts        # API端点配置
├── utils/
│   └── proxyTest.ts  # 代理测试工具
└── services/
    └── mock.ts       # 使用代理的API服务
```

## ⚙️ 配置说明

### 1. 代理规则配置 (`src/config/proxy.ts`)

```typescript
{
  pathPattern: '/apifox/mock',    // 匹配的URL路径前缀
  target: 'https://...',          // 目标服务器地址
  changeOrigin: true,             // 改变请求源
  pathRewrite: {                  // 路径重写规则
    '^/apifox/mock': ''
  },
  description: 'Apifox Mock API代理',
  secure: true,                   // 是否验证SSL证书
  headers: {                      // 自定义请求头
    'User-Agent': 'React-App-Dev'
  }
}
```

### 2. API端点配置 (`src/config/api.ts`)

```typescript
development: {
  baseUrl: '/api/v1',           // 基础API地址
  mockUrl: '/apifox/mock',      // Mock API地址
  uploadUrl: '/api/upload',     // 文件上传地址
  wsUrl: 'ws://localhost:3000/ws' // WebSocket地址
}
```

## 🚀 使用方法

### 1. 基础用法

```typescript
import { apiUrlBuilder, API_PATHS } from '@src/config/api';

// 构建Mock API URL
const mockUrl = apiUrlBuilder.buildMockUrl(API_PATHS.MOCK.USER_INFO);
// 结果: /apifox/mock/test (开发环境)

// 构建基础API URL
const apiUrl = apiUrlBuilder.buildApiUrl('/user/profile');
// 结果: /api/v1/user/profile (开发环境)
```

### 2. 在服务中使用

```typescript
// src/services/mock.ts
import { apiUrlBuilder, API_PATHS } from '@src/config/api';

const fetchUserInfoRequest = (data?: any) => {
    const url = apiUrlBuilder.buildMockUrl(API_PATHS.MOCK.USER_INFO);
    return get(url, { apifoxToken: 'xxx' });
};
```

### 3. 代理测试

```typescript
import { testMockApi, testAllProxyPaths } from '@src/utils/proxyTest';

// 测试Mock API代理
const result = await testMockApi();

// 测试所有代理配置
const results = await testAllProxyPaths();
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

### 2. 更新API配置

在 `src/config/api.ts` 中添加对应的端点：

```typescript
development: {
  // ... 其他配置
  newServiceUrl: '/api/newservice'
}
```

### 3. 添加API路径常量

```typescript
export const API_PATHS = {
  // ... 其他路径
  NEW_SERVICE: {
    LIST: '/list',
    DETAIL: '/detail'
  }
} as const;
```

## 🌍 环境配置

### 开发环境 (development)
- Mock API：代理到 Apifox Mock 服务
- 本地API：代理到 localhost:3001
- 文件上传：代理到 localhost:3002

### 测试环境 (testing)
- Mock API：代理到 Apifox Mock 服务
- 测试API：代理到 test-api.example.com

### 预发布环境 (staging)
- API：代理到 staging-api.example.com

### 生产环境 (production)
- API：代理到 api.example.com

## 📊 代理状态监控

启动开发服务器时，控制台会显示：

```
🔗 代理配置信息
📂 当前环境: Development (development)
📝 环境描述: 本地开发环境

📋 代理规则:
  1. Apifox Mock API代理
     🎯 匹配路径: /apifox/mock
     🔗 目标地址: https://m1.apifoxmock.com/m1/6595783-6301451-default
     ✏️  路径重写: {"^/apifox/mock":""}

🌐 API配置信息
📂 当前环境: development
🔗 基础API: /api/v1
🎭 Mock API: /apifox/mock
📤 上传API: /api/upload
```

## 🧪 测试代理配置

### 手动测试

```typescript
import { testProxyPath } from '@src/utils/proxyTest';

// 测试特定路径
const result = await testProxyPath('/apifox/mock/test');
console.log(result);
```

### 自动测试

在开发环境下，代理会自动执行健康检查，确保Mock API可正常访问。

## ⚠️ 注意事项

1. **路径匹配顺序**：代理规则按配置顺序匹配，更具体的路径应放在前面
2. **CORS问题**：代理主要解决开发环境的跨域问题，生产环境需要服务端配置CORS
3. **HTTPS证书**：对于自签名证书，可设置 `secure: false`
4. **请求头**：某些API可能需要特定的请求头，可在代理规则中配置

## 🔍 故障排查

### 代理不生效
1. 检查URL路径是否匹配代理规则
2. 查看控制台的代理配置信息
3. 使用代理测试工具验证配置

### 请求失败
1. 检查目标服务器是否可访问
2. 验证请求头和认证信息
3. 查看网络面板的实际请求

### 路径重写问题
1. 检查正则表达式是否正确
2. 测试路径重写的结果
3. 确认目标服务器的API路径

通过这套代理配置机制，可以轻松管理不同环境下的API请求，提高开发效率并简化部署过程。 