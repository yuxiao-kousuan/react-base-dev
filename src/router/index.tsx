import { lazy, ComponentType, ReactElement } from "react";
import { DashboardOutlined } from "@ant-design/icons";

interface RouteConfig {
    path: string;
    component: ComponentType<any>;
    title: string;
    group: string;
    icon?: string | ReactElement;
    showInMenu?: boolean;
    children?: RouteConfig[];
}

const routes: RouteConfig[] = [
    {
        path: '/',
        component: lazy(() => import('@src/page/WelcomePage')),
        title: '欢迎你哦',
        icon: <DashboardOutlined />,
        showInMenu: true,
        group: 'Navigation'
    },
    {
        path: '/dashboard',
        component: lazy(() => import('@src/page/Dashboard')),
        title: '仪表盘',
        icon: '📊',
        showInMenu: true,
        group: 'Navigation'
    },
    {
        path: '/users',
        component: lazy(() => import('@src/page/Users')),
        title: '用户管理',
        icon: '👥',
        showInMenu: true,
        group: 'Navigation'
    },
    {
        path: '/settings',
        component: lazy(() => import('@src/page/Settings')),
        title: '系统设置',
        icon: '⚙️',
        showInMenu: true,
        group: 'Authentication'
    },
    {
        path: '/antd-demo',
        component: lazy(() => import('@src/components/AntdDemo')),
        title: 'Ant Design 演示',
        icon: '🎨',
        showInMenu: true,
        group: 'Utilities'
    },
    {
        path: '/adaptive-layout',
        component: lazy(() => import('@src/page/AdaptiveLayoutDemo')),
        title: '自适应布局',
        icon: '📐',
        showInMenu: true,
        group: 'Utilities'
    },
    {
        path: '/virtual-meeting',
        component: lazy(() => import('@src/page/VirtualMeetingRoom')),
        title: '虚拟会议室',
        icon: '🎥',
        showInMenu: true,
        group: 'Navigation'
    }
];

export default routes;
export type { RouteConfig };