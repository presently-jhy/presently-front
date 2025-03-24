import styles from './Eventbox.module.css';
import giftImg from './giftImg.png';
import calendarImg from './calendarImg.png';
import viewImg from './viewImg.png';
import presentImg from './presentImg.png';

const Eventbox = ({ eventImg, eventName, eventDate, eventView, eventPresent }) => {
    return (
        <div className={styles.container}>
            {/* 이벤트 대표 이미지: eventImg가 있으면 그것을, 없으면 giftImg 사용 */}
            <div className={styles.giftImgDiv}>
                <img src={eventImg || giftImg} alt="event preview" />
            </div>

            {/* 이벤트 텍스트 영역 */}
            <div className={styles.eventTextDiv}>
                {/* 이벤트 타이틀 */}
                <div className={styles.eventTitle}>{eventName}</div>

                {/* 날짜/조회수/선물수 컨테이너 */}
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
