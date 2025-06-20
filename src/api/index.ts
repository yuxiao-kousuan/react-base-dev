// 导出HTTP配置和工具
export { http, request, createHttpInstance } from './http';
export type { ApiRequestConfig, ApiResponse } from './http';

// 导出异步管理器
export { default as asyncParallelManager, makeCancelable } from './asyncManager';

// 导出API模块
export { default as userApi } from './modules/user';
export * from './modules/user';

// 统一的API对象，方便使用
import userApi from './modules/user';

export const api = {
    user: userApi,
    // 这里可以继续添加其他模块
    // product: productApi,
    // order: orderApi,
};

// 导出默认API
export default api; 