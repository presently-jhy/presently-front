// src/pages/Setting/Setting.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import styles from './Setting.module.css';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../context/ToastContext';

function Setting() {
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
        const saved = localStorage.getItem('notificationsEnabled');
        return saved ? JSON.parse(saved) : true;
    });

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
        // 로컬스토리지에 알림 설정 저장
        localStorage.setItem('notificationsEnabled', JSON.stringify(!notificationsEnabled));
        showSuccess('알림 설정이 저장되었습니다!');
    };

    // 실제 로그아웃
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('로그아웃 실패:', error.message);
            showError('로그아웃 중 오류가 발생했습니다.');
        } else {
            showSuccess('로그아웃되었습니다.');
        }
        navigate('/');
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    <ArrowLeft size={24} />
                </button>
                <h2 className={styles.title}>설정</h2>
            </header>

            <div className={styles.content}>
                {/* 프로필 수정 */}
                <div className={styles.settingItem} onClick={handleProfileEdit}>
                    <span>프로필 정보 수정</span>
                    <User size={20} className={styles.settingIcon} />
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
