import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 动态导入页面组件
const Home = lazy(() => import('@src/pages/Home'));
const Users = lazy(() => import('@src/pages/Users'));
const Todos = lazy(() => import('@src/pages/Todos'));
const Settings = lazy(() => import('@src/pages/Settings'));

// 加载中组件
const LoadingSpinner: React.FC = () => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f7fa'
    }}>
        <div style={{ textAlign: 'center' }}>
            <div style={{
                width: '50px',
                height: '50px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #007bff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px'
            }}></div>
            <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>页面加载中...</p>
        </div>
    </div>
);

// 路由配置类型
export interface RouteConfig {
    path: string;
    element: React.ComponentType;
    title: string;
    icon: string;
    showInMenu?: boolean;
}

// 路由配置数组
export const routeConfig: RouteConfig[] = [
    {
        path: '/',
        element: Home,
        title: '首页',
        icon: '🏠',
        showInMenu: true,
    },
    {
        path: '/users',
        element: Users,
        title: '用户管理',
        icon: '👥',
        showInMenu: true,
    },
    {
        path: '/todos',
        element: Todos,
        title: '待办事项',
        icon: '📝',
        showInMenu: true,
    },
    {
        path: '/settings',
        element: Settings,
        title: '设置',
        icon: '⚙️',
        showInMenu: true,
    },
];

// 路由组件
const AppRouter: React.FC = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                {routeConfig.map(({ path, element: Component }) => (
                    <Route
                        key={path}
                        path={path}
                        element={<Component />}
                    />
                ))}
                {/* 默认重定向到首页 */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
};

export default AppRouter; 