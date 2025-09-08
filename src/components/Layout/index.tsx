import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import RoutesConfig from '@src/router';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BellOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Button, Input, Badge, Avatar, Dropdown, Menu } from 'antd';
import './index.less';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const userMenu = (
        <Menu>
            <Menu.Item key="profile">
                个人资料
            </Menu.Item>
            <Menu.Item key="settings">
                设置
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout">
                退出登录
            </Menu.Item>
        </Menu>
    );

    const isActivePath = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    const filterAndGroupRoutes = RoutesConfig
        .filter(route => route.showInMenu)
        .reduce((acc, curRouter) => {
            const curGroup = curRouter.group;
            if (!acc[curGroup]) {
                acc[curGroup] = [];
            }
            acc[curGroup].push(curRouter);
            return acc;
        }, {} as Record<string, typeof RoutesConfig>);

    return (
        <div className={`layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            {/* 侧边栏 */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <span className="logo-icon">🚀</span>
                        {!sidebarCollapsed && (
                            <span className="logo-text">React</span>
                        )}
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {Object.entries(filterAndGroupRoutes).map(([groupName, routes]) => (
                        <div key={groupName} className="nav-group">
                            {!sidebarCollapsed && (
                                <div className="nav-group-title">{groupName}</div>
                            )}
                            <ul className="nav-list">
                                {routes.map((route) => (
                                    <li key={route.path} className="nav-item">
                                        <Link
                                            to={route.path}
                                            className={`nav-link ${isActivePath(route.path) ? 'active' : ''}`}
                                            title={route.title}
                                        >
                                            <span className="nav-icon">{route.icon}</span>
                                            {!sidebarCollapsed && (
                                                <span className="nav-text">{route.title}</span>
                                            )}
                                            {isActivePath(route.path) && (
                                                <span className="nav-indicator"></span>
                                            )}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    {!sidebarCollapsed && (
                        <div className="footer-info">
                            <p>© 2024 React Base</p>
                            <p>Version 1.0.0</p>
                        </div>
                    )}
                </div>
            </aside >

            {/* 主内容区域 */}
            <main className="main-content">
                {/* 顶部栏 */}
                <header className="top-header">
                    <div className="header-left">
                        <Button
                            onClick={toggleSidebar}
                            title={sidebarCollapsed ? '展开菜单' : '收起菜单'}
                            type='text'
                            className="sidebar-toggle"
                        >
                            {sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        </Button>
                        <div className="logo">
                            <div className="logo-icon">💎</div>
                            <span className="logo-text">Mantis</span>
                        </div>
                    </div>

                    <div className="header-right">
                        <Badge count={2} size="small">
                            <Button type="text" icon={<BellOutlined />} className="header-icon" />
                        </Badge>
                        <Dropdown overlay={userMenu} placement="bottomRight">
                            <div className="user-info">
                                <Avatar size="small" icon={<UserOutlined />} />
                                <span className="user-name">John Doe</span>
                            </div>
                        </Dropdown>
                    </div>
                </header>

                {/* 页面内容 */}
                <div className="page-content">
                    {children}
                </div>
            </main>

            {/* 移动端遮罩层 */}
            {
                !sidebarCollapsed && (
                    <div
                        className="mobile-overlay"
                        onClick={() => setSidebarCollapsed(true)}
                    />
                )
            }
        </div >
    );
};

export default Layout; 