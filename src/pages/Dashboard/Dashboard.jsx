// src/pages/Dashboard/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Dashboard.module.css';
import Eventbox from '../../components/eventbox/Eventbox';
import userButton from './userButton.png';
import sortEventDate from './sortEventDate.png';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

export default function Dashboard() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    const { user, accessToken, checking } = useAuth();

    // 1) 인증 처리
    useEffect(() => {
        if (!checking && !user) {
            navigate('/');
        }
    }, [user, checking, navigate]);

    // 2) 사용자 이벤트 가져오기 (unchanged)
    useEffect(() => {
        async function fetchUserEvents() {
            if (!checking && user && accessToken) {
                try {
                    const res = await fetch('https://rewftufssxzqgdqrsqlz.functions.supabase.co/get-user-events', {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setEvents(
                            data.map((e) => ({
                                id: e.id,
                                eventName: e.title,
                                eventDescription: e.description,
                                eventDate: e.event_datetime?.split('T')[0],
                                eventImg: e.image_url,
                                eventView: e.event_view,
                                eventPresent: e.event_present,
                                ownerId: e.creator_id,
                            }))
                        );
                    } else {
                        console.error('이벤트 불러오기 실패:', await res.text());
                    }
                } catch (err) {
                    console.error('이벤트 요청 에러:', err);
                }
            }
        }
        fetchUserEvents();
    }, [user, accessToken, checking]);

    // 3) 최신순 정렬 (unchanged)
    const sortByNewest = () => {
        setEvents((prev) => [...prev].sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate)));
    };

    // 4) 이벤트 삭제 (unchanged)
    const handleDelete = (idx, e) => {
        e.stopPropagation();
        const updated = events.filter((_, i) => i !== idx);
        setEvents(updated);
        localStorage.setItem('events', JSON.stringify(updated));
    };

    // 5) 이벤트 클릭 (unchanged)
    const handleEventClick = (ev) => {
        navigate('/eventview', { state: ev });
    };

    if (checking) return <div className={styles.loading}>로그인 확인 중...</div>;

    return (
        <div className={styles.dashboardContainer}>
            <header className={styles.header}>
                <h1 className={styles.pageTitle}>이벤트 목록</h1>
                {/* 설정 페이지로 이동하는 버튼만 남깁니다 */}
                <Link to="/setting" className={styles.userButton} aria-label="설정 페이지로 이동">
                    <img src={userButton} alt="설정" />
                </Link>
            </header>

            <div className={styles.sortButtonWrapper} onClick={sortByNewest}>
                <img src={sortEventDate} alt="최신순" className={styles.sortButton} />
                <div className={styles.sortButtonText}>최신순</div>
            </div>

            <div className={styles.eventList}>
                {events.map((event, idx) => {
                    const isOwner = event.ownerId === user?.id;
                    return (
                        <div key={event.id} onClick={() => handleEventClick(event)} className={styles.eventLinkWrapper}>
                            <Eventbox
                                {...event}
                                eventView={event.eventView}
                                eventPresent={event.eventPresent}
                                isOwner={isOwner}
                                onDelete={(e) => handleDelete(idx, e)}
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
}
