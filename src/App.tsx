import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import appStore from './store/AppStore';
import TodoItem from './components/TodoItem';
import { fetchUserInfo, refetchUserInfo, getCachedUserInfo } from '@src/services/mock';
import './App.less';

/**
 * 用户信息数据类型定义
 */
export interface UserInfo {
    userId: number;
    name: string;
}

const App: React.FC = observer(() => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [cachedUserInfo, setCachedUserInfo] = useState<UserInfo | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestCount, setRequestCount] = useState(0);
  const [lastRequestTime, setLastRequestTime] = useState<string>('');

  useEffect(() => {
    // 页面加载时自动获取用户信息（智能请求）
    handleFetchUserInfo();
  }, []);

  // 场景1: 智能请求 - 会使用缓存，防止重复请求
  const handleFetchUserInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      setRequestCount(prev => prev + 1);
      setLastRequestTime(new Date().toLocaleTimeString());

      console.log('📡 发起智能请求...');
      const response = await fetchUserInfo();
      console.log('✅ 智能请求完成:', response);

      // 从响应中提取用户信息
      if (response.data) {
        setUserInfo(response.data);
      }

      // 更新缓存显示
      updateCachedInfo();
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取用户信息失败');
      console.error('❌ 智能请求失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 场景2: 强制刷新 - 绕过缓存，每次都发起新请求
  const handleRefetchUserInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      setRequestCount(prev => prev + 1);
      setLastRequestTime(new Date().toLocaleTimeString());

      console.log('🔄 发起强制刷新请求...');
      const response = await refetchUserInfo();
      console.log('✅ 强制刷新完成:', response);

      // 从响应中提取用户信息
      if (response.data) {
        setUserInfo(response.data);
      }

      // 更新缓存显示
      updateCachedInfo();
    } catch (err) {
      setError(err instanceof Error ? err.message : '刷新用户信息失败');
      console.error('❌ 强制刷新失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 场景3: 获取缓存数据 - 同步方法，不发起网络请求
  const updateCachedInfo = () => {
    console.log('💾 获取缓存数据...');
    const cachedResponse = getCachedUserInfo();
    console.log('✅ 缓存数据:', cachedResponse);

    // 从缓存的响应中提取用户信息
    if (cachedResponse && cachedResponse.data) {
      setCachedUserInfo(cachedResponse.data);
    } else {
      setCachedUserInfo(undefined);
    }
  };

  // 场景5: 测试并发请求去重 - 同时发起多个请求，验证只执行一次
  const handleConcurrentRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🚀 发起并发请求测试（3个同时请求）...');

      const startTime = Date.now();

      // 同时发起3个相同的请求
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

      // 从第一个响应中提取用户信息
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

  const handleAddTodo = () => {
    if (newTodoTitle.trim()) {
      appStore.addTodo(newTodoTitle.trim());
      setNewTodoTitle('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  return (
    <div className="app">
      <h1>Todo 应用 - React + MobX + TypeScript</h1>

      {/* 用户信息管理演示区域 */}
      <div className="user-info-demo">
        <h2>🧪 用户信息 API 调用演示</h2>

        {/* 用户信息显示 */}
        <div className="user-info-display">
          <h3>当前用户信息:</h3>
          {userInfo ? (
            <div className="user-card">
              <p><strong>用户ID:</strong> {userInfo.userId}</p>
              <p><strong>用户名:</strong> {userInfo.name}</p>
              <p><small>最后更新: {lastRequestTime}</small></p>
            </div>
          ) : (
            <p className="no-data">暂无用户信息</p>
          )}
        </div>

        {/* 缓存信息显示 */}
        <div className="cache-info">
          <h3>缓存状态:</h3>
          {cachedUserInfo ? (
            <div className="cache-card">
              <p>💾 已缓存用户: {cachedUserInfo.name} (ID: {cachedUserInfo.userId})</p>
              <button onClick={updateCachedInfo} className="cache-btn">
                🔍 检查缓存
              </button>
            </div>
          ) : (
            <p className="no-cache">💾 暂无缓存数据</p>
          )}
        </div>

        {/* 操作按钮区域 */}
        <div className="api-buttons">
          <button
            onClick={handleFetchUserInfo}
            disabled={loading}
            className="smart-fetch-btn"
            title="智能请求：会使用缓存，防止重复请求"
          >
            📡 智能获取用户信息
          </button>

          <button
            onClick={handleRefetchUserInfo}
            disabled={loading}
            className="force-refresh-btn"
            title="强制刷新：绕过缓存，每次都发起新请求"
          >
            🔄 强制刷新用户信息
          </button>

          <button
            onClick={handleConcurrentRequests}
            disabled={loading}
            className="concurrent-test-btn"
            title="并发测试：同时发起3个请求，验证去重机制"
          >
            🚀 并发请求测试
          </button>
        </div>

        {/* 请求状态显示 */}
        <div className="request-status">
          <p><strong>请求次数:</strong> {requestCount}</p>
          {loading && <p className="loading">⏳ 请求中...</p>}
          {error && <p className="error">❌ {error}</p>}
        </div>

        {/* 使用说明 */}
        <div className="usage-guide">
          <h4>📖 使用说明:</h4>
          <ul>
            <li><strong>智能获取:</strong> 首次请求后会缓存结果，后续相同请求直接返回缓存</li>
            <li><strong>强制刷新:</strong> 每次都发起新的网络请求，获取最新数据</li>
            <li><strong>代理诊断:</strong> 测试代理配置是否正常工作，检查直接访问和代理访问</li>
            <li><strong>并发测试:</strong> 同时发起多个相同请求，实际只会执行一次网络请求</li>
            <li><strong>缓存检查:</strong> 同步获取当前缓存的数据，不发起网络请求</li>
          </ul>
        </div>
      </div>

      {/* 原有的 Todo 功能 */}
      {/* 统计信息 */}
      <div className="stats">
        <span>总计: {appStore.todos.length}</span>
        <span>未完成: {appStore.uncompletedTodosCount}</span>
        <span>已完成: {appStore.completedTodosCount}</span>
      </div>

      {/* 添加新待办事项 */}
      <div className="add-todo">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入新的待办事项..."
          className="todo-input"
        />
        <button onClick={handleAddTodo} className="add-btn">
          添加
        </button>
      </div>

      {/* 从 API 获取数据的按钮 */}
      <div className="api-actions">
        <button
          onClick={appStore.fetchTodos}
          disabled={appStore.loading}
          className="fetch-btn"
        >
          {appStore.loading ? '加载中...' : '从 API 获取示例数据'}
        </button>
        {appStore.error && <div className="error">{appStore.error}</div>}
      </div>

      {/* 待办事项列表 */}
      <div className="todo-list">
        {appStore.todos.length === 0 ? (
          <p className="empty-message">暂无待办事项</p>
        ) : (
          appStore.todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={appStore.toggleTodo}
              onDelete={appStore.deleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
});

export default App;
