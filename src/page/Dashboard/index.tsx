import React, { ReactElement } from 'react';
import './index.less';

function Dashboard(): ReactElement {
    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>📊 仪表盘</h1>
                <p>欢迎来到仪表盘页面，这里可以展示各种数据统计和图表。</p>
            </div>

            <div className="dashboard-content">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-info">
                            <h3>总用户数</h3>
                            <p className="stat-number">1,234</p>
                            <span className="stat-change positive">+12%</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">📈</div>
                        <div className="stat-info">
                            <h3>总收入</h3>
                            <p className="stat-number">¥56,789</p>
                            <span className="stat-change positive">+8%</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">🛒</div>
                        <div className="stat-info">
                            <h3>订单数量</h3>
                            <p className="stat-number">456</p>
                            <span className="stat-change negative">-3%</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">⭐</div>
                        <div className="stat-info">
                            <h3>满意度</h3>
                            <p className="stat-number">4.8</p>
                            <span className="stat-change positive">+0.2</span>
                        </div>
                    </div>
                </div>

                <div className="chart-section">
                    <h2>数据趋势图</h2>
                    <div className="chart-placeholder">
                        <p>📊 这里可以放置图表组件</p>
                        <p>例如：折线图、柱状图、饼图等</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
