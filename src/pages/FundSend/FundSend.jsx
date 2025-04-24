// src/pages/FundSend/FundSend.jsx

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './FundSend.module.css';
import arrowIcon from './arrowIcon.png';
import watchImg from './watch.png';

// 기본 이벤트 데이터 (전달받은 데이터가 없을 경우...)
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

function FundSend() {
    const navigate = useNavigate();
    const location = useLocation();

    // 전달받은 state 분해
    const passedState = location.state || {};
    const initialEventData = passedState.eventData || passedState || defaultEventData;
    const passedGift = passedState.gift || null;
    const isFundMode = passedGift ? passedGift.selectedType === 'fund' : initialEventData.eventType === 'fund';

    // 상태
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

        // 1) gifts 업데이트
        if (isFundMode && giftData) {
            const stored = JSON.parse(localStorage.getItem('gifts')) || [];
            const updated = stored.map((g) => {
                if (g.id === giftData.id) {
                    const newCur = (g.currentAmount || 0) + num;
                    const tgt = g.targetAmount || 1000000;
                    const pct = Math.min(100, (newCur / tgt) * 100).toFixed(0) + '%';
                    const fb = { id: Date.now(), amount: num, message: message.trim() };
                    return { ...g, currentAmount: newCur, percent: pct, feedbacks: [...(g.feedbacks || []), fb] };
                }
                return g;
            });
            localStorage.setItem('gifts', JSON.stringify(updated));
        }

        // 2) events 업데이트
        const evts = JSON.parse(localStorage.getItem('events')) || [];
        const evtsUpd = evts.map((evt) => {
            if (evt.id === eventData.id) {
                const view = (evt.eventView || 0) + 1;
                const nick = nickname.trim() || evt.nickname;
                const pres = isFundMode ? (evt.eventPresent || 0) + num : (evt.eventPresent || 0) + 1;
                return { ...evt, eventView: view, eventPresent: pres, nickname: nick };
            }
            return evt;
        });
        localStorage.setItem('events', JSON.stringify(evtsUpd));

        // 3) EventView로 돌아가기 (모달 자동 오픈 가능)
        navigate('/eventview', { state: { eventData, gift: giftData } });
    };

    return (
        <div className={`${styles.container} ${isFundMode ? styles.fundMode : styles.giftMode}`}>
            {/* 헤더 */}
            <header className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    <img src={arrowIcon} alt="뒤로가기" />
                </button>
                <h2 className={styles.pageTitle}>{eventData.eventName}</h2>
            </header>

            {/* 이벤트 정보 */}
            <div className={styles.eventInfo}>
                <h4 className={styles.eventTitle}>{eventData.eventTitle}</h4>
                <p className={styles.eventDate}>{eventData.eventDate}</p>
            </div>

            {/* 이미지 */}
            <div className={styles.imageWrapper}>
                <img src={eventData.eventImg} alt="이벤트 이미지" className={styles.eventImg} />
            </div>

            {/* 금액 입력(PC: 키보드, Mobile: 숫자 키패드) */}
            {isFundMode && (
                <div className={styles.amountContainer}>
                    <input
                        type="text"
                        className={styles.amountInput}
                        placeholder="10,000"
                        value={amount}
                        onChange={(e) => {
                            // 숫자만 허용, 천 단위 콤마 없이 내부 저장
                            const raw = e.target.value.replace(/[^0-9]/g, '');
                            setAmount(raw);
                        }}
                        inputMode="numeric"
                        pattern="[0-9]*"
                    />
                    <span className={styles.currency}>원 보냅니다.</span>
                </div>
            )}

            {/* 방명록 */}
            <textarea
                className={styles.messageTextarea}
                placeholder="방명록 작성하기"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
            />

            {/* 닉네임 */}
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

            {/* 에러 */}
            {error && <div className={styles.errorMessage}>{error}</div>}

            {/* 제출 */}
            <motion.button
                className={styles.submitButton}
                onClick={handleSubmit}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
            >
                {isFundMode ? '펀드 보내기' : '선물 보내기'}
            </motion.button>
        </div>
    );
}

export default FundSend;
