import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';
import Eventbox from '../../components/eventbox/Eventbox';
import userButton from './userButton.png';
import sortEventDate from './sortEventDate.png';

const Dashboard = () => {
    // localStorage에서 저장된 이벤트를 상태로 관리
    const [events, setEvents] = useState([]);

    // 컴포넌트 마운트 시 localStorage의 이벤트 로드
    useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
        setEvents(storedEvents);
    }, []);

    // 최신순 정렬
    const sortByNewest = () => {
        const sortedEvents = [...events].sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
        setEvents(sortedEvents);
    };

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.header}>
                <h1 className={styles.pageTitle}>이벤트 목록</h1>
                <Link to="/user" className={styles.userButton}>
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
                {events.map((event, index) => (
                    <Eventbox key={index} {...event} />
                ))}
            </div>

            {/* 이벤트 추가하기 버튼 */}
            <div className={styles.buttonWrapper}>
                <Link to="/addEvent" className={styles.button}>
                    이벤트 추가하기
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
