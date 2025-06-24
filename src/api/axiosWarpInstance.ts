import { getHttpClient, initHttpClient } from './axiosInstance';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * HTTP请求方法类型
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

/**
 * 请求配置选项
 */
export interface RequestOptions extends Omit<AxiosRequestConfig, 'method' | 'url' | 'data' | 'params'> {
    type?: HttpMethod;                    // 请求方法，默认GET
    customize?: boolean;                  // 是否使用自定义配置
    showLoading?: boolean;               // 是否显示loading，默认false
    spinProps?: any;                     // loading组件属性
    useGlobalParams?: boolean;           // 是否使用全局参数
    skipGlobalHandler?: boolean;         // 是否跳过全局错误处理
    retryCount?: number;                 // 重试次数，默认0
    timeout?: number;                    // 请求超时时间
    withCredentials?: boolean;           // 是否携带凭证
    responseType?: 'json' | 'blob' | 'text' | 'arraybuffer' | 'document' | 'stream'; // 响应类型
    params?: any;                        // URL查询参数（适用于所有请求方法）
}

/**
 * 通用API响应格式
 */
export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
    success: boolean;
    timestamp?: number;
}

/**
 * 分页查询参数
 */
export interface PaginationParams {
    page?: number;
    pageSize?: number;
    current?: number;
    size?: number;
}

/**
 * 分页响应数据
 */
export interface PaginationResponse<T = any> {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages?: number;
}

/**
 * 文件上传配置
 */
export interface UploadConfig extends RequestOptions {
    onUploadProgress?: (progressEvent: any) => void;
    maxFileSize?: number;              // 最大文件大小（字节）
    allowedTypes?: string[];           // 允许的文件类型
}

/**
 * 检查是否为IE浏览器
 */
const isIE = (): boolean => {
    return !!(window as any).MSInputMethodContext && !!(document as any).documentMode;
};

/**
 * 添加缓存破坏参数（用于IE浏览器GET请求）
 */
const addCacheBuster = (data: any): any => {
    if (isIE()) {
        return { ...data, _t: new Date().getTime() };
    }
    return data;
};

/**
 * 验证文件上传
 */
const validateFile = (file: File, config: UploadConfig): boolean => {
    const { maxFileSize, allowedTypes } = config;

    // 检查文件大小
    if (maxFileSize && file.size > maxFileSize) {
        throw new Error(`文件大小超过限制：${maxFileSize / 1024 / 1024}MB`);
    }

    // 检查文件类型
    if (allowedTypes && allowedTypes.length > 0) {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const mimeType = file.type.toLowerCase();

        const isAllowed = allowedTypes.some(type =>
            type.toLowerCase() === fileExtension ||
            mimeType.includes(type.toLowerCase())
        );

        if (!isAllowed) {
            throw new Error(`不支持的文件类型：${fileExtension}`);
        }
    }

    return true;
};

/**
 * 重试逻辑包装
 */
const withRetry = async <T>(
    requestFn: () => Promise<T>,
    retryCount: number = 0,
    delay: number = 1000
): Promise<T> => {
    try {
        return await requestFn();
    } catch (error) {
        if (retryCount > 0) {
            console.warn(`请求失败，${delay}ms后进行第${retryCount}次重试...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return withRetry(requestFn, retryCount - 1, delay * 2); // 指数退避
        }
        throw error;
    }
};

/**
 * 核心请求包装函数
 * 
 * @param url 请求URL
 * @param data 请求数据
 * @param options 请求配置选项
 * @returns Promise<AxiosResponse>
 */
export async function axiosWarpInstance<T = any>(
    url: string,
    data?: any,
    options: RequestOptions = {}
): Promise<AxiosResponse<T>> {
    const {
        type = 'GET',
        customize = false,
        showLoading = false,
        spinProps,
        retryCount = 0,
        ...restProps
    } = options;

    const method = type.toUpperCase() as HttpMethod;

    // 请求执行函数
    const executeRequest = async (): Promise<AxiosResponse<T>> => {
        initHttpClient(options);
        const httpClient = getHttpClient();

        // 自定义配置模式
        if (customize) {
            return await httpClient.request({
                method: method.toLowerCase(),
                url,
                data,
                showLoading,
                spinProps,
                ...restProps
            } as any);
        }

        // 根据请求方法分类处理
        if (['GET', 'DELETE', 'HEAD', 'OPTIONS'].includes(method)) {
            // GET类请求，数据作为查询参数
            const params = method === 'GET' ? addCacheBuster(data) : data;

            return await httpClient.get(url, {
                params,
                showLoading,
                spinProps,
                ...restProps
            } as any);
        }

        if (['POST', 'PUT', 'PATCH'].includes(method)) {
            // POST类请求，数据作为请求体，同时支持URL查询参数
            const config = {
                showLoading,
                spinProps,
                ...restProps
            } as any;

            // 如果有URL查询参数，添加到配置中
            if (restProps.params) {
                config.params = restProps.params;
            }

            if (method === 'POST') {
                return await httpClient.post(url, data, config);
            } else if (method === 'PUT') {
                return await httpClient.put(url, data, config);
            } else if (method === 'PATCH') {
                return await httpClient.patch(url, data, config);
            }
        }

        throw new Error(`不支持的请求方法: ${method}`);
    };

    // 执行请求（带重试机制）
    return withRetry(executeRequest, retryCount);
}

/**
 * GET请求快捷方法
 */
export const get = <T = any>(
    url: string,
    params?: any,
    options?: Omit<RequestOptions, 'type'>
): Promise<AxiosResponse<T>> => {
    return axiosWarpInstance<T>(url, params, { ...options, type: 'GET' });
};

/**
 * POST请求快捷方法
 */
export const post = <T = any>(
    url: string,
    data?: any,
    options?: Omit<RequestOptions, 'type'>
): Promise<AxiosResponse<T>> => {
    return axiosWarpInstance<T>(url, data, { ...options, type: 'POST' });
};

/**
 * PUT请求快捷方法
 */
export const put = <T = any>(
    url: string,
    data?: any,
    options?: Omit<RequestOptions, 'type'>
): Promise<AxiosResponse<T>> => {
    return axiosWarpInstance<T>(url, data, { ...options, type: 'PUT' });
};


/**
 * DELETE请求快捷方法
 */
export const del = <T = any>(
    url: string,
    params?: any,
    options?: Omit<RequestOptions, 'type'>
): Promise<AxiosResponse<T>> => {
    return axiosWarpInstance<T>(url, params, { ...options, type: 'DELETE' });
};

/**
 * PATCH请求快捷方法
 */
export const patch = <T = any>(
    url: string,
    data?: any,
    options?: Omit<RequestOptions, 'type'>
): Promise<AxiosResponse<T>> => {
    return axiosWarpInstance<T>(url, data, { ...options, type: 'PATCH' });
};

/**
 * PATCH请求（支持URL参数和请求体数据）
 */
export const patchWithParams = <T = any>(
    url: string,
    data?: any,
    params?: Record<string, any>,
    options?: Omit<RequestOptions, 'type' | 'params'>
): Promise<AxiosResponse<T>> => {
    return axiosWarpInstance<T>(url, data, {
        ...options,
        type: 'PATCH',
        params
    });
};

/**
 * 分页查询通用方法
 */
export const getPaginated = <T = any>(
    url: string,
    params: PaginationParams & Record<string, any> = {},
    options?: Omit<RequestOptions, 'type'>
): Promise<AxiosResponse<PaginationResponse<T>>> => {
    const { page = 1, pageSize = 10, ...otherParams } = params;

    return get<PaginationResponse<T>>(url, {
        page,
        pageSize,
        ...otherParams
    }, options);
};

/**
 * 文件上传方法
 */
export const uploadFile = <T = any>(
    url: string,
    file: File | FileList | FormData,
    config: UploadConfig = {}
): Promise<AxiosResponse<T>> => {
    let formData: FormData;

    if (file instanceof FormData) {
        formData = file;
    } else if (file instanceof FileList) {
        formData = new FormData();
        Array.from(file).forEach((f, index) => {
            validateFile(f, config);
            formData.append(`file${index}`, f);
        });
    } else {
        validateFile(file, config);
        formData = new FormData();
        formData.append('file', file);
    }

    return post<T>(url, formData, {
        ...config,
        headers: {
            'Content-Type': 'multipart/form-data',
            ...config.headers
        }
    });
};

/**
 * 文件下载方法
 */
export const downloadFile = async (
    url: string,
    params?: any,
    filename?: string,
    options?: Omit<RequestOptions, 'type' | 'responseType'>
): Promise<void> => {
    const response = await get<Blob>(url, params, {
        ...options,
        responseType: 'blob'
    });

    // 创建下载链接
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;

    // 设置文件名
    if (filename) {
        link.download = filename;
    } else {
        // 尝试从响应头获取文件名
        const contentDisposition = response.headers['content-disposition'];
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (filenameMatch) {
                link.download = filenameMatch[1].replace(/['"]/g, '');
            }
        }
    }

    // 触发下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
};

/**
 * JSON数据导出方法
 */
export const exportJSON = (data: any, filename: string = 'data.json'): void => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

/**
 * 批量请求方法
 */
export const batchRequest = async <T = any>(
    requests: Array<{
        url: string;
        data?: any;
        options?: RequestOptions;
    }>,
    concurrent: number = 5
): Promise<AxiosResponse<T>[]> => {
    const results: AxiosResponse<T>[] = [];

    // 分批处理请求
    for (let i = 0; i < requests.length; i += concurrent) {
        const batch = requests.slice(i, i + concurrent);
        const batchPromises = batch.map(({ url, data, options }) =>
            axiosWarpInstance<T>(url, data, options)
        );

        const batchResults = await Promise.allSettled(batchPromises);

        batchResults.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                results.push(result.value);
            } else {
                console.error(`批量请求失败 [${i + index}]:`, result.reason);
                throw result.reason;
            }
        });
    }

    return results;
};

/**
 * 轮询请求方法
 */
export const pollRequest = <T = any>(
    url: string,
    data?: any,
    options: RequestOptions & {
        interval?: number;           // 轮询间隔（毫秒），默认3000
        maxAttempts?: number;        // 最大尝试次数，默认10
        condition?: (response: AxiosResponse<T>) => boolean; // 停止条件
    } = {}
): Promise<AxiosResponse<T>> => {
    const {
        interval = 3000,
        maxAttempts = 10,
        condition,
        ...requestOptions
    } = options;

    return new Promise((resolve, reject) => {
        let attempts = 0;

        const poll = async () => {
            try {
                attempts++;
                const response = await axiosWarpInstance<T>(url, data, requestOptions);

                // 检查停止条件
                if (condition && condition(response)) {
                    resolve(response);
                    return;
                }

                // 检查最大尝试次数
                if (attempts >= maxAttempts) {
                    reject(new Error(`轮询超过最大尝试次数: ${maxAttempts}`));
                    return;
                }

                // 继续轮询
                setTimeout(poll, interval);
            } catch (error) {
                reject(error);
            }
        };

        poll();
    });
};

// 导出默认方法
export default axiosWarpInstance; 