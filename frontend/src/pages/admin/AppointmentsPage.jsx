import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Select, DatePicker, TimePicker, message } from 'antd';
import api from '../../api';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchAll = async () => {
    try {
      const [appsRes, participantsRes, workersRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/participants'),
        api.get('/workers')
      ]);
      setAppointments(appsRes.data);
      setParticipants(participantsRes.data);
      setWorkers(workersRes.data);
    } catch (err) {
      message.error('Failed to load data');
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const date = values.date.toDate();
      const payload = {
        participant: values.participant,
        worker: values.worker,
        date,
        startTime: values.startTime.format('HH:mm'),
        endTime: values.endTime.format('HH:mm')
      };
      await api.post('/appointments', payload);
      message.success('Appointment created');
      setIsModalOpen(false);
      fetchAll();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to create');
    }
  };

  const columns = [
    {
      title: 'Participant',
      render: (_, record) => record.participant?.firstName + ' ' + record.participant?.lastName
    },
    {
      title: 'Worker',
      render: (_, record) => record.worker?.user?.name
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime'
    },
    {
      title: 'End Time',
      dataIndex: 'endTime'
    },
    {
      title: 'Status',
      dataIndex: 'status'
    },
    {
      title: 'Worker Response',
      dataIndex: 'workerResponse'
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Appointments</h2>
        <Button type="primary" onClick={handleAdd}>Add Appointment</Button>
      </div>
      <Table dataSource={appointments} columns={columns} rowKey="_id" pagination={{ pageSize: 10 }} />
      <Modal title="Add Appointment" open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
        <Form layout="vertical" form={form}>
          <Form.Item name="participant" label="Participant" rules={[{ required: true }]}> 
            <Select showSearch optionFilterProp="label">
              {participants.map((p) => (
                <Select.Option key={p._id} value={p._id} label={`${p.firstName} ${p.lastName}`}>{p.firstName} {p.lastName}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="worker" label="Worker" rules={[{ required: true }]}> 
            <Select showSearch optionFilterProp="label">
              {workers.map((w) => (
                <Select.Option key={w._id} value={w._id} label={w.user?.name}>{w.user?.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="date" label="Date" rules={[{ required: true }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="startTime" label="Start Time" rules={[{ required: true }]}> <TimePicker format="HH:mm" style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="endTime" label="End Time" rules={[{ required: true }]}> <TimePicker format="HH:mm" style={{ width: '100%' }} /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AppointmentsPage;