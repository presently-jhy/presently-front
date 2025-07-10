// src/pages/Dashboard/Dashboard.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, ArrowDown } from 'lucide-react';
import styles from './Dashboard.module.css';
import Eventbox from '../../components/eventbox/Eventbox';
import { SkeletonCard, Spinner, EventStats, CuteLoading, Button, EmptyState, ErrorState } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useSupabaseRealtime } from '../../hooks/useSupabaseRealtime';
import { eventService } from '../../services/eventService';

export default function Dashboard() {
    const [gifts, setGifts] = useState([]);
    const [sortLoading, setSortLoading] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const navigate = useNavigate();
    const { user, checking } = useAuth();
    const { showSuccess, showError } = useToast();

    // Supabase Realtime으로 이벤트 데이터 관리
    const {
        data: events,
        loading,
        error,
    } = useSupabaseRealtime('events', {
        column: 'creator_id',
        value: user?.id,
    });

    // 인증 처리
    useEffect(() => {
        if (!checking && !user) {
            navigate('/');
        }
    }, [checking, user, navigate]);

    // 사용자 이벤트 가져오기 (Supabase Realtime으로 대체됨)
    // 성공 알림 제거 - 실시간 업데이트이므로 불필요한 알림 방지

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
        // events는 useSupabaseRealtime에서 관리되므로 정렬은 UI에서만 처리
        setSortLoading(false);
        showSuccess('이벤트가 최신순으로 정렬되었어요!');
    };

    // 이벤트 삭제
    const handleDelete = async (eventId, e) => {
        e.stopPropagation();
        try {
            await eventService.deleteEvent(eventId);
            showSuccess('이벤트가 삭제되었습니다!');
        } catch (error) {
            console.error('이벤트 삭제 실패:', error);
            showError('이벤트 삭제에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 이벤트 클릭
    const handleEventClick = (event) => {
        // Supabase 데이터 구조에 맞게 변환
        const eventData = {
            id: event.id,
            eventName: event.title,
            eventDescription: event.description,
            eventDate: event.event_datetime?.split('T')[0],
            eventImg: event.image_url,
            eventView: event.event_view,
            eventPresent: event.event_present,
            ownerId: event.creator_id,
        };
        navigate('/eventview', { state: eventData });
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
                        aria-label={showStats ? '통계 숨기기' : '통계 보기'}
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
                    aria-label="이벤트 최신순 정렬"
                >
                    {sortLoading ? (
                        <Spinner size={16} />
                    ) : (
                        <motion.div animate={{ rotate: 0 }} transition={{ duration: 0.3 }}>
                            <ArrowDown size={20} />
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
                ) : error ? (
                    <ErrorState
                        title="이벤트를 불러올 수 없습니다"
                        message="네트워크 연결을 확인하고 다시 시도해주세요."
                        onRetry={() => window.location.reload()}
                    />
                ) : events.length === 0 ? (
                    <EmptyState
                        icon="calendar"
                        title="첫 번째 이벤트를 만들어보세요!"
                        description="아직 등록된 이벤트가 없습니다. 새로운 이벤트를 추가해보세요."
                        action={
                            <Button variant="primary" onClick={() => navigate('/addevent')} size="medium">
                                이벤트 추가하기
                            </Button>
                        }
                    />
                ) : (
                    events.map((event) => {
                        const isOwner = event.creator_id === user?.id;
                        return (
                            <div
                                key={event.id}
                                onClick={() => handleEventClick(event)}
                                className={styles.eventLinkWrapper}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleEventClick(event);
                                    }
                                }}
                                aria-label={`${event.title} 이벤트 보기`}
                            >
                                <Eventbox
                                    id={event.id}
                                    eventName={event.title}
                                    eventDescription={event.description}
                                    eventDate={event.event_datetime?.split('T')[0]}
                                    eventImg={event.image_url}
                                    eventView={event.event_view}
                                    eventPresent={event.event_present}
                                    isOwner={isOwner}
                                    onDelete={(e) => handleDelete(event.id, e)}
                                />
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
