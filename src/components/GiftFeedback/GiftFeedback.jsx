import React from 'react';
import styles from './GiftFeedback.module.css';

const GiftFeedback = ({ feedback, onAccept, onReject }) => {
    if (!feedback) return null;

    const formatted = feedback.amount ? feedback.amount.toLocaleString('ko-KR') + '원' : '0원';

    return (
        <div className={styles.container}>
            <div className={styles.details}>
                <div className={styles.amount}>{formatted}</div>
                {feedback.message && <div className={styles.message}>{feedback.message}</div>}
            </div>
            <div className={styles.actions}>
                <button className={styles.acceptButton} onClick={() => onAccept(feedback.id)}>
                    수락
                </button>
                <button className={styles.rejectButton} onClick={() => onReject(feedback.id)}>
                    거절
                </button>
            </div>
        </div>
    );
};

export default GiftFeedback;
