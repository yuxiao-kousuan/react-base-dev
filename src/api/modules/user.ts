import { request } from '../http';
import asyncParallelManager from '../asyncManager';

// 用户信息类型定义
export interface UserInfo {
    id: number;
    username: string;
    email: string;
    avatar?: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

// 登录请求参数
export interface LoginParams {
    username: string;
    password: string;
    rememberMe?: boolean;
}

// 登录响应数据
export interface LoginResponse {
    token: string;
    user: UserInfo;
    expiresIn: number;
}

// 注册请求参数
export interface RegisterParams {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

// 用户列表查询参数
export interface UserListParams {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: string;
}

// 用户列表响应
export interface UserListResponse {
    list: UserInfo[];
    total: number;
    page: number;
    pageSize: number;
}

// 基础API函数
const userApi = {
    // 用户登录
    login: (params: LoginParams) => {
        return request.post<LoginResponse>('/auth/login', params, {
            showLoading: true,
            showError: true,
        });
    },

    // 用户注册
    register: (params: RegisterParams) => {
        return request.post<UserInfo>('/auth/register', params, {
            showLoading: true,
            showError: true,
        });
    },

    // 获取当前用户信息
    getCurrentUser: () => {
        return request.get<UserInfo>('/user/profile', {
            showError: true,
        });
    },

    // 更新用户信息
    updateProfile: (params: Partial<UserInfo>) => {
        return request.put<UserInfo>('/user/profile', params, {
            showLoading: true,
            showError: true,
        });
    },

    // 获取用户列表
    getUserList: (params: UserListParams = {}) => {
        return request.get<UserListResponse>('/user/list', {
            params,
            showError: true,
        });
    },

    // 删除用户
    deleteUser: (userId: number) => {
        return request.delete<boolean>(`/user/${userId}`, {
            showLoading: true,
            showError: true,
        });
    },

    // 重置密码
    resetPassword: (userId: number, newPassword: string) => {
        return request.post<boolean>('/user/reset-password', {
            userId,
            newPassword,
        }, {
            showLoading: true,
            showError: true,
        });
    },
};

// 使用异步管理器优化的API
// 获取当前用户信息 - 防止重复请求
export const getCurrentUserManager = asyncParallelManager(() =>
    userApi.getCurrentUser().then(response => response.data.data)
);

// 获取用户列表 - 防止重复请求
export const getUserListManager = asyncParallelManager((params: UserListParams = {}) =>
    userApi.getUserList(params).then(response => response.data.data)
);

// 导出API
export default userApi; 