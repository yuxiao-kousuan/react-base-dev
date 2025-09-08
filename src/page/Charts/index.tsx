import React, { ReactElement } from 'react';
import './index.less';

function Charts(): ReactElement {
    return (
        <div className="charts-page">
            <div className="page-header">
                <h1>📈 图表分析</h1>
                <p>数据可视化分析，帮助您更好地理解业务数据。</p>
            </div>

            <div className="charts-content">
                <div className="chart-filters">
                    <div className="filter-group">
                        <label>时间范围</label>
                        <select>
                            <option value="7days">最近7天</option>
                            <option value="30days">最近30天</option>
                            <option value="90days">最近90天</option>
                            <option value="1year">最近1年</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>数据类型</label>
                        <select>
                            <option value="sales">销售数据</option>
                            <option value="users">用户数据</option>
                            <option value="orders">订单数据</option>
                            <option value="revenue">收入数据</option>
                        </select>
                    </div>
                    <button className="refresh-btn">🔄 刷新数据</button>
                </div>

                <div className="charts-grid">
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>📊 销售趋势</h3>
                            <div className="chart-actions">
                                <button>📥</button>
                                <button>🔍</button>
                            </div>
                        </div>
                        <div className="chart-container">
                            <div className="chart-placeholder">
                                <p>📈 折线图</p>
                                <p>显示销售数据的时间趋势</p>
                            </div>
                        </div>
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>🥧 用户分布</h3>
                            <div className="chart-actions">
                                <button>📥</button>
                                <button>🔍</button>
                            </div>
                        </div>
                        <div className="chart-container">
                            <div className="chart-placeholder">
                                <p>🥧 饼图</p>
                                <p>显示用户地区分布</p>
                            </div>
                        </div>
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>📊 订单统计</h3>
                            <div className="chart-actions">
                                <button>📥</button>
                                <button>🔍</button>
                            </div>
                        </div>
                        <div className="chart-container">
                            <div className="chart-placeholder">
                                <p>📊 柱状图</p>
                                <p>显示各月份订单数量</p>
                            </div>
                        </div>
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>📈 收入分析</h3>
                            <div className="chart-actions">
                                <button>📥</button>
                                <button>🔍</button>
                            </div>
                        </div>
                        <div className="chart-container">
                            <div className="chart-placeholder">
                                <p>📈 面积图</p>
                                <p>显示收入变化趋势</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="chart-summary">
                    <div className="summary-card">
                        <h3>📋 数据概览</h3>
                        <div className="summary-stats">
                            <div className="summary-item">
                                <span className="label">总销售额</span>
                                <span className="value">¥1,234,567</span>
                                <span className="change positive">+12.5%</span>
                            </div>
                            <div className="summary-item">
                                <span className="label">新增用户</span>
                                <span className="value">2,345</span>
                                <span className="change positive">+8.3%</span>
                            </div>
                            <div className="summary-item">
                                <span className="label">订单数量</span>
                                <span className="value">5,678</span>
                                <span className="change negative">-2.1%</span>
                            </div>
                            <div className="summary-item">
                                <span className="label">转化率</span>
                                <span className="value">3.45%</span>
                                <span className="change positive">+0.8%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Charts;
