import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * HTTP客户端配置
 * 提供通用的请求拦截、响应处理和错误管理
 */

// 扩展AxiosRequestConfig接口，添加自定义配置
declare module 'axios' {
    interface AxiosRequestConfig {
        showLoading?: boolean;           // 是否显示loading
        showError?: {                   // 错误显示配置
            isShow: boolean;
            showPopup: boolean;
            title: string;
        };
        skipGlobalHandler?: boolean;     // 是否跳过全局处理
        useGlobalParams?: boolean;       // 是否使用全局参数
        spinProps?: any;                // loading组件属性
    }
}

/**
 * 状态码常量
 */
export const STATUS_CODE = {
    SUCCESS: 200,                // 成功
    UNAUTHENTICATED: 10201,    // 未认证
    UNAUTHORIZED: 10403,       // 无权限
    NOT_FOUND: 10404,          // 未找到
    SERVER_ERROR: 10500,       // 服务器错误
} as const;

/**
 * HTTP客户端配置选项
 */
export interface HttpClientOptions {
    baseURL?: string;
    timeout?: number;
    getToken?: () => string | null;                    // 获取token的方法
    getGlobalParams?: () => Record<string, any>;       // 获取全局参数的方法
    onShowLoading?: (props?: any) => void;             // 显示loading的回调
    onHideLoading?: () => void;                        // 隐藏loading的回调
    onShowMessage?: (type: any, content: string) => void; // 显示消息的回调
    onUnauthorized?: () => void;                       // 未授权处理回调
    shouldHideError?: () => boolean;                   // 是否隐藏错误消息
}

/**
 * 创建HTTP客户端
 */
export const createHttpClient = (options: HttpClientOptions = {}) => {
    const {
        baseURL = '',
        timeout = 1000 * 60 * 3,
        getToken,
        getGlobalParams,
        onShowLoading,
        onHideLoading,
        onShowMessage,
        onUnauthorized,
        shouldHideError = () => false,
    } = options;

    // 创建axios实例
    const axiosInstance = axios.create({
        baseURL,
        timeout,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // 请求拦截器
    axiosInstance.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
            // 设置默认错误显示配置
            const defaultShowError = {
                isShow: false,
                showPopup: false,
                title: '',
            };
            (config as any).showError = Object.assign(defaultShowError, (config as any).showError);

            // 添加认证token
            const token = getToken?.();
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            // 显示loading
            if ((config as any).showLoading !== false && onShowLoading) {
                onShowLoading((config as any).spinProps);
            }

            // 添加全局参数
            if ((config as any).useGlobalParams && getGlobalParams) {
                const globalParams = getGlobalParams();
                config.params = {
                    ...(config.params || {}),
                    ...globalParams,
                };
            }

            return config;
        },
        (error) => {
            // 请求错误时隐藏loading
            if (error.config?.showLoading !== false && onHideLoading) {
                onHideLoading();
            }
            onShowMessage?.('error', error.message || '请求发送失败');
            return Promise.reject(error);
        }
    );

    // 响应拦截器
    axiosInstance.interceptors.response.use(
        (response: AxiosResponse) => {
            const { data, config, headers } = response;

            // 隐藏loading
            if ((config as any).showLoading !== false && onHideLoading) {
                onHideLoading();
            }

            // 处理文件下载等特殊响应
            const contentType = headers['content-type'];
            if (
                contentType === 'application/csv;charset=UTF-8' ||
                contentType === 'application/octet-stream'
            ) {
                return Promise.resolve(data);
            }

            // 跳过全局处理
            if ((config as any).skipGlobalHandler) {
                return Promise.resolve(data);
            }

            // 检查是否隐藏错误
            const hideError = shouldHideError();
            if (hideError && (data.code === STATUS_CODE.SUCCESS || data.code === 10001)) {
                return Promise.resolve(data.data);
            }
            if (hideError) {
                return Promise.reject(data);
            }

            // 处理认证失败
            if (data.code === STATUS_CODE.UNAUTHENTICATED) {
                onShowMessage?.('warning', '用户认证已过期，请重新登录');
                onUnauthorized?.();
                return Promise.reject(data);
            }

            // 默认返回成功响应的数据
            return Promise.resolve(data);
        },
        (error: AxiosError) => {
            // 隐藏loading
            if ((error.config as any)?.showLoading !== false && onHideLoading) {
                onHideLoading();
            }

            // 请求被取消
            if (error.code === 'ERR_CANCELED') {
                return Promise.reject(error.message);
            }

            if (error.response) {
                const hideError = shouldHideError();
                if (hideError) {
                    return Promise.reject(error.response);
                }

                const status = error.response.status;
                const firstDigit = Math.floor(status / 100);

                // 根据HTTP状态码处理错误
                if (firstDigit === 4) {
                    onShowMessage?.('error', '请求失败，请检查网络连接或请求参数');
                } else if (firstDigit === 5) {
                    onShowMessage?.('error', '服务器异常，请稍后重试');
                } else {
                    onShowMessage?.('error', '网络请求失败，请稍后重试');
                }

                return Promise.reject(error.response);
            }

            // 网络错误
            onShowMessage?.('error', '网络连接失败，请检查网络设置');
            return Promise.reject(error);
        }
    );

    return {
        instance: axiosInstance,
        get: axiosInstance.get,
        post: axiosInstance.post,
        put: axiosInstance.put,
        delete: axiosInstance.delete,
        patch: axiosInstance.patch,
        request: axiosInstance.request,
    };
};

// 导出默认实例（需要在应用初始化时配置）
export let defaultHttpClient: ReturnType<typeof createHttpClient>;

/**
 * 初始化默认HTTP客户端
 */
export const initHttpClient = (options: HttpClientOptions) => {
    defaultHttpClient = createHttpClient(options);
    return defaultHttpClient;
};

/**
 * 获取默认HTTP客户端实例
 */
export const getHttpClient = () => {
    if (!defaultHttpClient) {
        throw new Error('HTTP客户端未初始化，请先调用 initHttpClient');
    }
    return defaultHttpClient;
};

export default createHttpClient; 