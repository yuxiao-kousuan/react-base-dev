/**
 * AsyncTreeSelect 工具函数
 * 提供树节点操作、数据转换等核心功能
 */

import type { DataNode } from 'antd/es/tree';

// ==================== 类型定义 ====================

/**
 * 服务端树节点类型
 */
export interface ServerTreeNode {
    id: number;
    name: string;
    rel_id?: number;
    parent?: string;
    child?: ServerTreeNode[];
}

/**
 * 转换后的树节点类型（用于 Ant Design TreeSelect）
 */
export interface TransformedTreeNode extends DataNode {
    key: string;
    value: string;
    title: string;
    children?: TransformedTreeNode[];
    isLeaf?: boolean;
    selectable?: boolean;
    checkable?: boolean;
    originalData: {
        id: number;
        name: string;
    };
}

// ==================== 核心工具函数 ====================

/**
 * 从 key 中解析出路径信息
 * @internal 内部使用
 */
const parseKeyToPath = (key: string): string[] => {
    return key.split('/');
};

/**
 * 构建唯一的树节点 key
 * @param node - 当前节点
 * @param parentKey - 父节点的 key
 * @returns 节点的唯一 key (格式: "父/子/孙")
 * 
 * @example
 * buildNodeKey({ name: 'DCS', ... }, 'WJ/WJ1')
 * // 返回: "WJ/WJ1/DCS"
 */
export const buildNodeKey = (node: ServerTreeNode, parentKey: string = ''): string => {
    if (parentKey) {
        return `${parentKey}/${node.name}`;
    }
    return node.name;
};

/**
 * 获取父节点的 key
 * @param key - 当前节点的 key
 * @returns 父节点的 key，如果是根节点则返回空字符串
 * 
 * @example
 * getParentKey("WJ/WJ1/DCS")  // 返回: "WJ/WJ1"
 * getParentKey("WJ")           // 返回: ""
 */
export const getParentKey = (key: string): string => {
    const pathArray = parseKeyToPath(key);
    if (pathArray.length <= 1) {
        return '';
    }
    pathArray.pop();
    return pathArray.join('/');
};

/**
 * 从 key 中获取节点名称
 * @param key - 节点的 key
 * @returns 节点名称
 * 
 * @example
 * getNodeNameFromKey("WJ/WJ1/DCS")  // 返回: "DCS"
 */
export const getNodeNameFromKey = (key: string): string => {
    const pathArray = parseKeyToPath(key);
    return pathArray[pathArray.length - 1];
};

/**
 * 将服务端树数据转换为 TreeSelect 组件所需格式
 * @param data - 服务端返回的树数据
 * @param parentKey - 父节点的 key（递归使用）
 * @param enableAsyncLoad - 是否启用异步加载
 * @param isAsyncLoaded - 是否为异步加载的节点
 * @returns 转换后的树节点数组
 */
export const convertServerTreeToAntdTree = (
    data: ServerTreeNode[],
    parentKey: string = '',
    enableAsyncLoad: boolean = false,
    isAsyncLoaded: boolean = false
): TransformedTreeNode[] => {
    if (!data || data.length === 0) return [];

    return data.map((node) => {
        const currentKey = buildNodeKey(node, parentKey);
        const hasChildren = Array.isArray(node.child) && node.child.length > 0;

        const treeNode: TransformedTreeNode = {
            key: currentKey,
            value: currentKey,
            title: node.name,
            originalData: {
                id: node.id,
                name: node.name,
            },
        };

        if (isAsyncLoaded) {
            // 异步加载的节点：可选择，可勾选，真正的叶子节点
            treeNode.selectable = true;
            treeNode.checkable = true;
            treeNode.isLeaf = true;
        } else {
            // 初始树节点：不可选择，不显示勾选框
            treeNode.selectable = false;
            treeNode.checkable = false;

            if (hasChildren) {
                treeNode.children = convertServerTreeToAntdTree(node.child!, currentKey, enableAsyncLoad, false);
            } else {
                treeNode.isLeaf = !enableAsyncLoad;
            }
        }

        return treeNode;
    });
};

/**
 * 更新树节点数据（用于异步加载后更新）
 * @param list - 树节点列表
 * @param key - 要更新的节点 key
 * @param children - 新的子节点
 * @returns 更新后的树节点列表
 */
export const updateTreeData = (
    list: TransformedTreeNode[],
    key: string,
    children: TransformedTreeNode[]
): TransformedTreeNode[] => {
    return list.map((node) => {
        if (node.key === key) {
            const updatedNode: TransformedTreeNode = {
                ...node,
                children,
            };

            if (children.length === 0) {
                updatedNode.isLeaf = true;
            } else {
                delete updatedNode.isLeaf;
            }

            return updatedNode;
        }
        if (node.children) {
            return {
                ...node,
                children: updateTreeData(node.children, key, children),
            };
        }
        return node;
    });
};

// ==================== Mock 数据 ====================

/**
 * Mock 树数据，用于测试和演示
 */
export const mockTreeData: ServerTreeNode[] = [
    {
        id: 2,
        name: "DG",
        child: [
            {
                id: 13,
                rel_id: 2,
                name: "DG7",
                parent: "DG",
                child: [
                    {
                        id: 13,
                        rel_id: 13,
                        name: "CDP",
                        parent: "DG7",
                        child: [
                            {
                                id: 57,
                                rel_id: 13,
                                name: "A11",
                                parent: "CDP"
                            },
                            {
                                id: 56,
                                rel_id: 13,
                                name: "F203",
                                parent: "CDP"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 1,
        name: "WJ",
        child: [
            {
                id: 7,
                rel_id: 1,
                name: "WJ1",
                parent: "WJ",
                child: [
                    {
                        id: 7,
                        rel_id: 7,
                        name: "DCS",
                        parent: "WJ1",
                        child: [
                            {
                                id: 23,
                                rel_id: 7,
                                name: "DCS-PM1",
                                parent: "DCS"
                            }
                        ]
                    }
                ]
            }
        ]
    }
];
