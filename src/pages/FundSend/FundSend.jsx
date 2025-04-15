import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './FundSend.module.css';
import arrowIcon from './arrowIcon.png';
import watchImg from './watch.png';
import AmountDial from '../../components/AmountDial/AmountDial'; // AmountDial 임포트

// 기본 이벤트 데이터 (전달받은 데이터가 없을 경우 사용할 기본값)
const defaultEventData = {
    id: 0,
    eventTitle: '애플워치 울트라',
    eventName: '2025 나의 생일',
    eventDate: '2025-06-15',
    eventImg: watchImg,
    eventType: 'gift', // 선물 모드 기본값 (혹은 'fund')
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
    // gift 데이터가 전달되었으면 gift.selectedType 기준, 없으면 eventData.eventType 사용
    const isFundMode = passedGift ? passedGift.selectedType === 'fund' : initialEventData.eventType === 'fund';

    // 상태 초기화
    const [eventData] = useState(initialEventData);
    const [giftData] = useState(passedGift);
    const [amount, setAmount] = useState('');
    const [nickname, setNickname] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    // 추가: 다이얼 모달 토글 상태 (기본: false)
    const [showDial, setShowDial] = useState(false);

    const handleBack = () => {
        window.history.back();
    };

    // 펀드 보내기 폼 제출 시, gift 객체의 currentAmount와 percent 업데이트
    const handleSubmit = (e) => {
        e.preventDefault();

        // 기본 유효성 검사
        if (!nickname.trim()) {
            setError('닉네임을 입력해 주세요.');
            return;
        }
        if (isFundMode) {
            const numericAmount = Number(amount);
            if (!numericAmount || numericAmount <= 0) {
                setError('보낼 금액을 올바르게 입력해 주세요.');
                return;
            }
        }

        // gift 객체 업데이트 (펀드인 경우)
        if (isFundMode && giftData) {
            const storedGifts = JSON.parse(localStorage.getItem('gifts')) || [];
            const updatedGifts = storedGifts.map((gift) => {
                if (gift.id === giftData.id) {
                    // 누적 금액 업데이트
                    const newCurrentAmount = (gift.currentAmount || 0) + Number(amount);
                    // 목표 금액(targetAmount)은 gift에 저장된 값 사용, 없으면 기본값 1,000,000
                    const targetAmount = gift.targetAmount || 1000000;
                    const newPercent = Math.min(100, (newCurrentAmount / targetAmount) * 100);
                    return {
                        ...gift,
                        currentAmount: newCurrentAmount,
                        percent: newPercent.toFixed(0) + '%',
                    };
                }
                return gift;
            });
            localStorage.setItem('gifts', JSON.stringify(updatedGifts));
        }

        // 이벤트 업데이트 처리 (기존 로직)
        const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
        const updatedEvents = storedEvents.map((evt) => {
            if (evt.id === eventData.id) {
                const newView = (evt.eventView || 0) + 1;
                const newNickname = nickname.trim() ? nickname : evt.nickname;
                const newPresent = isFundMode ? Number(amount) || evt.eventPresent : (evt.eventPresent || 0) + 1;
                return {
                    ...evt,
                    eventView: newView,
                    eventPresent: newPresent,
                    nickname: newNickname,
                };
            }
            return evt;
        });
        localStorage.setItem('events', JSON.stringify(updatedEvents));

        // 제출 후 대시보드로 이동
        navigate('/dashboard');
    };

    // 상단 콘텐츠: 펀드 모드에서는 기본 인라인 입력창을 보여주고, 포커스 시 슬라이더 모달 토글
    const topContent = isFundMode ? (
        <div>
            <span className={styles.eventDescription}>{eventData.eventDescription}</span>
            <br />
            <div className={styles.amountContainer}>
                {!showDial && (
                    <input
                        type="text"
                        className={styles.amountInlineInput}
                        placeholder="10,000"
                        value={amount}
                        onFocus={() => setShowDial(true)}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                )}
                <span className={styles.currency}>원 보냅니다.</span>
            </div>
        </div>
    ) : (
        <div>
            <span className={styles.eventDescription}>{eventData.eventDescription}</span>
            <br />
            <span className={styles.participationText}>정말 소중한 선물을 보내요!</span>
        </div>
    );

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

            {/* 중앙 이미지 */}
            <div className={styles.imageWrapper}>
                <img src={eventData.eventImg} alt="이벤트 이미지" className={styles.eventImg} />
            </div>

            {/* 상단 콘텐츠 영역 */}
            <div className={styles.topContent}>{topContent}</div>

            {/* 다이얼 모달 (금액 입력 슬라이더) */}
            {showDial && (
                <div className={styles.sliderModal}>
                    <div className={styles.sliderModalContent}>
                        <AmountDial
                            value={amount}
                            setValue={setAmount}
                            maxValue={giftData && giftData.targetAmount ? giftData.targetAmount : 1000000}
                        />
                        <div className={styles.sliderValue}>{parseInt(amount, 10).toLocaleString('ko-KR')}원</div>
                        <button type="button" className={styles.closeDialButton} onClick={() => setShowDial(false)}>
                            닫기
                        </button>
                    </div>
                </div>
            )}

            {/* 방명록 입력 */}
            <textarea
                className={styles.messageTextarea}
                placeholder="방명록 작성하기"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
            />

            {/* 닉네임 입력 */}
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

            {/* 에러 메시지 */}
            {error && <div className={styles.errorMessage}>{error}</div>}

            {/* 제출 버튼 */}
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
