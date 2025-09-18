import React, { useState } from 'react';
import { Button, InputNumber, Space, Card, Row, Col } from 'antd';
import AdaptiveLayout from '@src/components/AdaptiveLayout';
import './index.less';

const AdaptiveLayoutDemo: React.FC = () => {
    const [containerWidth, setContainerWidth] = useState(1200);
    const [itemsPerRow, setItemsPerRow] = useState(2);

    // 示例数据：不同宽高比的盒子
    const sampleItems = [
        { id: '1', aspectRatio: 16 / 9, content: '16:9 宽屏' },
        { id: '2', aspectRatio: 4 / 3, content: '4:3 标准' },
        { id: '3', aspectRatio: 1 / 1, content: '1:1 正方形' },
        { id: '4', aspectRatio: 3 / 4, content: '3:4 竖屏' },
        { id: '5', aspectRatio: 9 / 16, content: '9:16 手机屏' },
        { id: '6', aspectRatio: 2 / 1, content: '2:1 超宽屏' },
        { id: '7', aspectRatio: 1 / 2, content: '1:2 超窄屏' },
        { id: '8', aspectRatio: 21 / 9, content: '21:9 电影屏' },
        { id: '9', aspectRatio: 5 / 4, content: '5:4 经典' },
        { id: '10', aspectRatio: 4 / 5, content: '4:5 竖版' },
        { id: '11', aspectRatio: 3 / 2, content: '3:2 相机' },
        { id: '12', aspectRatio: 2 / 3, content: '2:3 竖相机' },
        { id: '13', aspectRatio: 1.5, content: '1.5:1 宽屏' },
        { id: '14', aspectRatio: 0.75, content: '0.75:1 窄屏' },
        { id: '15', aspectRatio: 1.8, content: '1.8:1 超宽' },
        { id: '16', aspectRatio: 0.6, content: '0.6:1 超窄' },
    ];

    return (
        <div className="adaptive-layout-demo">
            <Card title="自适应布局演示" className="demo-card">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* 控制面板 */}
                    <Card size="small" title="控制面板">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Space>
                                    <span>容器宽度:</span>
                                    <InputNumber
                                        value={containerWidth}
                                        onChange={(value) => setContainerWidth(value || 1200)}
                                        min={500}
                                        max={2000}
                                        step={50}
                                    />
                                    <span>px</span>
                                </Space>
                            </Col>
                            <Col span={12}>
                                <Space>
                                    <span>每行盒子数:</span>
                                    <InputNumber
                                        value={itemsPerRow}
                                        onChange={(value) => setItemsPerRow(value || 2)}
                                        min={1}
                                        max={8}
                                        step={1}
                                    />
                                    <span>个</span>
                                </Space>
                            </Col>
                        </Row>
                        <div style={{ marginTop: 8, color: '#666' }}>
                            盒子间距固定为15px
                        </div>
                    </Card>

                    {/* 布局展示 */}
                    <Card size="small" title="布局效果">
                        <div
                            className="demo-container"
                            style={{ width: containerWidth }}
                        >
                            <AdaptiveLayout
                                items={sampleItems}
                                containerHeight={600}
                                itemsPerRow={itemsPerRow}
                            />
                        </div>
                    </Card>

                    {/* 说明信息 */}
                    <Card size="small" title="功能说明">
                        <ul>
                            <li>✅ 容器宽度可动态调整，布局会自动重新计算</li>
                            <li>✅ 同一行的盒子高度保持一致</li>
                            <li>✅ 盒子保持原始宽高比，不会被拉伸变形</li>
                            <li>✅ 容器高度固定，内容溢出时显示滚动条</li>
                            <li>✅ 使用ResizeObserver监控容器大小变化</li>
                            <li>✅ 支持不同宽高比的盒子混合布局</li>
                            <li>✅ 可配置每行盒子数量（1-8个）</li>
                            <li>✅ 盒子间距固定为15px，确保视觉一致性</li>
                            <li>✅ 按固定数量分行，布局更加规整</li>
                            <li>✅ 每行高度根据内容自动调整</li>
                        </ul>
                    </Card>

                    {/* 测试按钮 */}
                    <Card size="small" title="快速测试">
                        <Space wrap>
                            <Button onClick={() => setContainerWidth(600)}>
                                超窄屏 (600px)
                            </Button>
                            <Button onClick={() => setContainerWidth(800)}>
                                窄屏模式 (800px)
                            </Button>
                            <Button onClick={() => setContainerWidth(1200)}>
                                标准模式 (1200px)
                            </Button>
                            <Button onClick={() => setContainerWidth(1600)}>
                                宽屏模式 (1600px)
                            </Button>
                            <Button onClick={() => setContainerWidth(2000)}>
                                超宽屏 (2000px)
                            </Button>
                        </Space>
                        <div style={{ marginTop: 12 }}>
                            <Space wrap>
                                <Button onClick={() => setItemsPerRow(1)}>
                                    每行1个
                                </Button>
                                <Button onClick={() => setItemsPerRow(2)}>
                                    每行2个
                                </Button>
                                <Button onClick={() => setItemsPerRow(3)}>
                                    每行3个
                                </Button>
                                <Button onClick={() => setItemsPerRow(4)}>
                                    每行4个
                                </Button>
                                <Button onClick={() => setItemsPerRow(6)}>
                                    每行6个
                                </Button>
                                <Button onClick={() => setItemsPerRow(8)}>
                                    每行8个
                                </Button>
                            </Space>
                        </div>
                    </Card>
                </Space>
            </Card>
        </div>
    );
};

export default AdaptiveLayoutDemo;
