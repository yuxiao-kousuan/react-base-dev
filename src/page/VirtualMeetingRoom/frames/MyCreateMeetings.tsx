/** @jsxImportSource @emotion/react */
import React, { ReactElement, useState } from 'react';
import { css } from '@emotion/react';
import { Card, Button, Tag, Space, Empty, Modal, message, Form, Input, DatePicker, Select, Radio, Checkbox, Badge, TreeSelect, Input as AntdInput, Pagination } from 'antd';
import {
    ClockCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    TeamOutlined,
    CalendarOutlined,
    PlusOutlined,
    SyncOutlined,
    UserOutlined,
    EnvironmentOutlined,
    SearchOutlined,
    CopyOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
const { Search } = AntdInput;

interface Participant {
    id: string;
    name: string;
}

interface RecurrenceConfig {
    type: 'none' | 'daily' | 'weekly' | 'monthly';
    weekdays?: number[];
    monthlyType?: 'date' | 'weekday';
    endType: 'date' | 'never';
    endDate?: string;
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
    participants: Participant[];
    locations?: string[];
    hasPassword: boolean;
    isRecurring?: boolean;
    recurrencePattern?: string;
    recurrenceConfig?: RecurrenceConfig;
}

const styles = {
    container: css`
        padding: 24px;

        @media (max-width: 768px) {
            padding: 16px;
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

    headerActions: css`
        display: flex;
        gap: 12px;
        align-items: center;

        @media (max-width: 768px) {
            width: 100%;
            
            button {
                flex: 1;
            }

            .ant-input-search {
                flex: 2;
            }
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
        border: 1px solid #d9d9d9;

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
        margin-top: 16px;

        .ant-space {
            width: 100%;
        }
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
    `,

    paginationContainer: css`
        display: flex;
        justify-content: center;
        margin-top: 16px;
        padding: 16px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    `
};

function MyCreateMeetings(): ReactElement {
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

    // 生成测试数据 - 只有当前用户创建的会议
    const initialMeetings: Meeting[] = [];
    for (let i = 1; i <= 15; i++) {
        const date = dayjs().add(i, 'day');
        initialMeetings.push({
            id: `created-${i}`,
            title: `我创建的会议 ${i}`,
            description: `这是我创建的第 ${i} 个会议`,
            meetingType: i % 3 === 0 ? 'quality' : i % 3 === 1 ? 'productivity' : 'efficiency',
            organizer: '当前用户',
            date: date.format('YYYY-MM-DD'),
            time: '10:00',
            duration: 60,
            meetingId: `MEET-${String(i).padStart(6, '0')}`,
            participants: [
                { id: 'user1', name: '张三' },
                { id: 'user2', name: '李四' },
                { id: 'user3', name: '王五' },
            ],
            locations: ['east-shanghai-a'],
            hasPassword: false,
            isRecurring: i % 4 === 0,
            recurrencePattern: i % 4 === 0 ? '每周重复' : undefined,
            recurrenceConfig: i % 4 === 0 ? {
                type: 'weekly',
                weekdays: [1],
                endType: 'never'
            } : undefined
        });
    }

    const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [recurrenceType, setRecurrenceType] = useState('none');
    const [endType, setEndType] = useState('date');
    const [meetingDuration, setMeetingDuration] = useState<number>(0);

    // 搜索和分页
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6); // 每页显示6个卡片

    // 过滤和分页
    const filteredMeetings = meetings.filter(meeting =>
        meeting.meetingId.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        meeting.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    const totalMeetings = filteredMeetings.length;
    const totalPages = Math.ceil(totalMeetings / pageSize);
    const paginatedMeetings = filteredMeetings.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleSearch = (value: string) => {
        setSearchKeyword(value);
        setCurrentPage(1);
    };

    const handleCopyMeetingId = (meetingId: string) => {
        navigator.clipboard.writeText(meetingId).then(() => {
            message.success('房间ID已复制到剪贴板');
        }).catch(() => {
            message.error('复制失败，请重试');
        });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePageSizeChange = (current: number, size: number) => {
        setCurrentPage(1);
        setPageSize(size);
    };

    const handleEditMeeting = (meeting: Meeting) => {
        setEditingMeeting(meeting);
        setCreateModalVisible(true);

        const recurrenceConfig = meeting.recurrenceConfig || {
            type: 'none',
            endType: 'date'
        };

        const meetingStart = dayjs(`${meeting.date} ${meeting.time}`, 'YYYY-MM-DD HH:mm');
        const meetingEnd = meetingStart.add(meeting.duration, 'minute');

        const formValues: any = {
            title: meeting.title,
            description: meeting.description,
            meetingType: meeting.meetingType,
            participants: meeting.participants.map(p => p.id),
            locations: meeting.locations || [],
            timeRange: [meetingStart, meetingEnd],
            recurrenceType: recurrenceConfig.type,
            endType: recurrenceConfig.endType,
        };

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
        setRecurrenceType(recurrenceConfig.type);
        setEndType(recurrenceConfig.endType);
        setMeetingDuration(meeting.duration);
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
                // 如果当前页没有数据了，返回上一页
                const newFiltered = meetings.filter(m => m.id !== meeting.id &&
                    (m.meetingId.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                        m.title.toLowerCase().includes(searchKeyword.toLowerCase()))
                );
                if ((currentPage - 1) * pageSize >= newFiltered.length && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
            },
        });
    };

    const handleOpenCreateModal = () => {
        setEditingMeeting(null);
        form.resetFields();
        setRecurrenceType('none');
        setEndType('date');
        setMeetingDuration(0);
        setCreateModalVisible(true);
    };

    const handleCreateMeeting = async (values: any) => {
        setLoading(true);
        try {
            console.log(editingMeeting ? '编辑会议:' : '创建会议:', values);

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

                recurrenceConfig = {
                    type: recurrenceType as 'daily' | 'weekly' | 'monthly',
                    endType: values.endType || 'date',
                    weekdays: values.weekdays,
                    monthlyType: values.monthlyType,
                    endDate: values.endDate?.format('YYYY-MM-DD')
                };
            }

            await new Promise(resolve => setTimeout(resolve, 1000));

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

            const [startTime, endTime] = values.timeRange;
            const meetingDate = startTime.format('YYYY-MM-DD');
            const meetingTime = startTime.format('HH:mm');
            const duration = endTime.diff(startTime, 'minute');

            if (editingMeeting) {
                const updatedMeeting: Meeting = {
                    ...editingMeeting,
                    title: values.title,
                    description: values.description,
                    meetingType: values.meetingType,
                    date: meetingDate,
                    time: meetingTime,
                    duration: duration,
                    participants: selectedParticipants,
                    locations: values.locations || [],
                    isRecurring: recurrenceType !== 'none',
                    recurrencePattern: recurrenceType !== 'none' ? recurrenceDesc : undefined,
                    recurrenceConfig: recurrenceConfig,
                };

                setMeetings(meetings.map(m => m.id === editingMeeting.id ? updatedMeeting : m));
                message.success('会议更新成功！');
            } else {
                const newMeeting: Meeting = {
                    id: Date.now().toString(),
                    title: values.title,
                    description: values.description,
                    meetingType: values.meetingType,
                    organizer: '当前用户',
                    date: meetingDate,
                    time: meetingTime,
                    duration: duration,
                    participants: selectedParticipants,
                    locations: values.locations || [],
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
                setCurrentPage(1);
            }

            form.resetFields();
            setCreateModalVisible(false);
            setEditingMeeting(null);
            setRecurrenceType('none');
            setEndType('date');
        } catch (error) {
            message.error(editingMeeting ? '更新会议失败，请重试' : '创建会议失败，请重试');
        } finally {
            setLoading(false);
        }
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

    return (
        <div css={styles.container}>
            <div css={styles.pageHeader}>
                <h1>我创建的会议</h1>
                <div css={styles.headerActions}>
                    <Search
                        placeholder="搜索房间ID或会议标题"
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                        onSearch={handleSearch}
                        onChange={(e) => {
                            if (!e.target.value) handleSearch('');
                        }}
                        style={{ width: 300 }}
                    />
                    <Button
                        type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={handleOpenCreateModal}
                    >
                        创建会议
                    </Button>
                </div>
            </div>

            {paginatedMeetings.length > 0 ? (
                <>
                    <div css={styles.meetingsGrid}>
                        {paginatedMeetings.map(meeting => (
                            <Card
                                key={meeting.id}
                                css={styles.meetingCard}
                                hoverable
                            >
                                <div css={styles.meetingHeader}>
                                    <div css={styles.meetingTitleRow}>
                                        <h3>
                                            {meeting.isRecurring && <SyncOutlined style={{ marginRight: 6, fontSize: 16 }} />}
                                            {meeting.title}
                                        </h3>
                                        {getMeetingTypeTag(meeting.meetingType)}
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
                                        <ClockCircleOutlined />
                                        <span>持续时间：{formatDuration(meeting.duration)}</span>
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
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div css={styles.paginationContainer}>
                        <Pagination
                            current={currentPage}
                            total={totalMeetings}
                            pageSize={pageSize}
                            showSizeChanger
                            showQuickJumper
                            pageSizeOptions={['5', '10', '20', '50', '100']}
                            showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
                            onChange={handlePageChange}
                            onShowSizeChange={handlePageSizeChange}
                        />
                    </div>
                </>
            ) : (
                <Empty
                    description="暂无创建的会议"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            )}

            {/* 创建会议弹窗 */}
            <Modal
                title={editingMeeting ? "编辑会议" : "创建会议"}
                open={createModalVisible}
                onCancel={() => {
                    setCreateModalVisible(false);
                    setEditingMeeting(null);
                    form.resetFields();
                    setRecurrenceType('none');
                    setEndType('date');
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

                    <Form.Item
                        label="会议地址"
                        name="locations"
                        rules={[{ required: true, message: '请选择会议地址' }]}
                    >
                        <TreeSelect
                            treeData={locationTreeData}
                            placeholder="请选择区域、工厂和生产线（可多选）"
                            size="large"
                            multiple
                            treeCheckable
                            showCheckedStrategy={TreeSelect.SHOW_CHILD}
                            showSearch
                            treeNodeFilterProp="title"
                            filterTreeNode={(input, treeNode) => {
                                const title = treeNode.title as string;
                                return title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                            }}
                            maxTagCount="responsive"
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeDefaultExpandAll={false}
                        />
                    </Form.Item>

                    <Form.Item label="会议时间">
                        <Space style={{ width: '100%', display: 'flex', alignItems: 'flex-start' }}>
                            <Form.Item
                                name="timeRange"
                                rules={[{ required: true, message: '请选择会议开始和结束时间' }]}
                                noStyle
                            >
                                <RangePicker
                                    showTime={{ format: 'HH:mm' }}
                                    format="YYYY-MM-DD HH:mm"
                                    placeholder={['开始时间', '结束时间']}
                                    size="large"
                                    onChange={(dates) => {
                                        if (dates && dates[0] && dates[1]) {
                                            const duration = dates[1].diff(dates[0], 'minute');
                                            setMeetingDuration(duration);
                                        } else {
                                            setMeetingDuration(0);
                                        }
                                    }}
                                />
                            </Form.Item>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                height: '40px',
                                padding: '0 12px',
                                background: '#f5f5f5',
                                borderRadius: '6px',
                                minWidth: '120px',
                                whiteSpace: 'nowrap'
                            }}>
                                <ClockCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                                <span style={{ fontWeight: 500, color: '#333' }}>
                                    {formatDuration(meetingDuration)}
                                </span>
                            </div>
                        </Space>
                    </Form.Item>

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

export default MyCreateMeetings;
