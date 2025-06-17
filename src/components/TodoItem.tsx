import React from 'react';
import { observer } from 'mobx-react';
import { Todo } from '../store/AppStore';
import './TodoItem.less';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = observer(({ todo, onToggle, onDelete }) => {
    return (
        <div className="todo-item">
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
                className="todo-checkbox"
            />
            <span
                className={`todo-title ${todo.completed ? 'completed' : ''}`}
                onClick={() => onToggle(todo.id)}
            >
                {todo.title}
            </span>
            <button
                onClick={() => onDelete(todo.id)}
                className="delete-btn"
            >
                删除
            </button>
        </div>
    );
});

export default TodoItem; 