/** @jsxImportSource @emotion/react */
import React, { ReactElement, useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { Card, Button, Tag, Space, Empty, message, Collapse, Badge, Tooltip } from 'antd';
import {
    VideoCameraOutlined,
    ClockCircleOutlined,
    TeamOutlined,
    CalendarOutlined,
    SyncOutlined,
    UserOutlined,
    EnvironmentOutlined,
    ReloadOutlined,
    CopyOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Panel } = Collapse;

interface Participant {
    id: string;
    name: string;
}

interface RecurrenceConfig {
    type: 'none' | 'daily' | 'weekly' | 'monthly';
    weekdays?: number[]; // 周重复时选择的星期几 (0-6)
    monthlyType?: 'date' | 'weekday'; // 月重复方式
    endType: 'date' | 'never';
    endDate?: string; // YYYY-MM-DD
}

interface Meeting {
    id: string;
    title: string;
    description?: string;
    meetingType?: 'productivity' | 'quality' | 'efficiency';
    organizer: string;
    date: string;
    time: string;
    duration: number;
    meetingId: string;
    participants: Participant[]; // 改为参会人员对象数组
    locations?: string[]; // 地址：区域-厂-线的值数组
    hasPassword: boolean;
    isRecurring?: boolean;
    recurrencePattern?: string; // 重复描述（用于显示）
    recurrenceConfig?: RecurrenceConfig; // 重复配置（用于编辑）
}

type MeetingStatus = 'upcoming' | 'in-progress' | 'scheduled' | 'completed';

/**
 * 根据会议日期、时间和持续时间判断会议状态
 * @param date 会议日期 (YYYY-MM-DD)
 * @param time 会议时间 (HH:mm)
 * @param duration 会议持续时间（分钟）
 * @returns 会议状态
 */
const getMeetingStatus = (date: string, time: string, duration: number): MeetingStatus => {
    const now = dayjs();
    const meetingStart = dayjs(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
    const meetingEnd = meetingStart.add(duration, 'minute');

    // 如果当前时间已经超过会议结束时间，则是已完成
    if (now.isAfter(meetingEnd)) {
        return 'completed';
    }

    // 如果当前时间在会议开始和结束之间，则是进行中
    if (now.isAfter(meetingStart) || now.isSame(meetingStart)) {
        return 'in-progress';
    }

    // 计算距离会议开始的分钟数
    const minutesUntilStart = meetingStart.diff(now, 'minute');

    // 如果15分钟之内，则是即将开始
    if (minutesUntilStart <= 15) {
        return 'upcoming';
    }

    // 否则是已预约
    return 'scheduled';
};

const styles = {
    container: css`
        padding: 24px;

        @media (max-width: 768px) {
            padding: 16px;
        }
    `,

    collapseSection: css`
        margin-bottom: 16px;

        .ant-collapse {
            border: none;
            background: transparent;
        }

        .ant-collapse-item {
            border: none;
            margin-bottom: 16px;
        }

        .ant-collapse-header {
            padding: 16px 20px !important;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
            font-weight: 600;
            font-size: 18px;
            
            &:hover {
                background: #fafafa;
            }
        }

        .ant-collapse-content {
            border: none;
            background: transparent;
        }

        .ant-collapse-content-box {
            padding: 16px 0 0 0;
        }
    `,

    sectionHeader: css`
        display: flex;
        align-items: center;
        gap: 12px;
        color: #333;

        .anticon {
            font-size: 20px;
        }

        &.in-progress {
            color: #52c41a;
            .anticon {
                color: #52c41a;
            }
        }

        &.upcoming {
            color: #1890ff;
            .anticon {
                color: #1890ff;
            }
        }

        &.scheduled {
            color: #666;
            .anticon {
                color: #666;
            }
        }

        &.completed {
            color: #8c8c8c;
            .anticon {
                color: #8c8c8c;
            }
        }
    `,

    pageHeader: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;

        h1 {
            font-size: 24px;
            font-weight: 600;
            margin: 0;
        }

        @media (max-width: 768px) {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
        }
    `,

    headerLeft: css`
        display: flex;
        align-items: center;
        gap: 24px;

        @media (max-width: 768px) {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
        }
    `,

    currentTime: css`
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        color: #1890ff;
        background: linear-gradient(135deg, #e6f7ff 0%, #f0f7ff 100%);
        padding: 8px 16px;
        border-radius: 8px;
        border: 1px solid #91d5ff;
        font-weight: 500;

        .anticon {
            font-size: 18px;
        }

        @media (max-width: 768px) {
            font-size: 14px;
            padding: 6px 12px;
        }
    `,

    quickActions: css`
        display: flex;
        gap: 12px;

        @media (max-width: 768px) {
            width: 100%;
            
            button {
                flex: 1;
            }
        }
    `,

    meetingsSection: css`
        margin-bottom: 32px;
    `,

    sectionTitle: css`
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 8px;

        .anticon {
            color: #1890ff;
        }
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

    meetingCard: css`
        border-radius: 12px;
        transition: all 0.3s;

        &:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }
    `,

    inProgressMeeting: css`
        border: 2px solid #52c41a;
        background: linear-gradient(to bottom, #f6ffed 0%, #ffffff 100%);
        box-shadow: 0 0 12px rgba(82, 196, 26, 0.15);
    `,

    upcomingMeeting: css`
        border: 2px solid #1890ff;
        background: linear-gradient(to bottom, #f0f7ff 0%, #ffffff 100%);
        box-shadow: 0 0 8px rgba(24, 144, 255, 0.1);
    `,

    scheduledMeeting: css`
        border: 1px solid #d9d9d9;
        background: #ffffff;
    `,

    completedMeeting: css`
        border: 1px solid #d9d9d9;
        background: #fafafa;
        opacity: 0.85;
    `,

    meetingHeader: css`
        margin-bottom: 16px;
    `,

    meetingTitleRow: css`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;

        h3 {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
            flex: 1;
        }
    `,

    meetingDescription: css`
        color: #666;
        font-size: 14px;
        margin: 0;
        line-height: 1.5;
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

    meetingIdCard: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
        border: 1px solid #d9d9d9;
        border-radius: 6px;
        padding: 8px 12px;
        margin: 12px 0;
        
        .meeting-id-left {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #666;
            font-weight: 500;
            font-size: 13px;
        }
        
        .meeting-id-right {
            display: flex;
            align-items: center;
            gap: 6px;
            
            .meeting-id-text {
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
                background: #fff;
                padding: 4px 8px;
                border-radius: 4px;
                border: 1px solid #d9d9d9;
                font-size: 13px;
                font-weight: 500;
                color: #595959;
                letter-spacing: 0.5px;
            }
            
            .anticon {
                color: #8c8c8c;
                cursor: pointer;
                font-size: 14px;
                padding: 4px;
                border-radius: 3px;
                transition: all 0.3s;
                
                &:hover {
                    color: #595959;
                    background: rgba(0, 0, 0, 0.06);
                }
            }
        }
    `,

    meetingActions: css`
        .ant-space {
            width: 100%;
        }

        margin-top: 16px;
    `,

    recurrenceSection: css`
        background: #f9f9f9;
        padding: 16px;
        border-radius: 8px;
        margin: 16px 0;
        border: 1px solid #e8e8e8;
    `,

    recurrenceTitle: css`
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 15px;
        font-weight: 600;
        margin-bottom: 16px;
        color: #1890ff;

        .anticon {
            font-size: 16px;
        }
    `,

    weekdaysSelector: css`
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 8px;
    `,

    recurrenceEndSection: css`
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #e8e8e8;
    `
};

function MyMeetings(): ReactElement {
    // 当前时间状态
    const [currentTime, setCurrentTime] = useState(dayjs());

    // 生成测试用的时间：确保能展示四种不同状态
    const now = currentTime;
    const completedTime = now.subtract(2, 'hour'); // 2小时前开始，已完成
    const inProgressTime = now.subtract(10, 'minute'); // 10分钟前开始，正在进行
    const upcomingTime = now.add(10, 'minute'); // 10分钟后开始，即将开始
    const scheduledTime = now.add(2, 'hour'); // 2小时后开始，已预约

    // 格式化持续时间显示
    const formatDuration = (minutes: number): string => {
        if (minutes === 0) return '- 分钟';

        const days = Math.floor(minutes / 1440);
        const hours = Math.floor((minutes % 1440) / 60);
        const mins = minutes % 60;

        const parts: string[] = [];
        if (days > 0) parts.push(`${days}天`);
        if (hours > 0) parts.push(`${hours}小时`);
        if (mins > 0) parts.push(`${mins}分钟`);

        return parts.join(' ');
    };

    // 地址树形数据：区域-厂-线
    const locationTreeData = [
        {
            title: '华东区域',
            value: 'east',
            children: [
                {
                    title: '上海工厂',
                    value: 'east-shanghai',
                    children: [
                        { title: 'A生产线', value: 'east-shanghai-a' },
                        { title: 'B生产线', value: 'east-shanghai-b' },
                        { title: 'C生产线', value: 'east-shanghai-c' },
                    ],
                },
                {
                    title: '杭州工厂',
                    value: 'east-hangzhou',
                    children: [
                        { title: '一号线', value: 'east-hangzhou-1' },
                        { title: '二号线', value: 'east-hangzhou-2' },
                    ],
                },
            ],
        },
        {
            title: '华南区域',
            value: 'south',
            children: [
                {
                    title: '深圳工厂',
                    value: 'south-shenzhen',
                    children: [
                        { title: 'SMT生产线', value: 'south-shenzhen-smt' },
                        { title: '组装线', value: 'south-shenzhen-assembly' },
                        { title: '测试线', value: 'south-shenzhen-test' },
                    ],
                },
                {
                    title: '广州工厂',
                    value: 'south-guangzhou',
                    children: [
                        { title: '自动化产线', value: 'south-guangzhou-auto' },
                        { title: '手工产线', value: 'south-guangzhou-manual' },
                    ],
                },
            ],
        },
        {
            title: '华北区域',
            value: 'north',
            children: [
                {
                    title: '北京工厂',
                    value: 'north-beijing',
                    children: [
                        { title: '精密加工线', value: 'north-beijing-precision' },
                        { title: '装配线', value: 'north-beijing-assembly' },
                    ],
                },
            ],
        },
    ];

    // 根据地址值获取完整路径名称
    const getLocationLabel = (value: string): string => {
        const findNode = (nodes: any[], val: string, path: string[] = []): string[] | null => {
            for (const node of nodes) {
                const currentPath = [...path, node.title];
                if (node.value === val) {
                    return currentPath;
                }
                if (node.children) {
                    const found = findNode(node.children, val, currentPath);
                    if (found) return found;
                }
            }
            return null;
        };

        const path = findNode(locationTreeData, value);
        return path ? path.join(' / ') : value;
    };

    const [meetings, setMeetings] = useState<Meeting[]>([
        {
            id: '1',
            title: '每日站会',
            description: '团队每日同步进度',
            meetingType: 'efficiency',
            organizer: '张三',
            date: inProgressTime.format('YYYY-MM-DD'),
            time: inProgressTime.format('HH:mm'),
            duration: 15,
            meetingId: '123-456-789',
            participants: [
                { id: 'user1', name: '张三' },
                { id: 'user2', name: '李四' },
                { id: 'user3', name: '王五' },
                { id: 'user4', name: '赵六' },
                { id: 'user5', name: '钱七' },
                { id: 'user6', name: '孙八' },
                { id: 'user7', name: '周九' },
                { id: 'user8', name: '吴十' },
            ],
            locations: ['east-shanghai-a', 'east-shanghai-b'],
            hasPassword: false,
            isRecurring: true,
            recurrencePattern: '每天重复，直到 2025-12-31',
            recurrenceConfig: {
                type: 'daily',
                endType: 'date',
                endDate: '2025-12-31'
            }
        },
        {
            id: '2',
            title: '团队周会',
            description: '每周例行团队会议',
            meetingType: 'productivity',
            organizer: '李四',
            date: upcomingTime.format('YYYY-MM-DD'),
            time: upcomingTime.format('HH:mm'),
            duration: 90,
            meetingId: '987-654-321',
            participants: [
                { id: 'user1', name: '张三' },
                { id: 'user2', name: '李四' },
                { id: 'user3', name: '王五' },
                { id: 'user4', name: '赵六' },
                { id: 'user5', name: '钱七' },
                { id: 'user6', name: '孙八' },
                { id: 'user7', name: '周九' },
                { id: 'user8', name: '吴十' },
            ],
            locations: ['south-shenzhen-smt'],
            hasPassword: false,
            isRecurring: true,
            recurrencePattern: '每周一重复',
            recurrenceConfig: {
                type: 'weekly',
                weekdays: [1],
                endType: 'never'
            }
        },
        {
            id: '3',
            title: '产品评审会',
            meetingType: 'quality',
            organizer: '王五',
            date: scheduledTime.format('YYYY-MM-DD'),
            time: scheduledTime.format('HH:mm'),
            duration: 120,
            meetingId: '456-789-123',
            participants: [
                { id: 'user1', name: '张三' },
                { id: 'user2', name: '李四' },
                { id: 'user3', name: '王五' },
                { id: 'user4', name: '赵六' },
                { id: 'user5', name: '钱七' },
                { id: 'user6', name: '孙八' },
                { id: 'user7', name: '周九' },
                { id: 'user8', name: '吴十' },
                { id: 'user9', name: '郑十一' },
                { id: 'user10', name: '冯十二' },
                { id: 'user11', name: '陈十三' },
                { id: 'user12', name: '楚十四' },
            ],
            locations: ['north-beijing-precision', 'north-beijing-assembly'],
            hasPassword: true,
        },
        {
            id: '4',
            title: '技术分享会',
            description: 'React最佳实践分享',
            meetingType: 'efficiency',
            organizer: '赵六',
            date: completedTime.format('YYYY-MM-DD'),
            time: completedTime.format('HH:mm'),
            duration: 60,
            meetingId: '111-222-333',
            participants: [
                { id: 'user1', name: '张三' },
                { id: 'user2', name: '李四' },
                { id: 'user4', name: '赵六' },
                { id: 'user5', name: '钱七' },
                { id: 'user7', name: '周九' },
            ],
            locations: ['east-hangzhou-1', 'south-guangzhou-auto', 'south-guangzhou-manual'],
            hasPassword: false,
        },
    ]);

    const [refreshing, setRefreshing] = useState(false); // 手动刷新状态

    // 更新时间函数
    const updateCurrentTime = () => {
        setCurrentTime(dayjs());
    };

    // 手动刷新函数
    const handleManualRefresh = async () => {
        setRefreshing(true);
        try {
            updateCurrentTime();
            message.success('会议状态已更新');
        } catch (error) {
            message.error('刷新失败，请重试');
        } finally {
            setRefreshing(false);
        }
    };

    // 自动刷新：每秒更新时间显示，每分钟更新会议状态
    useEffect(() => {
        // 每秒更新时间显示
        const timeInterval = setInterval(() => {
            updateCurrentTime();
        }, 1000); // 1秒更新一次时间显示

        return () => clearInterval(timeInterval);
    }, []);

    const handleJoinMeeting = (meeting: Meeting) => {
        message.success(`正在加入会议: ${meeting.title}`);
    };

    const handleCopyMeetingId = (meetingId: string) => {
        navigator.clipboard.writeText(meetingId).then(() => {
            message.success('房间ID已复制到剪贴板');
        }).catch(() => {
            message.error('复制失败，请重试');
        });
    };

    const getStatusTag = (status: MeetingStatus) => {
        const statusMap = {
            'upcoming': { color: 'blue', text: '即将开始' },
            'in-progress': { color: 'green', text: '进行中' },
            'scheduled': { color: 'default', text: '已预约' },
            'completed': { color: 'default', text: '已完成' },
        };
        const { color, text } = statusMap[status];
        return <Tag color={color}>{text}</Tag>;
    };

    const getMeetingTypeTag = (type?: Meeting['meetingType']) => {
        if (!type) return null;
        const typeMap = {
            'productivity': { color: 'cyan', text: '产能会议' },
            'quality': { color: 'purple', text: '质量分析会议' },
            'efficiency': { color: 'orange', text: '效能会议' },
        };
        const { color, text } = typeMap[type];
        return <Tag color={color}>{text}</Tag>;
    };

    // 按状态分组会议（根据时间动态计算）
    const inProgressMeetings = meetings.filter(m => getMeetingStatus(m.date, m.time, m.duration) === 'in-progress');
    const upcomingMeetings = meetings.filter(m => getMeetingStatus(m.date, m.time, m.duration) === 'upcoming');
    const scheduledMeetings = meetings.filter(m => getMeetingStatus(m.date, m.time, m.duration) === 'scheduled');
    const completedMeetings = meetings.filter(m => getMeetingStatus(m.date, m.time, m.duration) === 'completed');

    return (
        <div css={styles.container}>
            {/* 页面头部 */}
            <div css={styles.pageHeader}>
                <div css={styles.headerLeft}>
                    <h1>我的会议</h1>
                    <div css={styles.currentTime}>
                        <ClockCircleOutlined />
                        <span>{currentTime.format('YYYY-MM-DD HH:mm:ss')}</span>
                    </div>
                </div>
                <div css={styles.quickActions}>
                    <Tooltip title="页面默认1分钟更新会议状态，时间每秒更新，点击按钮可以实时更新会议状态">
                        <Button
                            type="default"
                            size="large"
                            icon={<ReloadOutlined />}
                            onClick={handleManualRefresh}
                            loading={refreshing}
                        >
                            刷新状态
                        </Button>
                    </Tooltip>
                </div>
            </div>

            {/* 正在进行的会议 */}
            {inProgressMeetings.length > 0 && (
                <div css={styles.collapseSection}>
                    <Collapse
                        defaultActiveKey={['in-progress']}
                        expandIconPosition="end"
                    >
                        <Panel
                            header={
                                <div css={styles.sectionHeader} className="in-progress">
                                    <VideoCameraOutlined />
                                    <span>正在进行</span>
                                    <Badge
                                        count={inProgressMeetings.length}
                                        style={{ backgroundColor: '#52c41a' }}
                                    />
                                </div>
                            }
                            key="in-progress"
                        >
                            <div css={styles.meetingsGrid}>
                                {inProgressMeetings.map(meeting => (
                                    <Card
                                        key={meeting.id}
                                        css={[styles.meetingCard, styles.inProgressMeeting]}
                                        hoverable
                                    >
                                        <div css={styles.meetingHeader}>
                                            <div css={styles.meetingTitleRow}>
                                                <h3>
                                                    {meeting.isRecurring && <SyncOutlined style={{ marginRight: 6, fontSize: 16 }} />}
                                                    {meeting.title}
                                                </h3>
                                                <Space>
                                                    {getMeetingTypeTag(meeting.meetingType)}
                                                    {getStatusTag(getMeetingStatus(meeting.date, meeting.time, meeting.duration))}
                                                </Space>
                                            </div>
                                            {meeting.description && (
                                                <p css={styles.meetingDescription}>{meeting.description}</p>
                                            )}
                                        </div>

                                        <div css={styles.meetingInfo}>
                                            <div css={styles.infoItem}>
                                                <UserOutlined />
                                                <span>组织者：{meeting.organizer}</span>
                                            </div>
                                            <div css={styles.infoItem}>
                                                <CalendarOutlined />
                                                <span>
                                                    {meeting.date} {meeting.time} ~ {dayjs(`${meeting.date} ${meeting.time}`, 'YYYY-MM-DD HH:mm').add(meeting.duration, 'minute').format('YYYY-MM-DD HH:mm')}
                                                </span>
                                            </div>
                                            <div css={styles.infoItem}>
                                                <TeamOutlined />
                                                <span>{meeting.participants.length} 人参与</span>
                                            </div>
                                            {meeting.locations && meeting.locations.length > 0 && (
                                                <div css={styles.infoItem}>
                                                    <EnvironmentOutlined />
                                                    <span style={{ fontSize: 13 }}>
                                                        {meeting.locations.map(loc => getLocationLabel(loc)).join('; ')}
                                                    </span>
                                                </div>
                                            )}
                                            {meeting.isRecurring && (
                                                <div css={styles.infoItem}>
                                                    <SyncOutlined />
                                                    <span style={{ color: '#1890ff', fontSize: 13 }}>
                                                        {meeting.recurrencePattern}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* 房间ID卡片 */}
                                        <div css={styles.meetingIdCard}>
                                            <div className="meeting-id-left">
                                                <ClockCircleOutlined />
                                                <span>房间ID</span>
                                            </div>
                                            <div className="meeting-id-right">
                                                <span className="meeting-id-text">{meeting.meetingId}</span>
                                                <CopyOutlined onClick={() => handleCopyMeetingId(meeting.meetingId)} />
                                            </div>
                                        </div>

                                        <div css={styles.meetingActions}>
                                            <Button
                                                type="primary"
                                                icon={<VideoCameraOutlined />}
                                                onClick={() => handleJoinMeeting(meeting)}
                                                block
                                                size="large"
                                                style={{ background: '#52c41a', borderColor: '#52c41a' }}
                                            >
                                                立即加入
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </Panel>
                    </Collapse>
                </div>
            )}

            {/* 即将开始的会议 */}
            {upcomingMeetings.length > 0 && (
                <div css={styles.collapseSection}>
                    <Collapse
                        defaultActiveKey={['upcoming']}
                        expandIconPosition="end"
                    >
                        <Panel
                            header={
                                <div css={styles.sectionHeader} className="upcoming">
                                    <ClockCircleOutlined />
                                    <span>即将开始</span>
                                    <Badge
                                        count={upcomingMeetings.length}
                                        style={{ backgroundColor: '#1890ff' }}
                                    />
                                </div>
                            }
                            key="upcoming"
                        >
                            <div css={styles.meetingsGrid}>
                                {upcomingMeetings.map(meeting => (
                                    <Card
                                        key={meeting.id}
                                        css={[styles.meetingCard, styles.upcomingMeeting]}
                                        hoverable
                                    >
                                        <div css={styles.meetingHeader}>
                                            <div css={styles.meetingTitleRow}>
                                                <h3>
                                                    {meeting.isRecurring && <SyncOutlined style={{ marginRight: 6, fontSize: 16 }} />}
                                                    {meeting.title}
                                                </h3>
                                                <Space>
                                                    {getMeetingTypeTag(meeting.meetingType)}
                                                    {getStatusTag(getMeetingStatus(meeting.date, meeting.time, meeting.duration))}
                                                </Space>
                                            </div>
                                            {meeting.description && (
                                                <p css={styles.meetingDescription}>{meeting.description}</p>
                                            )}
                                        </div>

                                        <div css={styles.meetingInfo}>
                                            <div css={styles.infoItem}>
                                                <UserOutlined />
                                                <span>组织者：{meeting.organizer}</span>
                                            </div>
                                            <div css={styles.infoItem}>
                                                <CalendarOutlined />
                                                <span>
                                                    {meeting.date} {meeting.time} ~ {dayjs(`${meeting.date} ${meeting.time}`, 'YYYY-MM-DD HH:mm').add(meeting.duration, 'minute').format('YYYY-MM-DD HH:mm')}
                                                </span>
                                            </div>
                                            <div css={styles.infoItem}>
                                                <TeamOutlined />
                                                <span>{meeting.participants.length} 人参与</span>
                                            </div>
                                            {meeting.locations && meeting.locations.length > 0 && (
                                                <div css={styles.infoItem}>
                                                    <EnvironmentOutlined />
                                                    <span style={{ fontSize: 13 }}>
                                                        {meeting.locations.map(loc => getLocationLabel(loc)).join('; ')}
                                                    </span>
                                                </div>
                                            )}
                                            {meeting.isRecurring && (
                                                <div css={styles.infoItem}>
                                                    <SyncOutlined />
                                                    <span style={{ color: '#1890ff', fontSize: 13 }}>
                                                        {meeting.recurrencePattern}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* 房间ID卡片 */}
                                        <div css={styles.meetingIdCard}>
                                            <div className="meeting-id-left">
                                                <ClockCircleOutlined />
                                                <span>房间ID</span>
                                            </div>
                                            <div className="meeting-id-right">
                                                <span className="meeting-id-text">{meeting.meetingId}</span>
                                                <CopyOutlined onClick={() => handleCopyMeetingId(meeting.meetingId)} />
                                            </div>
                                        </div>

                                        <div css={styles.meetingActions}>
                                            <Button
                                                type="primary"
                                                icon={<VideoCameraOutlined />}
                                                onClick={() => handleJoinMeeting(meeting)}
                                                block
                                                size="large"
                                            >
                                                加入会议
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </Panel>
                    </Collapse>
                </div>
            )}

            {/* 已预约的会议 */}
            <div css={styles.collapseSection}>
                <Collapse
                    defaultActiveKey={scheduledMeetings.length > 0 ? [] : undefined}
                    expandIconPosition="end"
                >
                    <Panel
                        header={
                            <div css={styles.sectionHeader} className="scheduled">
                                <CalendarOutlined />
                                <span>已预约会议</span>
                                <Badge
                                    count={scheduledMeetings.length}
                                    style={{ backgroundColor: '#8c8c8c' }}
                                />
                            </div>
                        }
                        key="scheduled"
                    >
                        {scheduledMeetings.length > 0 ? (
                            <div css={styles.meetingsGrid}>
                                {scheduledMeetings.map(meeting => (
                                    <Card
                                        key={meeting.id}
                                        css={[styles.meetingCard, styles.scheduledMeeting]}
                                        hoverable
                                    >
                                        <div css={styles.meetingHeader}>
                                            <div css={styles.meetingTitleRow}>
                                                <h3>{meeting.title}</h3>
                                                <Space>
                                                    {getMeetingTypeTag(meeting.meetingType)}
                                                    {getStatusTag(getMeetingStatus(meeting.date, meeting.time, meeting.duration))}
                                                </Space>
                                            </div>
                                            {meeting.description && (
                                                <p css={styles.meetingDescription}>{meeting.description}</p>
                                            )}
                                        </div>

                                        <div css={styles.meetingInfo}>
                                            <div css={styles.infoItem}>
                                                <UserOutlined />
                                                <span>组织者：{meeting.organizer}</span>
                                            </div>
                                            <div css={styles.infoItem}>
                                                <CalendarOutlined />
                                                <span>
                                                    {meeting.date} {meeting.time} ~ {dayjs(`${meeting.date} ${meeting.time}`, 'YYYY-MM-DD HH:mm').add(meeting.duration, 'minute').format('YYYY-MM-DD HH:mm')}
                                                </span>
                                            </div>
                                            <div css={styles.infoItem}>
                                                <TeamOutlined />
                                                <span>{meeting.participants.length} 人参与</span>
                                            </div>
                                            {meeting.locations && meeting.locations.length > 0 && (
                                                <div css={styles.infoItem}>
                                                    <EnvironmentOutlined />
                                                    <span style={{ fontSize: 13 }}>
                                                        {meeting.locations.map(loc => getLocationLabel(loc)).join('; ')}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* 房间ID卡片 */}
                                        <div css={styles.meetingIdCard}>
                                            <div className="meeting-id-left">
                                                <ClockCircleOutlined />
                                                <span>房间ID</span>
                                            </div>
                                            <div className="meeting-id-right">
                                                <span className="meeting-id-text">{meeting.meetingId}</span>
                                                <CopyOutlined onClick={() => handleCopyMeetingId(meeting.meetingId)} />
                                            </div>
                                        </div>

                                        <div css={styles.meetingActions}>
                                            <Space style={{ width: '100%' }} direction="vertical">
                                                <Button
                                                    type="default"
                                                    icon={<VideoCameraOutlined />}
                                                    onClick={() => handleJoinMeeting(meeting)}
                                                    block
                                                >
                                                    加入会议
                                                </Button>
                                            </Space>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Empty
                                description="暂无预约会议"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        )}
                    </Panel>
                </Collapse>
            </div>

            {/* 已完成的会议 */}
            {completedMeetings.length > 0 && (
                <div css={styles.collapseSection}>
                    <Collapse
                        defaultActiveKey={[]}
                        expandIconPosition="end"
                    >
                        <Panel
                            header={
                                <div css={styles.sectionHeader} className="completed">
                                    <ClockCircleOutlined />
                                    <span>已完成会议</span>
                                    <Badge
                                        count={completedMeetings.length}
                                        style={{ backgroundColor: '#8c8c8c' }}
                                    />
                                </div>
                            }
                            key="completed"
                        >
                            <div css={styles.meetingsGrid}>
                                {completedMeetings.map(meeting => (
                                    <Card
                                        key={meeting.id}
                                        css={[styles.meetingCard, styles.completedMeeting]}
                                    >
                                        <div css={styles.meetingHeader}>
                                            <div css={styles.meetingTitleRow}>
                                                <h3>
                                                    {meeting.isRecurring && <SyncOutlined style={{ marginRight: 6, fontSize: 16 }} />}
                                                    {meeting.title}
                                                </h3>
                                                <Space>
                                                    {getMeetingTypeTag(meeting.meetingType)}
                                                    {getStatusTag(getMeetingStatus(meeting.date, meeting.time, meeting.duration))}
                                                </Space>
                                            </div>
                                            {meeting.description && (
                                                <p css={styles.meetingDescription}>{meeting.description}</p>
                                            )}
                                        </div>

                                        <div css={styles.meetingInfo}>
                                            <div css={styles.infoItem}>
                                                <UserOutlined />
                                                <span>组织者：{meeting.organizer}</span>
                                            </div>
                                            <div css={styles.infoItem}>
                                                <CalendarOutlined />
                                                <span>
                                                    {meeting.date} {meeting.time} ~ {dayjs(`${meeting.date} ${meeting.time}`, 'YYYY-MM-DD HH:mm').add(meeting.duration, 'minute').format('YYYY-MM-DD HH:mm')}
                                                </span>
                                            </div>
                                            <div css={styles.infoItem}>
                                                <TeamOutlined />
                                                <span>{meeting.participants.length} 人参与</span>
                                            </div>
                                            {meeting.locations && meeting.locations.length > 0 && (
                                                <div css={styles.infoItem}>
                                                    <EnvironmentOutlined />
                                                    <span style={{ fontSize: 13 }}>
                                                        {meeting.locations.map(loc => getLocationLabel(loc)).join('; ')}
                                                    </span>
                                                </div>
                                            )}
                                            {meeting.isRecurring && (
                                                <div css={styles.infoItem}>
                                                    <SyncOutlined />
                                                    <span style={{ color: '#8c8c8c', fontSize: 13 }}>
                                                        {meeting.recurrencePattern}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* 房间ID卡片 */}
                                        <div css={styles.meetingIdCard}>
                                            <div className="meeting-id-left">
                                                <ClockCircleOutlined />
                                                <span>房间ID</span>
                                            </div>
                                            <div className="meeting-id-right">
                                                <span className="meeting-id-text">{meeting.meetingId}</span>
                                                <CopyOutlined onClick={() => handleCopyMeetingId(meeting.meetingId)} />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </Panel>
                    </Collapse>
                </div>
            )}
        </div>
    );
}

export default MyMeetings;
