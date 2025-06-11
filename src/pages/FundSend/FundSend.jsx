// src/pages/FundSend/FundSend.jsx

import React, { useState, useMemo } from 'react';
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
    targetAmount: 1000000, // 기본 최대 펀딩 목표
};

export default function FundSend() {
    const navigate = useNavigate();
    const location = useLocation();

    const passed = location.state || {};
    const initialEventData = passed.eventData || passed || defaultEventData;
    const giftData = passed.gift || null;
    const isFundMode = giftData ? giftData.selectedType === 'fund' : initialEventData.eventType === 'fund';

    const [eventData] = useState(initialEventData);
    const [amount, setAmount] = useState(''); // 원 단위 숫자만 저장
    const [nickname, setNickname] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // 쉼표 찍힌 표시값
    const formattedAmount = useMemo(() => {
        if (!amount) return '';
        const num = Number(amount);
        return isNaN(num) ? '' : num.toLocaleString();
    }, [amount]);

    const handleAmountChange = (e) => {
        // 숫자만 남기기
        const raw = e.target.value.replace(/[^\d]/g, '');
        setAmount(raw);
        setError('');
    };

    const handleBack = () => window.history.back();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!nickname.trim()) {
            setError('닉네임을 입력해 주세요.');
            return;
        }

        let num = 0;
        if (isFundMode) {
            num = Number(amount);
            if (!num || num < 1000) {
                setError('1,000원 이상 입력해 주세요.');
                return;
            }
            if (eventData.targetAmount && num > eventData.targetAmount) {
                setError(`최대 ${eventData.targetAmount.toLocaleString()}원 이하로 입력해 주세요.`);
                return;
            }
        }

        // 1) 피드백만 쌓기 (currentAmount/percent 누적은 수락 시 처리)
        if (giftData) {
            const stored = JSON.parse(localStorage.getItem('gifts')) || [];
            const updatedGifts = stored.map((g) => {
                if (g.id !== giftData.id) return g;
                const fb = {
                    id: Date.now(),
                    message: message.trim(),
                    nickname: nickname.trim(),
                    status: 'pending',
                    ...(isFundMode && { amount: num }),
                };
                return {
                    ...g,
                    feedbacks: [...(g.feedbacks || []), fb],
                };
            });
            localStorage.setItem('gifts', JSON.stringify(updatedGifts));
        }

        // 2) 이벤트 뷰 카운트만 +1 (펀드 present 증가도 수락 시 처리)
        const evts = JSON.parse(localStorage.getItem('events')) || [];
        const updatedEvents = evts.map((evt) => {
            if (evt.id !== eventData.id) return evt;
            const newView = (evt.eventView || 0) + 1;
            const newPresent = isFundMode ? evt.eventPresent || 0 : (evt.eventPresent || 0) + 1;
            return {
                ...evt,
                eventView: newView,
                eventPresent: newPresent,
                nickname: nickname.trim() || evt.nickname,
            };
        });
        localStorage.setItem('events', JSON.stringify(updatedEvents));

        navigate('/eventview', { state: eventData });
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
                    <label htmlFor="amountInput" className={styles.amountLabel}>
                        금액
                    </label>
                    <div className={styles.inputWrapper}>
                        <input
                            id="amountInput"
                            type="text"
                            className={styles.amountInput}
                            placeholder="0"
                            value={formattedAmount}
                            onChange={handleAmountChange}
                            inputMode="numeric"
                        />
                        <span className={styles.currency}>원</span>
                    </div>
                    <div className={styles.hint}>
                        최소 1,000원 이상, 최대 {eventData.targetAmount?.toLocaleString() || '제한 없음'}원
                    </div>
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
