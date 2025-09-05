import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { appStore, welcomePageStore } from '@src/stores';
import './index.less';

const WelcomePage: React.FC = () => {
    // 页面加载时初始化
    useEffect(() => {
        appStore.setLoading(true);
        
        // 模拟页面加载
        setTimeout(() => {
            appStore.setLoading(false);
        }, 1000);
    }, []);

    // 获取特性数据
    const features = welcomePageStore.getFeatures();
    const pageStats = welcomePageStore.getPageStats();

    return (
        <div className="welcome-page">
            <div className="welcome-container">
                <div className="welcome-header">
                    <div className="welcome-icon">🚀</div>
                    <h1 className="welcome-title">欢迎使用 React 基础项目</h1>
                    <p className="welcome-subtitle">这是一个干净的 React + TypeScript + Vite 项目模板</p>
                </div>
                
                <div className="welcome-content">
                    <div className="feature-grid">
                        {features.map((feature: { id: number; name: string; icon: string; description: string }) => (
                            <div key={feature.id} className="feature-card">
                                <div className="feature-icon">{feature.icon}</div>
                                <h3>{feature.name}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="welcome-actions">
                        <button 
                            className="action-btn primary"
                            onClick={welcomePageStore.handleStartDevelopment}
                        >
                            开始开发
                        </button>
                        <button 
                            className="action-btn secondary"
                            onClick={welcomePageStore.handleViewDocumentation}
                        >
                            查看文档
                        </button>
                    </div>
                </div>
                
                <div className="welcome-footer">
                    <p>© 2024 React Base Project. 基于 React + TypeScript + Vite 构建</p>
                    {process.env.NODE_ENV === 'development' && (
                        <div style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
                            页面状态: {JSON.stringify(pageStats, null, 2)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// 直接使用observer包裹组件，直接导入store实例
export default observer(WelcomePage);
