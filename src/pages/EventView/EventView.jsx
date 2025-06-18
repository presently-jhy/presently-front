// src/pages/EventView/EventView.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/Header/Header';
import GiftItem from '../../components/GiftItem/GiftItem';
import GiftPreview from '../../components/GiftPreview/GiftPreview';
import GiftFeedback from '../../components/GiftFeedback/GiftFeedback';
import { useAuth } from '../../context/AuthContext';
import styles from './EventView.module.css';
import shareIcon from './shareIcon.svg';
import defaultEventImg from './defaultEventImg.png';
import editButtonImg from './editButton.png';

const giftItemVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05, transition: { duration: 0.5 } },
};

export default function EventView() {
    const { user, checking } = useAuth();
    const navigate = useNavigate();
    const { state: eventData = {} } = useLocation();

    const [gifts, setGifts] = useState([]);
    const [mainTab, setMainTab] = useState('gift');
    const [giftTab, setGiftTab] = useState('want');
    const [selectedGift, setSelectedGift] = useState(null);
    const [userMode, setUserMode] = useState('owner');

    // 1. 로그인 확인 & 모드(owner/giver) 설정
    useEffect(() => {
        if (!checking) {
            if (!user) {
                navigate('/login');
            } else {
                setUserMode(user.id === eventData.creatorId ? 'owner' : 'giver');
            }
        }
    }, [user, checking, eventData.creatorId]);

    // 2. 로컬스토리지에서 gifts 로드 & 100% 펀딩 자동 완료 처리
    useEffect(() => {
        if (!eventData.id) return;
        let all = JSON.parse(localStorage.getItem('gifts')) || [];
        // 이벤트별로 필터링
        const filtered = all.filter((g) => g.eventId === eventData.id);
        let changed = false;

        const updated = filtered.map((g) => {
            const pct = typeof g.percent === 'string' ? parseInt(g.percent, 10) : g.percent;
            let next = {
                ...g,
                feedbacks: g.feedbacks || [],
                acceptedFeedbacks: g.acceptedFeedbacks || [],
            };
            if (g.selectedType === 'fund' && g.receiveStatus === 'want' && pct >= 100) {
                changed = true;
                next = {
                    ...next,
                    receiveStatus: 'done',
                    acceptedFeedbacks: [...next.acceptedFeedbacks, ...next.feedbacks],
                    feedbacks: [],
                };
            }
            return next;
        });

        if (changed) {
            // 변경된 이벤틑만 덮어씌우고 나머지는 그대로
            const rest = all.filter((g) => g.eventId !== eventData.id);
            localStorage.setItem('gifts', JSON.stringify([...updated, ...rest]));
        }
        setGifts(updated);
    }, [eventData.id]);

    // 3. 탭별 필터링
    const currentList = gifts.filter((g) => {
        if (giftTab === 'want') return g.receiveStatus === 'want';
        if (giftTab === 'notwant') return g.receiveStatus === 'unwant';
        if (giftTab === 'received') return g.receiveStatus === 'done';
        return false;
    });

    // 4. 핸들러
    const handleUserModeToggle = () => {
        setUserMode((m) => (m === 'owner' ? 'giver' : 'owner'));
        setSelectedGift(null);
    };
    const handleAdd = () => navigate('/giftenroll', { state: eventData });
    const handleEdit = () => navigate('/addEventLog', { state: { ...eventData, mode: 'edit' } });

    const handleDeleteGift = useCallback(
        (giftId, e) => {
            e.stopPropagation();
            const all = JSON.parse(localStorage.getItem('gifts')) || [];
            const updatedAll = all.filter((g) => g.id !== giftId);
            localStorage.setItem('gifts', JSON.stringify(updatedAll));
            setGifts(updatedAll.filter((g) => g.eventId === eventData.id));
            if (selectedGift?.id === giftId) setSelectedGift(null);
        },
        [eventData.id, selectedGift]
    );

    const handleAcceptFeedback = useCallback(
        (fbId) => {
            const all = JSON.parse(localStorage.getItem('gifts')) || [];
            const updatedAll = all.map((g) => {
                if (g.id !== selectedGift.id) return g;
                const fb = (g.feedbacks || []).find((x) => x.id === fbId);
                const pending = (g.feedbacks || []).filter((x) => x.id !== fbId);
                let next = {
                    ...g,
                    feedbacks: pending,
                    acceptedFeedbacks: [...(g.acceptedFeedbacks || []), fb],
                };
                if (g.selectedType === 'fund' && fb) {
                    const newCur = (g.currentAmount || 0) + fb.amount;
                    const tgt = g.targetAmount || 1000000;
                    const pct = Math.min(100, Math.round((newCur / tgt) * 100));
                    next = {
                        ...next,
                        currentAmount: newCur,
                        percent: `${pct}%`,
                    };
                    if (pct >= 100 && next.receiveStatus === 'want') {
                        // 100% 달성 시
                        next = {
                            ...next,
                            receiveStatus: 'done',
                            acceptedFeedbacks: [...next.acceptedFeedbacks, ...pending],
                            feedbacks: [],
                        };
                    }
                } else {
                    next.receiveStatus = 'done';
                    next.feedbacks = [];
                }
                return next;
            });
            localStorage.setItem('gifts', JSON.stringify(updatedAll));
            setGifts(updatedAll.filter((g) => g.eventId === eventData.id));
            setSelectedGift(updatedAll.find((g) => g.id === selectedGift.id) || null);
        },
        [eventData.id, selectedGift]
    );

    const handleRejectFeedback = useCallback(
        (fbId) => {
            const all = JSON.parse(localStorage.getItem('gifts')) || [];
            const updatedAll = all.map((g) =>
                g.id !== selectedGift.id ? g : { ...g, feedbacks: (g.feedbacks || []).filter((f) => f.id !== fbId) }
            );
            localStorage.setItem('gifts', JSON.stringify(updatedAll));
            setGifts(updatedAll.filter((g) => g.eventId === eventData.id));
            setSelectedGift(updatedAll.find((g) => g.id === selectedGift.id) || null);
        },
        [eventData.id, selectedGift]
    );

    const handleGiftAction = useCallback(() => {
        if (!selectedGift) return;
        const toSend = selectedGift;
        setGifts((gs) => gs.filter((g) => g.id !== toSend.id));
        setSelectedGift(null);
        setTimeout(() => {
            navigate('/fundsend', { state: { eventData, gift: toSend } });
        }, 300);
    }, [navigate, eventData, selectedGift]);

    // 5. Preview에 넘길 props
    const previewFeedbacks = selectedGift
        ? giftTab === 'received'
            ? selectedGift.acceptedFeedbacks
            : selectedGift.feedbacks
        : [];
    const previewOnAccept = giftTab !== 'received' ? handleAcceptFeedback : undefined;
    const previewOnReject = giftTab !== 'received' ? handleRejectFeedback : undefined;
    const previewOnGiftAction = userMode === 'giver' && giftTab === 'want' ? handleGiftAction : undefined;

    return (
        <div className={styles.container}>
            {/* 상단 헤더 */}
            <Header title="이벤트 보기" subTitle="상세 정보" rightButton={shareIcon} />

            {/* 모드 토글 */}
            <div className={styles.userModeToggle}>
                <button className={styles.toggleButton} onClick={handleUserModeToggle}>
                    {userMode === 'owner' ? '등록자 (내가 등록함)' : '선물 주는 사람'}
                </button>
            </div>

            {/* 이벤트 정보 */}
            <div className={styles.eventInfo}>
                <img src={eventData.eventImg || defaultEventImg} alt="이벤트" className={styles.eventImage} />
                <div className={styles.eventTextBox}>
                    <div className={styles.hostName}>{eventData.hostName || '주최자'}</div>
                    <div className={styles.eventDate}>{eventData.eventDate || '날짜 정보 없음'}</div>
                    <div className={styles.eventTitle}>{eventData.eventName || '이벤트 제목'}</div>
                    <div className={styles.eventDescription}>
                        {eventData.eventDescription || '이벤트 설명이 여기에 표시됩니다.'}
                    </div>
                </div>
                {userMode === 'owner' && (
                    <div className={styles.buttonGroup}>
                        <button className={styles.addButton} onClick={handleAdd}>
                            ＋
                        </button>
                        <button className={styles.editButton} onClick={handleEdit}>
                            <img src={editButtonImg} alt="이벤트 수정" className={styles.editButtonImg} />
                        </button>
                    </div>
                )}
            </div>

            {/* 메인 탭 */}
            <div className={styles.tabMenu}>
                {['gift', 'record'].map((tab) => (
                    <div
                        key={tab}
                        className={`${styles.tab} ${mainTab === tab ? styles.activeTab : ''}`}
                        onClick={() => {
                            setMainTab(tab);
                            setSelectedGift(null);
                        }}
                    >
                        {tab === 'gift' ? '선물' : '이벤트 기록'}
                    </div>
                ))}
            </div>

            {/* 선물 탭 */}
            {mainTab === 'gift' ? (
                <>
                    <div className={styles.subTabMenu}>
                        {['want', 'notwant', 'received'].map((t) => (
                            <div
                                key={t}
                                className={`${styles.subTab} ${giftTab === t ? styles.activeSubTab : ''}`}
                                onClick={() => {
                                    setGiftTab(t);
                                    setSelectedGift(null);
                                }}
                            >
                                {t === 'want' ? '받고 싶은' : t === 'notwant' ? '받기 싫은' : '받은'}
                            </div>
                        ))}
                    </div>

                    <div className={styles.itemList}>
                        <AnimatePresence>
                            {currentList.length > 0 ? (
                                currentList.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        className={styles.giftItemWrapper}
                                        variants={giftItemVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                    >
                                        <GiftItem
                                            type={item.selectedType === 'fund' ? '펀딩' : '선물'}
                                            title={item.giftName}
                                            description={item.giftDescription}
                                            image={item.imageUrl}
                                            percent={item.selectedType === 'fund' ? item.percent : null}
                                            onClick={() => setSelectedGift(item)}
                                            onDelete={
                                                userMode === 'owner' && giftTab !== 'received'
                                                    ? (e) => handleDeleteGift(item.id, e)
                                                    : undefined
                                            }
                                        />

                                        {giftTab === 'received' && item.acceptedFeedbacks?.length > 0 && (
                                            <details className={styles.feedbackFolder}>
                                                <summary>피드백 {item.acceptedFeedbacks.length}개 보기</summary>
                                                <div className={styles.feedbackHistory}>
                                                    {item.acceptedFeedbacks.map((fb) => (
                                                        <GiftFeedback key={fb.id} feedback={fb} type="received" />
                                                    ))}
                                                </div>
                                            </details>
                                        )}
                                    </motion.div>
                                ))
                            ) : (
                                <div className={styles.emptyState}>
                                    <div className={styles.icon}>🎁</div>
                                    <div className={styles.text}>
                                        아직 등록된 선물이 없어요.
                                        <br />⊕ 버튼으로 추가해 보세요!
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </>
            ) : (
                /* 이벤트 기록 탭 */
                <div className={`${styles.recordArea} ${styles.emptyState}`}>
                    <div className={styles.icon}>📝</div>
                    <div className={styles.text}>
                        아직 남긴 기록이 없어요.
                        <br />
                        이벤트를 즐기고 기록해 보세요!
                    </div>
                </div>
            )}

            {/* Preview 모달 */}
            {selectedGift && (
                <GiftPreview
                    gift={selectedGift}
                    feedbacks={previewFeedbacks}
                    onAccept={previewOnAccept}
                    onReject={previewOnReject}
                    onClose={() => setSelectedGift(null)}
                    onGiftAction={previewOnGiftAction}
                />
            )}
        </div>
    );
}
