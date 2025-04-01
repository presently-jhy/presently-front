import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './FundSend.module.css';
import arrowIcon from './arrowIcon.png';
import watchImg from './watch.png'; // 기본 이벤트 이미지

// 기본 이벤트 데이터 (없을 경우 사용할 기본값)
const defaultEventData = {
    id: 0,
    eventTitle: '애플워치 울트라', // H2 스타일
    eventName: '2025 나의 생일', // H4, Bold, Gray
    eventDate: '2025-06-15',
    eventImg: watchImg,
    eventType: 'fund', // 'fund' 또는 'gift'
    eventDescription: '행복한 추억', // 최대 30자 (AddEventLog에서 입력)
    eventView: 0,
    eventPresent: 0,
    nickname: '',
};

function FundSend() {
    const navigate = useNavigate();
    const location = useLocation();

    // location.state로 전달받은 이벤트 데이터가 있으면 사용, 없으면 기본값
    const passedEvent = location.state;
    const [eventData, setEventData] = useState(passedEvent || defaultEventData);
    const isFundMode = eventData.eventType === 'fund';

    // 입력 상태: 금액, 닉네임, 방명록
    const [amount, setAmount] = useState('');
    const [nickname, setNickname] = useState('');
    const [message, setMessage] = useState('');

    // 뒤로가기
    const handleBack = () => {
        window.history.back();
    };

    // 폼 제출: 로컬스토리지의 해당 이벤트를 업데이트하고 Dashboard로 이동
    const handleSubmit = (e) => {
        e.preventDefault();
        const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
        const updatedEvents = storedEvents.map((evt) => {
            if (evt.id === eventData.id) {
                // 조회수 증가
                const newView = (evt.eventView || 0) + 1;
                // 닉네임: 기존 닉네임이 없으면 FundSend에서 입력한 값 사용
                const newNickname = evt.nickname || (nickname.trim() ? nickname : evt.nickname);
                // eventPresent: 펀드일 경우, 금액(숫자)로 업데이트; 선물일 경우 1 증가
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

    // 상단 문장 구성: 줄바꿈 적용
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
                {/* 페이지 타이틀은 항상 검정색 */}
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

            {/* 닉네임 입력 및 "이/가" 표시 (완료하기 버튼 바로 위, 오른쪽) */}
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
