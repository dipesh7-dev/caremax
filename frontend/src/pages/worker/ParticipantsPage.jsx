import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import api from '../../api';

const WorkerParticipantsPage = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const res = await api.get('/workers/me/participants');
      setParticipants(res.data);
    } catch (err) {
      message.error('Failed to load participants');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const handleAddNote = (participant) => {
    setSelectedParticipant(participant);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await api.post('/progress-notes', {
        participant: selectedParticipant._id,
        note: values.note
      });
      message.success('Note added');
      setIsModalOpen(false);
    } catch (err) {
      message.error('Failed to add note');
    }
  };

  const columns = [
    { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
    { title: 'NDIS #', dataIndex: 'ndisNumber', key: 'ndisNumber' },
    {
      title: 'Action',
      render: (_, record) => (
        <Button type="link" onClick={() => handleAddNote(record)}>
          Add Note
        </Button>
      )
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Participants</h2>
      <Table dataSource={participants} columns={columns} rowKey="_id" loading={loading} pagination={{ pageSize: 10 }} />
      <Modal title="Add Progress Note" open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
        <Form layout="vertical" form={form}>
          <Form.Item name="note" label="Note" rules={[{ required: true }]}> 
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkerParticipantsPage;