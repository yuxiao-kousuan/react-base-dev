import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { routeConfig } from '@src/router';
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

    const isActivePath = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    const getCurrentPageTitle = () => {
        const currentRoute = routeConfig.find(route =>
            route.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(route.path)
        );
        return currentRoute?.title || '未知页面';
    };

    return (
        <div className={`layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            {/* 侧边栏 */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <span className="logo-icon">🚀</span>
                        {!sidebarCollapsed && (
                            <span className="logo-text">React App</span>
                        )}
                    </div>
                    <button
                        className="sidebar-toggle"
                        onClick={toggleSidebar}
                        title={sidebarCollapsed ? '展开菜单' : '收起菜单'}
                    >
                        {sidebarCollapsed ? '🔸' : '🔹'}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <ul className="nav-list">
                        {routeConfig
                            .filter(route => route.showInMenu)
                            .map((route) => (
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
                </nav>

                <div className="sidebar-footer">
                    {!sidebarCollapsed && (
                        <div className="footer-info">
                            <p>© 2024 React Base App</p>
                            <p>Version 1.0.0</p>
                        </div>
                    )}
                </div>
            </aside>

            {/* 主内容区域 */}
            <main className="main-content">
                {/* 顶部栏 */}
                <header className="top-header">
                    <div className="header-left">
                        <h1 className="page-title">{getCurrentPageTitle()}</h1>
                        <div className="breadcrumb">
                            <span className="breadcrumb-home">🏠</span>
                            <span className="breadcrumb-separator">/</span>
                            <span className="breadcrumb-current">{getCurrentPageTitle()}</span>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="header-actions">
                            <button className="action-btn" title="通知">
                                🔔
                            </button>
                            <button className="action-btn" title="用户">
                                👤
                            </button>
                        </div>
                    </div>
                </header>

                {/* 页面内容 */}
                <div className="page-content">
                    {children}
                </div>
            </main>

            {/* 移动端遮罩层 */}
            {!sidebarCollapsed && (
                <div
                    className="mobile-overlay"
                    onClick={() => setSidebarCollapsed(true)}
                />
            )}
        </div>
    );
};

export default Layout; 