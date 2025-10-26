/** @jsxImportSource @emotion/react */
import React, { ReactElement, useState } from 'react';
import { css } from '@emotion/react';
import { Card, Button, Tag, Space, Table, Modal, Row, Col, Pagination } from 'antd';
import {
    ClockCircleOutlined,
    EyeOutlined,
    TeamOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    EnvironmentOutlined,
    BranchesOutlined,
    UserOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface HistoryMeeting {
    id: string;
    title: string;
    startTime: string;
    endTime?: string;
    meetingId: string;
    participants: number;
    status: 'completed' | 'cancelled' | 'missed';
    address: string;
    meetingType: string;
    organizer: string;
    summary: string;
}

const styles = {
    container: css`
        padding: 24px;

        @media (max-width: 768px) {
            padding: 16px;
        }
    `,

    viewControls: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;

        h2 {
            font-size: 20px;
            font-weight: 600;
            margin: 0;
        }

        @media (max-width: 768px) {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;

            h2 {
                font-size: 18px;
            }
        }
    `,

    meetingsGridContainer: css`
        padding: 16px 8px;
    `,

    meetingsGrid: css`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 16px;

        @media (max-width: 1200px) {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        }

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    `,

    historyMeetingCard: css`
        border-radius: 12px;
        transition: all 0.3s;

        &:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }
    `,

    meetingHeader: css`
        margin-bottom: 16px;
    `,

    meetingTitleRow: css`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        h3 {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
            flex: 1;
        }
    `,

    meetingInfo: css`
        background: #f5f5f5;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 12px;
    `,

    infoItem: css`
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        font-size: 14px;

        &:last-child {
            margin-bottom: 0;
        }

        .anticon {
            color: #1890ff;
        }
    `,

    meetingTypeTag: css`
        margin-top: 8px;
    `,

    meetingActions: css`
        .ant-space {
            width: 100%;
            justify-content: flex-start;
        }
    `,

    tableView: css`
        background: #fff;
        padding: 0;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        border: 1px solid #e8e8e8;

        .ant-table {
            font-size: 14px;
            
            .ant-table-thead > tr > th {
                background: #fafafa;
                border-bottom: 2px solid #e8e8e8;
                font-weight: 600;
            }

            .ant-table-tbody > tr > td {
                border-bottom: 1px solid #f0f0f0;
            }

            .ant-table-tbody > tr:hover > td {
                background: #f5f5f5;
            }
        }
    `,

    meetingDetail: css`
        @media (max-width: 768px) {
            .detail-row {
                flex-direction: column;
                align-items: flex-start;
                gap: 4px;

                strong {
                    width: 100%;
                }
            }
        }
    `,

    summaryContent: css`
        background: #f5f5f5;
        padding: 16px;
        border-radius: 8px;
        white-space: pre-wrap;
        line-height: 1.8;
        max-height: 400px;
        overflow-y: auto;
        
        p {
            margin-bottom: 12px;
            
            &:last-child {
                margin-bottom: 0;
            }
        }
    `,

    summarySection: css`
        margin-top: 16px;
        
        strong {
            display: block;
            margin-bottom: 12px;
            color: #333;
            font-size: 16px;
            font-weight: 600;
        }
    `,

    paginationWrapper: css`
        display: flex;
        justify-content: center;
        margin-top: 16px;
        padding: 16px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    `
};

function MeetingHistory(): ReactElement {
    const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
    const [selectedMeeting, setSelectedMeeting] = useState<HistoryMeeting | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const historyMeetings: HistoryMeeting[] = [
        {
            id: '1',
            title: '产品设计评审',
            startTime: '2025-10-20 14:00',
            endTime: '2025-10-20 15:55',
            meetingId: '111-222-333',
            participants: 8,
            status: 'completed',
            address: '虚拟会议室 A',
            meetingType: '产品评审',
            organizer: '张产品',
            summary: '本次产品设计评审会议主要讨论了新版本的功能规划和用户体验优化方案。\n\n主要议题：\n1. 首页改版设计方案的评审\n2. 用户交互流程的优化\n3. 移动端适配方案讨论\n\n会议结论：\n- 确定了首页改版的核心设计方向，强调简洁清晰的信息架构\n- 决定采用卡片式布局，提升信息层次感\n- 移动端采用响应式设计，确保各设备良好体验\n\n下次会议计划：\n定于下周进行设计稿的终审和开发排期讨论。',
        },
        {
            id: '2',
            title: '技术架构讨论',
            startTime: '2025-10-18 10:00',
            endTime: '2025-10-18 11:35',
            meetingId: '444-555-666',
            participants: 6,
            status: 'completed',
            address: '虚拟会议室 B',
            meetingType: '技术讨论',
            organizer: '李架构',
            summary: '技术架构讨论会议，重点讨论了系统微服务化改造方案。\n\n会议内容：\n1. 现有单体架构的问题分析\n2. 微服务拆分策略讨论\n3. 服务间通信方案选型\n\n技术决策：\n- 采用Spring Cloud框架进行微服务改造\n- 使用Nacos作为服务注册与配置中心\n- API网关统一管理对外接口\n\n后续工作：\n下周交付详细的微服务拆分方案文档。',
        },
        {
            id: '3',
            title: '客户需求沟通',
            startTime: '2025-10-15 15:30',
            endTime: '',
            meetingId: '777-888-999',
            participants: 0,
            status: 'cancelled',
            address: '虚拟会议室 C',
            meetingType: '客户会议',
            organizer: '王销售',
            summary: '会议已取消，客户另行安排时间。',
        },
        {
            id: '4',
            title: '团队建设活动',
            startTime: '2025-10-12 16:00',
            endTime: '2025-10-12 17:28',
            meetingId: '123-789-456',
            participants: 12,
            status: 'completed',
            address: '虚拟会议室 A',
            meetingType: '团队活动',
            organizer: '赵经理',
            summary: '团队建设活动会议，组织了一次线上团建活动。\n\n活动内容：\n1. 团队协作游戏环节\n2. 经验分享交流\n3. 未来团队规划讨论\n\n活动成果：\n- 提升了团队凝聚力\n- 加强了成员间的沟通交流\n- 制定了下一阶段的团队目标\n\n团队反馈良好，建议定期举办此类活动。',
        },
        {
            id: '5',
            title: '季度总结会议',
            startTime: '2025-10-10 09:00',
            endTime: '2025-10-10 11:55',
            meetingId: '321-654-987',
            participants: 15,
            status: 'completed',
            address: '虚拟会议室 D',
            meetingType: '总结会议',
            organizer: '陈总监',
            summary: '第三季度工作总结会议，全面回顾了本季度的工作成果。\n\n主要内容：\n1. 本季度业绩目标完成情况汇报\n2. 各项目进度总结\n3. 团队成员的成长与贡献\n4. 下季度工作规划\n\n重要成果：\n- 完成了3个重要项目的上线\n- 用户增长率达到120%\n- 团队规模扩大到15人\n- 提升了产品用户体验满意度\n\n下季度重点：\n- 继续优化核心功能\n- 拓展新用户市场\n- 加强团队能力建设',
        },
        {
            id: '6',
            title: '安全漏洞修复方案讨论',
            startTime: '2025-10-08 14:30',
            endTime: '2025-10-08 16:40',
            meetingId: '556-789-123',
            participants: 10,
            status: 'completed',
            address: '虚拟会议室 E',
            meetingType: '技术讨论',
            organizer: '刘安全',
            summary: '紧急安全漏洞修复方案的讨论会议。\n\n发现的安全问题：\n1. SQL注入漏洞2处\n2. XSS跨站脚本漏洞3处\n3. 敏感信息泄露风险\n\n修复计划：\n- 立即修复所有SQL注入漏洞\n- 实施输入验证和输出编码\n- 添加安全防护机制\n- 进行安全测试验证\n\n预期完成时间：本周五前全部修复。',
        },
        {
            id: '7',
            title: '前端性能优化会议',
            startTime: '2025-10-05 10:00',
            endTime: '2025-10-05 11:28',
            meetingId: '998-456-789',
            participants: 7,
            status: 'completed',
            address: '虚拟会议室 B',
            meetingType: '技术讨论',
            organizer: '孙前端',
            summary: '前端性能优化专项会议，讨论提升应用性能的方案。\n\n性能问题分析：\n1. 首屏加载时间超过3秒\n2. 图片未优化，体积过大\n3. JavaScript打包体积过大\n4. 缺少缓存策略\n\n优化方案：\n- 图片懒加载和压缩\n- 代码分割和按需加载\n- 启用CDN加速\n- 实现浏览器缓存策略\n\n目标：首屏加载时间降低到1秒以内。',
        },
        {
            id: '8',
            title: '用户反馈整理会议',
            startTime: '2025-10-03 15:00',
            endTime: '2025-10-03 15:58',
            meetingId: '334-667-890',
            participants: 5,
            status: 'completed',
            address: '虚拟会议室 A',
            meetingType: '产品评审',
            organizer: '张产品',
            summary: '用户反馈整理和分析会议。\n\n用户反馈汇总：\n1. 界面操作复杂，需要简化流程\n2. 搜索功能不够精准\n3. 移动端体验需要优化\n4. 希望增加夜间模式\n\n行动计划：\n- 优化用户交互流程\n- 改进搜索算法\n- 重点优化移动端体验\n- 设计并实现夜间模式\n\n下次会议：下周三讨论设计方案。',
        },
        {
            id: '9',
            title: '数据备份策略会议',
            startTime: '2025-10-01 11:00',
            endTime: '2025-10-01 12:02',
            meetingId: '445-778-901',
            participants: 6,
            status: 'completed',
            address: '虚拟会议室 C',
            meetingType: '技术讨论',
            organizer: '吴运维',
            summary: '数据备份策略和安全会议。\n\n备份现状：\n- 每日自动备份已实施\n- 保留近30天备份数据\n- 异地备份3个副本\n\n优化建议：\n- 增加备份频率到每小时\n- 延长备份保留期到90天\n- 增加加密备份\n- 建立灾难恢复预案\n\n实施计划：\n本周内完成备份策略升级。',
        },
        {
            id: '10',
            title: '新员工入职培训',
            startTime: '2025-09-28 09:30',
            endTime: '2025-09-28 12:25',
            meetingId: '667-889-012',
            participants: 12,
            status: 'completed',
            address: '虚拟会议室 A',
            meetingType: '团队活动',
            organizer: '赵经理',
            summary: '新员工入职培训和团队介绍会议。\n\n培训内容：\n1. 公司文化和发展历程\n2. 产品介绍和技术架构\n3. 工作流程和协作工具使用\n4. 团队介绍和角色说明\n\n参与人员：\n- 5名新入职员工\n- 7名老员工参与介绍\n\n培训效果：\n新员工快速融入团队，建立了良好的工作关系。',
        },
        {
            id: '11',
            title: 'API接口设计评审',
            startTime: '2025-09-26 14:00',
            endTime: '2025-09-26 15:35',
            meetingId: '223-556-789',
            participants: 8,
            status: 'completed',
            address: '虚拟会议室 B',
            meetingType: '技术讨论',
            organizer: '李架构',
            summary: '新版API接口设计评审会议。\n\n接口设计要点：\n1. RESTful风格设计\n2. 统一响应格式\n3. 完善的错误处理\n4. API版本控制\n\n技术决策：\n- 采用JWT认证方式\n- 实现接口限流机制\n- 添加请求日志\n- 提供完整的API文档\n\n交付时间：两周内完成开发。',
        },
        {
            id: '12',
            title: '竞品分析会议',
            startTime: '2025-09-24 16:00',
            endTime: '2025-09-24 17:58',
            meetingId: '778-901-234',
            participants: 9,
            status: 'completed',
            address: '虚拟会议室 D',
            meetingType: '产品评审',
            organizer: '张产品',
            summary: '竞品分析和市场定位会议。\n\n分析对象：\n1. 竞品A的功能特点\n2. 竞品B的用户体验\n3. 竞品C的商业模式\n\n优势分析：\n- 我们的技术架构更先进\n- 用户体验设计更人性化\n- 价格策略更具竞争力\n\n改进方向：\n- 学习竞品A的特色功能\n- 参考竞品的用户运营策略\n- 优化我们的差异化竞争点',
        },
        {
            id: '13',
            title: '服务器扩容讨论',
            startTime: '2025-09-22 10:30',
            endTime: '',
            meetingId: '112-345-678',
            participants: 0,
            status: 'cancelled',
            address: '虚拟会议室 E',
            meetingType: '技术讨论',
            organizer: '吴运维',
            summary: '会议已取消，因资源问题延后到下周。',
        },
        {
            id: '14',
            title: '用户增长策略会议',
            startTime: '2025-09-20 15:00',
            endTime: '2025-09-20 17:05',
            meetingId: '889-234-567',
            participants: 11,
            status: 'completed',
            address: '虚拟会议室 A',
            meetingType: '总结会议',
            organizer: '陈总监',
            summary: '用户增长策略和执行计划会议。\n\n当前用户数据：\n- 月活跃用户10万\n- 新增用户增长率15%\n- 用户留存率70%\n\n增长策略：\n1. 内容营销推广\n2. 社交裂变活动\n3. KOL合作\n4. 产品功能优化\n\n目标：\n3个月内月活用户达到15万。',
        },
        {
            id: '15',
            title: '代码审查会议',
            startTime: '2025-09-18 16:00',
            endTime: '2025-09-18 17:05',
            meetingId: '334-789-012',
            participants: 6,
            status: 'completed',
            address: '虚拟会议室 C',
            meetingType: '技术讨论',
            organizer: '李架构',
            summary: '核心功能代码审查会议。\n\n审查内容：\n- 用户认证模块重构\n- 支付流程优化\n- 数据库查询性能\n\n发现问题：\n- 3处代码冗余需要优化\n- 2处缺少异常处理\n- 1处存在安全隐患\n\n整改要求：\n本周内完成问题修复和优化。',
        },
    ];

    const getStatusTag = (status: HistoryMeeting['status']) => {
        const statusMap = {
            'completed': { color: 'success', text: '已完成', icon: <CheckCircleOutlined /> },
            'cancelled': { color: 'default', text: '已取消', icon: <ClockCircleOutlined /> },
            'missed': { color: 'error', text: '已错过', icon: <ClockCircleOutlined /> },
        };
        const { color, text, icon } = statusMap[status];
        return <Tag color={color} icon={icon}>{text}</Tag>;
    };

    const handleViewDetail = (meeting: HistoryMeeting) => {
        setSelectedMeeting(meeting);
        setDetailModalVisible(true);
    };

    const stats = {
        total: historyMeetings.length,
        completed: historyMeetings.filter(m => m.status === 'completed').length,
        totalParticipants: historyMeetings.reduce((sum, m) => sum + m.participants, 0),
    };

    // 计算分页数据
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedMeetings = historyMeetings.slice(startIndex, endIndex);
    const total = historyMeetings.length;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (current: number, size: number) => {
        setCurrentPage(1);
        setPageSize(size);
    };

    const columns: ColumnsType<HistoryMeeting> = [
        {
            title: '会议主题',
            dataIndex: 'title',
            key: 'title',
            width: 200,
        },
        {
            title: '会议类型',
            dataIndex: 'meetingType',
            key: 'meetingType',
            width: 120,
            render: (type) => <Tag color="processing" icon={<BranchesOutlined />}>{type}</Tag>,
        },
        {
            title: '开始时间',
            dataIndex: 'startTime',
            key: 'startTime',
            width: 180,
        },
        {
            title: '结束时间',
            dataIndex: 'endTime',
            key: 'endTime',
            width: 180,
            render: (endTime) => (
                <span>{endTime || '-'}</span>
            ),
        },
        {
            title: '会议地址',
            dataIndex: 'address',
            key: 'address',
            width: 150,
            render: (address) => (
                <span>
                    <EnvironmentOutlined style={{ marginRight: 4 }} />
                    {address}
                </span>
            ),
        },
        {
            title: '组织者',
            dataIndex: 'organizer',
            key: 'organizer',
            width: 100,
            render: (organizer) => (
                <span>
                    <UserOutlined style={{ marginRight: 4 }} />
                    {organizer}
                </span>
            ),
        },
        {
            title: '参与人数',
            dataIndex: 'participants',
            key: 'participants',
            width: 100,
            render: (count) => (
                <span>
                    <TeamOutlined /> {count}
                </span>
            ),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => getStatusTag(status),
        },
        {
            title: '操作',
            key: 'actions',
            width: 100,
            render: (_, record) => (
                <Button
                    type="link"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetail(record)}
                >
                    详情
                </Button>
            ),
        },
    ];

    return (
        <div css={styles.container}>
            <div css={styles.viewControls}>
                <h2>历史会议记录</h2>
                <Space>
                    <Button
                        type={viewMode === 'card' ? 'primary' : 'default'}
                        onClick={() => setViewMode('card')}
                    >
                        卡片视图
                    </Button>
                    <Button
                        type={viewMode === 'table' ? 'primary' : 'default'}
                        onClick={() => setViewMode('table')}
                    >
                        列表视图
                    </Button>
                </Space>
            </div>

            {viewMode === 'card' ? (
                <>
                    <div css={styles.meetingsGridContainer}>
                        <div css={styles.meetingsGrid}>
                            {paginatedMeetings.map(meeting => (
                                <Card
                                    key={meeting.id}
                                    css={styles.historyMeetingCard}
                                    hoverable
                                >
                                    <div css={styles.meetingHeader}>
                                        <div css={styles.meetingTitleRow}>
                                            <h3>{meeting.title}</h3>
                                            {getStatusTag(meeting.status)}
                                        </div>
                                        <div css={styles.meetingTypeTag}>
                                            <Tag color="processing" icon={<BranchesOutlined />}>
                                                {meeting.meetingType}
                                            </Tag>
                                        </div>
                                    </div>

                                    <div css={styles.meetingInfo}>
                                        <div css={styles.infoItem}>
                                            <CalendarOutlined />
                                            <span>
                                                {meeting.endTime && meeting.status === 'completed'
                                                    ? `${meeting.startTime} ~ ${meeting.endTime}`
                                                    : meeting.startTime
                                                }
                                            </span>
                                        </div>
                                        <div css={styles.infoItem}>
                                            <EnvironmentOutlined />
                                            <span>{meeting.address}</span>
                                        </div>
                                        <div css={styles.infoItem}>
                                            <UserOutlined />
                                            <span>{meeting.organizer}</span>
                                        </div>
                                        <div css={styles.infoItem}>
                                            <TeamOutlined />
                                            <span>{meeting.participants} 人参与</span>
                                        </div>
                                    </div>

                                    <div css={styles.meetingActions}>
                                        <Space style={{ width: '100%' }}>
                                            <Button
                                                icon={<EyeOutlined />}
                                                onClick={() => handleViewDetail(meeting)}
                                            >
                                                查看详情
                                            </Button>
                                        </Space>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                    <div css={styles.paginationWrapper}>
                        <Pagination
                            current={currentPage}
                            total={total}
                            pageSize={pageSize}
                            onChange={handlePageChange}
                            onShowSizeChange={handlePageSizeChange}
                            showSizeChanger
                            showQuickJumper
                            pageSizeOptions={['5', '10', '20', '50', '100']}
                            showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
                        />
                    </div>
                </>
            ) : (
                <>
                    <div css={styles.tableView}>
                        <Table
                            columns={columns}
                            dataSource={paginatedMeetings}
                            rowKey="id"
                            pagination={false}
                        />
                    </div>
                    <div css={styles.paginationWrapper}>
                        <Pagination
                            current={currentPage}
                            total={total}
                            pageSize={pageSize}
                            onChange={handlePageChange}
                            onShowSizeChange={handlePageSizeChange}
                            showSizeChanger
                            showQuickJumper
                            pageSizeOptions={['5', '10', '20', '50', '100']}
                            showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
                        />
                    </div>
                </>
            )}

            <Modal
                title={
                    selectedMeeting ? (
                        <div>
                            <div style={{ fontSize: '18px', marginBottom: '8px' }}>
                                {selectedMeeting.title}
                            </div>
                            <Space>
                                {getStatusTag(selectedMeeting.status)}
                                <Tag color="processing" icon={<BranchesOutlined />}>
                                    {selectedMeeting.meetingType}
                                </Tag>
                            </Space>
                        </div>
                    ) : '会议纪要'
                }
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setDetailModalVisible(false)}>
                        关闭
                    </Button>,
                ]}
                width={700}
            >
                {selectedMeeting && (
                    <div>
                        <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>
                            <Row gutter={[16, 8]}>
                                <Col span={12}>
                                    <CalendarOutlined style={{ marginRight: 6, color: '#1890ff' }} />
                                    <span style={{ color: '#666' }}>
                                        {selectedMeeting.endTime && selectedMeeting.status === 'completed'
                                            ? `${selectedMeeting.startTime} ~ ${selectedMeeting.endTime}`
                                            : selectedMeeting.startTime
                                        }
                                    </span>
                                </Col>
                                <Col span={12}>
                                    <EnvironmentOutlined style={{ marginRight: 6, color: '#1890ff' }} />
                                    <span style={{ color: '#666' }}>{selectedMeeting.address}</span>
                                </Col>
                                <Col span={12}>
                                    <UserOutlined style={{ marginRight: 6, color: '#1890ff' }} />
                                    <span style={{ color: '#666' }}>{selectedMeeting.organizer}</span>
                                </Col>
                                <Col span={12}>
                                    <TeamOutlined style={{ marginRight: 6, color: '#1890ff' }} />
                                    <span style={{ color: '#666' }}>{selectedMeeting.participants} 人参与</span>
                                </Col>
                            </Row>
                        </div>
                        <div css={styles.summarySection}>
                            <strong>会议纪要</strong>
                            <div css={styles.summaryContent}>
                                {selectedMeeting.summary.split('\n\n').map((paragraph, index) => (
                                    <p key={index} style={{ marginBottom: index < selectedMeeting.summary.split('\n\n').length - 1 ? '12px' : '0' }}>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default MeetingHistory;
