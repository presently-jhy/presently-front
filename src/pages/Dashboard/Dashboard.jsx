import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Dashboard.module.css';
import Eventbox from '../../components/eventbox/Eventbox';
import userButton from './userButton.png';
import sortEventDate from './sortEventDate.png';

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    const currentUserId = 'user123';

    useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem('events'));
        if (storedEvents && storedEvents.length > 0) {
            setEvents(storedEvents);
        } else {
            fetch('/data/events.json')
                .then((res) => res.json())
                .then((data) => setEvents(data))
                .catch((err) => {
                    console.error('이벤트 불러오기 실패:', err);
                    setEvents([]);
                });
        }
    }, []);

    const sortByNewest = () => {
        const sortedEvents = [...events].sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
        setEvents(sortedEvents);
    };

    const handleDelete = (indexToDelete, e) => {
        e.stopPropagation();
        const updatedEvents = events.filter((_, index) => index !== indexToDelete);
        setEvents(updatedEvents);
        localStorage.setItem('events', JSON.stringify(updatedEvents));
    };

    const handleEventClick = (event) => {
        navigate('/eventview', { state: event });
    };

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
                    // JSON에 저장된 조회수와 받은 선물 개수를 그대로 사용 (값이 없으면 0)
                    const computedEventView = event.eventView || 0;
                    const receivedGiftCount = event.eventPresent || 0;

                    return (
                        <div key={index} onClick={() => handleEventClick(event)} className={styles.eventLinkWrapper}>
                            <Eventbox
                                {...event}
                                eventView={computedEventView}
                                eventPresent={receivedGiftCount}
                                isOwner={isOwner}
                                onDelete={(e) => handleDelete(index, e)}
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
