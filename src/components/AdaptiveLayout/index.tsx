import React, { useMemo } from 'react';
import { useResizeObserver } from '@src/hooks/useResizeObserver';
import './index.less';

interface BoxItem {
    id: string;
    aspectRatio: number; // 宽高比 (width/height)
    content?: React.ReactNode;
}

interface AdaptiveLayoutProps {
    items: BoxItem[];
    containerHeight?: number;
    itemsPerRow?: number; // 每行盒子数量，默认为2
}

const AdaptiveLayout: React.FC<AdaptiveLayoutProps> = ({
    items,
    containerHeight = 1000,
    itemsPerRow = 2
}) => {
    const GAP = 15; // 固定间距15px
    const { width: containerWidth, setElementRef } = useResizeObserver<HTMLDivElement>();

    // 计算布局
    const layout = useMemo(() => {
        if (!containerWidth || items.length === 0) {
            return { rows: [], totalHeight: 0 };
        }

        const availableWidth = containerWidth;
        const rows: Array<{
            items: BoxItem[];
            height: number;
            itemWidths: number[];
        }> = [];

        // 按固定数量分组
        for (let i = 0; i < items.length; i += itemsPerRow) {
            const rowItems = items.slice(i, i + itemsPerRow);

            // 计算这一行的最优高度
            const rowHeight = calculateOptimalRowHeight(rowItems, availableWidth, GAP);

            // 计算每个item的实际宽度
            const itemWidths = rowItems.map(item => rowHeight * item.aspectRatio);

            rows.push({
                items: rowItems,
                height: rowHeight,
                itemWidths
            });
        }

        const totalHeight = rows.reduce((sum, row) => sum + row.height + GAP, 0) - GAP;

        return { rows, totalHeight };
    }, [items, containerWidth, itemsPerRow]);

    return (
        <div
            ref={setElementRef}
            className="adaptive-layout-container"
            style={{ height: containerHeight, overflowY: 'auto' }}
        >
            <div
                className="adaptive-layout-content"
                style={{ height: Math.max(layout.totalHeight, containerHeight) }}
            >
                {layout.rows.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="adaptive-layout-row"
                        style={{
                            height: row.height,
                            marginBottom: rowIndex < layout.rows.length - 1 ? GAP : 0
                        }}
                    >
                        {row.items.map((item, itemIndex) => {
                            const itemWidth = row.itemWidths[itemIndex];
                            return (
                                <div
                                    key={item.id}
                                    className="adaptive-layout-item"
                                    style={{
                                        width: itemWidth,
                                        height: row.height,
                                        marginRight: itemIndex < row.items.length - 1 ? GAP : 0
                                    }}
                                >
                                    {item.content || `Box ${item.id}`}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

// 计算最优行高，使得所有item保持宽高比且填满容器宽度
function calculateOptimalRowHeight(items: BoxItem[], availableWidth: number, gap: number): number {
    if (items.length === 0) return 0;

    // 计算所有item的宽高比总和
    const aspectRatioSum = items.reduce((sum, item) => sum + item.aspectRatio, 0);

    // 计算总间隙宽度
    const totalGapWidth = (items.length - 1) * gap;

    // 计算可用于item的宽度
    const availableItemWidth = availableWidth - totalGapWidth;

    // 计算统一高度：availableItemWidth / aspectRatioSum
    const height = availableItemWidth / aspectRatioSum;

    return height;
}

export default AdaptiveLayout;
