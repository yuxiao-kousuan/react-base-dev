import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from '@src/page/WelcomePage';

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
        element: WelcomePage,
        title: '欢迎页',
        icon: '🏠',
        showInMenu: true,
    },
];

// 路由组件
const AppRouter: React.FC = () => {
    return (
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
    );
};

export default AppRouter; 