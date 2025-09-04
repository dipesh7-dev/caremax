import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, TimePicker, Select, message } from 'antd';
import api from '../../api';

const WorkerIncidentsPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [incRes, partRes] = await Promise.all([
        api.get('/incidents'),
        api.get('/workers/me/participants')
      ]);
      setIncidents(incRes.data);
      setParticipants(partRes.data);
    } catch (err) {
      message.error('Failed to load incidents');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        title: values.title,
        date: values.date.toDate(),
        time: values.time.format('HH:mm'),
        participant: values.participant,
        type: values.type,
        description: values.description
      };
      await api.post('/incidents', payload);
      message.success('Incident logged');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      message.error('Failed to log incident');
    }
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Participant', render: (_, record) => record.participant?.firstName + ' ' + record.participant?.lastName },
    { title: 'Date', dataIndex: 'date', render: (d) => new Date(d).toLocaleDateString() },
    { title: 'Time', dataIndex: 'time' },
    { title: 'Status', dataIndex: 'status' }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Incidents</h2>
        <Button type="primary" onClick={handleAdd}>Log Incident</Button>
      </div>
      <Table dataSource={incidents} columns={columns} rowKey="_id" loading={loading} pagination={{ pageSize: 10 }} />
      <Modal title="Log Incident" open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
        <Form layout="vertical" form={form}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item name="participant" label="Participant" rules={[{ required: true }]}> 
            <Select showSearch optionFilterProp="label">
              {participants.map((p) => (
                <Select.Option key={p._id} value={p._id} label={`${p.firstName} ${p.lastName}`}>{p.firstName} {p.lastName}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="date" label="Date" rules={[{ required: true }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="time" label="Time" rules={[{ required: true }]}> <TimePicker format="HH:mm" style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="type" label="Type"> <Input /> </Form.Item>
          <Form.Item name="description" label="Description"> <Input.TextArea rows={3} /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkerIncidentsPage;