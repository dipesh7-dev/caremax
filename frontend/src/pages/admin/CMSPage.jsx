import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import api from '../../api';

const CMSPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cms');
      setItems(res.data);
    } catch (err) {
      message.error('Failed to load content');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await api.post('/cms', values);
      message.success('Content created');
      setIsModalOpen(false);
      fetchItems();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to create');
    }
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Created', dataIndex: 'createdAt', key: 'createdAt', render: (d) => new Date(d).toLocaleDateString() }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">CMS</h2>
        <Button type="primary" onClick={handleAdd}>Add Content</Button>
      </div>
      <Table dataSource={items} columns={columns} rowKey="_id" loading={loading} pagination={{ pageSize: 10 }} />
      <Modal title="Add Content" open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
        <Form layout="vertical" form={form}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item name="category" label="Category"> <Input /> </Form.Item>
          <Form.Item name="content" label="Content"> <Input.TextArea rows={4} /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CMSPage;