import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Dashboard.module.css';
import Eventbox from '../../components/eventbox/Eventbox';
import userButton from './userButton.png';
import sortEventDate from './sortEventDate.png';
import { ENDPOINTS } from '../../api/config';

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    const currentUserId = 'user123';

    useEffect(() => {
        // Mock 서버에서 이벤트 목록 가져오기
        fetch(ENDPOINTS.getEvents)
            .then((res) => res.json())
            .then((data) => setEvents(data))
            .catch((err) => {
                console.error('이벤트 불러오기 실패:', err);
                setEvents([]);
            });
    }, []);

    const sortByNewest = () => {
        const sorted = [...events].sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
        setEvents(sorted);
    };

    // ... 이하 handleDelete, handleEventClick 그대로 ...

    return (
        <div className={styles.dashboardContainer}>
            <header className={styles.header}>
                <h1 className={styles.pageTitle}>이벤트 목록</h1>
                <Link to="/setting" className={styles.userButton}>
                    <img src={userButton} alt="User Page" />
                </Link>
            </header>

            <div className={styles.sortButtonWrapper} onClick={sortByNewest}>
                <img src={sortEventDate} alt="Sort by Newest" className={styles.sortButton} />
                <div className={styles.sortButtonText}>최신순</div>
            </div>

            <div className={styles.eventList}>
                {events.map((event, index) => {
                    const isOwner = event.ownerId === currentUserId;
                    const viewCount = event.eventView || 0;
                    const presentCount = event.eventPresent || 0;
                    return (
                        <div
                            key={index}
                            onClick={() => navigate('/eventview', { state: event })}
                            className={styles.eventLinkWrapper}
                        >
                            <Eventbox
                                {...event}
                                eventView={viewCount}
                                eventPresent={presentCount}
                                isOwner={isOwner}
                                onDelete={(e) => {
                                    e.stopPropagation();
                                    const updated = events.filter((_, i) => i !== index);
                                    setEvents(updated);
                                    localStorage.setItem('events', JSON.stringify(updated));
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
