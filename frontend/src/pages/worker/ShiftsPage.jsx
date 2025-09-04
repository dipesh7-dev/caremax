import React, { useEffect, useState } from 'react';
import { Table, Select, message } from 'antd';
import api from '../../api';

const ShiftsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data);
    } catch (err) {
      message.error('Failed to load shifts');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const respond = async (id, workerResponse) => {
    try {
      await api.put(`/appointments/${id}`, { workerResponse });
      message.success('Response updated');
      fetchAppointments();
    } catch (err) {
      message.error('Failed to update response');
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
    { title: 'Start', dataIndex: 'startTime' },
    { title: 'End', dataIndex: 'endTime' },
    {
      title: 'Response',
      render: (_, record) => (
        <Select value={record.workerResponse} onChange={(value) => respond(record._id, value)} style={{ width: 140 }}>
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="accepted">Accept</Select.Option>
          <Select.Option value="declined">Decline</Select.Option>
        </Select>
      )
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Shifts</h2>
      <Table dataSource={appointments} columns={columns} rowKey="_id" loading={loading} pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default ShiftsPage;