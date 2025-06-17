import { makeAutoObservable } from 'mobx';
import axios from 'axios';

export interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

class AppStore {
    todos: Todo[] = [];
    loading = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    // 添加待办事项
    addTodo = (title: string) => {
        const newTodo: Todo = {
            id: Date.now(),
            title,
            completed: false,
        };
        this.todos.push(newTodo);
    };

    // 切换待办事项状态
    toggleTodo = (id: number) => {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
        }
    };

    // 删除待办事项
    deleteTodo = (id: number) => {
        this.todos = this.todos.filter(t => t.id !== id);
    };

    // 从 API 获取数据示例
    fetchTodos = async () => {
        this.loading = true;
        this.error = null;
        try {
            // 使用 JSONPlaceholder 作为示例 API
            const response = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5');
            this.todos = response.data;
        } catch (error) {
            this.error = '获取数据失败';
            console.error('Error fetching todos:', error);
        } finally {
            this.loading = false;
        }
    };

    // 计算属性：未完成的待办事项数量
    get uncompletedTodosCount() {
        return this.todos.filter(todo => !todo.completed).length;
    }

    // 计算属性：已完成的待办事项数量
    get completedTodosCount() {
        return this.todos.filter(todo => todo.completed).length;
    }
}

export default new AppStore(); 