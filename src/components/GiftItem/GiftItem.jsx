// src/components/GiftItem/GiftItem.jsx
<<<<<<< HEAD
import React from "react";
import styles from "./GiftItem.module.css";

export default function GiftItem({
  type,
  title,
  description,
  image,
  percent, // e.g. "75%"
  link, // 새로 추가된 상품 URL
  onClick,
  onDelete,
}) {
  const isFund = type === "펀딩";
  const pctValue = isFund ? parseInt(percent?.replace("%", ""), 10) || 0 : 0;
=======
import React from 'react';
import { motion } from 'framer-motion';
import styles from './GiftItem.module.css';

export default function GiftItem({
    type,
    title,
    description,
    image,
    percent, // e.g. "75%"
    link, // 새로 추가된 상품 URL
    feedbackCount, // 피드백 개수
    onClick,
    onDelete,
    onFeedbackClick, // 피드백 보기 클릭 핸들러
}) {
    const isFund = type === '펀딩';
    const pctValue = isFund ? parseInt(percent?.replace('%', ''), 10) || 0 : 0;
    const hasFeedbacks = feedbackCount && feedbackCount > 0;
>>>>>>> origin/jh

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

<<<<<<< HEAD
  return (
    <div className={styles.giftItemContainer} onClick={onClick} role="button" tabIndex={0} onKeyDown={handleKeyDown}>
      <img src={image} alt={`${title} 이미지`} className={styles.giftImage} />
=======
    const handleImageError = (e) => {
        // 기본 이미지로 대체
        e.target.src = '/default-gift-image.png';
    };

    return (
        <motion.div
            className={styles.giftItemContainer}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
            <img
                src={image}
                alt={`${title} 이미지`}
                className={styles.giftImage}
                loading="lazy"
                onError={handleImageError}
            />
>>>>>>> origin/jh

      <div className={styles.textWrap}>
        <div className={styles.topLine}>
          <span className={`${styles.typeBadge} ${isFund ? styles.fundBadge : styles.giftBadge}`}>{type}</span>
          <span className={styles.itemTitle}>{title}</span>
        </div>
        <p className={styles.itemDescription}>{description}</p>
      </div>

<<<<<<< HEAD
      <div className={styles.rightGroup}>
        {isFund && (
          <div
            className={styles.miniProgressCircle}
            style={{
              background: `conic-gradient(
                var(--primary-color) ${pctValue * 3.6}deg,
                var(--bg-light) ${pctValue * 3.6}deg
              )`,
            }}
            title={`진행률 ${pctValue}%`}
            aria-label={`진행률 ${pctValue}%`}
          />
        )}

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkButton}
            onClick={(e) => e.stopPropagation()}
            aria-label="상품 링크 열기"
          >
            🔗
          </a>
        )}

        {onDelete && (
          <button
            className={styles.deleteButton}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(e);
            }}
            aria-label="삭제"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
=======
            <div className={styles.rightGroup}>
                {isFund && (
                    <div
                        className={styles.miniProgressCircle}
                        style={{
                            '--progress': `${pctValue * 3.6}deg`,
                        }}
                        data-progress={pctValue > 0 ? `${pctValue}%` : ''}
                        title={`진행률 ${pctValue}%`}
                        aria-label={`진행률 ${pctValue}%`}
                    />
                )}

                {hasFeedbacks && (
                    <button
                        className={styles.feedbackButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            onFeedbackClick?.();
                        }}
                        title={`피드백 ${feedbackCount}개 보기`}
                        aria-label={`피드백 ${feedbackCount}개 보기`}
                    >
                        💬 {feedbackCount}
                    </button>
                )}

                {link && (
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.linkButton}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="상품 링크 열기"
                    >
                        🔗
                    </a>
                )}

                {onDelete && (
                    <button
                        className={styles.deleteButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        aria-label="삭제"
                    >
                        ×
                    </button>
                )}
            </div>
        </motion.div>
    );
>>>>>>> origin/jh
}
