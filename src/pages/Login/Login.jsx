import gift from './gift.png';
import kakao from './kakao-icon.png';
import google from './google-icon.png';
import styles from './Login.module.css';
import { supabase } from '../../lib/supabaseClient';

function Login() {
    // 실제 로그인 핸들러
    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            });
            if (error) {
                console.error('Google 로그인 실패:', error.message);
                alert('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('Google 로그인 중 예상치 못한 오류:', error);
            alert('인터넷 연결을 확인하고 다시 시도해주세요.');
        }
    };

    const handleKakaoLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'kakao',
            });
            if (error) {
                console.error('Kakao 로그인 실패:', error.message);
                alert('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('Kakao 로그인 중 예상치 못한 오류:', error);
            alert('인터넷 연결을 확인하고 다시 시도해주세요.');
        }
    };

    const handleImageError = (e) => {
        // 기본 이미지로 대체
        e.target.style.display = 'none';
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Welcome to Presently</h1>
                <p className={styles.description}>선물과 기념일을 더 특별하게 만들어보세요</p>
                <img
                    src={gift}
                    alt="선물 아이콘"
                    className={styles.giftImage}
                    loading="lazy"
                    onError={handleImageError}
                />
                <div className={styles.loginButtons}>
                    <button className={styles.icon} onClick={handleGoogleLogin} aria-label="구글로 로그인">
                        <img src={google} alt="구글 로그인" loading="lazy" onError={handleImageError} />
                    </button>
                    <button className={styles.icon} onClick={handleKakaoLogin} aria-label="카카오로 로그인">
                        <img src={kakao} alt="카카오 로그인" loading="lazy" onError={handleImageError} />
                    </button>
                </div>
                <p className={styles.terms}>로그인 시 서비스 이용약관과 개인정보 처리방침에 동의하게 됩니다.</p>
            </div>
        </div>
    );
}

export default Login;
