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
      title={editingWord ? 'Редактировать слово' : 'Новое слово'}
      open={open}
      onClose={onClose}
      width={450}
      closable={false}
      className="custom-drawer"
      extra={
        <Space>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            {editingWord ? 'Сохранить' : 'Добавить'}
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" className="drawer-form">
        <Form.Item
          name="eng"
          label="Английское слово"
          rules={[{ required: true, message: 'Введите слово на английском' }]}
        >
          <Input placeholder="to drop off" />
        </Form.Item>
        
        <Form.Item
          name="ru"
          label="Русский перевод"
          rules={[{ required: true, message: 'Введите перевод на русском' }]}
        >
          <Input placeholder="сдавать, доставить кого-либо" />
        </Form.Item>
        
        <Form.Item
          name="example"
          label="Пример использования (необязательно)"
        >
          <Input.TextArea 
            placeholder="dropped computer off at the repair shop" 
            rows={2}
          />
        </Form.Item>
        
        <Form.Item
          name="synonym"
          label="Синоним (необязательно)"
        >
          <Input placeholder="leave smth, someone" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default WordForm;