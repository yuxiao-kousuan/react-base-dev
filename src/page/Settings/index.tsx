import React, { ReactElement } from 'react';
import './index.less';

function Settings(): ReactElement {
    return (
        <div className="settings-page">
            <div className="page-header">
                <h1>⚙️ 系统设置</h1>
                <p>配置系统参数和用户偏好设置。</p>
            </div>

            <div className="settings-content">
                <div className="settings-tabs">
                    <button className="tab active">基本设置</button>
                    <button className="tab">安全设置</button>
                    <button className="tab">通知设置</button>
                    <button className="tab">高级设置</button>
                </div>

                <div className="settings-panel">
                    <div className="setting-group">
                        <h3>基本配置</h3>
                        <div className="setting-item">
                            <label>系统名称</label>
                            <input type="text" defaultValue="React Base System" />
                        </div>
                        <div className="setting-item">
                            <label>系统描述</label>
                            <textarea defaultValue="这是一个基于React的管理系统"></textarea>
                        </div>
                        <div className="setting-item">
                            <label>时区设置</label>
                            <select>
                                <option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</option>
                                <option value="UTC">UTC (UTC+0)</option>
                                <option value="America/New_York">America/New_York (UTC-5)</option>
                            </select>
                        </div>
                    </div>

                    <div className="setting-group">
                        <h3>界面设置</h3>
                        <div className="setting-item">
                            <label>主题模式</label>
                            <div className="radio-group">
                                <label>
                                    <input type="radio" name="theme" value="light" defaultChecked />
                                    <span>浅色模式</span>
                                </label>
                                <label>
                                    <input type="radio" name="theme" value="dark" />
                                    <span>深色模式</span>
                                </label>
                                <label>
                                    <input type="radio" name="theme" value="auto" />
                                    <span>自动模式</span>
                                </label>
                            </div>
                        </div>
                        <div className="setting-item">
                            <label>语言设置</label>
                            <select>
                                <option value="zh-CN">简体中文</option>
                                <option value="en-US">English</option>
                                <option value="ja-JP">日本語</option>
                            </select>
                        </div>
                    </div>

                    <div className="setting-group">
                        <h3>功能开关</h3>
                        <div className="setting-item">
                            <label className="switch-label">
                                <span>启用用户注册</span>
                                <div className="switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                </div>
                            </label>
                        </div>
                        <div className="setting-item">
                            <label className="switch-label">
                                <span>启用邮件通知</span>
                                <div className="switch">
                                    <input type="checkbox" />
                                    <span className="slider"></span>
                                </div>
                            </label>
                        </div>
                        <div className="setting-item">
                            <label className="switch-label">
                                <span>启用数据备份</span>
                                <div className="switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="settings-actions">
                        <button className="btn-save">保存设置</button>
                        <button className="btn-reset">重置设置</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
