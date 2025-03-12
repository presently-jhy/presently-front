import { Link } from 'react-router-dom';
import gift from './gift.png'; // 경로 수정 (보통 assets 폴더 사용)
import styles from './Home.module.css'; // CSS 파일 import

function Home() {
    return (
        <div className={styles.container}>
            {/* 브랜드 이름 */}
            <h1 className={styles.title}>presently</h1>

            {/* 설명 */}
            <p className={styles.description}>선물. 기념일. 더 완벽하게.</p>

            {/* 선물 이미지 */}
            <img src={gift} alt="Gift" className={styles.giftImage} />

            {/* 버튼 */}
            <Link to="/login" className={styles.button}>
                선물 받으러 가기
            </Link>
        </div>
    );
}

export default Home;
