// src/pages/GiftEnroll/GiftEnroll.jsx

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera } from 'lucide-react';
import styles from './GiftEnroll.module.css';
import fundExampleImg from './fundExample.png';
import giftExampleImg from './giftExample.png';
import AmountDial from '../../components/AmountDial/AmountDial';
import Spinner from '../../components/Spinner/Spinner';
import Confetti from '../../components/Confetti/Confetti';
import { giftService } from '../../services/giftService';
import { useToast } from '../../context/ToastContext';
import { Breadcrumb } from '../../components';

export default function GiftEnroll() {
    const navigate = useNavigate();
    const location = useLocation();
    const eventData = location.state;
    const { showSuccess, showError } = useToast();

    // 모바일 여부 체크 (현재 미사용)
    // const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    // useEffect(() => {
    //     const onResize = () => setIsMobile(window.innerWidth < 768);
    //     window.addEventListener('resize', onResize);
    //     return () => window.removeEventListener('resize', onResize);
    // }, []);

    // 타입 & 수신 상태
    const initialType = eventData?.eventType === 'gift' ? 'gift' : 'fund';
    const [selectedType, setSelectedType] = useState(initialType);
    const [receiveStatus, setReceiveStatus] = useState('want');

    // 폼 state + validation
    const [imageFile, setImageFile] = useState(null);
    const [giftName, setGiftName] = useState('');
    const [giftDescription, setGiftDescription] = useState('');
    const [giftAmount, setGiftAmount] = useState('0');
    const [giftLink, setGiftLink] = useState('');

    const [giftNameError, setGiftNameError] = useState('');
    const [giftAmountError, setGiftAmountError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const namePlaceholder = selectedType === 'gift' ? '선물 이름 (필수)' : '펀드 이름 (필수)';
    const descriptionPlaceholder = selectedType === 'gift' ? '선물 설명' : '펀드 설명';

    // validation functions
    const validateGiftName = (val) => {
        const v = val.trim();
        if (!v) {
            setGiftNameError('이름은 필수입니다.');
        } else if (v.length < 2) {
            setGiftNameError('최소 2글자 이상 입력해주세요.');
        } else {
            setGiftNameError('');
        }
    };
    const validateGiftAmount = (val) => {
        if (receiveStatus === 'want') {
            const num = parseFloat(val);
            if (!num || isNaN(num)) {
                setGiftAmountError('금액을 정확히 입력해주세요.');
            } else {
                setGiftAmountError('');
            }
        } else {
            setGiftAmountError('');
        }
    };

    // image preview
    const handleImageChange = (e) => {
        if (!e.target.files?.[0]) return;
        const reader = new FileReader();
        reader.onloadend = () => setImageFile(reader.result);
        reader.readAsDataURL(e.target.files[0]);
    };
    const getExampleImage = () => (selectedType === 'fund' ? fundExampleImg : giftExampleImg);
    const previewImage = imageFile || getExampleImage();

    // submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        // run validations
        validateGiftName(giftName);
        validateGiftAmount(giftAmount);

        let hasError = false;
        if (giftNameError) hasError = true;
        if (giftAmountError) hasError = true;
        if (hasError) return;

        setSubmitting(true);

        try {
            const amountValue = parseFloat(giftAmount) || 0;
            const giftData = {
                event_id: eventData?.id,
                title: giftName.trim(),
                description: giftDescription.trim(),
                image_url: previewImage,
                gift_type: selectedType,
                status: receiveStatus,
                link: giftLink.trim() || null,
            };

            if (selectedType === 'fund') {
                giftData.target_amount = amountValue;
                giftData.current_amount = 0;
            } else {
                giftData.price = amountValue;
            }

            await giftService.createGiftHybrid(giftData);
            showSuccess('선물이 등록되었습니다! 🎁');
        } catch (error) {
            console.error('선물 등록 실패:', error);
            showError('선물 등록에 실패했습니다.');
            setSubmitting(false);
            return;
        }

        // 폭죽 효과 트리거
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 100);

        // 잠시 후 페이지 이동
        setTimeout(() => {
            navigate('/eventview', { state: eventData });
        }, 1000);

        setSubmitting(false);
    };

    // header back
    const handleBack = () => navigate(-1);

    return (
        <div className={styles.container}>
            <Breadcrumb
                paths={[
                    { label: '홈', to: '/' },
                    { label: '대시보드', to: '/dashboard' },
                    { label: '이벤트 보기', to: '/eventview' },
                    { label: selectedType === 'gift' ? '선물 등록' : '펀드 등록' },
                ]}
            />
            <header className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    <ArrowLeft size={24} />
                </button>
                <h2 className={styles.title}>{selectedType === 'gift' ? '선물 등록' : '펀드 등록'}</h2>
            </header>

            <div className={styles.eventName}>{eventData?.eventName || '이벤트명'}</div>

            <div className={styles.tabContainer}>
                <button
                    className={`${styles.tabButton} ${selectedType === 'fund' ? styles.activeTab : ''}`}
                    onClick={() => receiveStatus === 'want' && setSelectedType('fund')}
                    disabled={receiveStatus !== 'want'}
                >
                    펀드
                </button>
                <button
                    className={`${styles.tabButton} ${selectedType === 'gift' ? styles.activeTab : ''}`}
                    onClick={() => receiveStatus === 'want' && setSelectedType('gift')}
                    disabled={receiveStatus !== 'want'}
                >
                    선물
                </button>
            </div>

            <div className={styles.receiveContainer}>
                <button
                    className={`${styles.receiveButton} ${receiveStatus === 'want' ? styles.receiveActive : ''}`}
                    onClick={() => setReceiveStatus('want')}
                >
                    받고 싶은
                </button>
                <button
                    className={`${styles.receiveButton} ${receiveStatus === 'unwant' ? styles.receiveActive : ''}`}
                    onClick={() => setReceiveStatus('unwant')}
                >
                    받기 싫은
                </button>
                <button
                    className={`${styles.receiveButton} ${receiveStatus === 'done' ? styles.receiveActive : ''}`}
                    onClick={() => setReceiveStatus('done')}
                >
                    받은
                </button>
            </div>

            <div className={styles.imageContainer}>
                <img src={previewImage} alt="예시" className={styles.exampleImage} />
                <label htmlFor="imageFile" className={styles.cameraLabel}>
                    <Camera size={24} />
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
                {/* 이름 */}
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        value={giftName}
                        onChange={(e) => {
                            setGiftName(e.target.value);
                            validateGiftName(e.target.value);
                        }}
                        maxLength={30}
                        placeholder={namePlaceholder}
                        className={styles.textInput}
                    />
                    <span className={styles.charCount}>{giftName.length}/30</span>
                    {giftNameError && <div className={styles.fieldError}>{giftNameError}</div>}
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

                {/* 링크 */}
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
                        setValue={(v) => {
                            const s = String(v);
                            setGiftAmount(s);
                            validateGiftAmount(s);
                        }}
                        maxValue={10000000}
                        disabled={receiveStatus !== 'want'}
                    />
                </div>
                {giftAmountError && <div className={styles.fieldError}>{giftAmountError}</div>}

                <motion.button
                    type="submit"
                    className={styles.submitButton}
                    disabled={submitting || giftNameError !== '' || giftAmountError !== ''}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                    {submitting ? <Spinner /> : '완료하기'}
                </motion.button>
            </form>

            {/* 폭죽 효과 */}
            <Confetti trigger={showConfetti} />
        </div>
    );
}
