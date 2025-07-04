import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

import gift from './gift2.png';
import googleLoginImg from './google-icon.png';
import kakaoLoginImg from './kakao-icon.png';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

function Home() {
    const [isLoginStarted, setIsLoginStarted] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    // 이미 로그인된 유저라면 바로 대시보드로 리디렉트
    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleLoginCheck = () => {
        setIsLoginStarted(true);
    };

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
        if (error) console.error('Google 로그인 실패:', error.message);
    };

    const handleKakaoLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'kakao',
        });
        if (error) console.error('Kakao 로그인 실패:', error.message);
    };

    return (
        <div className={styles.homeContainer}>
            <div className={styles.logoText}>presently</div>
            <div className={styles.subText}>선물. 기념일. 더 완벽하게.</div>
            <div className={styles.giftDiv}>
                <img src={gift} alt="gift" className={styles.giftImg} />
            </div>
            {isLoginStarted ? (
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
