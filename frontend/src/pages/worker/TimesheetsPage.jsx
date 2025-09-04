import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, message, Select } from 'antd';
import api from '../../api';

const WorkerTimesheetsPage = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tsRes, participantsRes] = await Promise.all([
        api.get('/timesheets'),
        api.get('/workers/me/participants')
      ]);
      setTimesheets(tsRes.data);
      setParticipants(participantsRes.data);
    } catch (err) {
      message.error('Failed to load timesheets');
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
        participant: values.participant,
        date: values.date.toDate(),
        hours: parseFloat(values.hours),
        notes: values.notes
      };
      await api.post('/timesheets', payload);
      message.success('Timesheet submitted');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to submit timesheet');
    }
  };

  const columns = [
    {
      title: 'Participant',
      render: (_, record) => record.participant?.firstName + ' ' + record.participant?.lastName
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: (d) => new Date(d).toLocaleDateString()
    },
    { title: 'Hours', dataIndex: 'hours', key: 'hours' },
    { title: 'Notes', dataIndex: 'notes', key: 'notes' },
    { title: 'Status', dataIndex: 'status', key: 'status' }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Timesheets</h2>
        <Button type="primary" onClick={handleAdd}>Submit Timesheet</Button>
      </div>
      <Table dataSource={timesheets} columns={columns} rowKey="_id" loading={loading} pagination={{ pageSize: 10 }} />
      <Modal title="Submit Timesheet" open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
        <Form layout="vertical" form={form}>
          <Form.Item name="participant" label="Participant" rules={[{ required: true }]}> 
            <Select showSearch optionFilterProp="label">
              {participants.map((p) => (
                <Select.Option key={p._id} value={p._id} label={`${p.firstName} ${p.lastName}`}>{p.firstName} {p.lastName}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="date" label="Date" rules={[{ required: true }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="hours" label="Hours" rules={[{ required: true }]}> <Input type="number" step="0.1" /> </Form.Item>
          <Form.Item name="notes" label="Notes"> <Input.TextArea rows={3} /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkerTimesheetsPage;