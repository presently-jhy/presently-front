import styles from './Eventbox.module.css';
import giftImg from './giftImg.png';
import calendarImg from './calendarImg.png';
import viewImg from './viewImg.png';
import presentImg from './presentImg.png';

const Eventbox = ({ eventImg, eventName, eventDate, eventView, eventPresent, onDelete }) => {
    return (
        <div className={styles.container}>
            {/* 삭제 버튼: onDelete prop이 있으면 표시 */}
            {onDelete && (
                <button className={styles.deleteButton} onClick={onDelete}>
                    삭제
                </button>
            )}

            {/* 이벤트 대표 이미지: eventImg가 있으면 사용, 없으면 기본 이미지 */}
            <div className={styles.giftImgDiv}>
                <img src={eventImg || giftImg} alt="event preview" />
            </div>

            {/* 이벤트 텍스트 영역 */}
            <div className={styles.eventTextDiv}>
                <div className={styles.eventTitle}>{eventName}</div>
                <div className={styles.infoContainer}>
                    <div className={styles.infoItem}>
                        <img src={calendarImg} alt="calendar" />
                        <span>{eventDate}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <img src={viewImg} alt="view" />
                        <span>{eventView}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <img src={presentImg} alt="present" />
                        <span>{eventPresent}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Eventbox;
