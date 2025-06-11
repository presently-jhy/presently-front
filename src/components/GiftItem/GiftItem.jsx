// src/components/GiftItem/GiftItem.jsx
import React from 'react';
import styles from './GiftItem.module.css';

export default function GiftItem({
    type,
    title,
    description,
    image,
    percent, // e.g. "75%"
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
        <div
            className={styles.giftItemContainer}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyDown}
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
                var(--purple-dark) ${pctValue * 3.6}deg,
                var(--bg-lighter) ${pctValue * 3.6}deg
              )`,
                        }}
                        title={`${pctValue}%`}
                        aria-label={`진행률 ${pctValue}%`}
                    />
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
        </div>
    );
}
