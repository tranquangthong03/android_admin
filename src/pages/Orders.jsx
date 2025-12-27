import React, { useEffect, useState } from "react";
import { Table, Button, Space, Typography, Card, Tag, Avatar, Modal, Form, Select, Popconfirm, message } from "antd";
import { Eye, Calendar, Trash2, Pencil } from "lucide-react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const { Title } = Typography;
const { Option } = Select;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');
  const [form] = Form.useForm();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const list = querySnapshot.docs.map(doc => ({
        key: doc.id,
        id: doc.id,
        ...doc.data()
      }));
      setOrders(list);
    } catch (error) {
      console.error("Error fetching orders: ", error);
      message.error("Lỗi khi tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "orders", id));
      message.success("Xóa đơn hàng thành công");
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order: ", error);
      message.error("Lỗi khi xóa đơn hàng");
    }
  };

  const handleEdit = (record) => {
    setEditingOrder(record);
    form.setFieldsValue({ status: record.status });
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingOrder) {
        await updateDoc(doc(db, "orders", editingOrder.id), { status: values.status });
        message.success("Cập nhật trạng thái đơn hàng thành công");
      }
      setIsModalOpen(false);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order: ", error);
      message.error("Lỗi khi cập nhật đơn hàng");
    }
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <span style={{ fontFamily: 'monospace', color: '#666' }}>#{text.substring(0, 8)}...</span>,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'date',
      key: 'date',
      render: (text) => (
        <Space size={4}>
          <Calendar size={14} color="#888" />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Món ăn',
      dataIndex: 'items',
      key: 'items',
      render: (items) => (
        <Avatar.Group maxCount={3}>
          {items && items.map((item, index) => (
            <Avatar key={index} src={item.imagePath} />
          ))}
        </Avatar.Group>
      ),
    },
    {
      title: 'Tổng tiền',
      key: 'total',
      render: (_, record) => {
        const total = record.items ? record.items.reduce((sum, item) => sum + item.price, 0) : 0;
        return <span style={{ fontWeight: 'bold', color: '#ff4d4f' }}>${total}</span>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'geekblue';
        let text = 'Đang xử lý';
        if (status === 'completed') {
          color = 'green';
          text = 'Hoàn thành';
        } else if (status === 'cancelled') {
          color = 'volcano';
          text = 'Đã hủy';
        }
        return <Tag color={color}>{text}</Tag>;
      },
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
            title="Xóa đơn hàng"
            description="Bạn có chắc chắn muốn xóa đơn hàng này?"
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

  const sortedOrders = [...orders].sort((a, b) => {
    // Assuming date is in a format that Date.parse() or new Date() can handle
    // If it's DD/MM/YYYY, this might need adjustment
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Quản lý Đơn hàng</Title>
        <Select 
          defaultValue="newest" 
          style={{ width: 200 }} 
          onChange={value => setSortOrder(value)}
        >
          <Option value="newest">Mới nhất</Option>
          <Option value="oldest">Cũ nhất</Option>
        </Select>
      </div>

      <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Table 
          dataSource={sortedOrders}  
          columns={columns} 
          pagination={{ pageSize: 10 }} 
          loading={loading}
        />
      </Card>

      <Modal
        title="Cập nhật trạng thái đơn hàng"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select>
              <Option value="pending">Đang xử lý</Option>
              <Option value="completed">Hoàn thành</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Orders;