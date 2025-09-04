import React, { useContext, useMemo } from 'react';
import { Layout, Menu, Avatar } from 'antd';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  DashboardOutlined,
  CalendarOutlined,
  UserOutlined,
  FileDoneOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { AuthContext } from '../AuthContext.jsx';

const { Header, Sider, Content } = Layout;

const WorkerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);

  // Define menu items with keys equal to route paths for easy navigation and selection.
  const menuItems = [
    { key: '/worker', icon: <DashboardOutlined />, label: 'Overview' },
    { key: '/worker/shifts', icon: <CalendarOutlined />, label: 'My Shifts' },
    { key: '/worker/participants', icon: <UserOutlined />, label: 'Participants' },
    { key: '/worker/timesheets', icon: <FileDoneOutlined />, label: 'Timesheets' },
    { key: '/worker/incidents', icon: <ExclamationCircleOutlined />, label: 'Incidents' },
    { key: '/worker/documents', icon: <FileTextOutlined />, label: 'My Documents' },
    { key: '/worker/notifications', icon: <BellOutlined />, label: 'Notifications' },
    { key: '/worker/messages', icon: <MessageOutlined />, label: 'Messages' },
    { key: '/worker/settings', icon: <SettingOutlined />, label: 'Settings' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Logout' }
  ];

  // Determine selected menu item based on current path.
  const selectedKeys = useMemo(() => {
    const match = menuItems.find((item) =>
      item.key !== 'logout' && location.pathname.startsWith(item.key)
    );
    return [match ? match.key : '/worker'];
  }, [location.pathname]);

  const onMenuClick = ({ key }) => {
    if (key === 'logout') {
      logout();
      navigate('/login');
      return;
    }
    navigate(key);
  };

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <Sider width={260} className="app-sider">
        {/* Brand area */}
        <div className="app-logo">
          <span className="app-logo__title">Caremax Service</span>
        </div>

        {/* User info card */}
        <div className="px-4 py-4">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <Avatar shape="circle" size={36} icon={<UserOutlined />} />
              <div>
                <div className="font-semibold text-gray-800">
                  {user?.name || 'Worker'}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.email || 'worker@ndis.com'}
                </div>
                <div className="text-xs text-emerald-600 font-semibold mt-1">
                  WORKER
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <Menu
          mode="inline"
          theme="light"
          selectedKeys={selectedKeys}
          onClick={onMenuClick}
          items={menuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label
          }))}
          className="px-3"
        />
      </Sider>

      {/* Main area */}
      <Layout>
        <Header className="bg-white shadow-sm px-6 flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        </Header>
        <Content className="m-6">
          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default WorkerLayout;