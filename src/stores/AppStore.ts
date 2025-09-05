import { makeAutoObservable } from 'mobx';

export class AppStore {
    // 应用基础状态
    loading = false;
    error: string | null = null;
    appName = 'React Base App';
    version = '1.0.0';

    constructor() {
        makeAutoObservable(this);
    }

    // 设置加载状态
    setLoading = (loading: boolean) => {
        this.loading = loading;
    };

    // 设置错误信息
    setError = (error: string | null) => {
        this.error = error;
    };

    // 清除错误
    clearError = () => {
        this.error = null;
    };

    // 重置store
    reset = () => {
        this.loading = false;
        this.error = null;
        this.appName = 'React Base App';
        this.version = '1.0.0';
    };
}
