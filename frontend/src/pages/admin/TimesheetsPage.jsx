import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Select, message } from 'antd';
import api from '../../api';

const TimesheetsPage = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTimesheets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/timesheets');
      setTimesheets(res.data);
    } catch (err) {
      message.error('Failed to load timesheets');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTimesheets();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/timesheets/${id}`, { status });
      message.success('Status updated');
      fetchTimesheets();
    } catch (err) {
      message.error('Failed to update status');
    }
  };

  const columns = [
    {
      title: 'Worker',
      key: 'worker',
      render: (_, record) => record.worker?.user?.name || record.worker?.name
    },
    {
      title: 'Participant',
      key: 'participant',
      render: (_, record) => record.participant?.firstName + ' ' + record.participant?.lastName
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Hours',
      dataIndex: 'hours',
      key: 'hours'
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Select
          value={record.status}
          onChange={(value) => updateStatus(record._id, value)}
          style={{ width: 120 }}
        >
          <Select.Option value="submitted">Submitted</Select.Option>
          <Select.Option value="approved">Approved</Select.Option>
          <Select.Option value="rejected">Rejected</Select.Option>
        </Select>
      )
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Timesheets</h2>
      <Table dataSource={timesheets} columns={columns} rowKey="_id" loading={loading} pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default TimesheetsPage;