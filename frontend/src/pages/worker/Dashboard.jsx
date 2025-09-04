import React, { useEffect, useState } from 'react';
import api from '../../api';
import { CalendarOutlined, UserOutlined, FileDoneOutlined } from '@ant-design/icons';

const WorkerDashboard = () => {
  const [stats, setStats] = useState({ shifts: 0, participants: 0, timesheets: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [appointmentsRes, participantsRes, timesheetsRes] = await Promise.all([
          api.get('/appointments'),
          api.get('/workers/me/participants'),
          api.get('/timesheets')
        ]);
        setStats({
          shifts: appointmentsRes.data.length,
          participants: participantsRes.data.length,
          timesheets: timesheetsRes.data.length
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Upcoming Shifts */}
        <div className="flex items-center p-4 bg-white shadow rounded-lg">
          <div className="p-3 rounded-full bg-blue-100 text-blue-700 mr-4">
            <CalendarOutlined className="text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Upcoming Shifts</p>
            <p className="text-2xl font-semibold text-gray-800">{stats.shifts}</p>
          </div>
        </div>
        {/* Assigned Participants */}
        <div className="flex items-center p-4 bg-white shadow rounded-lg">
          <div className="p-3 rounded-full bg-blue-100 text-blue-700 mr-4">
            <UserOutlined className="text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Assigned Participants</p>
            <p className="text-2xl font-semibold text-gray-800">{stats.participants}</p>
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
      </div>
    </div>
  );
};

export default WorkerDashboard;