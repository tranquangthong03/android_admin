import React, { useEffect, useState } from "react";
import { Table, Button, Space, Typography, Card, Image, Tag, Modal, Form, Input, InputNumber, Popconfirm, message, Select } from "antd";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const { Title } = Typography;

const Foods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: null, max: null });

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const list = querySnapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data()
      }));
      setCategories(list);
    } catch (error) {
      console.error("Error fetching categories: ", error);
      message.error("Lỗi khi tải danh mục");
    }
  };

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "foods"));
      const list = querySnapshot.docs.map(doc => ({
        key: doc.id,
        id: doc.id,
        ...doc.data()
      }));
      setFoods(list);
    } catch (error) {
      console.error("Error fetching foods: ", error);
      message.error("Lỗi khi tải danh sách món ăn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "foods", id));
      message.success("Xóa món ăn thành công");
      fetchFoods();
    } catch (error) {
      console.error("Error deleting food: ", error);
      message.error("Lỗi khi xóa món ăn");
    }
  };

  const handleEdit = (record) => {
    setEditingFood(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingFood(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingFood) {
        await updateDoc(doc(db, "foods", editingFood.id), values);
        message.success("Cập nhật món ăn thành công");
      } else {
        await addDoc(collection(db, "foods"), values);
        message.success("Thêm món ăn thành công");
      }
      setIsModalOpen(false);
      fetchFoods();
    } catch (error) {
      console.error("Error saving food: ", error);
      message.error("Lỗi khi lưu món ăn");
    }
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'imagePath',
      key: 'imagePath',
      render: (text) => <Image width={60} height={60} src={text} style={{ objectFit: 'cover', borderRadius: 8 }} />,
    },
    {
      title: 'Tên món ăn',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span style={{ fontWeight: 600, fontSize: 15 }}>{text}</span>,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{(price * 1000).toLocaleString('vi-VN')} vnđ</span>,
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
      title: 'Nhà hàng',
      dataIndex: 'restaurantName',
      key: 'restaurantName',
      render: (text) => <Tag color="blue">{text}</Tag>,
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
            title="Xóa món ăn"
            description="Bạn có chắc chắn muốn xóa món ăn này?"
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

  const filteredFoods = foods.filter(food => {
    const matchName = food.name.toLowerCase().includes(searchText.toLowerCase());
    const matchCategory = filterCategory ? food.categoryId === filterCategory : true;
    const matchPrice = (priceRange.min !== null ? food.price >= priceRange.min : true) && 
                       (priceRange.max !== null ? food.price <= priceRange.max : true);
    return matchName && matchCategory && matchPrice;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Quản lý Món ăn</Title>
        <Button type="primary" icon={<Plus size={18} />} onClick={handleAdd} style={{ background: '#ff4d4f', borderColor: '#ff4d4f' }}>
          Thêm món ăn
        </Button>
      </div>

      <Card style={{ marginBottom: 24 }}>
        <Space wrap>
          <Input.Search 
            placeholder="Tìm kiếm theo tên" 
            onSearch={value => setSearchText(value)} 
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 200 }} 
          />
          <Select 
            placeholder="Lọc theo danh mục" 
            style={{ width: 200 }} 
            allowClear 
            onChange={value => setFilterCategory(value)}
          >
            {categories.map(cat => (
              <Select.Option key={cat.docId} value={cat.id}>{cat.name}</Select.Option>
            ))}
          </Select>
          <InputNumber 
            placeholder="Giá thấp nhất" 
            min={0} 
            onChange={value => setPriceRange(prev => ({ ...prev, min: value }))} 
            style={{ width: 120 }}
          />
          <InputNumber 
            placeholder="Giá cao nhất" 
            min={0} 
            onChange={value => setPriceRange(prev => ({ ...prev, max: value }))} 
            style={{ width: 120 }}
          />
        </Space>
      </Card>

      <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Table 
          dataSource={filteredFoods}  
          columns={columns} 
          pagination={{ pageSize: 5 }} 
          loading={loading}
        />
      </Card>

      <Modal
        title={editingFood ? "Sửa món ăn" : "Thêm món ăn mới"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên món ăn"
            rules={[{ required: true, message: 'Vui lòng nhập tên món ăn!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá ($)"
            rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item
            name="rating"
            label="Đánh giá"
            initialValue={5}
          >
            <InputNumber style={{ width: '100%' }} min={0} max={5} step={0.1} />
          </Form.Item>
          <Form.Item
            name="restaurantName"
            label="Tên nhà hàng"
            rules={[{ required: true, message: 'Vui lòng nhập tên nhà hàng!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="ID Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn ID danh mục!' }]}
          >
            <Select placeholder="Chọn danh mục">
              {categories.map((category) => (
                <Select.Option key={category.docId} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
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

export default Foods;