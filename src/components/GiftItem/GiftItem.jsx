import React from "react";
import styles from "./GiftItem.module.css";

/*
  props 예시:
    {
      type: "펀딩"/"펀드" or "선물",
      title: "애플워치 프로",
      description: "짧은 설명",
      image: "이미지 경로",
      percent: "40%", // 펀딩률. 없으면 표시 안 함
      onClick: () => {} // 아이템 클릭 시 실행(모달 열기 등)
    }
*/
function GiftItem({ type, title, description, image, percent, onClick }) {
  // '펀딩'/'펀드' => 보라색 / '선물' => 분홍색
  const isFund = type === "펀딩" || type === "펀드";
  const isGift = type === "선물";

  return (
    <div className={styles.giftItemContainer} onClick={onClick}>
      {/* 왼쪽 60×60 이미지 */}
      <img src={image} alt={title} className={styles.giftImage} />

      {/* 오른쪽 텍스트 */}
      <div className={styles.textWrap}>
        <div className={styles.topLine}>
          {/* 라벨 */}
          <span className={`${styles.typeBadge} ${isFund ? styles.fundBadge : isGift ? styles.giftBadge : ""}`}>
            {type}
          </span>

          {/* 제목 */}
          <span className={styles.itemTitle}>{title}</span>

          {/* 퍼센트(펀딩률) */}
          {percent && <span className={styles.fundingPercent}>{percent}</span>}
        </div>

        {/* 둘째 줄: 설명 (길면 말줄임표 처리) */}
        <p className={styles.itemDescription}>{description}</p>
      </div>
    </div>
  );
}

export default GiftItem;
