/**
 * AsyncTreeSelect 组件使用示例
 */

import React from 'react';
import { Card } from 'antd';
import AsyncTreeSelect from './index';
import { type ServerTreeNode, mockTreeData } from './utils';

const Demo: React.FC = () => {
    /**
     * 模拟异步加载子节点的函数
     * 实际项目中，这里应该调用真实的 API
     */
    const handleLoadData = async (parentKey: string): Promise<ServerTreeNode[]> => {
        // 模拟网络延迟
        return new Promise((resolve) => {
            setTimeout(() => {
                // 从 key 中获取父节点名称
                const parentName = parentKey.split('/').pop() || '';

                // 模拟返回的子节点数据
                const mockChildren: ServerTreeNode[] = [
                    {
                        id: Date.now(),
                        name: `${parentName}-子节点1`,
                        rel_id: Date.now(),
                        parent: parentName,
                    },
                    {
                        id: Date.now() + 1,
                        name: `${parentName}-子节点2`,
                        rel_id: Date.now(),
                        parent: parentName,
                    },
                    {
                        id: Date.now() + 2,
                        name: `${parentName}-子节点3`,
                        rel_id: Date.now(),
                        parent: parentName,
                    },
                ];

                console.log(`异步加载 ${parentKey} 的子节点:`, mockChildren);
                resolve(mockChildren);
            }, 1000); // 模拟 1 秒延迟
        });
    };

    /**
     * 处理选择变化
     */
    const handleChange = (selectedKeys: string[]) => {
        console.log('选中的节点:', selectedKeys);
    };

    return (
        <div style={{ padding: '24px' }}>
            <Card title="AsyncTreeSelect 组件示例" bordered={false}>
                <div style={{ marginBottom: '16px', padding: '12px', background: '#f0f7ff', borderRadius: '4px' }}>
                    <p style={{ margin: 0, fontWeight: 500 }}>📝 使用说明：</p>
                    <ul style={{ margin: '8px 0 0 20px', paddingLeft: 0 }}>
                        <li>初始树节点无勾选框，不可选择</li>
                        <li>点击叶子节点的展开箭头异步加载子节点</li>
                        <li>异步加载的节点显示勾选框，可多选</li>
                        <li>只能选择同一个父节点下的节点</li>
                    </ul>
                </div>

                <AsyncTreeSelect
                    initialTreeData={mockTreeData}
                    onLoadData={handleLoadData}
                    onChange={handleChange}
                    placeholder="点击叶子节点展开异步加载"
                    style={{ width: '100%' }}
                    allowClear
                    showSearch
                />
            </Card>
        </div>
    );
};

export default Demo;

