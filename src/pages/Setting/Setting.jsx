// src/pages/Setting/Setting.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Setting.module.css';
import backIcon from './arrowIcon.png';
import profileIcon from './profileIcon.png';
import { supabase } from '../../lib/supabaseClient';

function Setting() {
    const navigate = useNavigate();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    // 뒤로가기
    const handleBack = () => {
        navigate(-1);
    };

    // 프로필 정보 수정으로 이동
    const handleProfileEdit = () => {
        navigate('/profile');
    };

    // 알림 설정 토글
    const handleToggleNotifications = () => {
        setNotificationsEnabled((prev) => !prev);
        // TODO: 백엔드 or 로컬스토리지에 실제 저장
    };

    // 실제 로그아웃
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('로그아웃 실패:', error.message);
            // 필요하다면 사용자에게 오류 안내
        }
        navigate('/');
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    <img src={backIcon} alt="뒤로가기" />
                </button>
                <h2 className={styles.title}>설정</h2>
            </header>

            <div className={styles.content}>
                {/* 프로필 수정 */}
                <div className={styles.settingItem} onClick={handleProfileEdit}>
                    <span>프로필 정보 수정</span>
                    <img src={profileIcon} alt="프로필 수정" className={styles.settingIcon} />
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

            {/* 로그아웃 */}
            <div className={styles.logoutContainer}>
                <button className={styles.logoutButton} onClick={handleLogout}>
                    로그아웃
                </button>
            </div>
        </div>
    );
}

export default Setting;
