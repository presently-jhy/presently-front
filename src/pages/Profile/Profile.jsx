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
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // 폼 제출: 로컬 스토리지에 프로필 정보 저장
    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedProfile = {
            profileImage,
            nickname,
            email,
        };
        localStorage.setItem('profile', JSON.stringify(updatedProfile));
        alert('프로필 정보가 저장되었습니다.');
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
                        업로드
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
                    />
                </div>

                {/* 이메일 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>이메일 주소</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        readOnly
                        className={styles.textInput}
                        placeholder="이메일 주소를 입력하세요"
                    />
                </div>

                {/* 저장하기 버튼 */}
                <Link to="/setting">
                    <button type="submit" className={styles.saveButton}>
                        저장하기
                    </button>
                </Link>
            </form>
        </div>
    );
}

export default Profile;
