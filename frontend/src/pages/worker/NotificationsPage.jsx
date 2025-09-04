import React, { useEffect, useState } from 'react';
import { List, Button, Tag, message } from 'antd';
import api from '../../api';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      message.error('Failed to load notifications');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      message.error('Failed to mark as read');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        loading={loading}
        renderItem={(item) => (
          <List.Item
            actions={[
              !item.read && (
                <Button type="link" onClick={() => markRead(item._id)}>Mark as read</Button>
              )
            ]}
          >
            <List.Item.Meta
              title={<span>{item.message}</span>}
              description={new Date(item.createdAt).toLocaleString()}
            />
            {item.read ? <Tag color="green">Read</Tag> : <Tag color="red">Unread</Tag>}
          </List.Item>
        )}
      />
    </div>
  );
};

export default NotificationsPage;