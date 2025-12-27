import React, { useEffect, useState } from "react";
import { Table, Button, Space, Typography, Card, Image, Modal, Form, Input, Popconfirm, message } from "antd";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const { Title } = Typography;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const list = querySnapshot.docs.map(doc => ({
        key: doc.id,
        docId: doc.id,
        ...doc.data()
      }));
      setCategories(list);
    } catch (error) {
      console.error("Error fetching categories: ", error);
      message.error("Lỗi khi tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "categories", id));
      message.success("Xóa danh mục thành công");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category: ", error);
      message.error("Lỗi khi xóa danh mục");
    }
  };

  const handleEdit = (record) => {
    setEditingCategory(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingCategory) {
        await updateDoc(doc(db, "categories", editingCategory.docId), values);
        message.success("Cập nhật danh mục thành công");
      } else {
        await addDoc(collection(db, "categories"), values);
        message.success("Thêm danh mục thành công");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category: ", error);
      message.error("Lỗi khi lưu danh mục");
    }
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'imagePath',
      key: 'imagePath',
      render: (text) => <Image width={50} height={50} src={text} style={{ objectFit: 'cover', borderRadius: 8 }} />,
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <span style={{ color: '#888' }}>{text}</span>,
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
            title="Xóa danh mục"
            description="Bạn có chắc chắn muốn xóa danh mục này?"
            onConfirm={() => handleDelete(record.docId)}
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
        <Title level={2} style={{ margin: 0 }}>Quản lý Danh mục</Title>
        <Button type="primary" icon={<Plus size={18} />} onClick={handleAdd} style={{ background: '#ff4d4f', borderColor: '#ff4d4f' }}>
          Thêm danh mục
        </Button>
      </div>

      <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Table 
          dataSource={categories} 
          columns={columns} 
          pagination={{ pageSize: 5 }} 
          loading={loading}
        />
      </Card>

      <Modal
        title={editingCategory ? "Sửa danh mục" : "Thêm danh mục mới"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="id"
            label="ID"
            rules={[{ required: true, message: 'Vui lòng nhập ID!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
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

export default Categories;