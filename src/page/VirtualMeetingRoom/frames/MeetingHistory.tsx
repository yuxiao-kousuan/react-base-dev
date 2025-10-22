/** @jsxImportSource @emotion/react */
import React, { ReactElement, useState } from 'react';
import { css } from '@emotion/react';
import { Card, Button, Tag, Space, Table, Modal, Statistic, Row, Col } from 'antd';
import {
    HistoryOutlined,
    ClockCircleOutlined,
    EyeOutlined,
    DownloadOutlined,
    TeamOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface HistoryMeeting {
    id: string;
    title: string;
    date: string;
    time: string;
    duration: number;
    actualDuration: number;
    meetingId: string;
    participants: number;
    status: 'completed' | 'cancelled' | 'missed';
    hasRecording: boolean;
    recordingUrl?: string;
}

const styles = {
    container: css`
        padding: 24px;

        @media (max-width: 768px) {
            padding: 16px;
        }
    `,

    statisticsSection: css`
        margin-bottom: 24px;

        .ant-card {
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        @media (max-width: 768px) {
            .ant-col {
                margin-bottom: 16px;
            }
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

    recordingBadge: css`
        background: #e6f7ff;
        padding: 4px 8px;
        border-radius: 4px;
        margin-top: 4px;

        .anticon {
            color: #1890ff;
        }

        span {
            color: #1890ff;
            font-weight: 500;
        }
    `,

    meetingId: css`
        padding: 8px 0;
        font-size: 13px;
        color: #666;
        border-top: 1px solid #f0f0f0;
        border-bottom: 1px solid #f0f0f0;
        margin-bottom: 16px;
    `,

    meetingActions: css`
        .ant-space {
            width: 100%;
            justify-content: flex-start;
        }
    `,

    tableView: css`
        background: #fff;
        padding: 16px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

        .ant-table {
            font-size: 14px;
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

    detailRow: css`
        display: flex;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
            border-bottom: none;
        }

        strong {
            width: 120px;
            color: #666;
            font-weight: 500;
        }

        span {
            flex: 1;
            color: #333;
        }
    `
};

function MeetingHistory(): ReactElement {
    const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
    const [selectedMeeting, setSelectedMeeting] = useState<HistoryMeeting | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);

    const historyMeetings: HistoryMeeting[] = [
        {
            id: '1',
            title: '产品设计评审',
            date: '2025-10-20',
            time: '14:00',
            duration: 120,
            actualDuration: 115,
            meetingId: '111-222-333',
            participants: 8,
            status: 'completed',
            hasRecording: true,
            recordingUrl: '/recordings/meeting1.mp4',
        },
        {
            id: '2',
            title: '技术架构讨论',
            date: '2025-10-18',
            time: '10:00',
            duration: 90,
            actualDuration: 95,
            meetingId: '444-555-666',
            participants: 6,
            status: 'completed',
            hasRecording: true,
            recordingUrl: '/recordings/meeting2.mp4',
        },
        {
            id: '3',
            title: '客户需求沟通',
            date: '2025-10-15',
            time: '15:30',
            duration: 60,
            actualDuration: 0,
            meetingId: '777-888-999',
            participants: 0,
            status: 'cancelled',
            hasRecording: false,
        },
        {
            id: '4',
            title: '团队建设活动',
            date: '2025-10-12',
            time: '16:00',
            duration: 90,
            actualDuration: 88,
            meetingId: '123-789-456',
            participants: 12,
            status: 'completed',
            hasRecording: false,
        },
        {
            id: '5',
            title: '季度总结会议',
            date: '2025-10-10',
            time: '09:00',
            duration: 180,
            actualDuration: 175,
            meetingId: '321-654-987',
            participants: 15,
            status: 'completed',
            hasRecording: true,
            recordingUrl: '/recordings/meeting5.mp4',
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

    const handleDownloadRecording = (meeting: HistoryMeeting) => {
        Modal.success({
            title: '下载录像',
            content: `正在下载会议"${meeting.title}"的录像...`,
        });
    };

    const stats = {
        total: historyMeetings.length,
        completed: historyMeetings.filter(m => m.status === 'completed').length,
        totalDuration: historyMeetings.reduce((sum, m) => sum + m.actualDuration, 0),
        totalParticipants: historyMeetings.reduce((sum, m) => sum + m.participants, 0),
    };

    const columns: ColumnsType<HistoryMeeting> = [
        {
            title: '会议主题',
            dataIndex: 'title',
            key: 'title',
            width: 250,
        },
        {
            title: '日期时间',
            key: 'datetime',
            width: 180,
            render: (_, record) => (
                <span>
                    {record.date} {record.time}
                </span>
            ),
        },
        {
            title: '时长',
            dataIndex: 'actualDuration',
            key: 'duration',
            width: 100,
            render: (duration) => `${duration} 分钟`,
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
            title: '录像',
            key: 'recording',
            width: 100,
            render: (_, record) => (
                record.hasRecording ? (
                    <Tag color="blue" icon={<FileTextOutlined />}>有录像</Tag>
                ) : (
                    <Tag>无录像</Tag>
                )
            ),
        },
        {
            title: '操作',
            key: 'actions',
            width: 200,
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(record)}
                    >
                        详情
                    </Button>
                    {record.hasRecording && (
                        <Button
                            type="link"
                            size="small"
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownloadRecording(record)}
                        >
                            下载
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div css={styles.container}>
            <div css={styles.statisticsSection}>
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="总会议数"
                                value={stats.total}
                                prefix={<HistoryOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="已完成"
                                value={stats.completed}
                                prefix={<CheckCircleOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="总时长"
                                value={stats.totalDuration}
                                suffix="分钟"
                                prefix={<ClockCircleOutlined />}
                                valueStyle={{ color: '#faad14' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="总参与人次"
                                value={stats.totalParticipants}
                                prefix={<TeamOutlined />}
                                valueStyle={{ color: '#722ed1' }}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

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
                <div css={styles.meetingsGrid}>
                    {historyMeetings.map(meeting => (
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
                            </div>

                            <div css={styles.meetingInfo}>
                                <div css={styles.infoItem}>
                                    <CalendarOutlined />
                                    <span>{meeting.date} {meeting.time}</span>
                                </div>
                                <div css={styles.infoItem}>
                                    <ClockCircleOutlined />
                                    <span>
                                        {meeting.status === 'completed'
                                            ? `实际时长: ${meeting.actualDuration} 分钟`
                                            : `计划时长: ${meeting.duration} 分钟`
                                        }
                                    </span>
                                </div>
                                <div css={styles.infoItem}>
                                    <TeamOutlined />
                                    <span>{meeting.participants} 人参与</span>
                                </div>
                                {meeting.hasRecording && (
                                    <div css={[styles.infoItem, styles.recordingBadge]}>
                                        <FileTextOutlined />
                                        <span>有录像可下载</span>
                                    </div>
                                )}
                            </div>

                            <div css={styles.meetingId}>
                                <span>会议ID: {meeting.meetingId}</span>
                            </div>

                            <div css={styles.meetingActions}>
                                <Space style={{ width: '100%' }}>
                                    <Button
                                        icon={<EyeOutlined />}
                                        onClick={() => handleViewDetail(meeting)}
                                    >
                                        查看详情
                                    </Button>
                                    {meeting.hasRecording && (
                                        <Button
                                            type="primary"
                                            icon={<DownloadOutlined />}
                                            onClick={() => handleDownloadRecording(meeting)}
                                        >
                                            下载录像
                                        </Button>
                                    )}
                                </Space>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div css={styles.tableView}>
                    <Table
                        columns={columns}
                        dataSource={historyMeetings}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                    />
                </div>
            )}

            <Modal
                title="会议详情"
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setDetailModalVisible(false)}>
                        关闭
                    </Button>,
                    selectedMeeting?.hasRecording && (
                        <Button
                            key="download"
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownloadRecording(selectedMeeting!)}
                        >
                            下载录像
                        </Button>
                    ),
                ]}
                width={600}
            >
                {selectedMeeting && (
                    <div css={styles.meetingDetail}>
                        <div css={styles.detailRow} className="detail-row">
                            <strong>会议主题：</strong>
                            <span>{selectedMeeting.title}</span>
                        </div>
                        <div css={styles.detailRow} className="detail-row">
                            <strong>会议ID：</strong>
                            <span>{selectedMeeting.meetingId}</span>
                        </div>
                        <div css={styles.detailRow} className="detail-row">
                            <strong>日期时间：</strong>
                            <span>{selectedMeeting.date} {selectedMeeting.time}</span>
                        </div>
                        <div css={styles.detailRow} className="detail-row">
                            <strong>计划时长：</strong>
                            <span>{selectedMeeting.duration} 分钟</span>
                        </div>
                        {selectedMeeting.status === 'completed' && (
                            <div css={styles.detailRow} className="detail-row">
                                <strong>实际时长：</strong>
                                <span>{selectedMeeting.actualDuration} 分钟</span>
                            </div>
                        )}
                        <div css={styles.detailRow} className="detail-row">
                            <strong>参与人数：</strong>
                            <span>{selectedMeeting.participants} 人</span>
                        </div>
                        <div css={styles.detailRow} className="detail-row">
                            <strong>会议状态：</strong>
                            {getStatusTag(selectedMeeting.status)}
                        </div>
                        <div css={styles.detailRow} className="detail-row">
                            <strong>录像状态：</strong>
                            <span>{selectedMeeting.hasRecording ? '有录像' : '无录像'}</span>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default MeetingHistory;
