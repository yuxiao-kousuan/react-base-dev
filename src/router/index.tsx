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
        path: '/virtual-meeting',
        component: lazy(() => import('@src/page/VirtualMeetingRoom')),
        title: '虚拟会议室',
        icon: '🎥',
        showInMenu: true,
        group: 'Navigation'
    },
    {
        path: '/rma-chat',
        component: lazy(() => import('@src/page/RmaAiChat')),
        title: 'RMA聊天',
        icon: '💬',
        showInMenu: true,
        group: 'Navigation'
    }
];

export default routes;
export type { RouteConfig };