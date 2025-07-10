// src/components/GiftPreview/GiftPreview.jsx

import React, { useState, useEffect, useRef } from 'react';
import styles from './GiftPreview.module.css';
import GiftFeedback from '../GiftFeedback/GiftFeedback';

export default function GiftPreview({
    gift,
    feedbacks = [],
    feedbackType = 'pending',
    onAccept,
    onReject,
    onClose,
    onGiftAction,
}) {
    const [anim, setAnim] = useState(0);
    const rafRef = useRef();

    if (!gift) return null;

    const {
        selectedType: type,
        giftName: title,
        giftDescription: desc,
        imageUrl,
        targetAmount = 0,
        currentAmount = 0,
        percent = '0%',
        price = 0,
        link,
    } = gift;

    const isFund = type === 'fund' || type === '펀딩';

    useEffect(() => {
        if (!isFund) return;
        let start;
        const total = parseInt(percent.replace('%', ''), 10) || 0;
        function frame(now) {
            if (!start) start = now;
            const progress = Math.min(1, (now - start) / 700);
            setAnim(Math.round(total * progress));
            if (progress < 1) rafRef.current = requestAnimationFrame(frame);
        }
        rafRef.current = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(rafRef.current);
    }, [isFund, percent]);

    const angle = anim * 3.6;
    const display = isFund
        ? `${currentAmount.toLocaleString()}원 / ${targetAmount.toLocaleString()}원`
        : `${price.toLocaleString()}원`;

    return (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose} aria-label="닫기">
                    &times;
                </button>

                <div className={styles.imageCircleWrap}>
                    <div
                        className={styles.progressCircle}
                        style={{
                            background: isFund
                                ? `conic-gradient(var(--purple-start) ${angle}deg, var(--border-gray) ${angle}deg)`
                                : 'var(--border-gray)',
                        }}
                    />
                    <img src={imageUrl} alt={title} className={styles.previewImage} />
                    {isFund && <div className={styles.progressText}>{anim}%</div>}
                </div>

                <div className={styles.titleRow}>
                    <span className={styles.giftTitle}>{title}</span>
                    <span className={styles.giftPrice}>{display}</span>
                </div>

                <p className={styles.giftDescription}>{desc}</p>

                {link && (
                    <div className={styles.linkRow}>
                        <span className={styles.linkLabel}>상품 링크:</span>
                        <a href={link} target="_blank" rel="noopener noreferrer" className={styles.linkAnchor}>
                            보러가기 ↗
                        </a>
                    </div>
                )}

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
                                type={feedbackType}
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
