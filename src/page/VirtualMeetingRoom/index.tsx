/** @jsxImportSource @emotion/react */
import React, { ReactElement, useState } from 'react';
import { css } from '@emotion/react';
import { Tabs } from 'antd';
import {
    CalendarOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import MyMeetings from './frames/MyMeetings';
import MeetingHistory from './frames/MeetingHistory';
const { TabPane } = Tabs;

const styles = {
    pageContainer: css`
        min-height: 100vh;
        background: #f0f2f5;
    `,

    pageContent: css`
        max-width: 1400px;
        margin: 0 auto;
        padding: 0;
    `,

    styledTabs: css`
        background: transparent;

        .ant-tabs-nav {
            background: #fff;
            margin: 0;
            padding: 0 24px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

            &::before {
                border-bottom: none;
            }
        }

        .ant-tabs-tab {
            padding: 16px 24px;
            font-size: 16px;
            font-weight: 500;
            margin: 0 4px;
            border-radius: 8px 8px 0 0;
            transition: all 0.3s;

            &:hover {
                color: #667eea;
            }

            .anticon {
                margin-right: 8px;
                font-size: 18px;
            }
        }

        .ant-tabs-tab-active {
            background: #f0f2f5;

            .ant-tabs-tab-btn {
                color: #667eea;
                font-weight: 600;
            }
        }

        .ant-tabs-ink-bar {
            background: #667eea;
            height: 3px;
        }

        .ant-tabs-content {
            background: transparent;
            min-height: calc(100vh - 180px);
        }

        .ant-tabs-tabpane {
            padding: 0;
        }

        @media (max-width: 768px) {
            .ant-tabs-nav {
                padding: 0 12px;
            }

            .ant-tabs-tab {
                padding: 12px 16px;
                font-size: 14px;

                .anticon {
                    font-size: 16px;
                }

                span {
                    display: flex;
                    align-items: center;
                }
            }
        }

        @media (max-width: 480px) {
            .ant-tabs-tab {
                padding: 10px 12px;
                font-size: 13px;
                margin: 0 2px;

                span {
                    font-size: 13px;
                }
            }
        }
    `
};

function VirtualMeetingRoom(): ReactElement {
    const [activeTab, setActiveTab] = useState('my');

    return (
        <div css={styles.pageContainer}>

            <div css={styles.pageContent}>
                <Tabs
                    css={styles.styledTabs}
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    size="large"
                    type="card"
                >
                    <TabPane
                        tab={
                            <span>
                                <CalendarOutlined />
                                我的会议
                            </span>
                        }
                        key="my"
                    >
                        <MyMeetings />
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <HistoryOutlined />
                                历史会议
                            </span>
                        }
                        key="history"
                    >
                        <MeetingHistory />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
}

export default VirtualMeetingRoom;
