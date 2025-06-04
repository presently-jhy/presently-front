// src/components/GiftItem/GiftItem.jsx

import React from 'react';
import styles from './GiftItem.module.css';

/*
  props:
    type, title, description, image, percent,  // percent는 "75%" 같은 문자열
    onClick, onDelete
*/
const GiftItem = ({ type, title, description, image, percent, onClick, onDelete }) => {
    const isFund = type === '펀딩';
    const isGift = type === '선물';

    // percent 문자열(예: "75%")에서 숫자만 뽑아서 정수로 변환
    const pctValue = isFund ? parseInt(percent.replace('%', ''), 10) || 0 : 0;

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            onClick();
        }
    };

    return (
        <div
            className={styles.giftItemContainer}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyPress={handleKeyPress}
        >
            {/* 왼쪽: 이미지 */}
            <img src={image} alt={`${title} 이미지`} className={styles.giftImage} />

            {/* 중앙: 텍스트 (타입 배지 + 제목 + 설명) */}
            <div className={styles.textWrap}>
                <div className={styles.topLine}>
                    <span
                        className={`${styles.typeBadge} ${isFund ? styles.fundBadge : isGift ? styles.giftBadge : ''}`}
                    >
                        {type}
                    </span>
                    <span className={styles.itemTitle}>{title}</span>
                </div>
                <p className={styles.itemDescription}>{description}</p>
            </div>

            {/* 오른쪽: 미니 원형 프로그래션 + 삭제 버튼 */}
            <div className={styles.rightGroup}>
                {isFund && (
                    <div
                        className={styles.miniProgressCircle}
                        style={{
                            background: `conic-gradient(
                #7d57b1 ${pctValue * 3.6}deg,
                #ededed ${pctValue * 3.6}deg
              )`,
                        }}
                        aria-label={`진행률 ${pctValue}%`}
                        title={`${pctValue}%`}
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
};

export default GiftItem;
