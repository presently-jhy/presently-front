import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import styles from './AddEventLog.module.css';
import anniversaryImg from './anniversaryImg.png';
import birthdayImg from './birthdayImg.png';
import etcImg from './etcImg.png';

import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import { useToast } from '../../context/ToastContext';

const AddEventLog = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const eventData = location.state || {};
    // const { user } = useAuth();
    const { showError } = useToast();
    const isEditMode = Boolean(eventData.id);

    // 초기 이벤트 타입: 수정 모드면 기존 eventData, 아니면 전달받은 state의 eventType 또는 기본 'birthday'
    const initialType = isEditMode ? eventData.eventType : location.state?.eventType || 'birthday';
    // 예시: birthday일 경우 기본값을 'fund'로 설정
    const [selectedType] = useState(initialType);

    const [eventName, setEventName] = useState(isEditMode ? eventData.eventName : '');
    const [eventDate, setEventDate] = useState(isEditMode ? eventData.eventDate : '');
    const [eventDescription, setEventDescription] = useState(isEditMode ? eventData.eventDescription : '');
    const [imageFile, setImageFile] = useState(null);

    const getDefaultImage = () => {
        if (selectedType === 'anniversary') return anniversaryImg;
        if (selectedType === 'etc') return etcImg;
        if (selectedType === 'gift') return birthdayImg;
        return birthdayImg;
    };

    const [defaultImage] = useState(getDefaultImage());
    const todayDate = new Date().toISOString().slice(0, 10);

    const handleBack = () => navigate(-1);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => setImageFile(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const previewImage = imageFile || (isEditMode && eventData.eventImg ? eventData.eventImg : defaultImage);

    // 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 유효성 검사
        if (!eventName.trim()) {
            showError('이벤트 이름은 필수 입력 사항입니다.');
            return;
        }
        if (!eventDate) {
            showError('이벤트 날짜는 필수 입력 사항입니다.');
            return;
        }
        if (new Date(eventDate) < new Date(todayDate)) {
            showError('오늘 이전의 날짜는 선택할 수 없습니다.');
            return;
        }
        if (!eventDescription.trim()) {
            showError('이벤트 설명은 필수 입력 사항입니다.');
            return;
        }

        if (isEditMode) {
            // 수정 모드: Supabase 업데이트
            try {
                await eventService.updateEvent(eventData.id, {
                    title: eventName,
                    description: eventDescription,
                    event_datetime: eventDate,
                    image_url: imageFile || eventData.eventImg || defaultImage,
                    event_category: selectedType,
                });
                navigate('/dashboard');
            } catch (error) {
                console.error('이벤트 수정 중 오류:', error);
                showError('이벤트 수정 중 오류가 발생했습니다.');
            }
        } else {
            // 생성 모드: Supabase 생성
            try {
                await eventService.createEvent({
                    title: eventName,
                    description: eventDescription,
                    event_datetime: eventDate,
                    image_url: imageFile || defaultImage,
                    event_category: selectedType,
                });
                navigate('/dashboard');
            } catch (error) {
                console.error('이벤트 생성 중 오류:', error);
                showError('이벤트 생성 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    <ArrowLeft size={24} />
                </button>
                <h2 className={styles.title}>{isEditMode ? '이벤트 수정' : '이벤트 추가'}</h2>
            </header>

            <div className={styles.imageContainer}>
                <img src={previewImage} alt="이벤트 예시" className={styles.eventImage} />
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

            <form onSubmit={handleSubmit} className={styles.inputGroups}>
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
                <div className={styles.inputGroup}>
                    <input
                        type="date"
                        min={todayDate}
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className={styles.textInput}
                        placeholder="날짜 입력 (필수)"
                    />
                </div>
                <div className={styles.inputGroup}>
                    <textarea
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        maxLength={30}
                        rows="2"
                        className={styles.textarea}
                        placeholder="이벤트 설명 (최대 30자)"
                    />
                    <span className={styles.charCount}>{eventDescription.length}/30</span>
                </div>

                <p className={styles.infoMessage}>링크는 이벤트 날짜의 ±3일간, 총 7일간 활성화 됩니다.</p>
                <button type="submit" className={styles.submitButton}>
                    {isEditMode ? '수정하기' : '추가하기'}
                </button>
            </form>
        </div>
    );
};

export default AddEventLog;
