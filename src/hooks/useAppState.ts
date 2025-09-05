import { useState, useCallback } from 'react';

// 应用状态接口
interface AppState {
    loading: boolean;
    error: string | null;
    appName: string;
    version: string;
}

// 应用状态Hook
export const useAppState = () => {
    const [state, setState] = useState<AppState>({
        loading: false,
        error: null,
        appName: 'React Base App',
        version: '1.0.0',
    });

    // 设置加载状态
    const setLoading = useCallback((loading: boolean) => {
        setState(prev => ({ ...prev, loading }));
    }, []);

    // 设置错误信息
    const setError = useCallback((error: string | null) => {
        setState(prev => ({ ...prev, error }));
    }, []);

    // 清除错误
    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    // 重置状态
    const reset = useCallback(() => {
        setState({
            loading: false,
            error: null,
            appName: 'React Base App',
            version: '1.0.0',
        });
    }, []);

    return {
        ...state,
        setLoading,
        setError,
        clearError,
        reset,
    };
};
