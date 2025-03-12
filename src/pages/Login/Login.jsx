import { Link } from 'react-router-dom';
import gift from './gift.png';
import kakao from './kakao-icon.png';
import google from './google-icon.png';
import styles from './Login.module.css'; // CSS 파일 import

function Login() {
    // 로그인 버튼 클릭 핸들러 (구현 가능)
    const handleGoogleLogin = () => {
        console.log('Google 로그인 시도!');
        // 실제 Google 로그인 로직 연결
    };

    const handleKakaoLogin = () => {
        console.log('Kakao 로그인 시도!');
        // 실제 Kakao 로그인 로직 연결
    };

    return (
        <div className={styles.container}>
            {/* 로고 */}
            <h1 className={styles.title}>presently</h1>

            {/* 설명 */}
            <p className={styles.description}>선물. 기념일. 더 완벽하게.</p>

            {/* 선물 아이콘 */}
            <img src={gift} alt="Gift" className={styles.giftImage} />

            {/* Google 로그인 이미지 (버튼 역할) */}
            <img
                src={google}
                alt="Google Login"
                className={`${styles.icon} ${styles.clickable}`}
                onClick={handleGoogleLogin}
            />

            {/* Kakao 로그인 이미지 (버튼 역할) */}
            <img
                src={kakao}
                alt="Kakao Login"
                className={`${styles.icon} ${styles.clickable}`}
                onClick={handleKakaoLogin}
            />

            {/* 이용약관 안내 */}
            <p className={styles.terms}>
                시작할 경우, 프레젠틀리의 서비스 이용약관과 <br /> 개인정보 보호정책에 동의하게 됩니다.
            </p>
        </div>
    );
}

export default Login;
