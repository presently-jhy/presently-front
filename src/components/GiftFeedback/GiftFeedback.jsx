import React from 'react';
import styles from './GiftFeedback.module.css';

const GiftFeedback = ({ feedback, type, onAccept, onReject }) => {
    if (!feedback) return null;

    return (
        <div className={styles.container}>
            <div className={styles.details}>
                {/* fund 타입일 때만 금액 표시 */}
                {type === 'fund' && feedback.amount != null && (
                    <div className={styles.amount}>{feedback.amount.toLocaleString('ko-KR')}원</div>
                )}
                {feedback.message && <div className={styles.message}>{feedback.message}</div>}
            </div>
            <div className={styles.actions}>
                <button className={styles.acceptButton} onClick={() => onAccept(feedback.id)}>
                    {/* fund는 '수락', gift는 '완료' */}
                    {type === 'fund' ? '수락' : '완료'}
                </button>
                <button className={styles.rejectButton} onClick={() => onReject(feedback.id)}>
                    거절
                </button>
            </div>
        </div>
    );
};

export default GiftFeedback;
