import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Word, DisplayMode } from '../types';
import '../styles/WordCard.css';

interface WordCardProps {
  word: Word;
  displayMode: DisplayMode;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onIncrementCount: () => void;
}

const WordCard: React.FC<WordCardProps> = ({
  word,
  displayMode,
  isCompleted,
  onToggleComplete,
  onEdit,
  onDelete,
  onIncrementCount,
}) => {
  const [revealed, setRevealed] = useState(false);
  const [synonymRevealed, setSynonymRevealed] = useState(false);

  const showEnglish = displayMode === 'english';
  const showRussian = displayMode === 'russian';
  const isTrainingMode = showEnglish || showRussian;

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.word-card-actions')) return;
    if ((e.target as HTMLElement).closest('.synonym-hidden')) {
      setSynonymRevealed(true);
      return;
    }
    setRevealed(true);
  };

  const renderHiddenContent = (content: string, isHidden: boolean, placeholder: string) => {
    if (!isHidden || revealed) {
      return <span>{content}</span>;
    }
    return (
      <div className="word-card-hidden">
        <span className="word-card-hidden-content">{content}</span>
        <div className="word-card-hidden-overlay">{placeholder}</div>
      </div>
    );
  };

  const cardClasses = [
    'word-card',
    isCompleted ? 'completed' : '',
    !revealed && (showEnglish || showRussian) ? 'training-mode' : '',
    revealed ? 'revealed' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={handleCardClick}>
      <div className="word-card-header">
        <div className="word-card-main">
          <h4 className="word-card-english">
            {showRussian && !revealed ? (
              renderHiddenContent(word.eng, true, 'Нажмите, чтобы увидеть')
            ) : (
              word.eng
            )}
          </h4>
          <p className="word-card-russian">
            {showEnglish && !revealed ? (
              renderHiddenContent(word.ru, true, 'Нажмите, чтобы увидеть')
            ) : (
              word.ru
            )}
          </p>
        </div>
        <div className="word-card-actions">
          <button
            className={`word-card-action-btn check ${isCompleted ? 'checked' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete();
            }}
            title="Отметить как выполненное"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
          <button
            className="word-card-action-btn edit"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="Редактировать"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className="word-card-action-btn delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Удалить"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      {(word.example || word.synonym) && (
        <div className="word-card-details">
          {word.example && (
            <div className="word-card-detail">
              <span className="word-card-detail-label">Пример:</span>
              <span className="word-card-detail-value">
                {(showEnglish || showRussian) && !revealed ? (
                  renderHiddenContent(word.example, true, 'Нажмите для просмотра')
                ) : (
                  word.example
                )}
              </span>
            </div>
          )}
          {word.synonym && (
            <div className="word-card-detail synonym-hidden">
              <span className="word-card-detail-label">Синоним:</span>
              <span className="word-card-detail-value">
                {(showEnglish || showRussian) && !revealed && !synonymRevealed ? (
                  <div className="word-card-hidden">
                    <span className="word-card-hidden-content">{word.synonym}</span>
                    <div className="word-card-hidden-overlay">Нажмите для просмотра</div>
                  </div>
                ) : (
                  word.synonym
                )}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="word-card-meta">
        <div className="word-card-meta-item">
          <svg className="word-card-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{dayjs(word.createdAt).format('DD.MM.YYYY')}</span>
        </div>
        <div className="word-card-meta-item">
          <span className="correct-count-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {word.correctCount}
          </span>
        </div>
        <button className="increment-btn" onClick={(e) => {
          e.stopPropagation();
          onIncrementCount();
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          +1
        </button>
      </div>
    </div>
  );
};

export default WordCard;
