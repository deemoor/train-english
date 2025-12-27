import React, { useEffect } from 'react';
import { Drawer, Form, Input, Button, Space } from 'antd';
import { Topic } from '../types';

interface TopicFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  editingTopic?: Topic | null;
  loading?: boolean;
}

const TopicForm: React.FC<TopicFormProps> = ({
  open,
  onClose,
  onSubmit,
  editingTopic,
  loading,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (editingTopic) {
        form.setFieldsValue({ name: editingTopic.name });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingTopic, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values.name);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Drawer
      title={editingTopic ? 'Edit topic' : 'New topic'}
      open={open}
      onClose={onClose}
      width={400}
      closable={false}
      className="custom-drawer"
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            {editingTopic ? 'Save' : 'Create'}
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" className="drawer-form">
        <Form.Item
          name="name"
          label="Topic name"
          rules={[{ required: true, message: 'Required field' }]}
        >
          <Input placeholder="Enter topic name" size="large" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default TopicForm;