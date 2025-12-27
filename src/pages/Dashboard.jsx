import React from "react";
import { Card, Col, Row, Statistic, Typography } from "antd";
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Store 
} from "lucide-react";

const { Title } = Typography;

const Dashboard = () => {
  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>Tổng quan</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Tổng doanh thu"
              value={112893}
              precision={0}
              valueStyle={{ color: '#3f8600', fontWeight: 'bold' }}
              prefix={<DollarSign size={20} style={{ marginRight: 8 }} />}
              suffix="đ"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Đơn hàng"
              value={93}
              valueStyle={{ color: '#1677ff', fontWeight: 'bold' }}
              prefix={<ShoppingBag size={20} style={{ marginRight: 8 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Người dùng"
              value={12}
              valueStyle={{ color: '#cf1322', fontWeight: 'bold' }}
              prefix={<Users size={20} style={{ marginRight: 8 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Nhà hàng"
              value={5}
              valueStyle={{ color: '#faad14', fontWeight: 'bold' }}
              prefix={<Store size={20} style={{ marginRight: 8 }} />}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 24 }}>
        <Card title="Đơn hàng gần đây" bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <p>Chưa có dữ liệu thực tế...</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
