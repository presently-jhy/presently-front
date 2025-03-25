import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './AddEvent.module.css';
import arrowIcon from './arrowIcon.png';
import anniversaryIcon from './anniversaryIcon.png';
import birthdayIcon from './birthdayIcon.png';
import etcIcon from './etcIcon.png';

function AddEvent() {
    const navigate = useNavigate();

    // 뒤로 가기 버튼
    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className={styles.container}>
            {/* 상단 헤더 영역 */}
            <header className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    <img src={arrowIcon} alt="뒤로가기" />
                </button>
                <h2 className={styles.title}>이벤트 추가</h2>
            </header>

            {/* 메인 콘텐츠 영역 */}
            <div className={styles.content}>
                <p className={styles.subtitle}>
                    <span className={styles.subtitleGray}>함께 기록하고 나누고 싶은</span>
                    <br />
                    <span className={styles.subtitleBlack}>이벤트 유형을 선택하세요</span>
                </p>

                {/* 세 개의 이벤트 유형을 가로로 배치 */}
                <div className={styles.eventContainer}>
                    {/* 기념일 */}
                    <div className={styles.eventOption}>
                        <Link to="/addEventLog" state={{ eventType: 'anniversary' }} className={styles.eventTypeButton}>
                            <img src={anniversaryIcon} alt="기념일" />
                            <span>기념일</span>
                        </Link>
                    </div>

                    {/* 생일 */}
                    <div className={styles.eventOption}>
                        <Link to="/addEventLog" state={{ eventType: 'birthday' }} className={styles.eventTypeButton}>
                            <img src={birthdayIcon} alt="생일" />
                            <span>생일</span>
                        </Link>
                    </div>

                    {/* 기타 */}
                    <div className={styles.eventOption}>
                        <Link to="/addEventLog" state={{ eventType: 'etc' }} className={styles.eventTypeButton}>
                            <img src={etcIcon} alt="기타" />
                            <span>기타</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddEvent;
