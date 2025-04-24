import React from 'react';
import styles from './GiftItem.module.css';

/*
  props 예시:
    {
      type: "펀딩" 또는 "선물",
      title: "애플워치 프로",
      description: "짧은 설명",
      image: "이미지 경로",
      percent: "40%", // 펀딩률(펀드일 때만)
      onClick: () => {}
    }
*/
const GiftItem = ({ type, title, description, image, percent, onClick }) => {
    const isFund = type === '펀딩';
    const isGift = type === '선물';

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
            <img src={image} alt={`${title} 이미지`} className={styles.giftImage} />
            <div className={styles.textWrap}>
                <div className={styles.topLine}>
                    <span
                        className={`${styles.typeBadge} ${isFund ? styles.fundBadge : isGift ? styles.giftBadge : ''}`}
                    >
                        {type}
                    </span>
                    <span className={styles.itemTitle}>{title}</span>
                    {percent && <span className={styles.fundingPercent}>{percent}</span>}
                </div>
                <p className={styles.itemDescription}>{description}</p>
            </div>
        </div>
    );
};

export default GiftItem;
