// src/pages/EventView/EventView.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/Header/Header';
import GiftItem from '../../components/GiftItem/GiftItem';
import GiftPreview from '../../components/GiftPreview/GiftPreview';
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
    const navigate = useNavigate();
    const location = useLocation();
    const eventData = location.state || {};

    const [gifts, setGifts] = useState([]);
    const [mainTab, setMainTab] = useState('gift');
    const [giftTab, setGiftTab] = useState('want');
    const [selectedGift, setSelectedGift] = useState(null);
    const [userMode, setUserMode] = useState('owner');

    // 1) load gifts (with feedbacks & acceptedFeedbacks) from localStorage
    useEffect(() => {
        if (!eventData.id) return;
        const all = JSON.parse(localStorage.getItem('gifts')) || [];
        const eventGifts = all
            .filter((g) => g.eventId === eventData.id)
            .map((g) => ({
                ...g,
                feedbacks: g.feedbacks || [],
                acceptedFeedbacks: g.acceptedFeedbacks || [],
            }));
        setGifts(eventGifts);
    }, [eventData]);

    // 2) auto-move fully funded items to 'done'
    useEffect(() => {
        const all = JSON.parse(localStorage.getItem('gifts')) || [];
        let changed = false;
        const updated = all.map((g) => {
            const pct = typeof g.percent === 'string' ? parseInt(g.percent, 10) : g.percent;
            if (g.selectedType === 'fund' && g.receiveStatus === 'want' && pct >= 100) {
                changed = true;
                return { ...g, receiveStatus: 'done' };
            }
            return g;
        });
        if (changed) {
            localStorage.setItem('gifts', JSON.stringify(updated));
            setGifts(updated.filter((g) => g.eventId === eventData.id));
        }
    }, [gifts, eventData.id]);

    const handleUserModeToggle = () => {
        setUserMode((m) => (m === 'owner' ? 'giver' : 'owner'));
        setSelectedGift(null);
    };
    const handleAdd = () => navigate('/giftenroll', { state: eventData });
    const handleEdit = () => {
        if (!eventData.id) {
            const stored = JSON.parse(localStorage.getItem('events')) || [];
            const found = stored.find(
                (e) => e.eventName === eventData.eventName && e.eventDate === eventData.eventDate
            );
            if (found) navigate('/addEventLog', { state: { ...found, mode: 'edit' } });
            else alert('수정할 이벤트 데이터를 찾을 수 없습니다.');
        } else {
            navigate('/addEventLog', { state: { ...eventData, mode: 'edit' } });
        }
    };

    const handleDeleteGift = (giftId, e) => {
        e.stopPropagation();
        const all = JSON.parse(localStorage.getItem('gifts')) || [];
        const updated = all.filter((g) => g.id !== giftId);
        localStorage.setItem('gifts', JSON.stringify(updated));
        setGifts(updated.filter((g) => g.eventId === eventData.id));
    };

    const handleGiftAction = () => {
        if (!selectedGift) return;
        const toSend = selectedGift;
        setGifts((gs) => gs.filter((g) => g.id !== toSend.id));
        setSelectedGift(null);
        setTimeout(() => {
            navigate('/fundsend', { state: { eventData, gift: toSend } });
        }, 800);
    };

    // 3) feedback 수락/완료 handler
    const handleAcceptFeedback = (feedbackId) => {
        const all = JSON.parse(localStorage.getItem('gifts')) || [];
        const updated = all.map((g) => {
            if (g.id !== selectedGift.id) return g;
            // pending 에서 꺼내기
            const fb = (g.feedbacks || []).find((x) => x.id === feedbackId);
            const pending = (g.feedbacks || []).filter((x) => x.id !== feedbackId);
            const accepted = [...(g.acceptedFeedbacks || []), fb];
            let next = { ...g, feedbacks: pending, acceptedFeedbacks: accepted };

            if (g.selectedType === 'fund' && fb) {
                const newCur = (g.currentAmount || 0) + fb.amount;
                const tgt = g.targetAmount || 1000000;
                next.currentAmount = newCur;
                next.percent = Math.min(100, (newCur / tgt) * 100).toFixed(0) + '%';
            } else {
                next.receiveStatus = 'done';
            }
            return next;
        });
        localStorage.setItem('gifts', JSON.stringify(updated));
        setGifts(updated.filter((g) => g.eventId === eventData.id));
        setSelectedGift(updated.find((g) => g.id === selectedGift.id) || null);
    };
    // 4) feedback 거절 handler
    const handleRejectFeedback = (feedbackId) => {
        const all = JSON.parse(localStorage.getItem('gifts')) || [];
        const updated = all.map((g) => {
            if (g.id !== selectedGift.id) return g;
            return {
                ...g,
                feedbacks: (g.feedbacks || []).filter((f) => f.id !== feedbackId),
            };
        });
        localStorage.setItem('gifts', JSON.stringify(updated));
        setGifts(updated.filter((g) => g.eventId === eventData.id));
        setSelectedGift(updated.find((g) => g.id === selectedGift.id) || null);
    };

    // filter by 서브탭
    const currentList = gifts.filter((g) => {
        if (giftTab === 'want') return g.receiveStatus === 'want';
        if (giftTab === 'notwant') return g.receiveStatus === 'unwant';
        if (giftTab === 'received') return g.receiveStatus === 'done';
        return false;
    });

    // GiftPreview 용 props 분기
    const previewFeedbacks = selectedGift
        ? giftTab === 'received'
            ? selectedGift.acceptedFeedbacks || []
            : selectedGift.feedbacks || []
        : [];
    const previewOnAccept = giftTab === 'received' ? undefined : handleAcceptFeedback;
    const previewOnReject = giftTab === 'received' ? undefined : handleRejectFeedback;
    const previewOnGiftAction = userMode === 'giver' && giftTab !== 'received' ? handleGiftAction : null;

    return (
        <div className={styles.container}>
            <Header title="이벤트 보기" subTitle="상세 정보" rightButton={shareIcon} />

            {/* user mode toggle */}
            <div className={styles.userModeToggle}>
                <button className={styles.toggleButton} onClick={handleUserModeToggle}>
                    {userMode === 'owner' ? '등록자 (내가 등록함)' : '선물 주는 사람'}
                </button>
            </div>

            {/* event info */}
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
                            +
                        </button>
                        <button className={styles.editButton} onClick={handleEdit}>
                            <img src={editButtonImg} alt="이벤트 수정" className={styles.editButtonImg} />
                        </button>
                    </div>
                )}
            </div>

            {/* main tabs */}
            <div className={styles.tabMenu}>
                <div
                    className={`${styles.tab} ${mainTab === 'gift' ? styles.activeTab : ''}`}
                    onClick={() => setMainTab('gift')}
                >
                    선물
                </div>
                <div
                    className={`${styles.tab} ${mainTab === 'record' ? styles.activeTab : ''}`}
                    onClick={() => setMainTab('record')}
                >
                    이벤트 기록
                </div>
            </div>

            {mainTab === 'gift' ? (
                <>
                    {/* sub tabs */}
                    <div className={styles.subTabMenu}>
                        {['want', 'notwant', 'received'].map((t) => (
                            <div
                                key={t}
                                className={`${styles.subTab} ${giftTab === t ? styles.activeSubTab : ''}`}
                                onClick={() => setGiftTab(t)}
                            >
                                {t === 'want' ? '받고 싶은' : t === 'notwant' ? '받기 싫은' : '받은'}
                            </div>
                        ))}
                    </div>
                    {/* gift list */}
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
                                        onClick={() => setSelectedGift(item)}
                                    >
                                        <GiftItem
                                            type={item.selectedType === 'fund' ? '펀딩' : '선물'}
                                            title={item.giftName}
                                            description={item.giftDescription}
                                            image={item.imageUrl}
                                            percent={item.selectedType === 'fund' ? item.percent : null}
                                            onClick={() => setSelectedGift(item)}
                                        />
                                        {userMode === 'owner' && giftTab !== 'received' && (
                                            <button
                                                className={styles.deleteButton}
                                                onClick={(e) => handleDeleteGift(item.id, e)}
                                            >
                                                삭제
                                            </button>
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
                <div className={`${styles.recordArea} ${styles.emptyState}`}>
                    <div className={styles.icon}>📝</div>
                    <div className={styles.text}>
                        아직 남긴 기록이 없어요.
                        <br />
                        이벤트를 즐기고 기록해 보세요!
                    </div>
                </div>
            )}

            {/* preview modal */}
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
