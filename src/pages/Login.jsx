
import { Form, Input, Button, message, Checkbox, ConfigProvider, Typography } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { User, Lock, UtensilsCrossed } from "lucide-react";
import "./Login.css";

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      message.success("Đăng nhập thành công!");
      navigate("/"); // Chuyển về trang chủ admin
    } catch (error) {
      console.error(error);
      message.error("Tài khoản hoặc mật khẩu sai!");
    }
  };

  return (
    <div className="login-page">
      {/* Left Side - Branding/Image */}
      <div className="login-left">
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <div className="brand-logo">
            <div className="logo-icon">
              <UtensilsCrossed size={32} color="white" />
            </div>
            <h1 className="brand-name">FastFood Admin</h1>
          </div>
          <div className="banner-text">
            <h2>Quản lý nhà hàng<br/>Chuyên nghiệp & Hiệu quả</h2>
            <p>Hệ thống quản lý toàn diện giúp tối ưu hóa quy trình vận hành và nâng cao trải nghiệm khách hàng.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right">
        <div className="login-wrapper">
          <div className="form-header">
            <div className="mobile-logo">
               <UtensilsCrossed size={40} color="#ff4d4f" />
            </div>
            <Title level={2} className="form-title">Chào mừng trở lại</Title>
            <Text type="secondary" className="form-subtitle">Vui lòng nhập thông tin để đăng nhập</Text>
          </div>

          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#ff4d4f',
                borderRadius: 8,
                controlHeight: 48,
                fontSize: 16,
              },
              components: {
                Input: {
                  activeBorderColor: '#ff4d4f',
                  hoverBorderColor: '#ff7875',
                  paddingBlock: 12,
                },
                Button: {
                  fontWeight: 600,
                }
              }
            }}
          >
            <Form 
              layout="vertical" 
              onFinish={onFinish} 
              requiredMark={false} 
              size="large"
              className="login-form"
            >
              <Form.Item 
                label={<span className="input-label">Email</span>}
                name="email" 
                rules={[{ required: true, message: "Vui lòng nhập Email!", type: "email" }]}
              >
                <Input 
                  prefix={<User size={20} className="input-icon" />} 
                  placeholder="admin@example.com" 
                />
              </Form.Item>
              
              <Form.Item 
                label={<span className="input-label">Mật khẩu</span>}
                name="password" 
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password 
                  prefix={<Lock size={20} className="input-icon" />} 
                  placeholder="••••••••" 
                />
              </Form.Item>

              <div className="form-actions">
                 <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                 </Form.Item>
                 <a className="forgot-password" href="#">Quên mật khẩu?</a>
              </div>

              <Button type="primary" htmlType="submit" block className="submit-button">
                Đăng nhập
              </Button>
            </Form>
          </ConfigProvider>
          
          <div className="login-footer">
            © {new Date().getFullYear()} FastFood Admin Dashboard
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
