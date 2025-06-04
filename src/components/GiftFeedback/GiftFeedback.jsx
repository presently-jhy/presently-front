// src/components/GiftFeedback/GiftFeedback.jsx
import React from 'react';
import styles from './GiftFeedback.module.css';

export default function GiftFeedback({
    feedback,
    type, // 'fund' or 'gift'
    onAccept, // 없을 수도 있음
    onReject, // 없을 수도 있음
}) {
    if (!feedback) return null;

    const isFund = type === 'fund' || type === '펀딩';
    const { id, nickname, message, amount, status } = feedback;
    const formattedAmount = isFund && amount ? `${amount.toLocaleString('ko-KR')}원` : null;

    // onAccept/onReject 둘 다 없으면, '히스토리 모드' 로 간주
    const isHistory = typeof onAccept !== 'function' && typeof onReject !== 'function';

    return (
        <div className={styles.container}>
            {/* 보낸 사람 / 금액 / 메시지 */}
            <div className={styles.details}>
                <div className={styles.nick}>{nickname}님</div>
                {formattedAmount && <div className={styles.amount}>{formattedAmount}</div>}
                {message && <div className={styles.message}>{message}</div>}
            </div>

            {/* 히스토리 모드가 아니고, 상태가 pending 이면 수락/거절 버튼 */}
            {!isHistory && status === 'pending' && (
                <div className={styles.actions}>
                    <button className={styles.acceptButton} onClick={() => onAccept(id)}>
                        수락
                    </button>
                    <button className={styles.rejectButton} onClick={() => onReject(id)}>
                        거절
                    </button>
                </div>
            )}

            {/* 히스토리 모드가 아니고, 완료된 상태면 배지 */}
            {!isHistory && status !== 'pending' && (
                <div className={styles.statusBadge}>{status === 'accepted' ? '완료' : '거절됨'}</div>
            )}
        </div>
    );
}
