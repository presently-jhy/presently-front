import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';
import arrowIcon from './arrowIcon.png';

function Profile() {
    const navigate = useNavigate();

    // 프로필 정보 상태 (이미지, 닉네임, 이메일)
    const [profileImage, setProfileImage] = useState(null); // base64 URL
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 마운트 시 로컬 스토리지에서 프로필 정보 불러오기
    useEffect(() => {
        const storedProfile = JSON.parse(localStorage.getItem('profile')) || null;
        if (storedProfile) {
            setProfileImage(storedProfile.profileImage || null);
            setNickname(storedProfile.nickname || '');
            setEmail(storedProfile.email || '');
        }
    }, []);

    // 뒤로 가기
    const handleBack = () => {
        navigate(-1);
    };

    // 이미지 업로드 (FileReader → base64)
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // 파일 크기 체크 (5MB 제한)
            if (file.size > 5 * 1024 * 1024) {
                alert('파일 크기는 5MB 이하여야 합니다.');
                return;
            }

            // 파일 타입 체크
            if (!file.type.startsWith('image/')) {
                alert('이미지 파일만 업로드 가능합니다.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // 폼 제출: 로컬 스토리지에 프로필 정보 저장
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nickname.trim()) {
            alert('닉네임을 입력해주세요.');
            return;
        }

        setIsSubmitting(true);

        try {
            const updatedProfile = {
                profileImage,
                nickname: nickname.trim(),
                email,
                updatedAt: new Date().toISOString(),
            };
            localStorage.setItem('profile', JSON.stringify(updatedProfile));

            // 성공 메시지 표시
            setTimeout(() => {
                alert('프로필 정보가 저장되었습니다! 🎉');
                setIsSubmitting(false);
            }, 500);
        } catch (error) {
            console.error('프로필 저장 실패:', error);
            alert('프로필 저장에 실패했습니다. 다시 시도해주세요.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* 상단 헤더 */}
            <header className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    <img src={arrowIcon} alt="뒤로가기" />
                </button>
                <h2 className={styles.title}>프로필 정보</h2>
            </header>

            {/* 프로필 편집 폼 */}
            <form className={styles.form} onSubmit={handleSubmit}>
                {/* 프로필 이미지 영역 */}
                <div className={styles.profileImageContainer}>
                    {profileImage ? (
                        <img src={profileImage} alt="프로필" className={styles.profileImage} />
                    ) : (
                        <div className={styles.blankProfileImage} />
                    )}

                    {/* 원 하단 중앙에 "업로드" 버튼 라벨 */}
                    <label htmlFor="profileImageInput" className={styles.uploadLabel}>
                        {profileImage ? '변경' : '업로드'}
                    </label>
                    <input
                        type="file"
                        id="profileImageInput"
                        accept="image/*"
                        onChange={handleImageChange}
                        className={styles.imageInput}
                    />
                </div>

                {/* 닉네임 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>닉네임</label>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className={styles.textInput}
                        placeholder="닉네임을 입력하세요"
                        maxLength={20}
                        required
                    />
                    <span className={styles.charCount}>{nickname.length}/20</span>
                </div>

                {/* 이메일 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>이메일 주소</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.textInput}
                        placeholder="이메일 주소를 입력하세요"
                        required
                    />
                </div>

                {/* 저장하기 버튼 */}
                <button type="submit" className={styles.saveButton} disabled={isSubmitting || !nickname.trim()}>
                    {isSubmitting ? '저장 중...' : '저장하기'}
                </button>
            </form>
        </div>
    );
}

export default Profile;
