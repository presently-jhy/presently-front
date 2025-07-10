import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import styles from './Profile.module.css';
import { useToast } from '../../context/ToastContext';

function Profile() {
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

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
                showError('파일 크기는 5MB 이하여야 합니다.');
                return;
            }

            // 파일 타입 체크
            if (!file.type.startsWith('image/')) {
                showError('이미지 파일만 업로드 가능합니다.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // 이미지 로드 실패 시 기본 이미지로 대체
    const handleImageError = (e) => {
        e.target.style.display = 'none';
    };

    // 폼 제출: 로컬 스토리지에 프로필 정보 저장
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nickname.trim()) {
            showError('닉네임을 입력해주세요.');
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
                showSuccess('프로필 정보가 저장되었습니다! 🎉');
                setIsSubmitting(false);
            }, 500);
        } catch (error) {
            console.error('프로필 저장 실패:', error);
            showError('프로필 저장에 실패했습니다. 다시 시도해주세요.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* 상단 헤더 */}
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate(-1)} aria-label="뒤로 가기">
                    <ArrowLeft size={24} />
                </button>
                <h1 className={styles.title}>프로필 설정</h1>
            </header>

            {/* 프로필 편집 폼 */}
            <form className={styles.form} onSubmit={handleSubmit}>
                {/* 프로필 이미지 영역 */}
                <div className={styles.profileImageContainer}>
                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt="프로필 이미지"
                            className={styles.profileImage}
                            loading="lazy"
                            onError={handleImageError}
                        />
                    ) : (
                        <div className={styles.blankProfileImage}>
                            <span>👤</span>
                        </div>
                    )}
                    <label htmlFor="imageUpload" className={styles.uploadLabel}>
                        이미지 변경
                    </label>
                    <input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className={styles.hiddenInput}
                        aria-describedby="imageHelp"
                    />
                    <div id="imageHelp" className={styles.helperText}>
                        JPG, PNG 파일만 업로드 가능합니다 (최대 5MB)
                    </div>
                </div>

                {/* 닉네임 */}
                <div className={styles.inputGroup}>
                    <label htmlFor="nicknameInput" className={styles.inputLabel}>
                        닉네임 *
                    </label>
                    <input
                        id="nicknameInput"
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className={styles.textInput}
                        placeholder="닉네임을 입력하세요"
                        required
                        aria-describedby="nicknameHelp"
                    />
                    <div id="nicknameHelp" className={styles.helperText}>
                        다른 사용자에게 표시될 이름입니다
                    </div>
                </div>

                {/* 이메일 */}
                <div className={styles.inputGroup}>
                    <label htmlFor="emailInput" className={styles.inputLabel}>
                        이메일
                    </label>
                    <input
                        id="emailInput"
                        type="email"
                        value={email}
                        readOnly
                        className={styles.textInput}
                        aria-describedby="emailHelp"
                    />
                    <div id="emailHelp" className={styles.helperText}>
                        로그인 시 사용한 이메일입니다
                    </div>
                </div>

                {/* 저장하기 버튼 */}
                <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={isSubmitting || !nickname.trim()}
                    aria-label="프로필 저장"
                >
                    {isSubmitting ? '저장 중...' : '저장하기'}
                </button>
            </form>
        </div>
    );
}

export default Profile;
