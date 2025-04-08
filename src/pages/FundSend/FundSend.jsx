import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './FundSend.module.css';
import arrowIcon from './arrowIcon.png';
import watchImg from './watch.png'; // 기본 이벤트 이미지

// 기본 이벤트 데이터 (전달받은 데이터가 없을 경우 사용할 기본값)
const defaultEventData = {
    id: 0,
    eventTitle: '애플워치 울트라',
    eventName: '2025 나의 생일',
    eventDate: '2025-06-15',
    eventImg: watchImg,
    eventType: 'fund', // 'fund' 또는 'gift'
    eventDescription: '행복한 추억',
    eventView: 0,
    eventPresent: 0,
    nickname: '',
};

function FundSend() {
    const navigate = useNavigate();
    const location = useLocation();

    // 전달받은 state를 분해합니다.
    // 만약 { eventData, gift } 형태로 전달된다면 gift가 우선적으로 모드를 결정하게 할 수 있습니다.
    const passedState = location.state || {};
    // eventData는 passedState.eventData가 있으면 사용, 없으면 passedState 자체를 eventData로 간주
    const initialEventData = passedState.eventData || passedState || defaultEventData;
    // gift 데이터가 전달되었으면 추출 (없으면 null)
    const passedGift = passedState.gift || null;

    // FundSend 모드 결정: gift 데이터가 있으면 gift.selectedType을 참고하고, 그렇지 않으면 eventData.eventType을 사용
    const isFundMode = passedGift ? passedGift.selectedType === 'fund' : initialEventData.eventType === 'fund';

    // 상태 초기화
    const [eventData, setEventData] = useState(initialEventData);
    const [giftData, setGiftData] = useState(passedGift);
    const [amount, setAmount] = useState('');
    const [nickname, setNickname] = useState('');
    const [message, setMessage] = useState('');

    // 뒤로가기
    const handleBack = () => {
        window.history.back();
    };

    // 폼 제출: localStorage의 이벤트 데이터를 업데이트한 후 Dashboard로 이동
    const handleSubmit = (e) => {
        e.preventDefault();
        const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
        const updatedEvents = storedEvents.map((evt) => {
            if (evt.id === eventData.id) {
                const newView = (evt.eventView || 0) + 1;
                const newNickname = evt.nickname || (nickname.trim() ? nickname : evt.nickname);
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
        navigate('/dashboard');
    };

    // 상단 문장: 펀드 모드에서는 금액 입력 필드를, 선물 모드에서는 간단한 참여 메시지 표시
    const topText = isFundMode ? (
        <>
            {eventData.eventDescription}
            <br />
            <input
                type="text"
                className={styles.amountInlineInput}
                placeholder="10,000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            원 보냅니다.
        </>
    ) : (
        <>
            {eventData.eventDescription}
            <br />
            참여합니다.
        </>
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

            {/* 이벤트 정보 영역 */}
            <div className={styles.eventInfo}>
                <h4 className={styles.eventTitle}>{eventData.eventTitle}</h4>
                <p className={styles.eventDate}>{eventData.eventDate}</p>
            </div>

            {/* 중앙 이미지 */}
            <div className={styles.watchImgWrapper}>
                <img src={eventData.eventImg} alt="이벤트 이미지" className={styles.watchImg} />
            </div>

            {/* 상단 문장 */}
            <p className={styles.topText}>{topText}</p>

            {/* 방명록 입력 */}
            <textarea
                className={styles.messageTextarea}
                placeholder="방명록 작성하기"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
            />

            {/* 닉네임 입력 및 "이/가" 표시 */}
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

            {/* 완료하기 버튼 */}
            <button className={styles.submitButton} onClick={handleSubmit}>
                완료하기
            </button>
        </div>
    );
}

export default FundSend;
