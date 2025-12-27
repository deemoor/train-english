import React, { useEffect } from 'react';
import { Drawer, Form, Input, Button, Space } from 'antd';
import { Word } from '../types';

interface WordFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (word: Omit<Word, 'id' | 'createdAt' | 'correctCount'>) => void;
  editingWord?: Word | null;
  loading?: boolean;
}

const WordForm: React.FC<WordFormProps> = ({
  open,
  onClose,
  onSubmit,
  editingWord,
  loading,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (editingWord) {
        form.setFieldsValue({
          eng: editingWord.eng,
          ru: editingWord.ru,
          example: editingWord.example || '',
          synonym: editingWord.synonym || '',
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingWord, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({
        eng: values.eng,
        ru: values.ru,
        example: values.example || undefined,
        synonym: values.synonym || undefined,
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Drawer
      title={editingWord ? 'Edit word' : 'New word'}
      open={open}
      onClose={onClose}
      width={450}
      closable={false}
      className="custom-drawer"
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            {editingWord ? 'Save' : 'Add'}
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" className="drawer-form">
        <Form.Item
          name="eng"
          label="English word"
          rules={[{ required: true, message: 'Required field' }]}
        >
          <Input placeholder="Enter English word" />
        </Form.Item>
        
        <Form.Item
          name="ru"
          label="Russian translation"
          rules={[{ required: true, message: 'Required field' }]}
        >
          <Input placeholder="Enter Russian translation" />
        </Form.Item>
        
        <Form.Item
          name="example"
          label="Example"
        >
          <Input.TextArea 
            placeholder="Enter example sentence" 
            rows={2}
          />
        </Form.Item>
        
        <Form.Item
          name="synonym"
          label="Synonym"
        >
          <Input placeholder="Enter synonym" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default WordForm;