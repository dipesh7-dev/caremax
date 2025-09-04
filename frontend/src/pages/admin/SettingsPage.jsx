import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import api from '../../api';

const SettingsPage = () => {
  const [form] = Form.useForm();

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      form.setFieldsValue(res.data);
    } catch (err) {
      message.error('Failed to load settings');
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const onFinish = async (values) => {
    try {
      await api.put('/settings', values);
      message.success('Settings updated');
    } catch (err) {
      message.error('Failed to update settings');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item name="orgName" label="Organisation Name"> <Input /> </Form.Item>
        <Form.Item name="address" label="Address"> <Input /> </Form.Item>
        <Form.Item name="phone" label="Phone"> <Input /> </Form.Item>
        <Form.Item name="email" label="Email"> <Input /> </Form.Item>
        <Button type="primary" htmlType="submit">Save</Button>
      </Form>
    </div>
  );
};

export default SettingsPage;