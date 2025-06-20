import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// 请求配置接口
export interface ApiRequestConfig extends AxiosRequestConfig {
    showLoading?: boolean;
    showError?: boolean;
}

// 响应数据接口
export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
    success: boolean;
}

// 创建axios实例
const createHttpInstance = (baseConfig?: AxiosRequestConfig): AxiosInstance => {
    const instance = axios.create({
        baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
        ...baseConfig,
    });

    // 请求拦截器
    instance.interceptors.request.use(
        (config) => {
            // 添加token
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            // 这里可以添加loading状态
            const customConfig = config as ApiRequestConfig;
            if (customConfig.showLoading) {
                // 显示loading
                console.log('Request started, showing loading...');
            }

            return config;
        },
        (error: AxiosError) => {
            return Promise.reject(error);
        }
    );

    // 响应拦截器
    instance.interceptors.response.use(
        (response: AxiosResponse<ApiResponse>) => {
            const customConfig = response.config as ApiRequestConfig;

            // 隐藏loading
            if (customConfig.showLoading) {
                console.log('Request completed, hiding loading...');
            }

            const { data } = response;

            // 统一处理响应
            if (data.success || data.code === 200) {
                return response;
            } else {
                // 业务错误处理
                const error = new Error(data.message || '请求失败');
                return Promise.reject(error);
            }
        },
        (error: AxiosError) => {
            const customConfig = error.config as ApiRequestConfig;

            // 隐藏loading
            if (customConfig?.showLoading) {
                console.log('Request failed, hiding loading...');
            }

            // 网络错误处理
            if (error.response) {
                const { status, data } = error.response;

                switch (status) {
                    case 401:
                        // 未授权，清除token并跳转登录
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                        break;
                    case 403:
                        console.error('权限不足');
                        break;
                    case 404:
                        console.error('请求的资源不存在');
                        break;
                    case 500:
                        console.error('服务器内部错误');
                        break;
                    default:
                        console.error(`请求错误: ${status}`);
                }

                if (customConfig?.showError) {
                    const errorMessage = (data as any)?.message || '请求失败';
                    console.error(errorMessage);
                }
            } else if (error.request) {
                console.error('网络错误，请检查网络连接');
            } else {
                console.error('请求配置错误');
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

// 默认实例
export const http = createHttpInstance();

// 导出创建实例的方法，用于创建不同配置的实例
export { createHttpInstance };

// 常用的请求方法封装
export const request = {
    get: <T = any>(url: string, config?: ApiRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
        return http.get(url, config);
    },

    post: <T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
        return http.post(url, data, config);
    },

    put: <T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
        return http.put(url, data, config);
    },

    delete: <T = any>(url: string, config?: ApiRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
        return http.delete(url, config);
    },

    patch: <T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
        return http.patch(url, data, config);
    },
}; 