import React, { ReactElement } from 'react';
import './index.less';

function Users(): ReactElement {
    return (
        <div className="users-page">
            <div className="page-header">
                <h1>👥 用户管理</h1>
                <p>管理系统中的所有用户信息和权限。</p>
            </div>

            <div className="users-content">
                <div className="users-toolbar">
                    <div className="search-box">
                        <input type="text" placeholder="搜索用户..." />
                        <button>🔍</button>
                    </div>
                    <button className="add-user-btn">+ 添加用户</button>
                </div>

                <div className="users-table">
                    <table>
                        <thead>
                            <tr>
                                <th>头像</th>
                                <th>姓名</th>
                                <th>邮箱</th>
                                <th>角色</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><div className="avatar">👤</div></td>
                                <td>张三</td>
                                <td>zhangsan@example.com</td>
                                <td><span className="role admin">管理员</span></td>
                                <td><span className="status active">活跃</span></td>
                                <td>
                                    <button className="btn-edit">编辑</button>
                                    <button className="btn-delete">删除</button>
                                </td>
                            </tr>
                            <tr>
                                <td><div className="avatar">👤</div></td>
                                <td>李四</td>
                                <td>lisi@example.com</td>
                                <td><span className="role user">普通用户</span></td>
                                <td><span className="status active">活跃</span></td>
                                <td>
                                    <button className="btn-edit">编辑</button>
                                    <button className="btn-delete">删除</button>
                                </td>
                            </tr>
                            <tr>
                                <td><div className="avatar">👤</div></td>
                                <td>王五</td>
                                <td>wangwu@example.com</td>
                                <td><span className="role user">普通用户</span></td>
                                <td><span className="status inactive">非活跃</span></td>
                                <td>
                                    <button className="btn-edit">编辑</button>
                                    <button className="btn-delete">删除</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Users;
