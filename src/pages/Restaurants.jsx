import React, { useEffect, useState } from "react";
import { Table, Button, Space, Typography, Card, Image, Tag, Modal, Form, Input, InputNumber, Popconfirm, message, Select } from "antd";
import { Plus, Pencil, Trash2, Star, Clock, Truck } from "lucide-react";
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const { Title, Text } = Typography;
const { Option } = Select;

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [form] = Form.useForm();

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "restaurants"));
      const list = querySnapshot.docs.map(doc => ({
        key: doc.id,
        id: doc.id,
        ...doc.data()
      }));
      setRestaurants(list);
    } catch (error) {
      console.error("Error fetching restaurants: ", error);
      message.error("Lỗi khi tải danh sách nhà hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "restaurants", id));
      message.success("Xóa nhà hàng thành công");
      fetchRestaurants();
    } catch (error) {
      console.error("Error deleting restaurant: ", error);
      message.error("Lỗi khi xóa nhà hàng");
    }
  };

  const handleEdit = (record) => {
    setEditingRestaurant(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingRestaurant(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRestaurant) {
        await updateDoc(doc(db, "restaurants", editingRestaurant.id), values);
        message.success("Cập nhật nhà hàng thành công");
      } else {
        await addDoc(collection(db, "restaurants"), values);
        message.success("Thêm nhà hàng thành công");
      }
      setIsModalOpen(false);
      fetchRestaurants();
    } catch (error) {
      console.error("Error saving restaurant: ", error);
      message.error("Lỗi khi lưu nhà hàng");
    }
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'imagePath',
      key: 'imagePath',
      render: (text) => <Image width={80} height={60} src={text} style={{ objectFit: 'cover', borderRadius: 8 }} />,
    },
    {
      title: 'Tên nhà hàng',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 600, fontSize: 15 }}>{text}</span>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.description}</Text>
        </div>
      ),
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => (
        <Space size={4}>
          <Star size={14} fill="#faad14" color="#faad14" />
          <span>{rating}</span>
        </Space>
      ),
    },
    {
      title: 'Giao hàng',
      key: 'delivery',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space size={4}>
            <Clock size={14} color="#888" />
            <span style={{ fontSize: 13 }}>{record.deliveryTime}</span>
          </Space>
          <Space size={4}>
            <Truck size={14} color="#888" />
            <span style={{ fontSize: 13, color: record.deliveryFee === 'Free' ? '#52c41a' : '#333' }}>
              {record.deliveryFee}
            </span>
          </Space>
        </Space>
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
            title="Xóa nhà hàng"
            description="Bạn có chắc chắn muốn xóa nhà hàng này?"
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Quản lý Nhà hàng</Title>
        <Button type="primary" icon={<Plus size={18} />} onClick={handleAdd} style={{ background: '#ff4d4f', borderColor: '#ff4d4f' }}>
          Thêm nhà hàng
        </Button>
      </div>

      <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Table 
          dataSource={restaurants} 
          columns={columns} 
          pagination={{ pageSize: 5 }} 
          loading={loading}
        />
      </Card>

      <Modal
        title={editingRestaurant ? "Sửa nhà hàng" : "Thêm nhà hàng mới"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên nhà hàng"
            rules={[{ required: true, message: 'Vui lòng nhập tên nhà hàng!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="rating"
            label="Đánh giá"
            initialValue={5}
          >
            <InputNumber style={{ width: '100%' }} min={0} max={5} step={0.1} />
          </Form.Item>
          <Form.Item
            name="deliveryTime"
            label="Thời gian giao hàng (VD: 20 min)"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian giao hàng!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="deliveryFee"
            label="Phí giao hàng (VD: Free hoặc $2)"
            rules={[{ required: true, message: 'Vui lòng nhập phí giao hàng!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="imagePath"
            label="Link hình ảnh"
            rules={[{ required: true, message: 'Vui lòng nhập link hình ảnh!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Restaurants;