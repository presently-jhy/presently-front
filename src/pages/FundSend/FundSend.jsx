// src/pages/FundSend/FundSend.jsx

import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import styles from './FundSend.module.css';
import watchImg from './watch.png';
import Spinner from '../../components/Spinner/Spinner';

const defaultEventData = {
    id: 0,
    eventTitle: '애플워치 울트라',
    eventName: '2025 나의 생일',
    eventDate: '2025-06-15',
    eventImg: watchImg,
    eventType: 'gift',
    eventDescription: '행복한 추억',
    eventView: 0,
    eventPresent: 0,
    nickname: '',
    targetAmount: 1000000,
};

export default function FundSend() {
    const navigate = useNavigate();
    const location = useLocation();

    const passed = location.state || {};
    const initialEventData = passed.eventData || passed || defaultEventData;
    const giftData = passed.gift || null;
    const isFundMode = giftData ? giftData.selectedType === 'fund' : initialEventData.eventType === 'fund';

    const [eventData] = useState(initialEventData);
    const [amount, setAmount] = useState('');
    const [nickname, setNickname] = useState('');
    const [message, setMessage] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const [amountError, setAmountError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // ① 총액 계산
    const totalAmount = useMemo(() => {
        if (giftData) {
            return giftData.selectedType === 'fund' ? giftData.targetAmount || 0 : giftData.price || 0;
        }
        return eventData.targetAmount || 0;
    }, [giftData, eventData]);

    // nickname validation
    const validateNickname = (val) => {
        const v = val.trim();
        if (!v) {
            setNicknameError('닉네임을 입력해 주세요.');
        } else {
            setNicknameError('');
        }
    };

    // amount validation & formatted state
    const formattedAmount = useMemo(() => {
        if (!amount) return '';
        const num = Number(amount.replace(/[^\d]/g, ''));
        return isNaN(num) ? '' : num.toLocaleString();
    }, [amount]);

    const handleAmountChange = (e) => {
        let num = Number(e.target.value.replace(/[^\d]/g, '')) || 0;
        if (totalAmount && num > totalAmount) {
            num = totalAmount;
            setAmountError(`최대 ${totalAmount.toLocaleString()}원 이하로 입력해 주세요.`);
        } else if (isFundMode && num > 0 && num < 1000) {
            setAmountError('1,000원 이상 입력해 주세요.');
        } else {
            setAmountError('');
        }
        setAmount(String(num));
    };

    const handleBack = () => window.history.back();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // run validations
        validateNickname(nickname);
        if (!amountError && isFundMode && (!amount || Number(amount) < 1000)) {
            setAmountError('1,000원 이상 입력해 주세요.');
        }

        if (nicknameError || amountError) {
            return;
        }

        setSubmitting(true);

        // 기존 로직: feedback 추가 및 이벤트 업데이트
        if (giftData) {
            const stored = JSON.parse(localStorage.getItem('gifts')) || [];
            const updatedGifts = stored.map((g) => {
                if (g.id !== giftData.id) return g;
                const fb = {
                    id: Date.now(),
                    message: message.trim(),
                    nickname: nickname.trim(),
                    status: 'pending',
                    amount: isFundMode ? Number(amount) : undefined,
                };
                return { ...g, feedbacks: [...(g.feedbacks || []), fb] };
            });
            localStorage.setItem('gifts', JSON.stringify(updatedGifts));
        }

        const evts = JSON.parse(localStorage.getItem('events')) || [];
        const updatedEvents = evts.map((evt) => {
            if (evt.id !== eventData.id) return evt;
            const newView = (evt.eventView || 0) + 1;
            const newPresent = isFundMode ? evt.eventPresent || 0 : (evt.eventPresent || 0) + 1;
            return {
                ...evt,
                eventView: newView,
                eventPresent: newPresent,
                nickname: nickname.trim() || evt.nickname,
            };
        });
        localStorage.setItem('events', JSON.stringify(updatedEvents));

        navigate('/eventview', { state: eventData });
        setSubmitting(false);
    };

    return (
        <div className={`${styles.container} ${isFundMode ? styles.fundMode : styles.giftMode}`}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    <ArrowLeft size={24} />
                </button>
                <h2 className={styles.pageTitle}>{eventData.eventName}</h2>
            </header>

            <div className={styles.eventInfo}>
                <h4 className={styles.eventTitle}>{eventData.eventTitle}</h4>
                <p className={styles.eventDate}>{eventData.eventDate}</p>
            </div>

            <div className={styles.imageWrapper}>
                <img src={eventData.eventImg} alt="이벤트 이미지" className={styles.eventImg} />
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                {isFundMode && (
                    <div className={styles.amountContainer}>
                        <label htmlFor="amountInput" className={styles.amountLabel}>
                            금액
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                id="amountInput"
                                type="text"
                                className={styles.amountInput}
                                placeholder="0"
                                value={formattedAmount}
                                onChange={handleAmountChange}
                                inputMode="numeric"
                            />
                            <span className={styles.currency}>원</span>
                        </div>
                        {amountError && <div className={styles.fieldError}>{amountError}</div>}
                        <div className={styles.hint}>
                            최소 1,000원 이상, 최대 {totalAmount.toLocaleString() || '제한 없음'}원
                        </div>
                        {totalAmount > 0 && (
                            <div className={styles.remaining}>
                                남은 금액: {(totalAmount - Number(amount)).toLocaleString()}원
                            </div>
                        )}
                    </div>
                )}

                <textarea
                    className={styles.messageTextarea}
                    placeholder="방명록 작성하기"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <div className={styles.nicknameContainer}>
                    <input
                        type="text"
                        className={styles.nicknameInput}
                        placeholder="닉네임"
                        value={nickname}
                        onChange={(e) => {
                            setNickname(e.target.value);
                            validateNickname(e.target.value);
                        }}
                    />
                    <span className={styles.nicknameSuffix}>이/가</span>
                </div>
                {nicknameError && <div className={styles.fieldError}>{nicknameError}</div>}

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={submitting || nicknameError !== '' || amountError !== ''}
                >
                    {submitting ? <Spinner /> : isFundMode ? '펀드 보내기' : '선물 보내기'}
                </button>
            </form>
        </div>
    );
}
