import { api, asyncParallelManager, makeCancelable, getCurrentUserManager } from './index';

// ==================== 基础使用示例 ====================

// 1. 基础API调用
export const basicApiUsage = async () => {
    try {
        // 用户登录
        const loginResponse = await api.user.login({
            username: 'admin',
            password: '123456',
            rememberMe: true,
        });

        console.log('登录成功:', loginResponse.data.data);

        // 获取用户信息
        const userResponse = await api.user.getCurrentUser();
        console.log('用户信息:', userResponse.data.data);

    } catch (error) {
        console.error('API调用失败:', error);
    }
};

// ==================== 异步并行管理器使用示例 ====================

// 2. 使用asyncParallelManager防止重复请求
export const parallelManagerExample = async () => {
    // 创建一个管理器实例
    const getProductList = asyncParallelManager(async (category: string) => {
        // 模拟API请求
        const response = await api.user.getUserList({ search: category });
        return response.data.data;
    });

    // 同时发起多个相同的请求，但实际只会执行一次
    const promises = [
        getProductList.fetch('electronics'),
        getProductList.fetch('electronics'), // 这个不会重复请求
        getProductList.fetch('electronics'), // 这个也不会重复请求
    ];

    const results = await Promise.all(promises);
    console.log('所有请求得到相同结果:', results);

    // 获取缓存的数据
    const cachedData = getProductList.get();
    console.log('缓存数据:', cachedData);

    // 强制重新请求
    const freshData = await getProductList.refetch('electronics');
    console.log('重新请求的数据:', freshData);
};

// 3. 使用预定义的管理器
export const predefinedManagerExample = async () => {
    // 使用预定义的用户信息管理器
    const userInfo1 = await getCurrentUserManager.fetch();
    const userInfo2 = await getCurrentUserManager.fetch(); // 不会重复请求

    console.log('用户信息:', userInfo1);
    console.log('相同的用户信息:', userInfo2);
};

// ==================== 可取消请求使用示例 ====================

// 4. 使用makeCancelable取消重复请求
export const cancelableRequestExample = async () => {
    const searchUsers = async (keyword: string) => {
        // 使用makeCancelable包装请求，相同key的请求会取消之前的
        return makeCancelable(
            api.user.getUserList({ search: keyword }).then(res => res.data.data),
            'search-users' // 取消键
        );
    };

    try {
        // 快速连续搜索，前面的请求会被自动取消
        searchUsers('john');
        searchUsers('jane');
        const result = await searchUsers('admin'); // 只有这个会真正执行

        console.log('搜索结果:', result);
    } catch (error) {
        console.log('请求被取消或失败:', error);
    }
};

// ==================== 高级使用模式 ====================

// 5. 组合使用模式
export const advancedUsageExample = () => {
    // 创建带有取消功能的并行管理器
    const createAdvancedManager = <T>(apiCall: (...args: any[]) => Promise<T>) => {
        const manager = asyncParallelManager(apiCall);

        return {
            // 原有功能
            fetch: manager.fetch,
            refetch: manager.refetch,
            get: manager.get,

            // 添加可取消功能
            fetchCancelable: (key: string, ...args: any[]) => {
                return makeCancelable(manager.fetch(...args), key);
            },
        };
    };

    // 使用示例
    const advancedUserManager = createAdvancedManager((id: number) =>
        api.user.getCurrentUser().then(res => res.data.data)
    );

    return {
        // 普通请求
        getUser: () => advancedUserManager.fetch(1),

        // 可取消的请求
        getUserCancelable: () => advancedUserManager.fetchCancelable('get-user', 1),

        // 获取缓存
        getCachedUser: () => advancedUserManager.get(),
    };
};

// ==================== 实际业务场景示例 ====================

// 6. 搜索功能实现
export const createSearchManager = () => {
    const searchManager = asyncParallelManager((keyword: string) =>
        api.user.getUserList({ search: keyword }).then(res => res.data.data)
    );

    return {
        // 搜索方法
        search: (keyword: string) => {
            // 使用取消功能避免竞态条件
            return makeCancelable(
                searchManager.fetch(keyword),
                'user-search'
            );
        },

        // 清除搜索缓存
        clearCache: () => {
            // 注意：这里需要根据实际的管理器实现来清除缓存
            // 当前的实现没有提供清除缓存的方法，可以通过重新创建管理器实现
        },
    };
};

// 7. 数据预加载示例
export const dataPreloadExample = () => {
    // 页面加载时预加载用户信息
    const preloadUserData = () => {
        getCurrentUserManager.fetch(); // 预加载，不等待结果
    };

    // 在需要时获取用户信息（可能已经缓存）
    const getUserWhenNeeded = async () => {
        const user = await getCurrentUserManager.fetch();
        return user;
    };

    return {
        preloadUserData,
        getUserWhenNeeded,
    };
}; 