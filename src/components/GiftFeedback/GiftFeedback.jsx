// src/components/GiftFeedback/GiftFeedback.jsx
import React from 'react';
import styles from './GiftFeedback.module.css';

export default function GiftFeedback({ feedback, type, onAccept, onReject }) {
    if (!feedback) return null;
    const { id, nickname, message, amount, timestamp, avatarUrl, status } = feedback;
    const isHistory = type === 'received';

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
