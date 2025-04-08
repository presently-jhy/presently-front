import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

import gift from './gift2.png';
import googleLoginImg from './google-icon.png';
import kakaoLoginImg from './kakao-icon.png';

function Home() {
    const [isLogin, setIsLogin] = useState(false);
    const navigate = useNavigate();

    const handleLoginCheck = () => {
        // 로그인 여부 확인 로직 실행
        // (실제 서비스라면 로그인 모달 또는 API 연동이 있을 수 있음)
        setIsLogin(true);
    };

    // 구글 로그인 버튼 클릭 시, 로그인 후 /dashboard로 이동
    const handleGoogleLogin = () => {
        // 실제 로그인 로직 추가 가능
        navigate('/dashboard');
    };

    // 카카오 로그인 버튼 클릭 시, 로그인 후 /dashboard로 이동
    const handleKakaoLogin = () => {
        // 실제 로그인 로직 추가 가능
        navigate('/dashboard');
    };

    return (
        <div className={styles.homecontainer}>
            <div className={styles.logoText}>presently</div>
            <div className={styles.subText}>선물. 기념일. 더 완벽하게.</div>
            <div className={styles.giftDiv}>
                <img src={gift} alt="gift" className={styles.giftImg} />
            </div>
            {isLogin ? (
                <div>
                    <div className={styles.loginButtonGroup}>
                        <div className={styles.googleLoginDiv} onClick={handleGoogleLogin}>
                            <img src={googleLoginImg} alt="구글 로그인" className={styles.googleLoginImg} />
                        </div>
                        <div className={styles.kakaoLoginDiv} onClick={handleKakaoLogin}>
                            <img src={kakaoLoginImg} alt="카카오 로그인" className={styles.kakaoLoginImg} />
                        </div>
                    </div>
                    <div className={styles.captionText}>
                        시작할 경우, 프레젠틀리의 서비스 이용약관과
                        <br />
                        개인정보 보호정책에 동의하게 됩니다.
                    </div>
                </div>
            ) : (
                <div className={styles.goButtonDiv} onClick={handleLoginCheck}>
                    <button className={styles.goButton}>선물 받으러가기</button>
                </div>
            )}
        </div>
    );
}

export default Home;
