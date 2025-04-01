import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Dashboard.module.css';
import Eventbox from '../../components/eventbox/Eventbox';
import userButton from './userButton.png';
import sortEventDate from './sortEventDate.png';

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
        setEvents(storedEvents);
    }, []);

    // 최신순 정렬
    const sortByNewest = () => {
        const sortedEvents = [...events].sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
        setEvents(sortedEvents);
    };

    // 삭제 핸들러: 해당 인덱스 삭제
    const handleDelete = (indexToDelete) => {
        const updatedEvents = events.filter((_, index) => index !== indexToDelete);
        setEvents(updatedEvents);
        localStorage.setItem('events', JSON.stringify(updatedEvents));
    };

    // 이벤트 클릭 시 /fundsend 페이지로 이동, 이벤트 데이터를 state로 전달
    const handleEventClick = (event) => {
        navigate('/fundsend', { state: event });
    };

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.header}>
                <h1 className={styles.pageTitle}>이벤트 목록</h1>
                <Link to="/setting" className={styles.userButton}>
                    <img src={userButton} alt="User Page" />
                </Link>
            </div>

            <div className={styles.sortButtonWrapper}>
                <div>
                    <img
                        src={sortEventDate}
                        alt="Sort by Newest"
                        className={styles.sortButton}
                        onClick={sortByNewest}
                    />
                </div>
                <div className={styles.sortButtonText}>최신순</div>
            </div>

            {/* 이벤트 카드 목록 */}
            <div className={styles.eventList}>
                {events.map((event, index) => {
                    // eventPresent: 펀드이면 입력한 금액, 선물이면 기본 1 (또는 별도 giftCount)
                    const computedEventPresent = event.eventType === 'fund' ? event.giftAmount || 0 : 1;
                    const computedEventView = event.eventView || 0;

                    return (
                        <div key={index} onClick={() => handleEventClick(event)} className={styles.eventLinkWrapper}>
                            <Eventbox
                                {...event}
                                eventView={computedEventView}
                                eventPresent={computedEventPresent}
                                onDelete={(e) => {
                                    e.stopPropagation();
                                    handleDelete(index);
                                }}
                            />
                        </div>
                    );
                })}
            </div>

            <div className={styles.buttonWrapper}>
                <Link to="/addEvent" className={styles.button}>
                    이벤트 추가하기
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
