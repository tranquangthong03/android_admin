import React, { useState } from "react";
import { Layout, Menu, Button, theme, Avatar, Dropdown, Space, Typography } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Utensils, 
  ListOrdered, 
  Store, 
  Users, 
  LogOut, 
  Layers,
  Menu as MenuIcon,
  UtensilsCrossed,
  User
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const userMenu = [
    {
      key: '1',
      label: 'Thông tin tài khoản',
      icon: <User size={16} />,
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: 'Đăng xuất',
      icon: <LogOut size={16} />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  // Danh sách các menu tương ứng với database của bạn
  const menuItems = [
    { key: "/", icon: <LayoutDashboard size={20} />, label: "Tổng quan" },
    { key: "/categories", icon: <Layers size={20} />, label: "Danh mục" },
    { key: "/foods", icon: <Utensils size={20} />, label: "Món ăn" },
    { key: "/restaurants", icon: <Store size={20} />, label: "Nhà hàng" },
    { key: "/orders", icon: <ListOrdered size={20} />, label: "Đơn hàng" },
    { key: "/users", icon: <Users size={20} />, label: "Người dùng" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }} hasSider>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        theme="light"
        width={250}
        style={{
          boxShadow: "2px 0 8px 0 rgba(29,35,41,.05)",
          zIndex: 10
        }}
      >
        <div style={{ 
          height: 64, 
          margin: 16, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 10,
          overflow: 'hidden'
        }}>
          <div style={{
            minWidth: 40,
            height: 40,
            background: '#ff4d4f',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <UtensilsCrossed size={24} />
          </div>
          {!collapsed && (
            <span style={{ fontWeight: 800, fontSize: 18, color: '#1f1f1f' }}>
              FastFood<span style={{ color: '#ff4d4f' }}>Admin</span>
            </span>
          )}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0, padding: '0 8px' }}
          itemIcon={null}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,21,41,.08)', zIndex: 9 }}>
          <Button
            type="text"
            icon={<MenuIcon size={20} />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 46,
              height: 46,
            }}
          />
          
          <Space>
            <div style={{ textAlign: 'right', marginRight: 8, display: 'none', md: 'block' }}>
              <Text strong style={{ display: 'block', lineHeight: 1.2 }}>Admin User</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>Administrator</Text>
            </div>
            <Dropdown menu={{ items: userMenu }} placement="bottomRight">
              <Avatar 
                size="large" 
                style={{ backgroundColor: '#ff4d4f', cursor: 'pointer' }} 
                icon={<User size={20} />} 
              />
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: 'transparent',
            overflow: 'initial'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;