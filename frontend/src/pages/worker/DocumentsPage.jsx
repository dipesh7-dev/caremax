import React, { useEffect, useState } from 'react';
import { Table, message } from 'antd';
import api from '../../api';

const DocumentsPage = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/workers/me');
      setDocs(res.data.complianceDocs || []);
    } catch (err) {
      message.error('Failed to load documents');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Expiry Date', dataIndex: 'expiryDate', key: 'expiryDate', render: (d) => (d ? new Date(d).toLocaleDateString() : '') },
    { title: 'URL', dataIndex: 'url', key: 'url' }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Documents</h2>
      <p className="mb-4">Uploading documents is not implemented in this demo.</p>
      <Table dataSource={docs} columns={columns} rowKey="_id" loading={loading} pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default DocumentsPage;