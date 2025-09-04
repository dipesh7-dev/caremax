import React, { useEffect, useState, useContext } from 'react';
import { Card, Input, Button, message } from 'antd';
import api from '../../api.js';
import { AuthContext } from '../../AuthContext.jsx';

/**
 * MessagesPage (Worker)
 *
 * Workers communicate with the organisation’s admin via this page.  The
 * conversation history with the admin is displayed chronologically.  Messages
 * sent by the worker appear aligned to the right and messages from the
 * admin align to the left.  Sending a message automatically targets the
 * admin user (handled server-side via the 'admin' keyword on the receiver).
 */
const MessagesPage = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchConversation();
    // Poll for new messages every 15 seconds
    const interval = setInterval(fetchConversation, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchConversation = async () => {
    try {
      // Use special query param 'admin' to resolve admin user ID on server
      const res = await api.get('/messages', { params: { userId: 'admin' } });
      setMessages(res.data || []);
    } catch (err) {
      message.error('Failed to load messages');
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      await api.post('/messages', { receiver: 'admin', body: newMessage.trim() });
      setNewMessage('');
      fetchConversation();
    } catch (err) {
      message.error('Failed to send message');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-3">Messages with Admin</h2>
      <div className="flex-1 overflow-y-auto mb-4 pr-4">
        {messages.length === 0 && (
          <p>No messages yet. Start the conversation!</p>
        )}
        {messages.map((msg) => {
          // Align right if current user is the sender
          const alignRight = user && msg.sender === user._id;
          return (
            <div key={msg._id} className={`flex ${alignRight ? 'justify-end' : 'justify-start'} mb-2`}>
              <Card
                size="small"
                className={alignRight ? '!bg-emerald-600 !text-white' : '!bg-gray-100'}
                style={{ maxWidth: '70%' }}
                bodyStyle={{ padding: '8px 12px' }}
              >
                {msg.body}
              </Card>
            </div>
          );
        })}
      </div>
      <div className="flex items-center space-x-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onPressEnter={handleSend}
          placeholder="Type your message..."
        />
        <Button type="primary" onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
};

export default MessagesPage;