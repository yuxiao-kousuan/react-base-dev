import { lazy, ComponentType } from "react";

interface RouteConfig {
    path: string;
    component: ComponentType<any>;
    title: string;
    icon?: string;
    showInMenu?: boolean;
    children?: RouteConfig[];
}

const routes: RouteConfig[] = [
    {
        path: '/',
        component: lazy(() => import('@src/page/WelcomePage')),
        title: '欢迎页',
        icon: '🏠',
        showInMenu: true
    },
    {
        path: '/dashboard',
        component: lazy(() => import('@src/page/Dashboard')),
        title: '仪表盘',
        icon: '📊',
        showInMenu: true
    },
    {
        path: '/users',
        component: lazy(() => import('@src/page/Users')),
        title: '用户管理',
        icon: '👥',
        showInMenu: true
    },
    {
        path: '/settings',
        component: lazy(() => import('@src/page/Settings')),
        title: '系统设置',
        icon: '⚙️',
        showInMenu: true
    },
    {
        path: '/charts',
        component: lazy(() => import('@src/page/Charts')),
        title: '图表分析',
        icon: '📈',
        showInMenu: true
    }
];

export default routes;
export type { RouteConfig };