import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin, Modal, Switch, message, Space } from 'antd';
import { PlusOutlined, ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import WordCard from '../components/WordCard';
import WordForm from '../components/WordForm';
import { api } from '../services/api';
import { Topic, Word, DisplayMode } from '../types';
import '../styles/global.css';
import '../styles/WordCard.css';

const TopicPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [saving, setSaving] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('english');
  const [completedWords, setCompletedWords] = useState<Set<number>>(new Set());
  const [pendingCounts, setPendingCounts] = useState<Map<number, number>>(new Map());
  const [revealedKey, setRevealedKey] = useState(0);

  const topic = useMemo(() => {
    return topics.find((t) => t.id === Number(id));
  }, [topics, id]);

  // Words sorted by createdAt descending (newest first)
  const sortedWords = useMemo(() => {
    if (!topic) return [];
    return [...topic.words].sort((a, b) => 
      dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
    );
  }, [topic]);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      setLoading(true);
      const data = await api.getTopics();
      setTopics(data);
    } catch (error) {
      console.error('Failed to load topics:', error);
      message.error('Unable to load topics');
    } finally {
      setLoading(false);
    }
  };

  const saveTopics = async (updatedTopics: Topic[]) => {
    try {
      await api.saveTopics(updatedTopics);
      setTopics(updatedTopics);
      return true;
    } catch (error) {
      console.error('Failed to save:', error);
      message.error('Unable to save changes');
      return false;
    }
  };

  const handleAddWord = async (wordData: Omit<Word, 'id' | 'createdAt' | 'correctCount'>) => {
    if (!topic) return;
    setSaving(true);
    try {
      const newWord: Word = {
        id: Date.now(),
        ...wordData,
        correctCount: 0,
        createdAt: dayjs().toISOString(),
      };
      const updatedTopics = topics.map((t) =>
        t.id === topic.id
          ? {
              ...t,
              words: [...t.words, newWord],
              lastUpdated: dayjs().toISOString(),
            }
          : t
      );
      if (await saveTopics(updatedTopics)) {
        setFormOpen(false);
        message.success('Word added');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEditWord = async (wordData: Omit<Word, 'id' | 'createdAt' | 'correctCount'>) => {
    if (!topic || !editingWord) return;
    setSaving(true);
    try {
      const updatedTopics = topics.map((t) =>
        t.id === topic.id
          ? {
              ...t,
              words: t.words.map((w) =>
                w.id === editingWord.id ? { ...w, ...wordData } : w
              ),
              lastUpdated: dayjs().toISOString(),
            }
          : t
      );
      if (await saveTopics(updatedTopics)) {
        setFormOpen(false);
        setEditingWord(null);
        message.success('Word updated');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteWord = (word: Word) => {
    Modal.confirm({
      title: 'Delete word?',
      content: `Are you sure you want to delete "${word.eng}"?`,
      okText: 'Delete',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk: async () => {
        if (!topic) return;
        const updatedTopics = topics.map((t) =>
          t.id === topic.id
            ? {
                ...t,
                words: t.words.filter((w) => w.id !== word.id),
                lastUpdated: dayjs().toISOString(),
              }
            : t
        );
        if (await saveTopics(updatedTopics)) {
          message.success('Word deleted');
        }
      },
    });
  };

  const handleToggleComplete = (wordId: number) => {
    setCompletedWords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(wordId)) {
        newSet.delete(wordId);
      } else {
        newSet.add(wordId);
      }
      return newSet;
    });
  };

  const handleIncrementCount = (wordId: number, increment: boolean) => {
    setPendingCounts((prev) => {
      const newMap = new Map(prev);
      const currentPending = newMap.get(wordId) || 0;
      const newValue = increment ? currentPending + 1 : currentPending - 1;
      if (newValue === 0) {
        newMap.delete(wordId);
      } else {
        newMap.set(wordId, newValue);
      }
      return newMap;
    });
  };

  const handleSaveProgress = async () => {
    setSaving(true);
    try {
      const updatedTopics = topics.map((t) =>
        t.id === topic.id
          ? {
              ...t,
              words: t.words.map((w) => {
                const increment = pendingCounts.get(w.id) || 0;
                return increment > 0
                  ? { ...w, correctCount: w.correctCount + increment }
                  : w;
              }),
              lastUpdated: dayjs().toISOString(),
            }
          : t
      );
      if (await saveTopics(updatedTopics)) {
        setPendingCounts(new Map());
        setCompletedWords(new Set());
        message.success('Progress saved');
      }
    } finally {
      setSaving(false);
    }
  };

  const getWordWithPending = (word: Word): Word => {
    const pending = pendingCounts.get(word.id) || 0;
    return { ...word, correctCount: word.correctCount + pending };
  };

   const handleUpdateRevealedKey = () => {
    setRevealedKey(prev => prev + 1);
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

  if (!topic) {
    return (
      <div className="app-container">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowLeftOutlined /> Back to topics
        </button>
        <div className="empty-state">
          <div className="empty-state-icon">❓</div>
          <h3 className="empty-state-title">Topic not found</h3>
          <Button type="primary" onClick={() => navigate('/')}>
            Return to main page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <button className="back-button" onClick={() => navigate('/')}>
        <ArrowLeftOutlined /> Back to topics
      </button>

      <header className="page-header">
        <h1 className="page-title">{topic.name}</h1>
        <p className="page-subtitle">
          {topic.words.length}{' '}
          {topic.words.length === 1 ? 'word' : 'words'}
        </p>
        <div className="header-actions">
          <Space size="middle" wrap>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: displayMode === 'russian' ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
                RU
              </span>
              <Switch
                checked={displayMode === 'english'}
                onChange={(checked) => {
                  setDisplayMode(checked ? 'english' : 'russian');
                  handleUpdateRevealedKey();
                }}
              />
              <span style={{ color: displayMode === 'english' ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
                EN
              </span>
            </div>
            <Button
              icon={<SaveOutlined />}
              onClick={handleSaveProgress}
              loading={saving}
              disabled={pendingCounts.size === 0}
            >
              Save progress
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingWord(null);
                setFormOpen(true);
              }}
            >
              Add word
            </Button>
          </Space>
        </div>
      </header>

      {topic.words.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3 className="empty-state-title">No words yet</h3>
          <p className="empty-state-description">
            Add the first word for study
          </p>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingWord(null);
              setFormOpen(true);
            }}
          >
            Add word
          </Button>
        </div>
      ) : (
        <div className="words-list">
          {sortedWords.map((word) => (
            <WordCard
            word={getWordWithPending(word)}
            displayMode={displayMode}
            isCompleted={completedWords.has(word.id)}
            onToggleComplete={() => handleToggleComplete(word.id)}
            onEdit={() => {
              setEditingWord(word);
              setFormOpen(true);
            }}
            onDelete={() => handleDeleteWord(word)}
            onIncrementCount={(increment) => handleIncrementCount(word.id, increment)}
            key={`${word.id}-${revealedKey}`}
            />
          ))}
        </div>
      )}

      <WordForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingWord(null);
        }}
        onSubmit={editingWord ? handleEditWord : handleAddWord}
        editingWord={editingWord}
        loading={saving}
      />
    </div>
  );
};

export default TopicPage;