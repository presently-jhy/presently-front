// src/components/GiftFeedback/GiftFeedback.jsx

import React from 'react';
import styles from './GiftFeedback.module.css';

export default function GiftFeedback({
    feedback,
    type, // 'fund' or 'gift'
    onAccept,
    onReject,
}) {
    if (!feedback) return null;

    const isFund = type === 'fund' || type === '펀딩';
    const { id, nickname, message, amount, status } = feedback;

    // 포맷된 금액 (펀드일 때만)
    const formattedAmount = isFund && amount ? `${amount.toLocaleString('ko-KR')}원` : null;

    return (
        <div className={styles.container}>
            {/* 닉네임 표시 */}
            <div className={styles.details}>
                <div className={styles.nick}>{nickname}님</div>
                {formattedAmount && <div className={styles.amount}>{formattedAmount}</div>}
                {message && <div className={styles.message}>{message}</div>}
            </div>

            {status === 'pending' ? (
                <div className={styles.actions}>
                    <button className={styles.acceptButton} onClick={() => onAccept(id)}>
                        수락
                    </button>
                    <button className={styles.rejectButton} onClick={() => onReject(id)}>
                        거절
                    </button>
                </div>
            ) : (
                <div className={styles.statusBadge}>{status === 'accepted' ? '완료' : '거절됨'}</div>
            )}
        </div>
    );
}
