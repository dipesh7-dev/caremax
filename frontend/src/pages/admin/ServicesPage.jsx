import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Input, message, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import api from '../../api';

/**
 * ServicesPage
 *
 * This admin-facing page lets an administrator view all configured services
 * (the organisation’s offerings) and add new ones.  Services consist of a
 * service type, a main heading, a subheading and variable length lists of
 * features and benefits.  The form uses Ant Design’s Form.List to allow
 * dynamic addition/removal of feature and benefit items.
 */
const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Fetch all services on mount
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/services');
      setServices(res.data);
    } catch (err) {
      message.error('Failed to load services');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // Clean empty strings from features/benefits
      const payload = {
        serviceType: values.serviceType,
        mainHeading: values.mainHeading,
        subheading: values.subheading,
        features: (values.features || []).filter((i) => i && i.trim() !== ''),
        benefits: (values.benefits || []).filter((i) => i && i.trim() !== '')
      };
      await api.post('/services', payload);
      message.success('Service created');
      setIsModalOpen(false);
      fetchServices();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to create service');
    }
  };

  const columns = [
    {
      title: 'Service Type',
      dataIndex: 'serviceType',
      key: 'serviceType'
    },
    {
      title: 'Main Heading',
      dataIndex: 'mainHeading',
      key: 'mainHeading'
    },
    {
      title: 'Features',
      dataIndex: 'features',
      key: 'features',
      render: (features) => features?.length || 0
    },
    {
      title: 'Benefits',
      dataIndex: 'benefits',
      key: 'benefits',
      render: (benefits) => benefits?.length || 0
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Services</h2>
        <Button type="primary" onClick={openModal}>Add Service</Button>
      </div>
      <Table dataSource={services} columns={columns} rowKey="_id" loading={loading} pagination={{ pageSize: 10 }} />
      <Modal
        title="Create New Service"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        okText="Create"
      >
        <Form layout="vertical" form={form} name="serviceForm">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="serviceType" label="Service Type" rules={[{ required: true }]}> 
              <Input placeholder="e.g., Support Coordination, Daily Living" />
            </Form.Item>
            <Form.Item name="mainHeading" label="Main Heading" rules={[{ required: true }]}> 
              <Input placeholder="Enter compelling main heading" />
            </Form.Item>
          </div>
          <Form.Item name="subheading" label="Subheading" rules={[{ required: true }]}> 
            <Input placeholder="Supporting subtitle or description" />
          </Form.Item>
          {/* Features */}
          <Form.List name="features">
            {(fields, { add, remove }) => (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-medium">Features</label>
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>Add Feature</Button>
                </div>
                {fields.map((field, index) => (
                  <Space key={field.key} align="baseline" className="mb-3">
                    <Form.Item
                      {...field}
                      name={[field.name]}
                      fieldKey={[field.fieldKey]}
                      rules={[{ required: true, message: 'Please enter a feature' }]}
                      style={{ width: '600px' }}
                    >
                      <Input placeholder={`Feature ${index + 1}`}/>
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} className="text-red-600 cursor-pointer" />
                  </Space>
                ))}
              </div>
            )}
          </Form.List>
          {/* Benefits */}
          <Form.List name="benefits">
            {(fields, { add, remove }) => (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-medium">Benefits</label>
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>Add Benefit</Button>
                </div>
                {fields.map((field, index) => (
                  <Space key={field.key} align="baseline" className="mb-3">
                    <Form.Item
                      {...field}
                      name={[field.name]}
                      fieldKey={[field.fieldKey]}
                      rules={[{ required: true, message: 'Please enter a benefit' }]}
                      style={{ width: '600px' }}
                    >
                      <Input placeholder={`Benefit ${index + 1}`}/>
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} className="text-red-600 cursor-pointer" />
                  </Space>
                ))}
              </div>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default ServicesPage;