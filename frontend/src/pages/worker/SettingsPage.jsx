import React, { useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import api from '../../api';

const WorkerSettingsPage = () => {
  const [form] = Form.useForm();

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      form.setFieldsValue(res.data);
    } catch (err) {
      message.error('Failed to load user');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const onFinish = async (values) => {
    try {
      await api.put('/auth/me', values);
      message.success('Profile updated');
    } catch (err) {
      message.error('Failed to update profile');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item name="name" label="Name"> <Input /> </Form.Item>
        <Form.Item name="email" label="Email"> <Input disabled /> </Form.Item>
        <Form.Item name="phone" label="Phone"> <Input /> </Form.Item>
        <Form.Item name="address" label="Address"> <Input /> </Form.Item>
        <Form.Item name="password" label="New Password"> <Input.Password /> </Form.Item>
        <Button type="primary" htmlType="submit">Save</Button>
      </Form>
    </div>
  );
};

export default WorkerSettingsPage;