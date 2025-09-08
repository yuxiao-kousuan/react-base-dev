import React, { ReactElement } from 'react';
import { Button, Card, Space, Typography, Row, Col, Input, Select, DatePicker } from 'antd';
import { UserOutlined, SettingOutlined, HomeOutlined } from '@ant-design/icons';
import './index.less';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

function AntdDemo(): ReactElement {
    return (
        <div className="antd-demo">
            <Title level={2}>🎨 Ant Design 组件演示</Title>

            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card title="基础组件" bordered={false}>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <div>
                                <Text strong>按钮组件：</Text>
                                <Space style={{ marginLeft: 16 }}>
                                    <Button type="primary">主要按钮</Button>
                                    <Button>默认按钮</Button>
                                    <Button type="dashed">虚线按钮</Button>
                                    <Button type="link">链接按钮</Button>
                                </Space>
                            </div>

                            <div>
                                <Text strong>图标按钮：</Text>
                                <Space style={{ marginLeft: 16 }}>
                                    <Button type="primary" icon={<UserOutlined />}>
                                        用户
                                    </Button>
                                    <Button icon={<SettingOutlined />}>
                                        设置
                                    </Button>
                                    <Button icon={<HomeOutlined />}>
                                        首页
                                    </Button>
                                </Space>
                            </div>

                            <div>
                                <Text strong>输入组件：</Text>
                                <Space style={{ marginLeft: 16 }}>
                                    <Input placeholder="请输入内容" style={{ width: 200 }} />
                                    <Select placeholder="请选择" style={{ width: 200 }}>
                                        <Option value="option1">选项1</Option>
                                        <Option value="option2">选项2</Option>
                                        <Option value="option3">选项3</Option>
                                    </Select>
                                    <DatePicker placeholder="选择日期" />
                                </Space>
                            </div>
                        </Space>
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="布局组件" bordered={false}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Paragraph>
                                Ant Design 提供了丰富的布局组件，包括：
                            </Paragraph>
                            <ul>
                                <li>Grid 栅格系统</li>
                                <li>Space 间距组件</li>
                                <li>Divider 分割线</li>
                                <li>Card 卡片组件</li>
                            </ul>
                        </Space>
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="数据展示" bordered={false}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Paragraph>
                                数据展示组件包括：
                            </Paragraph>
                            <ul>
                                <li>Table 表格</li>
                                <li>List 列表</li>
                                <li>Descriptions 描述列表</li>
                                <li>Statistic 统计数值</li>
                            </ul>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default AntdDemo;
