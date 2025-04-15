import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './GiftEnroll.module.css';
import arrowIcon from './arrowIcon.png';
import fundExampleImg from './fundExample.png';
import giftExampleImg from './giftExample.png';
import cameraIcon from './cameraIcon.png';
import AmountDial from '../../components/AmountDial/AmountDial'; // AmountDial 임포트

function GiftEnroll() {
    const navigate = useNavigate();
    const location = useLocation();
    const eventData = location.state;

    // 디바이스 체크 (여기서는 AmountDial을 무조건 사용)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const initialType = eventData?.eventType === 'gift' ? 'gift' : 'fund';
    const [selectedType, setSelectedType] = useState(initialType);
    const [receiveStatus, setReceiveStatus] = useState('want');
    const [imageFile, setImageFile] = useState(null);
    const [giftName, setGiftName] = useState('');
    const [giftDescription, setGiftDescription] = useState('');
    const [giftAmount, setGiftAmount] = useState('0');

    const namePlaceholder = selectedType === 'gift' ? '선물 이름 (필수)' : '펀드 이름 (필수)';
    const descriptionPlaceholder = selectedType === 'gift' ? '선물 설명' : '펀드 설명';

    const handleBack = () => {
        navigate(-1);
    };

    const handleSelectFund = () => setSelectedType('fund');
    const handleSelectGift = () => setSelectedType('gift');
    const handleSelectWant = () => setReceiveStatus('want');
    const handleSelectUnwant = () => setReceiveStatus('unwant');
    const handleSelectDone = () => setReceiveStatus('done');

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

    const getExampleImage = () => (selectedType === 'fund' ? fundExampleImg : giftExampleImg);

    const previewImage = imageFile || getExampleImage();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!giftName.trim()) {
            alert(`${selectedType === 'gift' ? '선물' : '펀드'} 이름은 필수 입력 사항입니다.`);
            return;
        }
        if (receiveStatus === 'want' && !giftAmount) {
            alert(`${selectedType === 'gift' ? '선물' : '펀드'} 금액은 필수 입력 사항입니다.`);
            return;
        }
        if (receiveStatus === 'want' && isNaN(parseFloat(giftAmount))) {
            alert(`${selectedType === 'gift' ? '선물' : '펀드'} 금액은 숫자만 입력 가능합니다.`);
            return;
        }

        const targetAmount = 100000;
        const currentAmount = receiveStatus === 'want' ? parseFloat(giftAmount) : 0;
        const computedPercent =
            receiveStatus === 'want' ? Math.min(100, (currentAmount / targetAmount) * 100).toFixed(0) + '%' : '0%';

        const newGift = {
            id: Date.now(),
            selectedType,
            receiveStatus,
            giftName,
            giftDescription,
            targetAmount,
            currentAmount,
            percent: computedPercent,
            imageUrl: previewImage,
            eventId: eventData?.id || null,
        };

        const existingGifts = JSON.parse(localStorage.getItem('gifts')) || [];
        const updatedGifts = [...existingGifts, newGift];
        localStorage.setItem('gifts', JSON.stringify(updatedGifts));
        navigate('/eventview');
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    <img src={arrowIcon} alt="뒤로가기" />
                </button>
                <h2 className={styles.title}>{selectedType === 'gift' ? '선물 등록' : '펀드 등록'}</h2>
            </header>

            <div className={styles.eventName}>{eventData?.eventName || '이벤트명'}</div>

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

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        value={giftName}
                        onChange={(e) => setGiftName(e.target.value)}
                        maxLength={30}
                        placeholder={namePlaceholder}
                        className={styles.textInput}
                    />
                    <span className={styles.charCount}>{giftName.length}/30</span>
                </div>

                <div className={styles.inputGroup}>
                    <textarea
                        value={giftDescription}
                        onChange={(e) => setGiftDescription(e.target.value)}
                        maxLength={100}
                        rows="2"
                        placeholder={descriptionPlaceholder}
                        className={styles.textArea}
                    />
                    <span className={styles.charCount}>{giftDescription.length}/100</span>
                </div>

                {/* AmountDial 슬라이더는 다이얼 내부에 금액과 "원" 표시를 포함 */}
                <AmountDial value={giftAmount} setValue={setGiftAmount} maxValue={1000000} />

                <button type="submit" className={styles.submitButton}>
                    완료하기
                </button>
            </form>
        </div>
    );
}

export default GiftEnroll;
