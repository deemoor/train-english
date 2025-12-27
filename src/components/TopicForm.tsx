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
      title={editingTopic ? 'Редактировать тему' : 'Новая тема'}
      open={open}
      onClose={onClose}
      width={400}
      footer={
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            {editingTopic ? 'Сохранить' : 'Создать'}
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Название темы"
          rules={[{ required: true, message: 'Введите название темы' }]}
        >
          <Input placeholder="Например: Глаголы действия" size="large" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default TopicForm;
