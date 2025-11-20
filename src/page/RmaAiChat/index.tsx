import React from 'react';
import { Layout } from 'antd';
import LeftSider from './frame/LeftSider';
import ContentArea from './frame/Content';
import RightSider from './frame/RightSider';
import './index.less';

const { Sider, Content } = Layout;

const RmaAiChat: React.FC = () => {
    return (
        <div className="rma-ai-chat" style={{ height: '100%' }}>
            <Layout style={{ height: '100%' }}>
                {/* 左侧边栏 */}
                <Sider width={256} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
                    <LeftSider />
                </Sider>

                {/* 中间内容区 */}
                <Content style={{ height: '100%', overflow: 'hidden' }}>
                    <ContentArea />
                </Content>

                {/* 右侧边栏 */}
                <Sider width={300} theme="light" style={{ borderLeft: '1px solid #f0f0f0' }}>
                    <RightSider />
                </Sider>
            </Layout>
        </div>
    );
};

export default RmaAiChat;
