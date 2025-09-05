# 🎣 React Hooks 状态管理

本项目使用React Hooks进行状态管理，替代了复杂的MobX架构。

## 📁 目录结构

```
src/hooks/
├── index.ts                 # 统一导出
├── useAppState.ts          # 应用级状态Hook
├── useWelcomePageState.ts  # 欢迎页面状态Hook
└── README.md              # 使用文档
```

## 🚀 快速开始

### 1. 在组件中使用状态Hook

```tsx
import React from 'react';
import { useAppState, useWelcomePageState } from '@src/hooks';

const MyComponent: React.FC = () => {
    // 使用应用级状态
    const { loading, setLoading, error, setError } = useAppState();
    
    // 使用页面级状态
    const { 
        isVisible, 
        hasInteracted, 
        handleStartDevelopment,
        getFeatures 
    } = useWelcomePageState();

    return (
        <div>
            <p>加载状态: {loading ? '加载中...' : '完成'}</p>
            <p>页面可见: {isVisible ? '是' : '否'}</p>
            <button onClick={() => setLoading(true)}>
                设置加载状态
            </button>
        </div>
    );
};
```

## 🛠️ 创建新的状态Hook

### 1. 创建Hook文件

```typescript
// src/hooks/useUserState.ts
import { useState, useCallback } from 'react';

interface UserState {
    users: User[];
    loading: boolean;
    error: string | null;
}

export const useUserState = () => {
    const [state, setState] = useState<UserState>({
        users: [],
        loading: false,
        error: null,
    });

    const fetchUsers = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true }));
        try {
            const users = await api.getUsers();
            setState(prev => ({ ...prev, users, loading: false }));
        } catch (error) {
            setState(prev => ({ 
                ...prev, 
                error: error.message, 
                loading: false 
            }));
        }
    }, []);

    const reset = useCallback(() => {
        setState({
            users: [],
            loading: false,
            error: null,
        });
    }, []);

    return {
        ...state,
        fetchUsers,
        reset,
    };
};
```

### 2. 在index.ts中导出

```typescript
// src/hooks/index.ts
export { useUserState } from './useUserState';
```

### 3. 在组件中使用

```tsx
import { useUserState } from '@src/hooks';

const UserPage: React.FC = () => {
    const { users, loading, fetchUsers } = useUserState();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <div>
            {loading ? '加载中...' : '用户列表'}
        </div>
    );
};
```

## 🎯 最佳实践

1. **单一职责**: 每个Hook只管理特定的状态
2. **命名规范**: Hook以`use`开头，状态Hook以`State`结尾
3. **类型安全**: 为状态定义TypeScript接口
4. **useCallback**: 使用useCallback优化函数引用
5. **重置方法**: 每个Hook都应该有reset方法

## 🔍 调试技巧

1. 使用React DevTools查看组件状态
2. 在Hook中添加console.log进行调试
3. 使用useEffect监听状态变化
4. 在开发环境中显示状态信息

## 📝 注意事项

1. 使用useCallback避免不必要的重新渲染
2. 状态更新使用函数式更新确保最新状态
3. 避免在Hook中直接操作DOM
4. 保持Hook的纯净性，避免副作用
5. 合理使用useEffect的依赖数组

## 🔄 与MobX的对比

| 特性 | MobX | React Hooks |
|------|------|-------------|
| 学习成本 | 高 | 低 |
| 文件数量 | 多 | 少 |
| 调试难度 | 困难 | 容易 |
| 类型安全 | 好 | 好 |
| 性能 | 好 | 好 |
| 维护成本 | 高 | 低 |

## 🚀 优势

- ✅ **简单直观**: 使用React原生Hooks
- ✅ **类型安全**: 完整的TypeScript支持
- ✅ **调试友好**: 使用React DevTools
- ✅ **性能优化**: 使用useCallback和useMemo
- ✅ **易于维护**: 代码结构清晰
- ✅ **无依赖**: 不需要额外的状态管理库
