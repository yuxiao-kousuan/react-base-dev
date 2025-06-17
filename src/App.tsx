import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import appStore from './store/AppStore';
import TodoItem from './components/TodoItem';
import './App.less';

const App: React.FC = observer(() => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    // 组件挂载时可以选择性地从 API 获取数据
    // appStore.fetchTodos();
  }, []);

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
