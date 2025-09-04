import React, { useEffect, useState } from 'react';
import { List, Avatar, Input, Button, Card, message, Divider } from 'antd';
import api from '../../api';

/**
 * MessagesPage (Admin)
 *
 * This page allows administrators to communicate with workers.  It
 * presents a list of workers on the left and the conversation history
 * with the selected worker on the right.  Admins can send messages to
 * the worker via a simple input box.  Messages authored by the admin
 * appear aligned to the right while messages from the worker align to the
 * left for a chat-like feel.
 */
const MessagesPage = () => {
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWorkers();
  }, []);

  // Fetch list of workers
  const fetchWorkers = async () => {
    try {
      const res = await api.get('/workers');
      setWorkers(res.data);
    } catch (err) {
      message.error('Failed to load workers');
    }
  };

  // Fetch messages for selected worker
  const fetchMessages = async (workerId) => {
    if (!workerId) return;
    setLoading(true);
    try {
      const res = await api.get('/messages', { params: { userId: workerId } });
      setMessages(res.data || []);
    } catch (err) {
      message.error('Failed to load messages');
    }
    setLoading(false);
  };

  const handleSelectWorker = (worker) => {
    setSelectedWorker(worker);
    fetchMessages(worker.user?._id || worker._id);
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    if (!selectedWorker) return;
    try {
      const receiverId = selectedWorker.user ? selectedWorker.user._id : selectedWorker._id;
      await api.post('/messages', { receiver: receiverId, body: newMessage.trim() });
      setNewMessage('');
      fetchMessages(receiverId);
    } catch (err) {
      message.error('Failed to send message');
    }
  };

  return (
    <div className="flex h-full">
      {/* Worker list */}
      <div className="w-1/3 pr-4 border-r">
        <h2 className="text-lg font-semibold mb-3">Workers</h2>
        <List
          dataSource={workers}
          rowKey={(item) => item._id}
          renderItem={(item) => (
            <List.Item
              className={`cursor-pointer px-2 py-2 rounded-md mb-1 ${
                selectedWorker &&
                (selectedWorker._id === item._id || selectedWorker.user?._id === item._id)
                  ? 'bg-blue-100'
                  : ''
              }`}
              onClick={() => handleSelectWorker(item)}
            >
              <List.Item.Meta
                avatar={<Avatar>{item.name?.charAt(0)}</Avatar>}
                title={item.name || item.user?.name}
                description={item.user?.email || item.email}
              />
            </List.Item>
          )}
        />
      </div>
      {/* Conversation */}
      <div className="flex-1 flex flex-col">
        <h2 className="text-lg font-semibold mb-3">Conversation</h2>
        <div className="flex-1 overflow-y-auto mb-4 pr-4">
          {selectedWorker ? (
            messages.length ? (
              messages.map((msg) => {
                const isSenderAdmin = msg.sender !== (selectedWorker.user?._id || selectedWorker._id);
                return (
                  <div key={msg._id} className={`flex ${isSenderAdmin ? 'justify-end' : 'justify-start'} mb-2`}>
                    <Card
                      size="small"
                      className={isSenderAdmin ? '!bg-blue-500 !text-white' : '!bg-gray-100'}
                      style={{ maxWidth: '70%' }}
                      bodyStyle={{ padding: '8px 12px' }}
                    >
                      {msg.body}
                    </Card>
                  </div>
                );
              })
            ) : (
              <p>No messages yet. Start the conversation!</p>
            )
          ) : (
            <p>Select a worker to view conversation</p>
          )}
        </div>
        {selectedWorker && (
          <div className="flex items-center space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onPressEnter={handleSend}
              placeholder="Type your message..."
            />
            <Button type="primary" onClick={handleSend}>Send</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;