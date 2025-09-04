import React, { useContext, useMemo } from 'react';
import { Layout, Menu, Avatar } from 'antd';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileDoneOutlined,
  ExclamationCircleOutlined,
  DeploymentUnitOutlined,
  BookOutlined,
  SettingOutlined,
  LogoutOutlined,
  MessageOutlined,
  GiftOutlined
} from '@ant-design/icons';
import { AuthContext } from '../AuthContext.jsx';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);

  // Define menu items with route keys; keys double as navigation paths for simpler logic.
  const menuItems = [
    { key: '/admin', icon: <DashboardOutlined />, label: 'Overview' },
    { key: '/admin/participants', icon: <UserOutlined />, label: 'Participants' },
    { key: '/admin/workers', icon: <TeamOutlined />, label: 'Workers' },
    { key: '/admin/appointments', icon: <CalendarOutlined />, label: 'Appointments' },
    { key: '/admin/timesheets', icon: <FileDoneOutlined />, label: 'Timesheets' },
    { key: '/admin/incidents', icon: <ExclamationCircleOutlined />, label: 'Incidents' },
    { key: '/admin/referrals', icon: <DeploymentUnitOutlined />, label: 'Referrals' },
    { key: '/admin/cms', icon: <BookOutlined />, label: 'CMS' },
    { key: '/admin/services', icon: <GiftOutlined />, label: 'Services' },
    { key: '/admin/messages', icon: <MessageOutlined />, label: 'Messages' },
    { key: '/admin/settings', icon: <SettingOutlined />, label: 'Settings' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Logout' }
  ];

  // Determine which menu item is selected based on current path.
  const selectedKeys = useMemo(() => {
    const match = menuItems.find((item) =>
      item.key !== 'logout' && location.pathname.startsWith(item.key)
    );
    return [match ? match.key : '/admin'];
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
                  {user?.name || 'Admin'}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.email || 'admin@mail.com'}
                </div>
                <div className="text-xs text-emerald-600 font-semibold mt-1">
                  ADMIN
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

export default AdminLayout;