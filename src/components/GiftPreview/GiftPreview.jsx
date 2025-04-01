import React, { useState, useEffect } from "react";
import styles from "./GiftPreview.module.css";

/*
  props.gift: {
    type: "펀딩"/"펀드"/"선물",
    title: "애플워치 프로",
    description: "원하는 설명",
    image: "이미지 경로",
    percent: "40%",  // 펀딩률
    price: 123000
  }
  props.onClose: () => {} // 모달 닫기 함수
*/
function GiftPreview({ gift, onClose }) {
  if (!gift) return null;

  const { type, title, description, image, percent, price } = gift;

  // 펀딩 여부
  const isFund = type === "펀딩" || type === "펀드";

  // 퍼센트 숫자 (예: "40%" → 40)
  let targetValue = 0;
  if (percent) {
    const num = parseInt(percent.replace("%", ""), 10);
    targetValue = isNaN(num) ? 0 : Math.min(num, 100);
  }

  // 원형 차트가 서서히 채워지게 하는 애니메이션용 state
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (isFund) {
      // 펀딩이면 0 → targetValue 로 애니메이션
      let start = 0;
      const duration = 700; // 전체 0.7초
      const startTime = performance.now();

      function animate(now) {
        const elapsed = now - startTime;
        let progress = elapsed / duration;
        if (progress > 1) progress = 1;

        // 0 ~ targetValue 사이 선형 보간
        const current = start + (targetValue - start) * progress;
        setAnimatedValue(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      }
      requestAnimationFrame(animate);
    } else {
      // 선물이면 0으로
      setAnimatedValue(0);
    }
  }, [isFund, targetValue]);

  // 원형 차트에 적용할 각도
  const angle = animatedValue * 3.6; // 1% -> 3.6도

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* 닫기 버튼 (오른쪽 상단 X) */}
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        {/* 이미지 + 원형 차트 (펀딩이면 배경 conic-gradient, 선물이면 배경 없음) */}
        <div className={styles.imageCircleWrap}>
          <div
            className={styles.progressCircle}
            style={
              isFund
                ? {
                    background: `conic-gradient(#a874ff ${angle}deg, #ededed 0deg)`,
                  }
                : { background: "#ededed" }
            }
          >
            <img src={image} alt={title} className={styles.previewImage} />
          </div>
          {/* 퍼센트 텍스트 (펀딩이면 표시) */}
          {isFund && <div className={styles.progressText}>{Math.round(animatedValue)}%</div>}
        </div>

        {/* 제목 + 가격 */}
        <div className={styles.titleRow}>
          <span className={styles.giftTitle}>{title}</span>
          {price && <span className={styles.giftPrice}>{price}원</span>}
        </div>

        {/* 설명 */}
        <p className={styles.giftDescription}>{description}</p>

        {/* 버튼들 */}
        <button className={styles.detailButton}>선물 상세보기</button>
        <button className={styles.actionButton}>선물하기</button>
      </div>
    </div>
  );
}

export default GiftPreview;
