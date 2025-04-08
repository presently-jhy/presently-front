import React, { useState, useEffect } from 'react';
import styles from './GiftPreview.module.css';

/*
  props.gift: {
    type: "펀딩"/"펀드"/"선물",
    title: "애플워치 프로",
    description: "원하는 설명",
    imageUrl: "이미지 경로",  // GiftEnroll에서 저장한 키와 일치하도록 imageUrl 사용
    percent: "40%",  // 펀딩률
    price: 123000
  }
  props.onClose: () => {} // 모달 닫기 함수
  props.onGiftAction: () => {} // 선물하기 버튼 클릭 시 실행 (선물 주는 사람 모드)
*/
function GiftPreview({ gift, onClose, onGiftAction }) {
    if (!gift) return null;

    const { type, title, description, imageUrl, percent, price } = gift;
    const isFund = type === '펀딩' || type === '펀드';

    let targetValue = 0;
    if (percent) {
        const num = parseInt(percent.replace('%', ''), 10);
        targetValue = isNaN(num) ? 0 : Math.min(num, 100);
    }

    const [animatedValue, setAnimatedValue] = useState(0);
    const [showDetail, setShowDetail] = useState(false); // 상세 설명 표시 여부

    useEffect(() => {
        if (isFund) {
            let start = 0;
            const duration = 700;
            const startTime = performance.now();

            function animate(now) {
                const elapsed = now - startTime;
                let progress = elapsed / duration;
                if (progress > 1) progress = 1;
                const current = start + (targetValue - start) * progress;
                setAnimatedValue(current);
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            }
            requestAnimationFrame(animate);
        } else {
            setAnimatedValue(0);
        }
    }, [isFund, targetValue]);

    const angle = animatedValue * 3.6;

    // 토글 버튼 클릭 시 상세 설명 표시 여부 전환
    const toggleDetail = () => {
        setShowDetail((prev) => !prev);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
                <div className={styles.imageCircleWrap}>
                    <div
                        className={styles.progressCircle}
                        style={
                            isFund
                                ? {
                                      background: `conic-gradient(#a874ff ${angle}deg, #ededed 0deg)`,
                                  }
                                : { background: '#ededed' }
                        }
                    >
                        <img src={imageUrl} alt={title} className={styles.previewImage} />
                    </div>
                    {isFund && <div className={styles.progressText}>{Math.round(animatedValue)}%</div>}
                </div>
                <div className={styles.titleRow}>
                    <span className={styles.giftTitle}>{title}</span>
                    {price && <span className={styles.giftPrice}>{price}원</span>}
                </div>
                {/* 상세보기 토글 버튼 */}
                <button className={styles.detailButton} onClick={toggleDetail}>
                    {showDetail ? '상세 정보 숨기기' : '선물 상세보기'}
                </button>
                {/* 상세 설명은 토글 상태에 따라 표시 */}
                {showDetail && <p className={styles.giftDescription}>{description}</p>}
                {onGiftAction && (
                    <button className={styles.actionButton} onClick={onGiftAction}>
                        선물하기
                    </button>
                )}
            </div>
        </div>
    );
}

export default GiftPreview;
