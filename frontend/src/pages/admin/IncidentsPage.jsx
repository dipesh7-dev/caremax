import React, { useEffect, useState } from 'react';
import { Table, Select, message } from 'antd';
import api from '../../api';

const IncidentsPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/incidents');
      setIncidents(res.data);
    } catch (err) {
      message.error('Failed to load incidents');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/incidents/${id}`, { status });
      message.success('Status updated');
      fetchIncidents();
    } catch (err) {
      message.error('Failed to update status');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title'
    },
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
      render: (d) => new Date(d).toLocaleDateString()
    },
    {
      title: 'Status',
      render: (_, record) => (
        <Select value={record.status} onChange={(value) => updateStatus(record._id, value)} style={{ width: 150 }}>
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="review">Review</Select.Option>
          <Select.Option value="closed">Closed</Select.Option>
        </Select>
      )
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Incidents</h2>
      <Table dataSource={incidents} columns={columns} rowKey="_id" loading={loading} pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default IncidentsPage;