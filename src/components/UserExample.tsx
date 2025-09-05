import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { userStore } from '@src/stores';

const UserExample: React.FC = () => {
  useEffect(() => {
    userStore.fetchUsers();
  }, []);

  const handleAddUser = () => {
    const newUser = {
      name: `用户${Date.now()}`,
      email: `user${Date.now()}@example.com`,
    };
    userStore.addUser(newUser);
  };

  const handleRemoveUser = (id: number) => {
    userStore.removeUser(id);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>用户管理示例</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={userStore.fetchUsers} disabled={userStore.loading}>
          {userStore.loading ? '加载中...' : '刷新用户列表'}
        </button>
        <button onClick={handleAddUser} style={{ marginLeft: '10px' }}>
          添加用户
        </button>
      </div>

      {userStore.error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          错误: {userStore.error}
        </div>
      )}

      <div>
        <h4>用户列表 ({userStore.users.length})</h4>
        {userStore.users.length === 0 ? (
          <p>暂无用户</p>
        ) : (
          <ul>
            {userStore.users.map((user: any) => (
              <li key={user.id} style={{ marginBottom: '10px' }}>
                <strong>{user.name}</strong> - {user.email}
                <button 
                  onClick={() => handleRemoveUser(user.id)}
                  style={{ marginLeft: '10px', color: 'red' }}
                >
                  删除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {userStore.currentUser && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
          <h4>当前用户</h4>
          <p>姓名: {userStore.currentUser.name}</p>
          <p>邮箱: {userStore.currentUser.email}</p>
        </div>
      )}
    </div>
  );
};

export default observer(UserExample);
