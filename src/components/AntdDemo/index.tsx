import React, { ReactElement } from 'react';
import { Typography } from 'antd';
import AsyncTreeSelect from './comps/AsyncTreeSelect';
import './index.less';
import Demo from './comps/AsyncTreeSelect/Demo';
const { Title } = Typography;

function AntdDemo(): ReactElement {
    return (
        <div className="antd-demo">
            <Title level={2}>🎨 异步树选择组件演示</Title>

            <Demo />
        </div>
    );
}

export default AntdDemo;
