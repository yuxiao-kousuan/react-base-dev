import React, { useState } from 'react';
import { TreeSelect, message } from 'antd';
import { css } from '@emotion/css';
import {
    type ServerTreeNode,
    type TransformedTreeNode,
    convertServerTreeToAntdTree,
    updateTreeData,
    getParentKey,
    getNodeNameFromKey,
} from './utils';

// ==================== 样式定义 ====================

const treeSelectStyles = css`
    width: 100%;
`;

const popupStyles = css`
    .ant-select-tree-node-content-wrapper:hover {
        background-color: #f0f0f0 !important;
    }
    
    .ant-select-tree-node-selected .ant-select-tree-node-content-wrapper {
        background-color: #e6f7ff !important;
        font-weight: 500;
    }
`;

// ==================== 组件 Props ====================

export interface AsyncTreeSelectProps {
    /** 初始树数据 */
    initialTreeData: ServerTreeNode[];
    /** 异步加载子节点的函数 */
    onLoadData: (parentKey: string) => Promise<ServerTreeNode[]>;
    /** 选择变化的回调 */
    onChange?: (selectedKeys: string[]) => void;
    /** 占位符文本 */
    placeholder?: string;
    /** 样式 */
    style?: React.CSSProperties;
    /** 是否允许清除 */
    allowClear?: boolean;
    /** 是否显示搜索 */
    showSearch?: boolean;
    /** 自定义 CSS 类名 */
    className?: string;
}

// ==================== 组件实现 ====================

const AsyncTreeSelect: React.FC<AsyncTreeSelectProps> = ({
    initialTreeData,
    onLoadData,
    onChange,
    placeholder = '请选择节点',
    style,
    allowClear = true,
    showSearch = true,
    className,
}) => {
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [treeData, setTreeData] = useState<TransformedTreeNode[]>(() => {
        return convertServerTreeToAntdTree(initialTreeData, '', true, false);
    });

    /**
     * 异步加载数据的处理函数
     */
    const handleLoadData = async (treeNode: any): Promise<void> => {
        const { key } = treeNode;

        try {
            const childrenData = await onLoadData(key);
            const children = convertServerTreeToAntdTree(childrenData, key, false, true);
            setTreeData((origin) => updateTreeData(origin, key, children));
        } catch (error) {
            console.error('加载节点失败:', error);
            message.error('加载子节点失败，请重试');
        }
    };

    /**
     * 处理选择变化（多选）
     */
    const handleChange = (values: string[]) => {
        if (values && values.length > 0) {
            // 检查是否所有节点都在同一个父节点下
            const parentKeys = values.map(value => getParentKey(value));
            const firstParentKey = parentKeys[0];
            const allSameParent = parentKeys.every(parentKey => parentKey === firstParentKey);

            if (!allSameParent) {
                const differentParents = [...new Set(parentKeys)];
                const parentNames = differentParents.map(parentKey => {
                    const nodeName = getNodeNameFromKey(parentKey);
                    return `"${nodeName}"`;
                });

                message.warning({
                    content: `只能选择同一个父节点下的节点！当前选择了不同父节点的子节点：${parentNames.join('、')}`,
                    duration: 4,
                });
                return;
            }

            setSelectedValues(values);
            onChange?.(values);
        } else {
            setSelectedValues([]);
            onChange?.([]);
        }
    };

    return (
        <TreeSelect
            className={`${treeSelectStyles} ${className || ''}`}
            style={{ maxHeight: 500, ...style }}
            value={selectedValues}
            size='large'
            placeholder={placeholder}
            allowClear={allowClear}
            showSearch={showSearch}
            multiple
            treeCheckable
            showCheckedStrategy={TreeSelect.SHOW_CHILD}
            treeDefaultExpandAll={false}
            treeData={treeData}
            loadData={handleLoadData}
            onChange={handleChange}
            filterTreeNode={(input, node) => {
                const title = node.title as string;
                return title.toLowerCase().includes(input.toLowerCase());
            }}
            {...({
                popupStyle: { maxHeight: 500, overflow: 'auto' },
                popupClassName: popupStyles
            } as any)}
        />
    );
};

// ==================== 导出 ====================

export default AsyncTreeSelect;
export type { ServerTreeNode, TransformedTreeNode };
