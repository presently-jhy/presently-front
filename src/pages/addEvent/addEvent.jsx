import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import styles from './addEvent.module.css';
import anniversaryIcon from './anniversaryIcon.png';
import birthdayIcon from './birthdayIcon.png';
import etcIcon from './etcIcon.png';
import { Breadcrumb } from '../../components';

const AddEvent = () => {
    const navigate = useNavigate();

    const handleBack = () => navigate(-1);

    return (
        <div className={styles.container}>
            <Breadcrumb
                paths={[{ label: '홈', to: '/' }, { label: '대시보드', to: '/dashboard' }, { label: '이벤트 추가' }]}
            />
            <header className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    <ArrowLeft size={24} />
                </button>
                <h2 className={styles.title}>이벤트 추가</h2>
            </header>
            <div className={styles.content}>
                <p className={styles.subtitle}>
                    <span className={styles.subtitleGray}>함께 기록하고 나누고 싶은</span>
                    <br />
                    <span className={styles.subtitleBlack}>이벤트 유형을 선택하세요</span>
                </p>
                <div className={styles.eventContainer}>
                    <div className={styles.eventOption}>
                        <Link to="/addEventLog" state={{ eventType: 'anniversary' }} className={styles.eventTypeButton}>
                            <img src={anniversaryIcon} alt="기념일" />
                            <span>기념일</span>
                        </Link>
                    </div>
                    <div className={styles.eventOption}>
                        <Link to="/addEventLog" state={{ eventType: 'birthday' }} className={styles.eventTypeButton}>
                            <img src={birthdayIcon} alt="생일" />
                            <span>생일</span>
                        </Link>
                    </div>
                    <div className={styles.eventOption}>
                        <Link to="/addEventLog" state={{ eventType: 'other' }} className={styles.eventTypeButton}>
                            <img src={etcIcon} alt="기타" />
                            <span>기타</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEvent;
