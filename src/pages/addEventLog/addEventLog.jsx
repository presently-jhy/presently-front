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

    // 이전 페이지에서 전달한 이벤트 유형 (anniversary, birthday, etc)
    const selectedEventType = location.state?.eventType || 'birthday';

    // 입력 상태들
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    // imageFile will hold the base64 URL string if an image is uploaded.
    const [imageFile, setImageFile] = useState(null);

    // 이벤트 유형에 따른 기본 이미지 (파일을 업로드하지 않은 경우)
    const getEventTypeImage = () => {
        if (selectedEventType === 'anniversary') return anniversaryImg;
        if (selectedEventType === 'etc') return etcImg;
        return birthdayImg;
    };

    // 뒤로가기
    const handleBack = () => {
        navigate(-1);
    };

    // 이미지 선택 (FileReader로 base64 변환)
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageFile(reader.result); // base64 URL 저장
            };
            reader.readAsDataURL(file);
        }
    };

    // 폼 제출: 이벤트 정보를 로컬 스토리지에 저장 후 Dashboard로 이동
    const handleSubmit = (e) => {
        e.preventDefault();
        // 새 이벤트 객체에 업로드한 이미지(있으면 base64, 없으면 기본 이미지) 포함
        const newEvent = {
            eventType: selectedEventType,
            eventName,
            eventDate,
            eventDescription,
            eventImg: imageFile ? imageFile : getEventTypeImage(),
        };

        // 기존 이벤트 목록 읽기 (없으면 빈 배열)
        const existingEvents = JSON.parse(localStorage.getItem('events')) || [];
        // 새 이벤트 추가
        const updatedEvents = [...existingEvents, newEvent];
        localStorage.setItem('events', JSON.stringify(updatedEvents));

        // 저장 후 Dashboard로 이동
        navigate('/dashboard');
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

            {/* 폼 영역 */}
            <form className={styles.form} onSubmit={handleSubmit}>
                {/* 중앙 예시 이미지 + 카메라 아이콘 */}
                <div className={styles.imageContainer}>
                    <img src={getEventTypeImage()} alt="이벤트 예시" className={styles.eventImage} />

                    {/* 카메라 아이콘 클릭 → 파일 업로드 창 열기 */}
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

                {/* 이벤트 이름 */}
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

                {/* 이벤트 날짜 */}
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

                {/* 이벤트 설명 */}
                <div className={styles.inputGroup}>
                    <textarea
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        maxLength={100}
                        className={styles.textarea}
                        rows="4"
                        placeholder="이벤트 설명을 입력하세요..."
                    />
                    <span className={styles.charCount}>{eventDescription.length}/100</span>
                </div>

                {/* 회색 안내 문구 */}
                <p className={styles.infoMessage}>링크는 이벤트 날짜의 ±3일간, 총 7일간 활성화 됩니다.</p>

                {/* 추가하기 버튼 */}
                <button type="submit" className={styles.submitButton}>
                    추가하기
                </button>
            </form>
        </div>
    );
}

export default AddEventLog;
