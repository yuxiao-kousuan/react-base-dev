import { makeAutoObservable } from 'mobx';

export class UserStore {
    // 用户状态
    users: any[] = [];
    loading = false;
    error: string | null = null;
    currentUser: any = null;

    constructor() {
        makeAutoObservable(this);
    }

    // 获取用户列表
    fetchUsers = async () => {
        this.loading = true;
        this.error = null;
        
        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.users = [
                { id: 1, name: '张三', email: 'zhangsan@example.com' },
                { id: 2, name: '李四', email: 'lisi@example.com' },
                { id: 3, name: '王五', email: 'wangwu@example.com' },
            ];
        } catch (error: any) {
            this.error = error.message;
        } finally {
            this.loading = false;
        }
    };

    // 设置当前用户
    setCurrentUser = (user: any) => {
        this.currentUser = user;
    };

    // 添加用户
    addUser = (user: any) => {
        this.users.push({ ...user, id: Date.now() });
    };

    // 删除用户
    removeUser = (id: number) => {
        this.users = this.users.filter(user => user.id !== id);
    };

    // 重置store
    reset = () => {
        this.users = [];
        this.loading = false;
        this.error = null;
        this.currentUser = null;
    };
}
