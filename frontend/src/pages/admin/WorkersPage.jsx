import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import api from '../../api';

const WorkersPage = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/workers');
      setWorkers(res.data);
    } catch (err) {
      message.error('Failed to load workers');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await api.post('/workers', values);
      message.success('Worker added');
      setIsModalOpen(false);
      fetchWorkers();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to add worker');
    }
  };

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => record.user?.name
    },
    {
      title: 'Email',
      key: 'email',
      render: (_, record) => record.user?.email
    },
    {
      title: 'Phone',
      key: 'phone',
      render: (_, record) => record.user?.phone
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Workers</h2>
        <Button type="primary" onClick={handleAdd}>Add Worker</Button>
      </div>
      <Table dataSource={workers} columns={columns} rowKey="_id" loading={loading} pagination={{ pageSize: 10 }} />
      <Modal title="Add Worker" open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}> <Input /> </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}> <Input.Password /> </Form.Item>
          <Form.Item name="phone" label="Phone"> <Input /> </Form.Item>
          <Form.Item name="address" label="Address"> <Input /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkersPage;