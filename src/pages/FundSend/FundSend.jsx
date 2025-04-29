// src/pages/FundSend/FundSend.jsx

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './FundSend.module.css';
import arrowIcon from './arrowIcon.png';
import watchImg from './watch.png';

const defaultEventData = {
    id: 0,
    eventTitle: '애플워치 울트라',
    eventName: '2025 나의 생일',
    eventDate: '2025-06-15',
    eventImg: watchImg,
    eventType: 'gift',
    eventDescription: '행복한 추억',
    eventView: 0,
    eventPresent: 0,
    nickname: '',
};

export default function FundSend() {
    const navigate = useNavigate();
    const location = useLocation();

    const passed = location.state || {};
    const initialEventData = passed.eventData || passed || defaultEventData;
    const passedGift = passed.gift || null;
    const isFundMode = passedGift ? passedGift.selectedType === 'fund' : initialEventData.eventType === 'fund';

    const [eventData] = useState(initialEventData);
    const [giftData] = useState(passedGift);
    const [amount, setAmount] = useState('');
    const [nickname, setNickname] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleBack = () => window.history.back();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nickname.trim()) {
            setError('닉네임을 입력해 주세요.');
            return;
        }

        let num = 0;
        if (isFundMode) {
            num = Number(amount.replace(/,/g, ''));
            if (!num || num <= 0) {
                setError('보낼 금액을 올바르게 입력해 주세요.');
                return;
            }
        }

        // update gifts in localStorage
        if (giftData) {
            const stored = JSON.parse(localStorage.getItem('gifts')) || [];
            const updated = stored.map((g) => {
                if (g.id !== giftData.id) return g;
                if (isFundMode) {
                    // 펀드: feedback 추가
                    const newCur = (g.currentAmount || 0) + num;
                    const tgt = g.targetAmount || 1000000;
                    const newPct = Math.min(100, (newCur / tgt) * 100).toFixed(0) + '%';
                    const fb = { id: Date.now(), amount: num, message: message.trim() };
                    return {
                        ...g,
                        currentAmount: newCur,
                        percent: newPct,
                        feedbacks: [...(g.feedbacks || []), fb],
                    };
                } else {
                    // 선물: feedback 추가 without amount
                    const fb = { id: Date.now(), message: message.trim() };
                    return {
                        ...g,
                        feedbacks: [...(g.feedbacks || []), fb],
                    };
                }
            });
            localStorage.setItem('gifts', JSON.stringify(updated));
        }

        // update events in localStorage
        const evts = JSON.parse(localStorage.getItem('events')) || [];
        const evtsUpd = evts.map((evt) => {
            if (evt.id !== eventData.id) return evt;
            const newView = (evt.eventView || 0) + 1;
            const nick = nickname.trim() || evt.nickname;
            const pres = isFundMode ? (evt.eventPresent || 0) + num : (evt.eventPresent || 0) + 1;
            return {
                ...evt,
                eventView: newView,
                eventPresent: pres,
                nickname: nick,
            };
        });
        localStorage.setItem('events', JSON.stringify(evtsUpd));

        // back to EventView
        navigate('/eventview', { state: { ...eventData } });
    };

    return (
        <div className={`${styles.container} ${isFundMode ? styles.fundMode : styles.giftMode}`}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    <img src={arrowIcon} alt="뒤로가기" />
                </button>
                <h2 className={styles.pageTitle}>{eventData.eventName}</h2>
            </header>

            <div className={styles.eventInfo}>
                <h4 className={styles.eventTitle}>{eventData.eventTitle}</h4>
                <p className={styles.eventDate}>{eventData.eventDate}</p>
            </div>

            <div className={styles.imageWrapper}>
                <img src={eventData.eventImg} alt="이벤트 이미지" className={styles.eventImg} />
            </div>

            {isFundMode && (
                <div className={styles.amountContainer}>
                    <input
                        type="number"
                        className={styles.amountInput}
                        placeholder="금액 입력"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                        inputMode="numeric"
                    />
                    <span className={styles.currency}>원 보냅니다.</span>
                </div>
            )}

            <textarea
                className={styles.messageTextarea}
                placeholder="방명록 작성하기"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <div className={styles.nicknameContainer}>
                <input
                    type="text"
                    className={styles.nicknameInput}
                    placeholder="닉네임"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />
                <span className={styles.nicknameSuffix}>이/가</span>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <button className={styles.submitButton} onClick={handleSubmit}>
                {isFundMode ? '펀드 보내기' : '선물 보내기'}
            </button>
        </div>
    );
}
