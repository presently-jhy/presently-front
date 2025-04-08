import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import styles from './EventView.module.css';
import shareIcon from './shareIcon.svg';
import defaultEventImg from './defaultEventImg.png';

import GiftItem from '../../components/GiftItem/GiftItem';
import GiftPreview from '../../components/GiftPreview/GiftPreview';

function EventView() {
    const navigate = useNavigate();
    const location = useLocation();
    // 이전 페이지에서 전달받은 이벤트 데이터 (없으면 빈 객체)
    const eventData = location.state || {};

    // 선물 데이터를 불러오기 위한 state
    const [gifts, setGifts] = useState([]);
    // 탭 관련 state
    const [mainTab, setMainTab] = useState('gift');
    const [giftTab, setGiftTab] = useState('want');
    const [selectedGift, setSelectedGift] = useState(null);
    // 데모용: 사용자 모드를 직접 전환 ('owner': 등록자, 'giver': 선물 주는 사람)
    const [userMode, setUserMode] = useState('owner');

    // localStorage에서 현재 이벤트와 연결된 선물만 필터링해서 로드
    useEffect(() => {
        if (eventData && eventData.id) {
            const allGifts = JSON.parse(localStorage.getItem('gifts')) || [];
            const eventGifts = allGifts.filter((gift) => gift.eventId === eventData.id);
            setGifts(eventGifts);
        }
    }, [eventData]);

    // 탭별 선물 데이터 필터링 (receiveStatus 기준)
    const currentGiftList = gifts.filter((gift) => {
        if (giftTab === 'want') return gift.receiveStatus === 'want';
        if (giftTab === 'notwant') return gift.receiveStatus === 'unwant';
        if (giftTab === 'received') return gift.receiveStatus === 'done';
        return true;
    });

    // 데모용 모드 토글 버튼
    const handleUserModeToggle = () => {
        setUserMode((prev) => (prev === 'owner' ? 'giver' : 'owner'));
    };

    // owner 모드일 때, + 버튼 클릭 → giftEnroll로 이동
    const handleAdd = () => {
        navigate('/giftenroll', { state: eventData });
    };

    // GiftPreview에서 "선물하기" 버튼 클릭 시 호출 (giver 모드)
    const handleGiftAction = () => {
        // 선택된 선물(selectedGift)의 정보도 함께 넘김
        navigate('/fundsend', { state: { eventData, gift: selectedGift } });
    };

    // 선물 항목 삭제 함수
    const handleDeleteGift = (giftId) => {
        // 전체 선물 배열에서 giftId가 일치하는 선물을 제거합니다.
        const allGifts = JSON.parse(localStorage.getItem('gifts')) || [];
        const updatedGifts = allGifts.filter((gift) => gift.id !== giftId);
        localStorage.setItem('gifts', JSON.stringify(updatedGifts));
        // 현재 이벤트에 해당하는 선물만 state에 업데이트
        setGifts(updatedGifts.filter((gift) => gift.eventId === eventData.id));
    };

    return (
        <div className={styles.container}>
            <Header title="이벤트 보기" subTitle="상세 정보" rightButton={shareIcon} />

            {/* 데모용: 모드 토글 버튼 */}
            <div className={styles.userModeToggle}>
                <button onClick={handleUserModeToggle} className={styles.toggleButton}>
                    {userMode === 'owner' ? '등록자 (내가 등록함)' : '선물 주는 사람'}
                </button>
            </div>

            {/* 이벤트 정보 영역 */}
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
                {/* owner 모드일 때만 + 버튼 표시 */}
                {userMode === 'owner' && (
                    <button className={styles.addButton} onClick={handleAdd}>
                        +
                    </button>
                )}
            </div>

            {/* 메인 탭 (선물 / 이벤트 기록) */}
            <div className={styles.tabMenu}>
                <div
                    className={mainTab === 'gift' ? `${styles.tab} ${styles.activeTab}` : styles.tab}
                    onClick={() => setMainTab('gift')}
                >
                    선물
                </div>
                <div
                    className={mainTab === 'record' ? `${styles.tab} ${styles.activeTab}` : styles.tab}
                    onClick={() => setMainTab('record')}
                >
                    이벤트 기록
                </div>
            </div>

            {mainTab === 'gift' && (
                <>
                    <div className={styles.subTabMenu}>
                        <div
                            className={giftTab === 'want' ? `${styles.subTab} ${styles.activeSubTab}` : styles.subTab}
                            onClick={() => setGiftTab('want')}
                        >
                            받고 싶은
                        </div>
                        <div
                            className={
                                giftTab === 'notwant' ? `${styles.subTab} ${styles.activeSubTab}` : styles.subTab
                            }
                            onClick={() => setGiftTab('notwant')}
                        >
                            받고 싶지 않은
                        </div>
                        <div
                            className={
                                giftTab === 'received' ? `${styles.subTab} ${styles.activeSubTab}` : styles.subTab
                            }
                            onClick={() => setGiftTab('received')}
                        >
                            받은
                        </div>
                    </div>

                    {/* 선물 목록 */}
                    <div className={styles.itemList}>
                        {currentGiftList.length > 0 ? (
                            currentGiftList.map((item) => {
                                // displayType: '펀딩'이면 "펀딩", 그렇지 않으면 "선물"
                                const displayType = item.selectedType === 'fund' ? '펀딩' : '선물';
                                return (
                                    <div
                                        key={item.id}
                                        className={styles.giftItemWrapper}
                                        onClick={() => setSelectedGift(item)}
                                    >
                                        <GiftItem
                                            type={displayType}
                                            title={item.giftName}
                                            description={item.giftDescription}
                                            image={item.imageUrl}
                                            percent={item.percent}
                                            onClick={() => setSelectedGift(item)}
                                        />
                                        {/* owner 모드에서만 삭제 버튼 보이게 함 */}
                                        {userMode === 'owner' && (
                                            <button
                                                className={styles.deleteButton}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteGift(item.id);
                                                }}
                                            >
                                                삭제
                                            </button>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p>등록된 선물이 없습니다.</p>
                        )}
                    </div>
                </>
            )}

            {mainTab === 'record' && <div className={styles.recordArea}>이벤트 기록이 여기에 표시됩니다.</div>}

            {/* GiftPreview (gift giver 모드인 경우 "선물하기" 버튼 활성화) */}
            {selectedGift && (
                <GiftPreview
                    gift={selectedGift}
                    onClose={() => setSelectedGift(null)}
                    onGiftAction={userMode === 'giver' ? handleGiftAction : null}
                />
            )}
        </div>
    );
}

export default EventView;
