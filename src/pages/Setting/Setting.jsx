import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Setting.module.css';
import backIcon from './arrowIcon.png';
import profileIcon from './profileIcon.png';

function Setting() {
    const navigate = useNavigate();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    // 뒤로가기 버튼
    const handleBack = () => {
        navigate(-1);
    };

    // 프로필 정보 수정 (예: /profileEdit 페이지로 이동)
    const handleProfileEdit = () => {
        navigate('/profile');
    };

    // 알림 설정 토글
    const handleToggleNotifications = () => {
        setNotificationsEnabled(!notificationsEnabled);
        // 실제 알림 설정 로직 (백엔드/로컬스토리지 등) 추가 가능
    };

    // 로그아웃 기능 (예: 토큰 삭제 후 /home 이동)
    const handleLogout = () => {
        // 예: localStorage.removeItem('token');
        // 예: navigate('/home');
        alert('로그아웃 되었습니다.');
        navigate('/');
    };

    return (
        <div className={styles.container}>
            {/* 상단 헤더 */}
            <header className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    <img src={backIcon} alt="뒤로가기" />
                </button>
                <h2 className={styles.title}>설정</h2>
            </header>

            {/* 설정 콘텐츠 영역 */}
            <div className={styles.content}>
                {/* 프로필 정보 수정 */}
                <div className={styles.settingItem} onClick={handleProfileEdit}>
                    <span>프로필 정보 수정</span>
                    <img src={profileIcon} alt="profile" className={styles.settingIcon} />
                </div>

                {/* 알림 설정 */}
                <div className={styles.settingItem}>
                    <span>알림 설정</span>
                    <label className={styles.switch}>
                        <input type="checkbox" checked={notificationsEnabled} onChange={handleToggleNotifications} />
                        <span className={styles.slider}></span>
                    </label>
                </div>
            </div>

            {/* 로그아웃 버튼 */}
            <div className={styles.logoutContainer}>
                <button className={styles.logoutButton} onClick={handleLogout}>
                    로그아웃
                </button>
            </div>
        </div>
    );
}

export default Setting;
