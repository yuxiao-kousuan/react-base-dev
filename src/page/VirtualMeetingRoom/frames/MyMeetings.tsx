/** @jsxImportSource @emotion/react */
import React, { ReactElement, useState } from 'react';
import { css } from '@emotion/react';
import { Card, Button, Tag, Space, Empty, Modal, message, Form, Input, DatePicker, TimePicker, Select, Radio, Checkbox, InputNumber, Collapse, Badge } from 'antd';
import {
    VideoCameraOutlined,
    ClockCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    TeamOutlined,
    CalendarOutlined,
    PlusOutlined,
    SyncOutlined,
    UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Panel } = Collapse;

const { TextArea } = Input;
const { Option } = Select;

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
    // 生成测试用的时间：确保能展示四种不同状态
    const now = dayjs();
    const completedTime = now.subtract(2, 'hour'); // 2小时前开始，已完成
    const inProgressTime = now.subtract(10, 'minute'); // 10分钟前开始，正在进行
    const upcomingTime = now.add(10, 'minute'); // 10分钟后开始，即将开始
    const scheduledTime = now.add(2, 'hour'); // 2小时后开始，已预约

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
            hasPassword: false,
        },
    ]);

    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [recurrenceType, setRecurrenceType] = useState('none');
    const [endType, setEndType] = useState('date');

    const handleJoinMeeting = (meeting: Meeting) => {
        message.success(`正在加入会议: ${meeting.title}`);
    };

    const handleEditMeeting = (meeting: Meeting) => {
        setEditingMeeting(meeting);
        setCreateModalVisible(true);

        // 从重复配置中获取数据
        const recurrenceConfig = meeting.recurrenceConfig || {
            type: 'none',
            endType: 'date'
        };

        // 预填充表单数据
        const formValues: any = {
            title: meeting.title,
            description: meeting.description,
            meetingType: meeting.meetingType,
            participants: meeting.participants.map(p => p.id), // 设置参会人员ID数组
            date: dayjs(meeting.date, 'YYYY-MM-DD'),
            time: dayjs(meeting.time, 'HH:mm'),
            duration: meeting.duration,
            recurrenceType: recurrenceConfig.type,
            endType: recurrenceConfig.endType,
        };

        // 设置重复相关字段
        if (recurrenceConfig.type === 'weekly' && recurrenceConfig.weekdays) {
            formValues.weekdays = recurrenceConfig.weekdays;
        }

        if (recurrenceConfig.type === 'monthly' && recurrenceConfig.monthlyType) {
            formValues.monthlyType = recurrenceConfig.monthlyType;
        }

        if (recurrenceConfig.endType === 'date' && recurrenceConfig.endDate) {
            formValues.endDate = dayjs(recurrenceConfig.endDate, 'YYYY-MM-DD');
        }

        form.setFieldsValue(formValues);

        // 设置重复会议相关状态
        setRecurrenceType(recurrenceConfig.type);
        setEndType(recurrenceConfig.endType);
    };

    const handleDeleteMeeting = (meeting: Meeting) => {
        Modal.confirm({
            title: '确认删除',
            content: meeting.isRecurring
                ? `"${meeting.title}"是一个重复会议，是否删除所有重复会议？`
                : `确定要删除会议"${meeting.title}"吗？`,
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                setMeetings(meetings.filter(m => m.id !== meeting.id));
                message.success('会议已删除');
            },
        });
    };

    const handleQuickStart = () => {
        const meetingId = Math.random().toString(36).substring(7);
        message.success(`快速会议已创建，会议ID: ${meetingId}`);
    };

    const handleOpenCreateModal = () => {
        setEditingMeeting(null);
        form.resetFields();
        setRecurrenceType('none');
        setEndType('date');
        setCreateModalVisible(true);
    };

    const handleCreateMeeting = async (values: any) => {
        setLoading(true);
        try {
            console.log(editingMeeting ? '编辑会议:' : '创建会议:', values);

            // 构建重复模式描述和配置
            let recurrenceDesc = '';
            let recurrenceConfig: RecurrenceConfig | undefined;

            if (recurrenceType !== 'none') {
                const typeMap: { [key: string]: string } = {
                    'daily': '每天',
                    'weekly': '每周',
                    'monthly': '每月'
                };
                recurrenceDesc = typeMap[recurrenceType];

                if (recurrenceType === 'weekly' && values.weekdays?.length > 0) {
                    const weekdayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
                    const days = values.weekdays.map((d: number) => weekdayNames[d]).join('、');
                    recurrenceDesc = `每周${days}`;
                }

                if (values.endType === 'date' && values.endDate) {
                    recurrenceDesc += `重复，直到 ${values.endDate.format('YYYY-MM-DD')}`;
                } else {
                    recurrenceDesc += '重复';
                }

                // 构建重复配置
                recurrenceConfig = {
                    type: recurrenceType as 'daily' | 'weekly' | 'monthly',
                    endType: values.endType || 'date',
                    weekdays: values.weekdays,
                    monthlyType: values.monthlyType,
                    endDate: values.endDate?.format('YYYY-MM-DD')
                };
            }

            await new Promise(resolve => setTimeout(resolve, 1000));

            // 获取参会人员信息
            const participantOptions = [
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
            ];

            const selectedParticipants = participantOptions.filter(p =>
                values.participants?.includes(p.id)
            );

            if (editingMeeting) {
                // 编辑现有会议
                const updatedMeeting: Meeting = {
                    ...editingMeeting,
                    title: values.title,
                    description: values.description,
                    meetingType: values.meetingType,
                    date: values.date.format('YYYY-MM-DD'),
                    time: values.time.format('HH:mm'),
                    duration: Number(values.duration), // 确保是数字
                    participants: selectedParticipants,
                    isRecurring: recurrenceType !== 'none',
                    recurrencePattern: recurrenceType !== 'none' ? recurrenceDesc : undefined,
                    recurrenceConfig: recurrenceConfig,
                };

                setMeetings(meetings.map(m => m.id === editingMeeting.id ? updatedMeeting : m));
                message.success('会议更新成功！');
            } else {
                // 创建新会议
                const newMeeting: Meeting = {
                    id: Date.now().toString(),
                    title: values.title,
                    description: values.description,
                    meetingType: values.meetingType,
                    organizer: '当前用户', // 这里应该从用户信息中获取
                    date: values.date.format('YYYY-MM-DD'),
                    time: values.time.format('HH:mm'),
                    duration: Number(values.duration), // 确保是数字
                    participants: selectedParticipants,
                    meetingId: `${Math.random().toString(36).substr(2, 3)}-${Math.random().toString(36).substr(2, 3)}-${Math.random().toString(36).substr(2, 3)}`,
                    hasPassword: false,
                    isRecurring: recurrenceType !== 'none',
                    recurrencePattern: recurrenceType !== 'none' ? recurrenceDesc : undefined,
                    recurrenceConfig: recurrenceConfig,
                };

                setMeetings([...meetings, newMeeting]);
                message.success(
                    recurrenceType !== 'none'
                        ? `重复会议创建成功！${recurrenceDesc}`
                        : '会议创建成功！'
                );
            }

            form.resetFields();
            setCreateModalVisible(false);
            setEditingMeeting(null);
            // 重置重复会议状态
            setRecurrenceType('none');
            setEndType('date');
        } catch (error) {
            message.error(editingMeeting ? '更新会议失败，请重试' : '创建会议失败，请重试');
        } finally {
            setLoading(false);
        }
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
                <h1>我的会议</h1>
                <div css={styles.quickActions}>
                    <Button
                        type="default"
                        size="large"
                        icon={<VideoCameraOutlined />}
                        onClick={handleQuickStart}
                    >
                        快速会议
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={handleOpenCreateModal}
                    >
                        预约会议
                    </Button>
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
                                                <span>{meeting.date} {meeting.time}</span>
                                            </div>
                                            <div css={styles.infoItem}>
                                                <ClockCircleOutlined />
                                                <span>{meeting.duration} 分钟</span>
                                            </div>
                                            <div css={styles.infoItem}>
                                                <TeamOutlined />
                                                <span>{meeting.participants.length} 人参与</span>
                                            </div>
                                            {meeting.isRecurring && (
                                                <div css={styles.infoItem}>
                                                    <SyncOutlined />
                                                    <span style={{ color: '#1890ff', fontSize: 13 }}>
                                                        {meeting.recurrencePattern}
                                                    </span>
                                                </div>
                                            )}
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
                                            <Space style={{ marginTop: 8 }}>
                                                <Button
                                                    icon={<EditOutlined />}
                                                    onClick={() => handleEditMeeting(meeting)}
                                                >
                                                    编辑
                                                </Button>
                                                <Button
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => handleDeleteMeeting(meeting)}
                                                >
                                                    删除
                                                </Button>
                                            </Space>
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
                                                <span>{meeting.date} {meeting.time}</span>
                                            </div>
                                            <div css={styles.infoItem}>
                                                <ClockCircleOutlined />
                                                <span>{meeting.duration} 分钟</span>
                                            </div>
                                            <div css={styles.infoItem}>
                                                <TeamOutlined />
                                                <span>{meeting.participants.length} 人参与</span>
                                            </div>
                                            {meeting.isRecurring && (
                                                <div css={styles.infoItem}>
                                                    <SyncOutlined />
                                                    <span style={{ color: '#1890ff', fontSize: 13 }}>
                                                        {meeting.recurrencePattern}
                                                    </span>
                                                </div>
                                            )}
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
                                            <Space style={{ marginTop: 8 }}>
                                                <Button
                                                    icon={<EditOutlined />}
                                                    onClick={() => handleEditMeeting(meeting)}
                                                >
                                                    编辑
                                                </Button>
                                                <Button
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => handleDeleteMeeting(meeting)}
                                                >
                                                    删除
                                                </Button>
                                            </Space>
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
                                                <span>{meeting.date} {meeting.time}</span>
                                            </div>
                                            <div css={styles.infoItem}>
                                                <ClockCircleOutlined />
                                                <span>{meeting.duration} 分钟</span>
                                            </div>
                                            <div css={styles.infoItem}>
                                                <TeamOutlined />
                                                <span>{meeting.participants.length} 人参与</span>
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
                                                <Space>
                                                    <Button
                                                        icon={<EditOutlined />}
                                                        onClick={() => handleEditMeeting(meeting)}
                                                    >
                                                        编辑
                                                    </Button>
                                                    <Button
                                                        danger
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => handleDeleteMeeting(meeting)}
                                                    >
                                                        删除
                                                    </Button>
                                                </Space>
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
                                                <span>{meeting.date} {meeting.time}</span>
                                            </div>
                                            <div css={styles.infoItem}>
                                                <ClockCircleOutlined />
                                                <span>{meeting.duration} 分钟</span>
                                            </div>
                                            <div css={styles.infoItem}>
                                                <TeamOutlined />
                                                <span>{meeting.participants.length} 人参与</span>
                                            </div>
                                            {meeting.isRecurring && (
                                                <div css={styles.infoItem}>
                                                    <SyncOutlined />
                                                    <span style={{ color: '#8c8c8c', fontSize: 13 }}>
                                                        {meeting.recurrencePattern}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div css={styles.meetingActions}>
                                            <Space>
                                                <Button
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => handleDeleteMeeting(meeting)}
                                                >
                                                    删除
                                                </Button>
                                            </Space>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </Panel>
                    </Collapse>
                </div>
            )}

            {/* 创建会议弹窗 */}
            <Modal
                title={editingMeeting ? "编辑会议" : "预约会议"}
                open={createModalVisible}
                onCancel={() => {
                    setCreateModalVisible(false);
                    setEditingMeeting(null);
                    form.resetFields();
                    setRecurrenceType('none');
                    setEndType('date');
                    setRecurrenceType('none');
                }}
                footer={null}
                width={700}
                destroyOnClose
                centered
                bodyStyle={{
                    maxHeight: 'calc(100vh - 300px)',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    paddingRight: '32px'
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateMeeting}
                    initialValues={{
                        recurrenceType: 'none',
                        endType: 'date',
                        duration: 60,
                    }}
                >
                    <Form.Item
                        label="会议主题"
                        name="title"
                        rules={[{ required: true, message: '请输入会议主题' }]}
                    >
                        <Input
                            placeholder="输入会议主题"
                            prefix={<TeamOutlined />}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="会议类型"
                        name="meetingType"
                        rules={[{ required: true, message: '请选择会议类型' }]}
                    >
                        <Select
                            placeholder="选择会议类型"
                            size="large"
                        >
                            <Option value="productivity">产能会议</Option>
                            <Option value="quality">质量分析会议</Option>
                            <Option value="efficiency">效能会议</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="参会人员"
                        name="participants"
                        rules={[{ required: true, message: '请选择参会人员' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="选择参会人员"
                            size="large"
                            maxTagCount="responsive"
                        >
                            <Option value="user1">张三</Option>
                            <Option value="user2">李四</Option>
                            <Option value="user3">王五</Option>
                            <Option value="user4">赵六</Option>
                            <Option value="user5">钱七</Option>
                            <Option value="user6">孙八</Option>
                            <Option value="user7">周九</Option>
                            <Option value="user8">吴十</Option>
                        </Select>
                    </Form.Item>

                    <Space size="large" style={{ width: '100%' }}>
                        <Form.Item
                            label="开始日期"
                            name="date"
                            rules={[{ required: true, message: '请选择日期' }]}
                        >
                            <DatePicker
                                style={{ width: 200 }}
                                placeholder="选择日期"
                            />
                        </Form.Item>

                        <Form.Item
                            label="开始时间"
                            name="time"
                            rules={[{ required: true, message: '请选择时间' }]}
                        >
                            <TimePicker
                                style={{ width: 150 }}
                                format="HH:mm"
                                placeholder="选择时间"
                            />
                        </Form.Item>

                        <Form.Item
                            label="持续时间"
                            name="duration"
                            initialValue={60}
                        >
                            <InputNumber
                                placeholder="分钟"
                                addonAfter="分钟"
                                style={{ width: 120 }}
                                min={1}
                                max={1440}
                            />
                        </Form.Item>
                    </Space>

                    <Form.Item
                        label="会议描述"
                        name="description"
                    >
                        <TextArea
                            placeholder="添加会议描述（可选）"
                            rows={3}
                        />
                    </Form.Item>

                    {/* 重复设置 */}
                    <div css={styles.recurrenceSection}>
                        <div css={styles.recurrenceTitle}>
                            <SyncOutlined />
                            重复设置
                        </div>

                        <Form.Item
                            label="重复频率"
                            name="recurrenceType"
                        >
                            <Select
                                size="large"
                                onChange={(value) => setRecurrenceType(value)}
                            >
                                <Option value="none">不重复</Option>
                                <Option value="daily">每天</Option>
                                <Option value="weekly">每周</Option>
                                <Option value="monthly">每月</Option>
                            </Select>
                        </Form.Item>

                        {recurrenceType === 'weekly' && (
                            <Form.Item
                                label="重复日期"
                                name="weekdays"
                                rules={[{ required: true, message: '请选择至少一天' }]}
                            >
                                <Checkbox.Group>
                                    <div css={styles.weekdaysSelector}>
                                        <Checkbox value={1}>周一</Checkbox>
                                        <Checkbox value={2}>周二</Checkbox>
                                        <Checkbox value={3}>周三</Checkbox>
                                        <Checkbox value={4}>周四</Checkbox>
                                        <Checkbox value={5}>周五</Checkbox>
                                        <Checkbox value={6}>周六</Checkbox>
                                        <Checkbox value={0}>周日</Checkbox>
                                    </div>
                                </Checkbox.Group>
                            </Form.Item>
                        )}

                        {recurrenceType === 'monthly' && (
                            <Form.Item
                                label="每月重复方式"
                                name="monthlyType"
                                initialValue="date"
                            >
                                <Radio.Group>
                                    <Space direction="vertical">
                                        <Radio value="date">每月同一日期（如每月 15 号）</Radio>
                                        <Radio value="weekday">每月同一周几（如每月第二个周一）</Radio>
                                    </Space>
                                </Radio.Group>
                            </Form.Item>
                        )}

                        {recurrenceType !== 'none' && (
                            <div css={styles.recurrenceEndSection}>
                                <Form.Item
                                    label="结束条件"
                                    name="endType"
                                >
                                    <Radio.Group onChange={(e) => setEndType(e.target.value)}>
                                        <Space direction="vertical">
                                            <Radio value="date">结束日期</Radio>
                                            <Radio value="never">永不结束</Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>

                                {endType === 'date' && (
                                    <Form.Item
                                        name="endDate"
                                        rules={[{ required: true, message: '请选择结束日期' }]}
                                    >
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            placeholder="选择结束日期"
                                        />
                                    </Form.Item>
                                )}
                            </div>
                        )}
                    </div>

                    <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => {
                                setCreateModalVisible(false);
                                form.resetFields();
                                setRecurrenceType('none');
                            }}>
                                取消
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                icon={recurrenceType !== 'none' ? <SyncOutlined /> : <ClockCircleOutlined />}
                            >
                                {editingMeeting
                                    ? '更新会议'
                                    : (recurrenceType !== 'none' ? '创建重复会议' : '创建会议')
                                }
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default MyMeetings;
