// src/components/GiftItem/GiftItem.jsx
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
    onClick,
    onDelete,
}) {
    const isFund = type === '펀딩';
    const pctValue = isFund ? parseInt(percent?.replace('%', ''), 10) || 0 : 0;

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
        }
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
            <img src={image} alt={`${title} 이미지`} className={styles.giftImage} />

            <div className={styles.textWrap}>
                <div className={styles.topLine}>
                    <span className={`${styles.typeBadge} ${isFund ? styles.fundBadge : styles.giftBadge}`}>
                        {type}
                    </span>
                    <span className={styles.itemTitle}>{title}</span>
                </div>
                <p className={styles.itemDescription}>{description}</p>
            </div>

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
}
