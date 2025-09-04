import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './AuthContext.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import LoginPage from './pages/Login';
import AdminLayout from './layouts/AdminLayout';
import WorkerLayout from './layouts/WorkerLayout';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import ParticipantsPage from './pages/admin/ParticipantsPage';
import WorkersPage from './pages/admin/WorkersPage';
import AppointmentsPage from './pages/admin/AppointmentsPage';
import TimesheetsPage from './pages/admin/TimesheetsPage';
import IncidentsPage from './pages/admin/IncidentsPage';
import ReferralsPage from './pages/admin/ReferralsPage';
import CMSPage from './pages/admin/CMSPage';
import SettingsPage from './pages/admin/SettingsPage';
import ServicesPage from './pages/admin/ServicesPage';
import AdminMessagesPage from './pages/admin/MessagesPage';

// Worker pages
import WorkerDashboard from './pages/worker/Dashboard';
import ShiftsPage from './pages/worker/ShiftsPage';
import WorkerParticipantsPage from './pages/worker/ParticipantsPage';
import WorkerTimesheetsPage from './pages/worker/TimesheetsPage';
import WorkerIncidentsPage from './pages/worker/IncidentsPage';
import DocumentsPage from './pages/worker/DocumentsPage';
import NotificationsPage from './pages/worker/NotificationsPage';
import WorkerSettingsPage from './pages/worker/SettingsPage';
import WorkerMessagesPage from './pages/worker/MessagesPage';

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          /* A calming blue accent used consistently across buttons, inputs and links */
          colorPrimary: '#2563eb',
          /* Increase default border radius for rounded components */
          borderRadius: 8,
          /* Base font size for legibility */
          fontSize: 14
        },
      }}
    >
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* Admin routes */}
          <Route element={<PrivateRoute roles={['admin']} />}> 
            <Route path="/admin" element={<AdminLayout />}> 
              <Route index element={<AdminDashboard />} />
              <Route path="participants" element={<ParticipantsPage />} />
              <Route path="workers" element={<WorkersPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="timesheets" element={<TimesheetsPage />} />
              <Route path="incidents" element={<IncidentsPage />} />
              <Route path="referrals" element={<ReferralsPage />} />
              <Route path="cms" element={<CMSPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="messages" element={<AdminMessagesPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>
          {/* Worker routes */}
          <Route element={<PrivateRoute roles={['worker']} />}> 
            <Route path="/worker" element={<WorkerLayout />}> 
              <Route index element={<WorkerDashboard />} />
              <Route path="shifts" element={<ShiftsPage />} />
              <Route path="participants" element={<WorkerParticipantsPage />} />
              <Route path="timesheets" element={<WorkerTimesheetsPage />} />
              <Route path="incidents" element={<WorkerIncidentsPage />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="messages" element={<WorkerMessagesPage />} />
              <Route path="settings" element={<WorkerSettingsPage />} />
            </Route>
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;