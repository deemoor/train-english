import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spin, Modal, message } from 'antd';
import { PlusOutlined, BookOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import TopicCard from '../components/TopicCard';
import TopicForm from '../components/TopicForm';
import { api } from '../services/api';
import { Topic } from '../types';
import '../styles/global.css';
import '../styles/TopicCard.css';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      setLoading(true);
      const data = await api.getTopics();
      // Sort by lastUpdated descending
      const sortedData = [...data].sort((a, b) => 
        dayjs(b.lastUpdated).valueOf() - dayjs(a.lastUpdated).valueOf()
      );
      setTopics(sortedData);
    } catch (error) {
      console.error('Failed to load topics:', error);
      message.error('Unable to load topics');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async (name: string) => {
    setSaving(true);
    try {
      const newTopic: Topic = {
        id: Date.now(),
        name,
        createdAt: dayjs().toISOString(),
        lastUpdated: dayjs().toISOString(),
        words: [],
      };
      const updatedTopics = [...topics, newTopic];
      await api.saveTopics(updatedTopics);
      // Re-sort after adding
      const sortedData = [...updatedTopics].sort((a, b) => 
        dayjs(b.lastUpdated).valueOf() - dayjs(a.lastUpdated).valueOf()
      );
      setTopics(sortedData);
      setFormOpen(false);
      message.success('Topic created');
    } catch (error) {
      console.error('Failed to create topic:', error);
      message.error('Unable to create topic');
    } finally {
      setSaving(false);
    }
  };

  const handleEditTopic = async (name: string) => {
    if (!editingTopic) return;
    setSaving(true);
    try {
      const updatedTopics = topics.map((t) =>
        t.id === editingTopic.id
          ? { ...t, name, lastUpdated: dayjs().toISOString() }
          : t
      );
      await api.saveTopics(updatedTopics);
      // Re-sort after editing
      const sortedData = [...updatedTopics].sort((a, b) => 
        dayjs(b.lastUpdated).valueOf() - dayjs(a.lastUpdated).valueOf()
      );
      setTopics(sortedData);
      setEditingTopic(null);
      setFormOpen(false);
      message.success('Topic updated');
    } catch (error) {
      console.error('Failed to update topic:', error);
      message.error('Unable to update topic');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTopic = (topic: Topic) => {
    Modal.confirm({
      title: 'Delete topic?',
      content: `Are you sure you want to delete the topic "${topic.name}" and all words in it?`,
      okText: 'Delete',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const updatedTopics = topics.filter((t) => t.id !== topic.id);
          await api.saveTopics(updatedTopics);
          setTopics(updatedTopics);
          message.success('Topic deleted');
        } catch (error) {
          console.error('Failed to delete topic:', error);
          message.error('Unable to delete topic');
        }
      },
    });
  };

  const openEditForm = (topic: Topic, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTopic(topic);
    setFormOpen(true);
  };

  const openCreateForm = () => {
    setEditingTopic(null);
    setFormOpen(true);
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-container">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="page-header">
        <h1 className="page-title">
          <BookOutlined style={{ marginRight: 12 }} />
          English dictionary
        </h1>
        <p className="page-subtitle">
          Learn new words and track your progress
        </p>
        <div className="header-actions">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={openCreateForm}
          >
            Add topic
          </Button>
        </div>
      </header>

      {topics.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h3 className="empty-state-title">No topics yet</h3>
          <p className="empty-state-description">
            Create your first topic to start learning words
          </p>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateForm}>
            Create topic
          </Button>
        </div>
      ) : (
        <div className="topics-grid">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onClick={() => navigate(`/topic/${topic.id}`)}
              onEdit={(e) => openEditForm(topic, e)}
              onDelete={(e) => {
                e.stopPropagation();
                handleDeleteTopic(topic);
              }}
            />
          ))}
        </div>
      )}

      <TopicForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingTopic(null);
        }}
        onSubmit={editingTopic ? handleEditTopic : handleCreateTopic}
        editingTopic={editingTopic}
        loading={saving}
      />
    </div>
  );
};

export default Index;