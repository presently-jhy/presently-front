import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './GiftEnroll.module.css';
import arrowIcon from './arrowIcon.png';
import fundExampleImg from './fundExample.png';
import giftExampleImg from './giftExample.png';
import cameraIcon from './cameraIcon.png';

function GiftEnroll() {
    const navigate = useNavigate();
    const location = useLocation();
    // AddEventLog에서 전달한 이벤트 데이터
    const eventData = location.state;

    // 이벤트 데이터에 따른 초기 선택값: eventType이 'gift'면 gift, 아니면 fund
    const initialType = eventData?.eventType === 'gift' ? 'gift' : 'fund';
    const [selectedType, setSelectedType] = useState(initialType);

    // “받고 싶은 / 받기 싫은 / 받은” 상태
    const [receiveStatus, setReceiveStatus] = useState('want');

    // 업로드 이미지(base64)
    const [imageFile, setImageFile] = useState(null);

    // 입력 필드 상태
    const [giftName, setGiftName] = useState('');
    const [giftDescription, setGiftDescription] = useState('');
    const [giftAmount, setGiftAmount] = useState('');
    const [giftLink, setGiftLink] = useState('');

    // 뒤로 가기 버튼
    const handleBack = () => {
        navigate(-1);
    };

    // “펀드” / “선물” 선택
    const handleSelectFund = () => setSelectedType('fund');
    const handleSelectGift = () => setSelectedType('gift');

    // “받고 싶은 / 받기 싫은 / 받은” 선택
    const handleSelectWant = () => setReceiveStatus('want');
    const handleSelectUnwant = () => setReceiveStatus('unwant');
    const handleSelectDone = () => setReceiveStatus('done');

    // 이미지 업로드 핸들러
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageFile(reader.result); // base64 URL
            };
            reader.readAsDataURL(file);
        }
    };

    // "펀드"인지 "선물"인지에 따른 기본 예시 이미지
    const getExampleImage = () => {
        return selectedType === 'fund' ? fundExampleImg : giftExampleImg;
    };

    // 미리보기 이미지: 업로드한 것 or 기본 예시 이미지
    const previewImage = imageFile || getExampleImage();

    // 폼 제출: 선물 데이터를 로컬 스토리지에 저장하고 Dashboard로 이동
    const handleSubmit = (e) => {
        e.preventDefault();
        const newGift = {
            id: Date.now(), // 임시 ID
            selectedType, // "fund" 또는 "gift"
            receiveStatus, // "want", "unwant", "done"
            giftName,
            giftDescription,
            giftAmount,
            giftLink,
            imageUrl: previewImage, // base64 또는 예시 이미지
            eventId: eventData?.id || null, // 이벤트와 연결할 식별자
        };

        const existingGifts = JSON.parse(localStorage.getItem('gifts')) || [];
        const updatedGifts = [...existingGifts, newGift];
        localStorage.setItem('gifts', JSON.stringify(updatedGifts));

        navigate('/eventview');
    };

    return (
        <div className={styles.container}>
            {/* 헤더 */}
            <header className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    <img src={arrowIcon} alt="뒤로가기" />
                </button>
                <h2 className={styles.title}>선물 등록</h2>
            </header>

            {/* 이벤트 정보 영역: AddEventLog에서 전달받은 이벤트명 표시 */}
            <div className={styles.eventName}>{eventData?.eventName || '이벤트명'}</div>

            {/* 펀드 / 선물 탭 */}
            <div className={styles.tabContainer}>
                <button
                    className={`${styles.tabButton} ${selectedType === 'fund' ? styles.activeTab : ''}`}
                    onClick={handleSelectFund}
                >
                    펀드
                </button>
                <button
                    className={`${styles.tabButton} ${selectedType === 'gift' ? styles.activeTab : ''}`}
                    onClick={handleSelectGift}
                >
                    선물
                </button>
            </div>

            {/* 받고 싶은 / 받기 싫은 / 받은 버튼들 */}
            <div className={styles.receiveContainer}>
                <button
                    className={`${styles.receiveButton} ${receiveStatus === 'want' ? styles.receiveActive : ''}`}
                    onClick={handleSelectWant}
                >
                    받고 싶은
                </button>
                <button
                    className={`${styles.receiveButton} ${receiveStatus === 'unwant' ? styles.receiveActive : ''}`}
                    onClick={handleSelectUnwant}
                >
                    받기 싫은
                </button>
                <button
                    className={`${styles.receiveButton} ${receiveStatus === 'done' ? styles.receiveActive : ''}`}
                    onClick={handleSelectDone}
                >
                    받은
                </button>
            </div>

            {/* 이미지 업로드 / 미리보기 */}
            <div className={styles.imageContainer}>
                <img src={previewImage} alt="예시" className={styles.exampleImage} />
                <label htmlFor="imageFile" className={styles.cameraLabel}>
                    <img src={cameraIcon} alt="카메라 버튼" className={styles.cameraIcon} />
                </label>
                <input
                    type="file"
                    id="imageFile"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.imageInput}
                />
            </div>

            {/* 입력 폼 */}
            <form className={styles.form} onSubmit={handleSubmit}>
                {/* 선물 이름 */}
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        value={giftName}
                        onChange={(e) => setGiftName(e.target.value)}
                        maxLength={30}
                        placeholder="선물 이름 (필수)"
                        className={styles.textInput}
                    />
                    <span className={styles.charCount}>{giftName.length}/30</span>
                </div>

                {/* 선물 설명 */}
                <div className={styles.inputGroup}>
                    <textarea
                        value={giftDescription}
                        onChange={(e) => setGiftDescription(e.target.value)}
                        maxLength={100}
                        rows="2"
                        placeholder="선물 설명"
                        className={styles.textArea}
                    />
                    <span className={styles.charCount}>{giftDescription.length}/100</span>
                </div>

                {/* 선물 금액 */}
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        value={giftAmount}
                        onChange={(e) => setGiftAmount(e.target.value)}
                        placeholder="선물 금액"
                        className={styles.textInput}
                    />
                </div>

                {/* 링크 */}
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        value={giftLink}
                        onChange={(e) => setGiftLink(e.target.value)}
                        placeholder="쿠팡 링크"
                        className={styles.textInput}
                    />
                </div>

                {/* 완료하기 버튼 */}
                <button type="submit" className={styles.submitButton}>
                    완료하기
                </button>
            </form>
        </div>
    );
}

export default GiftEnroll;
