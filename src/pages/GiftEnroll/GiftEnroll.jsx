// src/pages/GiftEnroll/GiftEnroll.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Gift, PiggyBank, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './GiftEnroll.module.css';
import fundExampleImg from './fundExample.png';
import giftExampleImg from './giftExample.png';
import AmountDial from '../../components/AmountDial/AmountDial';
import Spinner from '../../components/Spinner/Spinner';
import Confetti from '../../components/Confetti/Confetti';
import { giftService } from '../../services/giftService';
import { useToast } from '../../context/ToastContext';

const GIFT_TYPES = {
    fund: { label: '펀드', icon: PiggyBank, color: '#10b981' },
    gift: { label: '선물', icon: Gift, color: '#f59e0b' },
};

const RECEIVE_STATUSES = [
    { key: 'want', label: '받고 싶은', emoji: '🎁' },
    { key: 'unwant', label: '받기 싫은', emoji: '❌' },
    { key: 'done', label: '받은', emoji: '✅' },
];

// 아코디언 섹션 컴포넌트
const AccordionSection = ({ title, isOpen, onToggle, children, icon: Icon, completed }) => {
    return (
        <motion.div
            className={`${styles.accordionSection} ${completed ? styles.completed : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.button
                className={styles.accordionHeader}
                onClick={onToggle}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className={styles.accordionTitle}>
                    {Icon && <Icon size={20} className={styles.sectionIcon} />}
                    <span>{title}</span>
                    {completed && <span className={styles.completedBadge}>✓</span>}
                </div>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.accordionContent}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default function GiftEnroll() {
    const navigate = useNavigate();
    const location = useLocation();
    const eventData = location.state;
    const { showSuccess, showError } = useToast();

    // State
    const [selectedType, setSelectedType] = useState(eventData?.eventType === 'gift' ? 'gift' : 'fund');
    const [receiveStatus, setReceiveStatus] = useState('want');
    const [imageFile, setImageFile] = useState(null);
    const [giftName, setGiftName] = useState('');
    const [giftDescription, setGiftDescription] = useState('');
    const [giftAmount, setGiftAmount] = useState('0');
    const [giftLink, setGiftLink] = useState('');
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // 아코디언 상태
    const [openSections, setOpenSections] = useState({
        basic: true, // 기본 정보
        details: false, // 상세 설정
        preview: false, // 미리보기
    });

    // Computed values
    const currentType = GIFT_TYPES[selectedType];
    const previewImage = imageFile || (selectedType === 'fund' ? fundExampleImg : giftExampleImg);
    const isFormValid = giftName.trim() && !errors.name && !errors.amount;

    // 완료 상태 체크
    const isBasicCompleted = giftName.trim() && selectedType && receiveStatus;
    const isDetailsCompleted =
        giftDescription.trim() || giftLink.trim() || (receiveStatus === 'want' && giftAmount !== '0');

    // Validation
    const validateField = (field, value) => {
        const newErrors = { ...errors };

        switch (field) {
            case 'name':
                if (!value.trim()) {
                    newErrors.name = '이름은 필수입니다.';
                } else if (value.trim().length < 2) {
                    newErrors.name = '최소 2글자 이상 입력해주세요.';
                } else {
                    delete newErrors.name;
                }
                break;
            case 'amount':
                if (receiveStatus === 'want') {
                    const num = parseFloat(value);
                    if (!num || isNaN(num)) {
                        newErrors.amount = '금액을 정확히 입력해주세요.';
                    } else {
                        delete newErrors.amount;
                    }
                } else {
                    delete newErrors.amount;
                }
                break;
        }

        setErrors(newErrors);
        return !newErrors[field];
    };

    // Handlers
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => setImageFile(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const isNameValid = validateField('name', giftName);
        const isAmountValid = validateField('amount', giftAmount);

        if (!isNameValid || !isAmountValid) return;

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

            // Success animation
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);

            // Navigate after delay
            setTimeout(() => {
                navigate('/eventview', { state: eventData });
            }, 2000);
        } catch (error) {
            console.error('선물 등록 실패:', error);
            showError('선물 등록에 실패했습니다.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <motion.header
                className={styles.header}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <button className={styles.backButton} onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h2 className={styles.title}>{currentType.label} 등록</h2>
            </motion.header>

            {/* Event Info */}
            <motion.div
                className={styles.eventInfo}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <h3 className={styles.eventName}>{eventData?.eventName || '이벤트명'}</h3>
            </motion.div>

            {/* 아코디언 섹션들 */}
            <div className={styles.accordionContainer}>
                {/* 기본 정보 섹션 */}
                <AccordionSection
                    title="기본 정보"
                    isOpen={openSections.basic}
                    onToggle={() =>
                        setOpenSections((prev) => ({
                            ...prev,
                            basic: !prev.basic,
                        }))
                    }
                    icon={currentType.icon}
                    completed={isBasicCompleted}
                >
                    <div className={styles.sectionContent}>
                        {/* Type Selection */}
                        <div className={styles.typeSelector}>
                            {Object.entries(GIFT_TYPES).map(([key, type]) => (
                                <motion.button
                                    key={key}
                                    className={`${styles.typeButton} ${selectedType === key ? styles.active : ''}`}
                                    onClick={() => receiveStatus === 'want' && setSelectedType(key)}
                                    disabled={receiveStatus !== 'want'}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <type.icon size={20} />
                                    <span>{type.label}</span>
                                </motion.button>
                            ))}
                        </div>

                        {/* Status Selection */}
                        <div className={styles.statusSelector}>
                            {RECEIVE_STATUSES.map((status) => (
                                <motion.button
                                    key={status.key}
                                    className={`${styles.statusButton} ${
                                        receiveStatus === status.key ? styles.active : ''
                                    }`}
                                    onClick={() => setReceiveStatus(status.key)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className={styles.statusEmoji}>{status.emoji}</span>
                                    <span>{status.label}</span>
                                </motion.button>
                            ))}
                        </div>

                        {/* Name Input */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>이름 *</label>
                            <input
                                type="text"
                                value={giftName}
                                onChange={(e) => {
                                    setGiftName(e.target.value);
                                    validateField('name', e.target.value);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && isBasicCompleted) {
                                        e.preventDefault();
                                        setOpenSections((prev) => ({
                                            basic: false,
                                            details: true,
                                            preview: false,
                                        }));
                                    }
                                }}
                                maxLength={30}
                                placeholder={
                                    selectedType === 'gift' ? '선물 이름을 입력하세요' : '펀드 이름을 입력하세요'
                                }
                                className={`${styles.input} ${errors.name ? styles.error : ''}`}
                            />
                            <div className={styles.inputFooter}>
                                <span className={styles.charCount}>{giftName.length}/30</span>
                                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                            </div>
                        </div>
                    </div>
                </AccordionSection>

                {/* 상세 설정 섹션 */}
                <AccordionSection
                    title="상세 설정"
                    isOpen={openSections.details}
                    onToggle={() =>
                        setOpenSections((prev) => ({
                            ...prev,
                            details: !prev.details,
                        }))
                    }
                    icon={Camera}
                    completed={isDetailsCompleted}
                >
                    <div className={styles.sectionContent}>
                        {/* Image Upload */}
                        <div className={styles.imageSection}>
                            <div className={styles.imageContainer}>
                                <img src={previewImage} alt="미리보기" className={styles.previewImage} />
                                <label htmlFor="imageFile" className={styles.uploadButton}>
                                    <Camera size={20} />
                                    <span>이미지 변경</span>
                                </label>
                                <input
                                    type="file"
                                    id="imageFile"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className={styles.hiddenInput}
                                />
                            </div>
                        </div>

                        {/* Description Input */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>설명</label>
                            <textarea
                                value={giftDescription}
                                onChange={(e) => setGiftDescription(e.target.value)}
                                maxLength={100}
                                rows="3"
                                placeholder="상세한 설명을 입력하세요"
                                className={styles.textarea}
                            />
                            <div className={styles.inputFooter}>
                                <span className={styles.charCount}>{giftDescription.length}/100</span>
                            </div>
                        </div>

                        {/* Link Input */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>상품 링크</label>
                            <input
                                type="url"
                                value={giftLink}
                                onChange={(e) => setGiftLink(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && isDetailsCompleted) {
                                        e.preventDefault();
                                        setOpenSections((prev) => ({
                                            basic: false,
                                            details: false,
                                            preview: true,
                                        }));
                                    }
                                }}
                                placeholder="https://..."
                                className={styles.input}
                            />
                        </div>

                        {/* Amount Input */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                {selectedType === 'fund' ? '목표 금액' : '예상 가격'} *
                            </label>
                            <div
                                className={`${styles.amountSection} ${receiveStatus !== 'want' ? styles.disabled : ''}`}
                            >
                                <AmountDial
                                    value={Number(giftAmount)}
                                    setValue={(value) => {
                                        setGiftAmount(String(value));
                                        validateField('amount', String(value));
                                    }}
                                    maxValue={10000000}
                                    disabled={receiveStatus !== 'want'}
                                />
                            </div>
                            {errors.amount && <span className={styles.errorText}>{errors.amount}</span>}
                        </div>
                    </div>
                </AccordionSection>

                {/* 미리보기 섹션 */}
                <AccordionSection
                    title="미리보기"
                    isOpen={openSections.preview}
                    onToggle={() =>
                        setOpenSections((prev) => ({
                            ...prev,
                            preview: !prev.preview,
                        }))
                    }
                    icon={Gift}
                >
                    <div className={styles.sectionContent}>
                        <div className={styles.previewCard}>
                            <img src={previewImage} alt="미리보기" className={styles.previewCardImage} />
                            <div className={styles.previewCardContent}>
                                <h4 className={styles.previewCardTitle}>{giftName || '이름을 입력해주세요'}</h4>
                                <p className={styles.previewCardDescription}>
                                    {giftDescription || '설명을 입력해주세요'}
                                </p>
                                <div className={styles.previewCardMeta}>
                                    <span className={styles.previewCardType}>
                                        {currentType.label} •{' '}
                                        {RECEIVE_STATUSES.find((s) => s.key === receiveStatus)?.label}
                                    </span>
                                    {receiveStatus === 'want' && giftAmount !== '0' && (
                                        <span className={styles.previewCardAmount}>
                                            {parseInt(giftAmount).toLocaleString()}원
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </AccordionSection>
            </div>

            {/* Submit Button */}
            <motion.form
                className={styles.form}
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <motion.button
                    type="submit"
                    className={styles.submitButton}
                    disabled={submitting || !isFormValid}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <AnimatePresence mode="wait">
                        {submitting ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={styles.loadingContent}
                            >
                                <Spinner />
                                <span>등록 중...</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <currentType.icon size={20} />
                                <span>{currentType.label} 등록하기</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </motion.form>

            {/* Confetti Effect */}
            <Confetti trigger={showConfetti} />
        </div>
    );
}
