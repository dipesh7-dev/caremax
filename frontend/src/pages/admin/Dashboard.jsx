import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { UserOutlined, TeamOutlined, FileDoneOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import api from '../../api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ participants: 0, workers: 0, timesheets: 0, incidents: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [participantsRes, workersRes, timesheetsRes, incidentsRes] = await Promise.all([
          api.get('/participants'),
          api.get('/workers'),
          api.get('/timesheets'),
          api.get('/incidents')
        ]);
        setStats({
          participants: participantsRes.data.length,
          workers: workersRes.data.length,
          timesheets: timesheetsRes.data.length,
          incidents: incidentsRes.data.length
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      {/* Responsive grid for statistics with icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Participants */}
        <div className="flex items-center p-4 bg-white shadow rounded-lg">
          <div className="p-3 rounded-full bg-blue-100 text-blue-700 mr-4">
            <UserOutlined className="text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Participants</p>
            <p className="text-2xl font-semibold text-gray-800">{stats.participants}</p>
          </div>
        </div>
        {/* Workers */}
        <div className="flex items-center p-4 bg-white shadow rounded-lg">
          <div className="p-3 rounded-full bg-blue-100 text-blue-700 mr-4">
            <TeamOutlined className="text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Workers</p>
            <p className="text-2xl font-semibold text-gray-800">{stats.workers}</p>
          </div>
        </div>
        {/* Timesheets */}
        <div className="flex items-center p-4 bg-white shadow rounded-lg">
          <div className="p-3 rounded-full bg-blue-100 text-blue-700 mr-4">
            <FileDoneOutlined className="text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Timesheets</p>
            <p className="text-2xl font-semibold text-gray-800">{stats.timesheets}</p>
          </div>
        </div>
        {/* Incidents */}
        <div className="flex items-center p-4 bg-white shadow rounded-lg">
          <div className="p-3 rounded-full bg-blue-100 text-blue-700 mr-4">
            <ExclamationCircleOutlined className="text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Incidents</p>
            <p className="text-2xl font-semibold text-gray-800">{stats.incidents}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;