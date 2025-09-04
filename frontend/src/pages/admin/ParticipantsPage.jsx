import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Space } from 'antd';
import api from '../../api';

const ParticipantsPage = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [emailAddress, setEmailAddress] = useState('');
  const [form] = Form.useForm();

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const res = await api.get('/participants');
      setParticipants(res.data);
    } catch (err) {
      message.error('Failed to load participants');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await api.post('/participants', values);
      message.success('Participant added');
      setIsModalOpen(false);
      fetchParticipants();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to add participant');
    }
  };

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName'
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName'
    },
    {
      title: 'NDIS #',
      dataIndex: 'ndisNumber',
      key: 'ndisNumber'
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button size="small" onClick={() => handleDownload(record._id)}>Download PDF</Button>
          <Button size="small" onClick={() => handleOpenEmail(record)}>Send Report</Button>
        </Space>
      )
    }
  ];

  // Download report as PDF for a participant
  const handleDownload = async (id) => {
    try {
      const res = await api.get(`/reports/participant/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `participant_${id}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      message.error('Failed to download report');
    }
  };

  // Open email modal for selected participant
  const handleOpenEmail = (participant) => {
    setSelectedParticipant(participant);
    // Pre-fill email address if participant has one
    setEmailAddress(participant.email || '');
    setEmailModalOpen(true);
  };

  // Send report via email
  const handleSendEmail = async () => {
    if (!selectedParticipant || !emailAddress) return;
    try {
      await api.post(`/reports/participant/${selectedParticipant._id}/send`, { email: emailAddress });
      message.success('Report emailed successfully');
      setEmailModalOpen(false);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to send report');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Participants</h2>
        <Button type="primary" onClick={handleAdd}>Add Participant</Button>
      </div>
      <Table dataSource={participants} columns={columns} rowKey="_id" loading={loading} pagination={{ pageSize: 10 }} />
      <Modal title="Add Participant" open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
        <Form layout="vertical" form={form}>
          <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="ndisNumber" label="NDIS Number"> 
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone"> 
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={`Send Report to ${selectedParticipant?.firstName || selectedParticipant?.name || ''}`}
        open={emailModalOpen}
        onOk={handleSendEmail}
        onCancel={() => setEmailModalOpen(false)}
        okText="Send"
      >
        <p className="mb-2">Enter the participant's email address:</p>
        <Input
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          placeholder="example@mail.com"
        />
      </Modal>
    </div>
  );
};

export default ParticipantsPage;