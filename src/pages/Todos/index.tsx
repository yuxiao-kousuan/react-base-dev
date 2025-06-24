import React, { useState } from 'react';
import { observer } from 'mobx-react';
import appStore from '@src/store/AppStore';
import TodoItem from '@src/components/TodoItem';
import './index.less';

const Todos: React.FC = observer(() => {
    const [newTodoTitle, setNewTodoTitle] = useState('');

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

    const handleFetchTodos = () => {
        appStore.fetchTodos();
    };

    return (
        <div className="todos-page">
            <h1>📝 待办事项管理</h1>

            <div className="todos-container">
                {/* 添加新任务区域 */}
                <div className="add-todo-section">
                    <h2>添加新任务</h2>
                    <div className="add-todo-form">
                        <input
                            type="text"
                            value={newTodoTitle}
                            onChange={(e) => setNewTodoTitle(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="输入新的待办事项..."
                            className="todo-input"
                        />
                        <button onClick={handleAddTodo} className="add-btn">
                            ➕ 添加任务
                        </button>
                    </div>
                </div>

                {/* 操作区域 */}
                <div className="actions-section">
                    <h2>操作面板</h2>
                    <div className="action-buttons">
                        <button
                            onClick={handleFetchTodos}
                            disabled={appStore.loading}
                            className="action-btn fetch-btn"
                        >
                            {appStore.loading ? '⏳ 加载中...' : '🌐 从API获取示例数据'}
                        </button>
                    </div>
                    {appStore.error && (
                        <div className="error-message">
                            ❌ {appStore.error}
                        </div>
                    )}
                </div>

                {/* 待办事项列表 */}
                <div className="todo-list-section">
                    <h2>待办事项列表</h2>
                    <div className="todo-list">
                        {appStore.todos.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📝</div>
                                <p>还没有待办事项</p>
                                <p className="empty-hint">添加一个新任务开始管理你的待办事项吧！</p>
                            </div>
                        ) : (
                            <div className="todo-items">
                                {appStore.todos.map((todo) => (
                                    <TodoItem
                                        key={todo.id}
                                        todo={todo}
                                        onToggle={appStore.toggleTodo}
                                        onDelete={appStore.deleteTodo}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 统计信息 */}
                <div className="stats-section">
                    <h2>统计信息</h2>
                    <div className="stats-grid">
                        <div className="stat-card total">
                            <div className="stat-icon">📊</div>
                            <div className="stat-content">
                                <div className="stat-number">{appStore.todos.length}</div>
                                <div className="stat-label">总计</div>
                            </div>
                        </div>

                        <div className="stat-card completed">
                            <div className="stat-icon">✅</div>
                            <div className="stat-content">
                                <div className="stat-number">{appStore.completedTodosCount}</div>
                                <div className="stat-label">已完成</div>
                            </div>
                        </div>

                        <div className="stat-card pending">
                            <div className="stat-icon">⏳</div>
                            <div className="stat-content">
                                <div className="stat-number">{appStore.uncompletedTodosCount}</div>
                                <div className="stat-label">待完成</div>
                            </div>
                        </div>

                        <div className="stat-card progress">
                            <div className="stat-icon">📈</div>
                            <div className="stat-content">
                                <div className="stat-number">
                                    {appStore.todos.length > 0
                                        ? Math.round((appStore.completedTodosCount / appStore.todos.length) * 100)
                                        : 0}%
                                </div>
                                <div className="stat-label">完成度</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Todos; 