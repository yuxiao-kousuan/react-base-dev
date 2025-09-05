import { makeAutoObservable } from 'mobx';

export class WelcomePageStore {
    // 页面状态
    isVisible = false;
    currentStep = 0;
    animationComplete = false;
    
    // 用户交互状态
    hasInteracted = false;
    lastVisitTime: Date | null = null;
    
    // 页面数据
    features = [
        { id: 1, name: 'React 1118', icon: '⚛️', description: '使用最新的 React 18 特性' },
        { id: 2, name: 'TypeScript', icon: '📘', description: '完整的类型安全支持' },
        { id: 3, name: 'Vite', icon: '⚡', description: '极速的开发体验' },
        { id: 4, name: 'Less', icon: '🎨', description: '强大的样式预处理器' },
        { id: 5, name: 'MobX', icon: '🔄', description: '简单高效的状态管理' },
        { id: 6, name: 'React Router', icon: '🛣️', description: '强大的路由解决方案' },
    ];

    constructor() {
        makeAutoObservable(this);
        this.initializePage();
    }

    /**
     * 初始化页面
     */
    initializePage = () => {
        this.isVisible = true;
        this.lastVisitTime = new Date();
        this.startAnimation();
    };

    /**
     * 开始动画
     */
    startAnimation = () => {
        this.animationComplete = false;
        this.currentStep = 0;
        
        // 模拟动画步骤
        const steps = [0, 1, 2, 3];
        steps.forEach((step, index) => {
            setTimeout(() => {
                this.setCurrentStep(step);
                if (index === steps.length - 1) {
                    this.setAnimationComplete(true);
                }
            }, index * 200);
        });
    };

    /**
     * 设置当前步骤
     */
    setCurrentStep = (step: number) => {
        this.currentStep = step;
    };

    /**
     * 设置动画完成状态
     */
    setAnimationComplete = (complete: boolean) => {
        this.animationComplete = complete;
    };

    /**
     * 用户交互
     */
    handleUserInteraction = () => {
        this.hasInteracted = true;
    };

    /**
     * 开始开发按钮点击
     */
    handleStartDevelopment = () => {
        this.handleUserInteraction();
        console.log('开始开发按钮被点击');
        // 这里可以添加跳转到其他页面的逻辑
    };

    /**
     * 查看文档按钮点击
     */
    handleViewDocumentation = () => {
        this.handleUserInteraction();
        console.log('查看文档按钮被点击');
        // 这里可以添加跳转到文档的逻辑
    };

    /**
     * 获取特性数据
     */
    getFeatures = () => {
        return this.features;
    };

    /**
     * 获取页面统计信息
     */
    getPageStats = () => {
        return {
            isVisible: this.isVisible,
            hasInteracted: this.hasInteracted,
            lastVisitTime: this.lastVisitTime,
            animationComplete: this.animationComplete,
            currentStep: this.currentStep,
        };
    };

    /**
     * 重置store
     */
    reset = () => {
        this.isVisible = false;
        this.currentStep = 0;
        this.animationComplete = false;
        this.hasInteracted = false;
        this.lastVisitTime = null;
    };
}
