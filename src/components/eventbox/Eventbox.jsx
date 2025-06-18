import React from 'react';
import styles from './Eventbox.module.css';
import giftImg from './giftImg.png';
import calendarImg from './calendarImg.png';
import viewImg from './viewImg.png';
import presentImg from './presentImg.png';

/**
 * Eventbox 컴포넌트
 * @param {object} props
 * @param {string} props.eventImg - 이벤트 이미지 URL (없으면 기본 giftImg)
 * @param {string} props.eventName - 이벤트 이름
 * @param {string} props.eventDate - 이벤트 날짜 (YYYY-MM-DD)
 * @param {number} props.eventView - 조회수
 * @param {number} props.eventPresent - 등록된 선물 수 (기본값)
 * @param {number} [props.receivedGiftCount] - 실제 받은 선물 수 (있으면 이를 표시)
 * @param {boolean} [props.isOwner] - 현재 사용자가 등록자인지 여부 (true: 등록자)
 * @param {function} [props.onDelete] - 삭제 버튼 클릭 핸들러
 */
const Eventbox = ({
    eventImg,
    eventName,
    eventDate,
    eventView,
    eventPresent,
    receivedGiftCount,
    isOwner,
    onDelete,
}) => {
    return (
        <div className={styles.container}>
            {/* 삭제 버튼: 삭제 핸들러가 있으면 표시 */}
            {onDelete && (
                <button className={styles.deleteButton} onClick={onDelete}>
                    삭제
                </button>
            )}

            {/* 이벤트 대표 이미지: eventImg가 제공되면 사용, 아니면 기본 이미지 */}
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
                        {/* 등록자라면 조회수를, 아니면 "비공개" 표시 */}
                        <span>{isOwner ? eventView : '비공개'}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <img src={presentImg} alt="present" />
                        {/* receivedGiftCount가 있다면 그 값을, 없으면 eventPresent */}
                        <span>{typeof receivedGiftCount === 'number' ? receivedGiftCount : eventPresent}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Eventbox;
