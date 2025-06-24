import { get } from '@src/api/axiosWarpInstance';
import asyncParallelManager from '@src/api/asyncParalleManager';

const serviesName = '/apifox/mock'

/**
 * 创建异步并行管理器实例
 * 防止重复请求，提供智能缓存和重新请求功能
 */
const userInfoManager = asyncParallelManager((data?: any) => get(`${serviesName}/test`, { apifoxToken: 'IlGWRhhZetq0ok6Z9HaUz' }));

/**
 * 获取用户信息 - 智能请求（会使用缓存）
 * 无论何时同时发起多少个相同的请求，实际上只会执行一次真正的网络请求
 */
export const fetchUserInfo = userInfoManager.fetch;

/**
 * 强制重新获取用户信息 - 绕过缓存
 * 每次调用都会发起新的网络请求，适用于需要强制刷新数据的场景
 */
export const refetchUserInfo = userInfoManager.refetch;

/**
 * 获取缓存的用户信息 - 同步方法
 * 不会发起网络请求，直接返回缓存的数据
 * @param defaultValue 可选的默认值
 * @returns UserInfo | undefined 缓存的用户信息或默认值
 */
export const getCachedUserInfo = userInfoManager.get;
