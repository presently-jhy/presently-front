import React, { useState, useEffect } from 'react';
import styles from './GiftPreview.module.css';
import GiftFeedback from '../GiftFeedback/GiftFeedback';

function GiftPreview({ gift, feedbacks = [], onAccept, onReject, onClose, onGiftAction }) {
    if (!gift) return null;

    const {
        selectedType: type,
        giftName: title,
        giftDescription: description,
        imageUrl,
        targetAmount = 0,
        currentAmount = 0,
        percent = '0%',
        price = 0,
    } = gift;

    const isFund = type === 'fund' || type === '펀딩';
    const [anim, setAnim] = useState(isFund ? 0 : 0);

    // 진행 퍼센트 애니메이션
    useEffect(() => {
        if (!isFund) return;
        const start = performance.now();
        const total = parseInt(percent.replace('%', ''), 10) || 0;
        function frame(now) {
            const progress = Math.min(1, (now - start) / 700);
            setAnim(Math.round(total * progress));
            if (progress < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }, [isFund, percent]);

    const angle = anim * 3.6;
    const display = isFund
        ? `${currentAmount.toLocaleString()}원 / ${targetAmount.toLocaleString()}원`
        : `${price.toLocaleString()}원`;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>

                <div className={styles.imageCircleWrap}>
                    <div
                        className={styles.progressCircle}
                        style={{
                            background: isFund
                                ? `conic-gradient(var(--purple-start) ${angle}deg, var(--gray-border) 0deg)`
                                : 'var(--gray-border)',
                        }}
                    />
                    <img src={imageUrl} alt={title} className={styles.previewImage} />
                    {isFund && <div className={styles.progressText}>{anim}%</div>}
                </div>

                <div className={styles.titleRow}>
                    <span className={styles.giftTitle}>{title}</span>
                    <span className={styles.giftPrice}>{display}</span>
                </div>

                <p className={styles.giftDescription}>{description}</p>

                {onGiftAction && (
                    <button className={styles.actionButton} onClick={onGiftAction}>
                        {isFund ? '펀드 보내기' : '선물 보내기'}
                    </button>
                )}

                {feedbacks.length > 0 && (
                    <div className={styles.feedbackSection}>
                        {feedbacks.map((fb) => (
                            <GiftFeedback
                                key={fb.id}
                                feedback={fb}
                                type={type}
                                onAccept={onAccept}
                                onReject={onReject}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default GiftPreview;
