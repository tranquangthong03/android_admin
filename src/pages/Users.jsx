import React, { useEffect, useState } from "react";
import { Table, Button, Space, Typography, Card, Tag, Avatar, Modal, Form, Input, Select, Popconfirm, message } from "antd";
import { Pencil, Trash2, User as UserIcon, Phone, Mail, Plus } from "lucide-react";
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const { Title } = Typography;
const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState(null);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const list = querySnapshot.docs.map(doc => ({
        key: doc.id,
        id: doc.id,
        ...doc.data()
      }));
      setUsers(list);
    } catch (error) {
      console.error("Error fetching users: ", error);
      message.error("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      message.success("Xóa người dùng thành công");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user: ", error);
      message.error("Lỗi khi xóa người dùng");
    }
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        await updateDoc(doc(db, "users", editingUser.id), values);
        message.success("Cập nhật người dùng thành công");
      } else {
        await addDoc(collection(db, "users"), values);
        message.success("Thêm người dùng thành công");
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error saving user: ", error);
      message.error("Lỗi khi lưu người dùng");
    }
  };

  const columns = [
    {
      title: 'Người dùng',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserIcon size={16} />} style={{ backgroundColor: '#87d068' }} />
          <span style={{ fontWeight: 500 }}>{record.name}</span>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
        <Space size={4}>
          <Mail size={14} color="#888" />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => (
        <Space size={4}>
          <Phone size={14} color="#888" />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'purple' : 'blue'}>
          {role ? role.toUpperCase() : 'USER'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<Pencil size={16} color="#1890ff" />} 
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Xóa người dùng"
            description="Bạn có chắc chắn muốn xóa người dùng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="text" danger icon={<Trash2 size={16} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredUsers = users.filter(user => {
    const matchText = (
      (user.name && user.name.toLowerCase().includes(searchText.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchText.toLowerCase())) ||
      (user.phone && user.phone.includes(searchText))
    );
    const matchRole = filterRole ? user.role === filterRole : true;
    return matchText && matchRole;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Quản lý Người dùng</Title>
        <Button type="primary" icon={<Plus size={18} />} onClick={handleAdd} style={{ background: '#ff4d4f', borderColor: '#ff4d4f' }}>
          Thêm người dùng
        </Button>
      </div>

      <Card style={{ marginBottom: 24 }}>
        <Space wrap>
          <Input.Search 
            placeholder="Tìm theo tên, email, sđt" 
            onSearch={value => setSearchText(value)} 
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }} 
          />
          <Select 
            placeholder="Lọc theo vai trò" 
            style={{ width: 150 }} 
            allowClear 
            onChange={value => setFilterRole(value)}
          >
            <Option value="user">User</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </Space>
      </Card>

      <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Table 
          dataSource={filteredUsers}  
          columns={columns} 
          pagination={{ pageSize: 10 }} 
          loading={loading}
        />
      </Card>

      <Modal
        title={editingUser ? "Sửa thông tin người dùng" : "Thêm người dùng mới"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên người dùng"
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Vai trò"
            initialValue="user"
          >
            <Select>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;