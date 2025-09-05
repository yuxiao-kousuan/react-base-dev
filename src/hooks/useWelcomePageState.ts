import { useState, useCallback, useEffect } from 'react';

// 欢迎页面状态接口
interface WelcomePageState {
    isVisible: boolean;
    currentStep: number;
    animationComplete: boolean;
    hasInteracted: boolean;
    lastVisitTime: Date | null;
}

// 欢迎页面状态Hook
export const useWelcomePageState = () => {
    const [state, setState] = useState<WelcomePageState>({
        isVisible: false,
        currentStep: 0,
        animationComplete: false,
        hasInteracted: false,
        lastVisitTime: null,
    });

    // 特性数据
    const features = [
        { id: 1, name: 'React 18', icon: '⚛️', description: '使用最新的 React 18 特性' },
        { id: 2, name: 'TypeScript', icon: '📘', description: '完整的类型安全支持' },
        { id: 3, name: 'Vite', icon: '⚡', description: '极速的开发体验' },
        { id: 4, name: 'Less', icon: '🎨', description: '强大的样式预处理器' },
        { id: 5, name: 'React Router', icon: '🛣️', description: '强大的路由解决方案' },
        { id: 6, name: 'Axios', icon: '🌐', description: '强大的HTTP客户端' },
    ];

    // 设置当前步骤
    const setCurrentStep = useCallback((step: number) => {
        setState(prev => ({ ...prev, currentStep: step }));
    }, []);

    // 设置动画完成状态
    const setAnimationComplete = useCallback((complete: boolean) => {
        setState(prev => ({ ...prev, animationComplete: complete }));
    }, []);

    // 用户交互
    const handleUserInteraction = useCallback(() => {
        setState(prev => ({ ...prev, hasInteracted: true }));
    }, []);

    // 开始动画
    const startAnimation = useCallback(() => {
        setAnimationComplete(false);
        setCurrentStep(0);
        
        // 模拟动画步骤
        const steps = [0, 1, 2, 3];
        steps.forEach((step, index) => {
            setTimeout(() => {
                setCurrentStep(step);
                if (index === steps.length - 1) {
                    setAnimationComplete(true);
                }
            }, index * 200);
        });
    }, [setCurrentStep, setAnimationComplete]);

    // 开始开发按钮点击
    const handleStartDevelopment = useCallback(() => {
        handleUserInteraction();
        console.log('开始开发按钮被点击');
        // 这里可以添加跳转到其他页面的逻辑
    }, [handleUserInteraction]);

    // 查看文档按钮点击
    const handleViewDocumentation = useCallback(() => {
        handleUserInteraction();
        console.log('查看文档按钮被点击');
        // 这里可以添加跳转到文档的逻辑
    }, [handleUserInteraction]);

    // 获取特性数据
    const getFeatures = useCallback(() => {
        return features;
    }, [features]);

    // 获取页面统计信息
    const getPageStats = useCallback(() => {
        return {
            isVisible: state.isVisible,
            hasInteracted: state.hasInteracted,
            lastVisitTime: state.lastVisitTime,
            animationComplete: state.animationComplete,
            currentStep: state.currentStep,
        };
    }, [state]);

    // 初始化页面
    const initializePage = useCallback(() => {
        setState(prev => ({
            ...prev,
            isVisible: true,
            lastVisitTime: new Date(),
        }));
        startAnimation();
    }, [startAnimation]);

    // 重置状态
    const reset = useCallback(() => {
        setState({
            isVisible: false,
            currentStep: 0,
            animationComplete: false,
            hasInteracted: false,
            lastVisitTime: null,
        });
    }, []);

    return {
        ...state,
        features,
        setCurrentStep,
        setAnimationComplete,
        handleUserInteraction,
        startAnimation,
        handleStartDevelopment,
        handleViewDocumentation,
        getFeatures,
        getPageStats,
        initializePage,
        reset,
    };
};
