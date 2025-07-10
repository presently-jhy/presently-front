// src/components/GiftFeedback/GiftFeedback.jsx
import React from 'react';
import styles from './GiftFeedback.module.css';

export default function GiftFeedback({ feedback, type, onAccept, onReject }) {
    if (!feedback) return null;
    const { id, nickname, message, amount, timestamp, avatarUrl, status } = feedback;

    // 받은 탭에서는 히스토리 스타일, 받고 싶은 탭에서는 수락/거절 버튼 표시
    const isHistory = type === 'received';
    const showActions = type === 'pending' && status === 'pending';

    if (isHistory) {
        return (
            <div className={styles.historyContainer}>
                {avatarUrl && <img src={avatarUrl} alt="" className={styles.avatar} />}
                <div className={styles.details}>
                    <div className={styles.nick}>{nickname}님</div>
                    {amount != null && <div className={styles.amount}>{amount.toLocaleString()}원</div>}
                    {message && <div className={styles.message}>{message}</div>}
                    {timestamp && <div className={styles.timestamp}>{timestamp}</div>}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.details}>
                <div className={styles.nick}>{nickname}님</div>
                {amount != null && <div className={styles.amount}>{amount.toLocaleString()}원</div>}
                {message && <div className={styles.message}>{message}</div>}
            </div>
            {showActions ? (
                <div className={styles.actions}>
                    <button className={styles.acceptButton} onClick={() => onAccept(id)}>
                        수락
                    </button>
                    <button className={styles.rejectButton} onClick={() => onReject(id)}>
                        거절
                    </button>
                </div>
            ) : (
                <div className={styles.statusBadge}>
                    {status === 'accepted' ? '완료' : status === 'rejected' ? '거절됨' : '대기중'}
                </div>
            )}
        </div>
    );
}
