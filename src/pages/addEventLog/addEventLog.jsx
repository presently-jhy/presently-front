import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './AddEventLog.module.css';
import arrowIcon from './arrowIcon.png';
import cameraIcon from './cameraIcon.png';
import anniversaryImg from './anniversaryImg.png';
import birthdayImg from './birthdayImg.png';
import etcImg from './etcImg.png';

function AddEventLog() {
    const navigate = useNavigate();
    const location = useLocation();

    // AddEvent에서 전달한 eventType이 있으면 사용, 없으면 기본 'birthday'
    const initialType = location.state?.eventType || 'birthday';
    // 토글 버튼으로 펀드/선물을 선택 (여기서는 'fund'와 'gift'로 사용)
    const [selectedType, setSelectedType] = useState(initialType === 'birthday' ? 'fund' : initialType);

    // 입력 상태들
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);

    // 선택된 eventType에 따라 기본 이미지를 반환하는 함수
    const getEventTypeImage = () => {
        if (selectedType === 'anniversary') return anniversaryImg;
        if (selectedType === 'gift') return etcImg;
        return birthdayImg;
    };

    // 토글 버튼을 눌러 'fund' 또는 'gift'를 선택
    const handleSelectFund = () => setSelectedType('fund');
    const handleSelectGift = () => setSelectedType('gift');

    // **문제 방지를 위해 한 번만 계산된 기본 이미지** (토글 시 재계산 방지)
    const [defaultImage] = useState(() => getEventTypeImage());

    const handleBack = () => {
        navigate(-1);
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageFile(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newEvent = {
            id: Date.now(),
            eventType: selectedType, // 'fund' 또는 'gift'
            eventName,
            eventDate,
            eventDescription,
            eventImg: imageFile ? imageFile : defaultImage,
        };

        const existingEvents = JSON.parse(localStorage.getItem('events')) || [];
        const updatedEvents = [...existingEvents, newEvent];
        localStorage.setItem('events', JSON.stringify(updatedEvents));

        // FundSend 페이지에 새 이벤트 데이터를 전달
        navigate('/fundsend', { state: newEvent });
    };

    return (
        <div className={styles.container}>
            {/* 헤더 */}
            <header className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    <img src={arrowIcon} alt="뒤로가기" />
                </button>
                <h2 className={styles.title}>이벤트 추가</h2>
            </header>

            {/* 펀드/선물 토글 버튼 - 타이틀과 이미지 영역 사이 */}
            <div className={styles.toggleContainer}>
                <button
                    className={`${styles.toggleButton} ${selectedType === 'fund' ? styles.activeToggle : ''}`}
                    onClick={handleSelectFund}
                >
                    펀드
                </button>
                <button
                    className={`${styles.toggleButton} ${selectedType === 'gift' ? styles.activeToggle : ''}`}
                    onClick={handleSelectGift}
                >
                    선물
                </button>
            </div>

            {/* 중앙 이미지 영역 */}
            <div className={styles.imageContainer}>
                <img src={imageFile || defaultImage} alt="이벤트 예시" className={styles.eventImage} />
                <label htmlFor="imageFile" className={styles.cameraLabel}>
                    <img src={cameraIcon} alt="카메라 아이콘" className={styles.cameraIcon} />
                </label>
                <input
                    type="file"
                    id="imageFile"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.imageInput}
                />
            </div>

            {/* 이벤트 이름 입력 */}
            <div className={styles.inputGroup}>
                <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    maxLength={30}
                    className={styles.textInput}
                    placeholder="이벤트 이름 (필수)"
                />
                <span className={styles.charCount}>{eventName.length}/30</span>
            </div>

            {/* 이벤트 날짜 입력 */}
            <div className={styles.inputGroup}>
                <input
                    type="date"
                    min="2025-01-01"
                    max="2026-12-31"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className={styles.textInput}
                    placeholder="연도. 월. 일. (필수)"
                />
            </div>

            {/* 이벤트 설명 입력 (최대 30자 제한) */}
            <div className={styles.inputGroup}>
                <textarea
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    maxLength={30}
                    className={styles.textarea}
                    rows="2"
                    placeholder="이벤트 설명 (최대 30자)"
                />
                <span className={styles.charCount}>{eventDescription.length}/30</span>
            </div>

            {/* 안내 문구 */}
            <p className={styles.infoMessage}>링크는 이벤트 날짜의 ±3일간, 총 7일간 활성화 됩니다.</p>

            {/* 추가하기 버튼 */}
            <button type="submit" className={styles.submitButton} onClick={handleSubmit}>
                추가하기
            </button>
        </div>
    );
}

export default AddEventLog;
