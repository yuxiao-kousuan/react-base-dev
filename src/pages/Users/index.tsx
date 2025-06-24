import React, { useState, useEffect } from 'react';
import { fetchUserInfo, refetchUserInfo, getCachedUserInfo } from '@src/services/mock';
import './index.less';

interface UserInfo {
    userId: number;
    name: string;
}

const Users: React.FC = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [cachedUserInfo, setCachedUserInfo] = useState<UserInfo | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [requestCount, setRequestCount] = useState(0);
    const [lastRequestTime, setLastRequestTime] = useState<string>('');

    useEffect(() => {
        updateCachedInfo();
    }, []);

    const handleFetchUserInfo = async () => {
        try {
            setLoading(true);
            setError(null);
            setRequestCount(prev => prev + 1);
            setLastRequestTime(new Date().toLocaleTimeString());

            console.log('📡 发起智能请求...');
            const response = await fetchUserInfo();
            console.log('✅ 智能请求完成:', response);

            if (response.data) {
                setUserInfo(response.data);
            }

            updateCachedInfo();
        } catch (err) {
            setError(err instanceof Error ? err.message : '获取用户信息失败');
            console.error('❌ 智能请求失败:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRefetchUserInfo = async () => {
        try {
            setLoading(true);
            setError(null);
            setRequestCount(prev => prev + 1);
            setLastRequestTime(new Date().toLocaleTimeString());

            console.log('🔄 发起强制刷新请求...');
            const response = await refetchUserInfo();
            console.log('✅ 强制刷新完成:', response);

            if (response.data) {
                setUserInfo(response.data);
            }

            updateCachedInfo();
        } catch (err) {
            setError(err instanceof Error ? err.message : '刷新用户信息失败');
            console.error('❌ 强制刷新失败:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateCachedInfo = () => {
        console.log('💾 获取缓存数据...');
        const cachedResponse = getCachedUserInfo();
        console.log('✅ 缓存数据:', cachedResponse);

        if (cachedResponse && cachedResponse.data) {
            setCachedUserInfo(cachedResponse.data);
        } else {
            setCachedUserInfo(undefined);
        }
    };

    const handleConcurrentRequests = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🚀 发起并发请求测试（3个同时请求）...');

            const startTime = Date.now();

            const promises = [
                fetchUserInfo(),
                fetchUserInfo(),
                fetchUserInfo()
            ];

            const results = await Promise.all(promises);
            const endTime = Date.now();

            console.log('✅ 并发请求完成，耗时:', endTime - startTime, 'ms');
            console.log('✅ 3个请求结果:', results);
            console.log('💡 注意：实际只发起了一次网络请求！');

            if (results[0] && results[0].data) {
                setUserInfo(results[0].data);
            }

            setRequestCount(prev => prev + 3);
            setLastRequestTime(new Date().toLocaleTimeString());
            updateCachedInfo();
        } catch (err) {
            setError(err instanceof Error ? err.message : '并发请求测试失败');
            console.error('❌ 并发请求失败:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="users-page">
            <h1>🧪 用户信息管理</h1>

            <div className="users-container">
                {/* 用户信息显示 */}
                <div className="user-info-section">
                    <h2>当前用户信息</h2>
                    {userInfo ? (
                        <div className="user-card">
                            <div className="user-avatar">
                                <span>{userInfo.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="user-details">
                                <h3>{userInfo.name}</h3>
                                <p><strong>用户ID:</strong> {userInfo.userId}</p>
                                <p><small>最后更新: {lastRequestTime}</small></p>
                            </div>
                        </div>
                    ) : (
                        <div className="no-user">
                            <p>暂无用户信息</p>
                        </div>
                    )}
                </div>

                {/* 缓存信息显示 */}
                <div className="cache-section">
                    <h2>缓存状态</h2>
                    {cachedUserInfo ? (
                        <div className="cache-card">
                            <div className="cache-icon">💾</div>
                            <div className="cache-details">
                                <p><strong>已缓存用户:</strong> {cachedUserInfo.name}</p>
                                <p><strong>用户ID:</strong> {cachedUserInfo.userId}</p>
                                <button onClick={updateCachedInfo} className="cache-btn">
                                    🔍 检查缓存
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="no-cache">
                            <p>💾 暂无缓存数据</p>
                        </div>
                    )}
                </div>

                {/* 操作按钮区域 */}
                <div className="actions-section">
                    <h2>操作面板</h2>
                    <div className="action-buttons">
                        <button
                            onClick={handleFetchUserInfo}
                            disabled={loading}
                            className="action-btn smart-fetch"
                            title="智能请求：会使用缓存，防止重复请求"
                        >
                            📡 智能获取用户信息
                        </button>

                        <button
                            onClick={handleRefetchUserInfo}
                            disabled={loading}
                            className="action-btn force-refresh"
                            title="强制刷新：绕过缓存，每次都发起新请求"
                        >
                            🔄 强制刷新用户信息
                        </button>

                        <button
                            onClick={handleConcurrentRequests}
                            disabled={loading}
                            className="action-btn concurrent-test"
                            title="并发测试：同时发起多个相同请求，验证去重机制"
                        >
                            🚀 并发请求测试
                        </button>
                    </div>
                </div>

                {/* 状态显示 */}
                <div className="status-section">
                    <h2>请求状态</h2>
                    <div className="status-display">
                        {loading && (
                            <div className="status-item loading">
                                <span className="status-icon">⏳</span>
                                <span>请求中...</span>
                            </div>
                        )}
                        {error && (
                            <div className="status-item error">
                                <span className="status-icon">❌</span>
                                <span>错误: {error}</span>
                            </div>
                        )}
                        <div className="status-item stats">
                            <span className="status-icon">📊</span>
                            <span>已发起请求次数: {requestCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Users; 