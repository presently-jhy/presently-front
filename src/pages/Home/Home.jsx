// import { Link } from "react-router-dom";
import { useState } from "react";
import styles from "./Home.module.css";

import gift from "./gift.png";
import googleLoginImg from "./google-icon.png";
import kakaoLoginImg from "./kakao-icon.png";

function Home() {
  const [isLogin, setIsLogin] = useState(false);

  const handleLoginCheck = () => {
    //눌리면 로그인 여부를 확인하는 로직 실행

    //만약 로그인이 안됐으면(isLogin=False) 새로 loginDiv를 렌더링
    setIsLogin(true);
  };
  return (
    <>
      <div className={styles.homecontainer}>
        <div className={styles.logoText}>presently</div>
        <div className={styles.subText}>선물. 기념일. 더 완벽하게.</div>
        <div className={styles.giftDiv}>
          <img src={gift} alt="gift" className={styles.giftImg} />
        </div>
        {isLogin ? (
          <div>
            <div>
              <div className={styles.googleLoginDv}>
                <img src={googleLoginImg} alt="googleLoginImg" className={styles.googleLoginImg} />
              </div>
              <div className={styles.kakaoLoginDiv}>
                <img src={kakaoLoginImg} alt="kakaoLoginImg" className={styles.kakaoLoginImg} />
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
    </>
  );
}

export default Home;
