import React from 'react';
import dayjs from 'dayjs';
import { Topic } from '../types';
import '../styles/TopicCard.css';

interface TopicCardProps {
  topic: Topic;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onClick, onEdit, onDelete }) => {
  return (
    <div className="topic-card" onClick={onClick}>
      <div className="topic-card-header">
        <h3 className="topic-card-name">{topic.name}</h3>
        <div className="topic-card-actions">
          <button 
            className="topic-card-action-btn edit" 
            onClick={onEdit}
            title="Редактировать"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button 
            className="topic-card-action-btn delete" 
            onClick={onDelete}
            title="Удалить"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="topic-card-stats">
        <div className="topic-card-stat">
          <span className="topic-card-stat-value">{topic.words.length}</span>
          <span className="topic-card-stat-label">
            {topic.words.length === 1 ? 'слово' : 
             topic.words.length >= 2 && topic.words.length <= 4 ? 'слова' : 'слов'}
          </span>
        </div>
      </div>
      
      <div className="topic-card-dates">
        <div className="topic-card-date">
          <svg className="topic-card-date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>Создано: {dayjs(topic.createdAt).format('DD.MM.YYYY')}</span>
        </div>
        <div className="topic-card-date">
          <svg className="topic-card-date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>Обновлено: {dayjs(topic.lastUpdated).format('DD.MM.YYYY HH:mm')}</span>
        </div>
      </div>
    </div>
  );
};

export default TopicCard;
