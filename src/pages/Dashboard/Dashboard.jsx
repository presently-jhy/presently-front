import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';
import Eventbox from '../../components/eventbox/Eventbox';
import userButton from './userButton.png'; // 🔹 유저 페이지 버튼 이미지
import sortEventDate from './sortEventDate.png'; // 🔹 최신순 정렬 버튼 이미지

const mockupData = [
    {
        eventImg: 'https://via.placeholder.com/56',
        eventName: '이준형님의 생일;)',
        eventDate: '2025-01-03',
        eventView: 1247,
        eventPresent: 100,
    },
    {
        eventImg: 'https://via.placeholder.com/56',
        eventName: '그냥 엄혜영의 생일',
        eventDate: '2025-04-30',
        eventView: 904,
        eventPresent: 87,
    },
    {
        eventImg: 'https://via.placeholder.com/56',
        eventName: '엄마 생신',
        eventDate: '2025-10-13',
        eventView: 1750,
        eventPresent: 150,
    },
];

const Dashboard = () => {
    // 🔹 이벤트 데이터를 상태로 관리
    const [events, setEvents] = useState(mockupData);

    // 🔹 최신순 정렬 함수 (이미지 클릭 시 실행)
    const sortByNewest = () => {
        const sortedEvents = [...events].sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
        setEvents(sortedEvents);
    };

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.header}>
                <h1 className={styles.pageTitle}>이벤트 목록</h1>

                {/* 🔹 User 페이지로 이동하는 버튼 */}
                <Link to="/user" className={styles.userButton}>
                    <img src={userButton} alt="User Page" />
                </Link>
            </div>

            {/* 🔹 최신순 정렬 버튼 (이미지 클릭) */}
            <div className={styles.sortButtonWrapper}>
                <img src={sortEventDate} alt="Sort by Newest" className={styles.sortButton} onClick={sortByNewest} />
                최신순
            </div>

            {/* 이벤트 카드 리스트 */}
            <div className={styles.eventList}>
                {events.map((event, index) => (
                    <Eventbox key={index} {...event} />
                ))}
            </div>

            {/* 이벤트 추가하기 버튼 */}
            <div className={styles.buttonWrapper}>
                <Link to="/" className={styles.button}>
                    이벤트 추가하기
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
