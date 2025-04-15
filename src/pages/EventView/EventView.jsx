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

const EventView = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const eventData = location.state || {};

    const [gifts, setGifts] = useState([]);
    const [mainTab, setMainTab] = useState('gift');
    const [giftTab, setGiftTab] = useState('want');
    const [selectedGift, setSelectedGift] = useState(null);
    const [userMode, setUserMode] = useState('owner');

    // 선물 데이터를 localStorage 또는 정적 JSON에서 불러오기
    useEffect(() => {
        if (eventData && eventData.id) {
            const storedGifts = JSON.parse(localStorage.getItem('gifts'));
            if (storedGifts && storedGifts.length > 0) {
                const eventGifts = storedGifts.filter((gift) => gift.eventId === eventData.id);
                setGifts(eventGifts);
            } else {
                fetch('/data/gifts.json')
                    .then((res) => res.json())
                    .then((allGifts) => {
                        const eventGifts = allGifts.filter((gift) => gift.eventId === eventData.id);
                        setGifts(eventGifts);
                    })
                    .catch((err) => {
                        console.error('선물 데이터 로드 실패:', err);
                        setGifts([]);
                    });
            }
        }
    }, [eventData]);

    // 선물의 펀딩 달성률이 100%이면 애니메이션 후 자동 제거
    useEffect(() => {
        gifts.forEach((gift) => {
            const percentValue = typeof gift.percent === 'string' ? parseInt(gift.percent, 10) : gift.percent;
            if (percentValue === 100) {
                setTimeout(() => {
                    setGifts((prevGifts) => prevGifts.filter((g) => g.id !== gift.id));
                }, 1000);
            }
        });
    }, [gifts]);

    const currentGiftList = gifts.filter((gift) => {
        if (giftTab === 'want') return gift.receiveStatus === 'want';
        if (giftTab === 'notwant') return gift.receiveStatus === 'unwant';
        if (giftTab === 'received') return gift.receiveStatus === 'done';
        return true;
    });

    const handleUserModeToggle = () => {
        setUserMode((prev) => (prev === 'owner' ? 'giver' : 'owner'));
    };

    const handleAdd = () => {
        navigate('/giftenroll', { state: eventData });
    };

    // 수정 기능: 수정 버튼 클릭 시 eventData에 id가 없으면 localStorage에서 찾아 전달하도록 함
    const handleEdit = () => {
        if (!eventData.id) {
            // 만약 eventData에 id가 없다면 localStorage에서 해당 이벤트를 찾습니다.
            const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
            const foundEvent = storedEvents.find(
                (evt) => evt.eventName === eventData.eventName && evt.eventDate === eventData.eventDate
            );
            if (foundEvent) {
                // 수정 모드를 명시하기 위해 추가 플래그(mode: 'edit')를 넣어도 좋습니다.
                navigate('/addEventLog', { state: { ...foundEvent, mode: 'edit' } });
                return;
            } else {
                alert('수정할 이벤트 데이터를 찾을 수 없습니다.');
                return;
            }
        }
        // eventData에 id가 이미 있다면 그대로 전달
        navigate('/addEventLog', { state: { ...eventData, mode: 'edit' } });
    };

    const handleGiftAction = () => {
        if (!selectedGift) return;
        const giftToRemove = selectedGift;
        setGifts((prevGifts) => prevGifts.filter((g) => g.id !== giftToRemove.id));
        setSelectedGift(null);
        setTimeout(() => {
            navigate('/fundsend', { state: { eventData, gift: giftToRemove } });
        }, 800);
    };

    const handleDeleteGift = (giftId, e) => {
        e.stopPropagation();
        const allGifts = JSON.parse(localStorage.getItem('gifts')) || [];
        const updatedGifts = allGifts.filter((gift) => gift.id !== giftId);
        localStorage.setItem('gifts', JSON.stringify(updatedGifts));
        setGifts(updatedGifts.filter((gift) => gift.eventId === eventData.id));
    };

    return (
        <div className={styles.container}>
            <Header title="이벤트 보기" subTitle="상세 정보" rightButton={shareIcon} />

            <div className={styles.userModeToggle}>
                <button className={styles.toggleButton} onClick={handleUserModeToggle}>
                    {userMode === 'owner' ? '등록자 (내가 등록함)' : '선물 주는 사람'}
                </button>
            </div>

            <div className={styles.eventInfo}>
                <img src={eventData.eventImg || defaultEventImg} alt="이벤트 이미지" className={styles.eventImage} />
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

            {mainTab === 'gift' && (
                <>
                    <div className={styles.subTabMenu}>
                        {['want', 'notwant', 'received'].map((tabType) => (
                            <div
                                key={tabType}
                                className={`${styles.subTab} ${giftTab === tabType ? styles.activeSubTab : ''}`}
                                onClick={() => setGiftTab(tabType)}
                            >
                                {tabType === 'want' ? '받고 싶은' : tabType === 'notwant' ? '받기 싫은' : '받은'}
                            </div>
                        ))}
                    </div>
                    <div className={styles.itemList}>
                        <AnimatePresence>
                            {currentGiftList.length > 0 ? (
                                currentGiftList.map((item) => (
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
                                            percent={item.percent}
                                            onClick={() => setSelectedGift(item)}
                                        />
                                        {userMode === 'owner' && (
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
                                <p>등록된 선물이 없습니다.</p>
                            )}
                        </AnimatePresence>
                    </div>
                </>
            )}

            {mainTab === 'record' && <div className={styles.recordArea}>이벤트 기록이 여기에 표시됩니다.</div>}

            {selectedGift && (
                <GiftPreview
                    gift={selectedGift}
                    onClose={() => setSelectedGift(null)}
                    onGiftAction={userMode === 'giver' ? handleGiftAction : null}
                />
            )}
        </div>
    );
};

export default EventView;
