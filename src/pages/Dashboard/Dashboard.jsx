// src/pages/Dashboard/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import styles from './Dashboard.module.css';
import Eventbox from '../../components/eventbox/Eventbox';
import SkeletonCard from '../../components/SkeletonCard/SkeletonCard';
import Spinner from '../../components/Spinner/Spinner';
import EventStats from '../../components/DataVisualization/EventStats';
import CuteLoading from '../../components/CuteLoading/CuteLoading';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
    const [events, setEvents] = useState([]);
    const [gifts, setGifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortLoading, setSortLoading] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const navigate = useNavigate();
    const { user, accessToken, checking } = useAuth();

    // 인증 처리
    useEffect(() => {
        if (!checking && !user) {
            navigate('/');
        }
    }, [checking, user, navigate]);

    // 사용자 이벤트 가져오기
    useEffect(() => {
        async function fetchUserEvents() {
            setLoading(true);
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
            } finally {
                setLoading(false);
            }
        }

        if (!checking && user && accessToken) {
            fetchUserEvents();
        }
    }, [checking, user, accessToken]);

    // 선물 데이터 가져오기
    useEffect(() => {
        const allGifts = JSON.parse(localStorage.getItem('gifts')) || [];
        setGifts(allGifts);
    }, []);

    // 최신순 정렬
    const sortByNewest = async () => {
        setSortLoading(true);
        // 애니메이션을 위한 지연
        await new Promise((resolve) => setTimeout(resolve, 300));
        setEvents((prev) => [...prev].sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate)));
        setSortLoading(false);
    };

    // 이벤트 삭제
    const handleDelete = (idx, e) => {
        e.stopPropagation();
        const updated = events.filter((_, i) => i !== idx);
        setEvents(updated);
        localStorage.setItem('events', JSON.stringify(updated));
    };

    // 이벤트 클릭
    const handleEventClick = (ev) => {
        navigate('/eventview', { state: ev });
    };

    if (checking)
        return (
            <div className={styles.loading}>
                <CuteLoading message="로그인을 확인하고 있어요..." />
            </div>
        );

    return (
        <div className={styles.dashboardContainer}>
            <header className={styles.header}>
                <h1 className={styles.pageTitle}>이벤트 목록</h1>
                <div className={styles.headerButtons}>
                    <motion.button
                        className={styles.statsButton}
                        onClick={() => setShowStats(!showStats)}
                        disabled={loading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="통계 보기"
                    >
                        <BarChart3 size={20} />
                    </motion.button>
                    <button
                        className={styles.userButton}
                        aria-label="설정 페이지로 이동"
                        onClick={() => navigate('/setting')}
                        disabled={loading}
                    >
                        {loading ? <Spinner size={20} /> : <img src="/userButton.png" alt="설정" />}
                    </button>
                </div>
            </header>

            {/* 통계 섹션 */}
            <AnimatePresence>
                {showStats && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className={styles.statsSection}
                    >
                        <EventStats events={events} gifts={gifts} />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={styles.sortButtonWrapper}>
                <motion.button
                    className={styles.sortButtonBtn}
                    onClick={sortByNewest}
                    disabled={loading || sortLoading}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                    {sortLoading ? (
                        <Spinner size={16} />
                    ) : (
                        <motion.div animate={{ rotate: 0 }} transition={{ duration: 0.3 }}>
                            <img src="/sortEventDate.png" alt="최신순" className={styles.sortButton} />
                        </motion.div>
                    )}
                    <span className={styles.sortButtonText}>
                        {loading ? '로딩중...' : sortLoading ? '정렬중...' : '최신순'}
                    </span>
                </motion.button>
            </div>

            <div className={styles.eventList}>
                {loading ? (
                    <SkeletonCard count={3} />
                ) : events.length === 0 ? (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '3rem 1rem',
                            color: '#666',
                            background: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '16px',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                            border: '1px solid rgba(102, 79, 171, 0.1)',
                        }}
                    >
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-dark)' }}>
                            첫 번째 이벤트를 만들어보세요!
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.875rem' }}>아직 등록된 이벤트가 없습니다.</p>
                    </div>
                ) : (
                    events.map((event, idx) => {
                        const isOwner = event.ownerId === user?.id;
                        return (
                            <div
                                key={event.id}
                                onClick={() => handleEventClick(event)}
                                className={styles.eventLinkWrapper}
                            >
                                <Eventbox
                                    {...event}
                                    eventView={event.eventView}
                                    eventPresent={event.eventPresent}
                                    isOwner={isOwner}
                                    onDelete={(e) => handleDelete(idx, e)}
                                />
                            </div>
                        );
                    })
                )}
            </div>

            <div className={styles.buttonWrapper}>
                <button className={styles.button} onClick={() => navigate('/addEvent')} disabled={loading}>
                    {loading ? (
                        <>
                            <Spinner size={18} />
                            로딩중...
                        </>
                    ) : (
                        <>이벤트 추가하기</>
                    )}
                </button>
            </div>
        </div>
    );
}
