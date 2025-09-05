import React from 'react';
import { observer } from 'mobx-react';
import { appStore, welcomePageStore } from '@src/stores';

// 示例1: 使用所有stores
const AllStoresExample: React.FC = () => {
    return (
        <div>
            <h3>所有Stores示例</h3>
            <p>应用名称: {appStore.appName}</p>
            <p>加载状态: {appStore.loading ? '加载中...' : '完成'}</p>
            <p>页面可见: {welcomePageStore.isVisible ? '是' : '否'}</p>
            <p>用户已交互: {welcomePageStore.hasInteracted ? '是' : '否'}</p>
            <button onClick={() => appStore.setLoading(!appStore.loading)}>
                切换加载状态
            </button>
        </div>
    );
};

// 示例2: 只使用AppStore
const AppStoreExample: React.FC = () => {
    return (
        <div>
            <h3>AppStore示例</h3>
            <p>应用名称: {appStore.appName}</p>
            <p>版本: {appStore.version}</p>
            <p>加载状态: {appStore.loading ? '加载中...' : '完成'}</p>
            <button onClick={() => appStore.setError('测试错误')}>
                设置错误
            </button>
            <button onClick={() => appStore.clearError()}>
                清除错误
            </button>
        </div>
    );
};

// 示例3: 只使用WelcomePageStore
const WelcomePageStoreExample: React.FC = () => {
    return (
        <div>
            <h3>WelcomePageStore示例</h3>
            <p>页面可见: {welcomePageStore.isVisible ? '是' : '否'}</p>
            <p>当前步骤: {welcomePageStore.currentStep}</p>
            <p>动画完成: {welcomePageStore.animationComplete ? '是' : '否'}</p>
            <p>用户已交互: {welcomePageStore.hasInteracted ? '是' : '否'}</p>
            <button onClick={welcomePageStore.handleStartDevelopment}>
                开始开发
            </button>
            <button onClick={welcomePageStore.handleViewDocumentation}>
                查看文档
            </button>
        </div>
    );
};

// 直接使用observer包裹组件
export const AllStoresExampleWithStores = observer(AllStoresExample);
export const AppStoreExampleWithStore = observer(AppStoreExample);
export const WelcomePageStoreExampleWithStore = observer(WelcomePageStoreExample);
