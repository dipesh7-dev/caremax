import React, { useEffect, useState } from 'react';
import { Table, Select, message } from 'antd';
import api from '../../api';

const ReferralsPage = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const res = await api.get('/referrals');
      setReferrals(res.data);
    } catch (err) {
      message.error('Failed to load referrals');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/referrals/${id}`, { status });
      message.success('Status updated');
      fetchReferrals();
    } catch (err) {
      message.error('Failed to update status');
    }
  };

  const columns = [
    { title: 'Full Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Status', key: 'status', render: (_, record) => (
      <Select value={record.status} onChange={(value) => updateStatus(record._id, value)} style={{ width: 150 }}>
        <Select.Option value="new">New</Select.Option>
        <Select.Option value="review">Review</Select.Option>
        <Select.Option value="approved">Approved</Select.Option>
      </Select>
    ) }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Referrals</h2>
      <Table dataSource={referrals} columns={columns} rowKey="_id" loading={loading} pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default ReferralsPage;