import React, { useState } from 'react';
import './index.less';

const Settings: React.FC = () => {
    const [settings, setSettings] = useState({
        theme: 'light',
        language: 'zh-CN',
        notifications: true,
        autoSave: true,
        itemsPerPage: 10,
    });

    const handleSettingChange = (key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSaveSettings = () => {
        // 这里可以保存到 localStorage 或发送到服务器
        localStorage.setItem('app-settings', JSON.stringify(settings));
        alert('设置已保存！');
    };

    const handleResetSettings = () => {
        const defaultSettings = {
            theme: 'light',
            language: 'zh-CN',
            notifications: true,
            autoSave: true,
            itemsPerPage: 10,
        };
        setSettings(defaultSettings);
    };

    return (
        <div className="settings-page">
            <h1>⚙️ 应用设置</h1>

            <div className="settings-container">
                {/* 主题设置 */}
                <div className="settings-section">
                    <h2>🎨 外观设置</h2>
                    <div className="setting-item">
                        <label className="setting-label">
                            <span className="label-text">主题模式</span>
                            <span className="label-desc">选择应用的显示主题</span>
                        </label>
                        <select
                            value={settings.theme}
                            onChange={(e) => handleSettingChange('theme', e.target.value)}
                            className="setting-select"
                        >
                            <option value="light">🌞 浅色模式</option>
                            <option value="dark">🌙 深色模式</option>
                            <option value="auto">🔄 跟随系统</option>
                        </select>
                    </div>
                </div>

                {/* 语言设置 */}
                <div className="settings-section">
                    <h2>🌍 语言设置</h2>
                    <div className="setting-item">
                        <label className="setting-label">
                            <span className="label-text">界面语言</span>
                            <span className="label-desc">选择应用的显示语言</span>
                        </label>
                        <select
                            value={settings.language}
                            onChange={(e) => handleSettingChange('language', e.target.value)}
                            className="setting-select"
                        >
                            <option value="zh-CN">🇨🇳 简体中文</option>
                            <option value="zh-TW">🇹🇼 繁体中文</option>
                            <option value="en-US">🇺🇸 English</option>
                            <option value="ja-JP">🇯🇵 日本語</option>
                        </select>
                    </div>
                </div>

                {/* 通知设置 */}
                <div className="settings-section">
                    <h2>🔔 通知设置</h2>
                    <div className="setting-item">
                        <label className="setting-label">
                            <span className="label-text">启用通知</span>
                            <span className="label-desc">接收应用相关的通知消息</span>
                        </label>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={settings.notifications}
                                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>

                {/* 功能设置 */}
                <div className="settings-section">
                    <h2>⚡ 功能设置</h2>
                    <div className="setting-item">
                        <label className="setting-label">
                            <span className="label-text">自动保存</span>
                            <span className="label-desc">自动保存用户的操作和数据</span>
                        </label>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={settings.autoSave}
                                onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <label className="setting-label">
                            <span className="label-text">每页显示项目数</span>
                            <span className="label-desc">设置列表每页显示的项目数量</span>
                        </label>
                        <select
                            value={settings.itemsPerPage}
                            onChange={(e) => handleSettingChange('itemsPerPage', parseInt(e.target.value))}
                            className="setting-select"
                        >
                            <option value={5}>5 项</option>
                            <option value={10}>10 项</option>
                            <option value={20}>20 项</option>
                            <option value={50}>50 项</option>
                        </select>
                    </div>
                </div>

                {/* 系统信息 */}
                <div className="settings-section">
                    <h2>ℹ️ 系统信息</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">应用版本</span>
                            <span className="info-value">v1.0.0</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">构建时间</span>
                            <span className="info-value">{new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">React 版本</span>
                            <span className="info-value">18.2.0</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">TypeScript</span>
                            <span className="info-value">4.6.4</span>
                        </div>
                    </div>
                </div>

                {/* 操作按钮 */}
                <div className="settings-actions">
                    <button onClick={handleSaveSettings} className="action-btn save-btn">
                        💾 保存设置
                    </button>
                    <button onClick={handleResetSettings} className="action-btn reset-btn">
                        🔄 重置为默认
                    </button>
                </div>

                {/* 当前设置预览 */}
                <div className="settings-preview">
                    <h3>当前设置预览</h3>
                    <pre className="settings-json">
                        {JSON.stringify(settings, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default Settings;