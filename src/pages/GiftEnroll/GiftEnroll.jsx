import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './GiftEnroll.module.css';
import arrowIcon from './arrowIcon.png';
import fundExampleImg from './fundExample.png';
import giftExampleImg from './giftExample.png';
import cameraIcon from './cameraIcon.png';
import AmountDial from '../../components/AmountDial/AmountDial';

export default function GiftEnroll() {
    const navigate = useNavigate();
    const location = useLocation();
    const eventData = location.state;

    // 모바일 여부 체크
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // 타입(gift|fund) & 수신 상태(want|unwant|done)
    const initialType = eventData?.eventType === 'gift' ? 'gift' : 'fund';
    const [selectedType, setSelectedType] = useState(initialType);
    const [receiveStatus, setReceiveStatus] = useState('want');

    // 폼 state
    const [imageFile, setImageFile] = useState(null);
    const [giftName, setGiftName] = useState('');
    const [giftDescription, setGiftDescription] = useState('');
    const [giftAmount, setGiftAmount] = useState('0');
    const [giftLink, setGiftLink] = useState('');

    const namePlaceholder = selectedType === 'gift' ? '선물 이름 (필수)' : '펀드 이름 (필수)';
    const descriptionPlaceholder = selectedType === 'gift' ? '선물 설명' : '펀드 설명';

    // 뒤로가기
    const handleBack = () => navigate(-1);

    // 타입 탭 클릭 (want 모드에서만)
    const typeSelectable = receiveStatus === 'want';
    const handleSelectFund = () => typeSelectable && setSelectedType('fund');
    const handleSelectGift = () => typeSelectable && setSelectedType('gift');

    // 수신 상태 변경
    const handleSelectWant = () => setReceiveStatus('want');
    const handleSelectUnwant = () => setReceiveStatus('unwant');
    const handleSelectDone = () => setReceiveStatus('done');

    // 이미지 업로드
    const handleImageChange = (e) => {
        if (!e.target.files?.[0]) return;
        const reader = new FileReader();
        reader.onloadend = () => setImageFile(reader.result);
        reader.readAsDataURL(e.target.files[0]);
    };
    const getExampleImage = () => (selectedType === 'fund' ? fundExampleImg : giftExampleImg);
    const previewImage = imageFile || getExampleImage();

    // 제출
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!giftName.trim()) {
            alert(`${selectedType === 'gift' ? '선물' : '펀드'} 이름은 필수입니다.`);
            return;
        }
        if (receiveStatus === 'want') {
            const amt = parseFloat(giftAmount);
            if (!amt || isNaN(amt)) {
                alert(`${selectedType === 'gift' ? '선물' : '펀드'} 금액을 정확히 입력해주세요.`);
                return;
            }
        }
        const amountValue = parseFloat(giftAmount) || 0;
        const newGift = {
            id: Date.now(),
            selectedType,
            receiveStatus,
            giftName: giftName.trim(),
            giftDescription: giftDescription.trim(),
            imageUrl: previewImage,
            eventId: eventData?.id ?? null,
            link: giftLink.trim() || undefined,
        };
        if (selectedType === 'fund') {
            newGift.targetAmount = amountValue;
            newGift.currentAmount = 0;
            newGift.percent = '0%';
        } else {
            newGift.price = amountValue;
        }
        const existing = JSON.parse(localStorage.getItem('gifts')) || [];
        localStorage.setItem('gifts', JSON.stringify([...existing, newGift]));
        navigate('/eventview', { state: eventData });
    };

    return (
        <div className={styles.container}>
            {/* 헤더 */}
            <header className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    <img src={arrowIcon} alt="뒤로가기" />
                </button>
                <h2 className={styles.title}>{selectedType === 'gift' ? '선물 등록' : '펀드 등록'}</h2>
            </header>

            {/* 이벤트명 */}
            <div className={styles.eventName}>{eventData?.eventName || '이벤트명'}</div>

            {/* 펀드/선물 탭 (want 모드에서만 활성) */}
            <div className={styles.tabContainer}>
                <button
                    className={`${styles.tabButton} ${selectedType === 'fund' ? styles.activeTab : ''}`}
                    onClick={handleSelectFund}
                    disabled={!typeSelectable}
                >
                    펀드
                </button>
                <button
                    className={`${styles.tabButton} ${selectedType === 'gift' ? styles.activeTab : ''}`}
                    onClick={handleSelectGift}
                    disabled={!typeSelectable}
                >
                    선물
                </button>
            </div>

            {/* 받고 싶은 / 받기 싫은 / 받은 */}
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

            {/* 이미지 업로드 */}
            <div className={styles.imageContainer}>
                <img src={previewImage} alt="예시" className={styles.exampleImage} />
                <label htmlFor="imageFile" className={styles.cameraLabel}>
                    <img src={cameraIcon} alt="카메라" />
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
                {/* 이름 */}
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

                {/* 설명 */}
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

                {/* 링크 (옵션) */}
                <div className={styles.inputGroup}>
                    <input
                        type="url"
                        value={giftLink}
                        onChange={(e) => setGiftLink(e.target.value)}
                        placeholder="상품 URL (옵션)"
                        className={styles.textInput}
                    />
                </div>

                {/* 금액 다이얼 */}
                <div className={`${styles.amountDialWrapper} ${receiveStatus !== 'want' ? styles.disabledDial : ''}`}>
                    <AmountDial
                        value={Number(giftAmount)}
                        setValue={(v) => setGiftAmount(String(v))}
                        maxValue={10000000}
                        disabled={receiveStatus !== 'want'}
                    />
                </div>

                <button type="submit" className={styles.submitButton}>
                    완료하기
                </button>
            </form>
        </div>
    );
}
