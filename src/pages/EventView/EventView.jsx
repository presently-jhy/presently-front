import { useState } from "react";
import Header from "../../components/Header/Header";
import styles from "./EventView.module.css";
import shareIcon from "./shareIcon.svg";

import birthdayCake from "./birthdayCake.png";
import ferrariImg from "./ferrari.png";
import appleWatchImg from "./appleWatch.png";

import GiftItem from "../../components/GiftItem/GiftItem";
import GiftPreview from "../../components/GiftPreview/GiftPreview";

function EventView() {
  const [mainTab, setMainTab] = useState("gift");
  const [giftTab, setGiftTab] = useState("want");
  const [selectedGift, setSelectedGift] = useState(null);

  const giftData = {
    want: [
      {
        id: 1,
        type: "펀딩",
        title: "이번 생일엔 페레로로쉐 대신 페라리",
        description: "진짜 드림카라서 매번 저축 중이니 많은 참여 부탁드...",
        image: ferrariImg,
        percent: "13%",
        price: 148200,
      },
      {
        id: 2,
        type: "펀딩",
        title: "애플워치 프로",
        description: "이전에 쓰던 애플워치가 망가져버렸다...",
        image: appleWatchImg,
        percent: "40%",
        price: 325000,
      },
    ],
    notwant: [
      {
        id: 3,
        type: "펀드", // '펀드'도 동일하게 펀딩 처리
        title: "차량용 방향제는 별로...",
        description: "차량용 방향제보단 다른 게 더 좋아요",
        image: ferrariImg,
        percent: "50%",
      },
    ],
    received: [
      {
        id: 4,
        type: "선물",
        title: "이미 받아버린 선물",
        description: "이미 받았기 때문에 새로는 필요 없을 것 같아요",
        image: appleWatchImg,
      },
    ],
  };

  const currentGiftList = giftData[giftTab] || [];

  return (
    <div className={styles.container}>
      <Header title="이벤트 보기" subTitle="eventView test" rightButton={shareIcon} />

      {/* 이벤트 정보 영역 */}
      <div className={styles.eventInfo}>
        <img src={birthdayCake} alt="Birthday Cake" className={styles.eventImage} />
        <div className={styles.eventTextBox}>
          <div className={styles.hostName}>이준형</div>
          <div className={styles.eventDate}>25.03.21</div>
          <div className={styles.eventTitle}>즐거운 나의 생일</div>
          <div className={styles.eventDescription}>
            생일 파티는 3월 7일에 모임사람 캡톡 ㅋㅋ <br />
            이번에 차 사서 차랑 차랑 용품이 필요합니다 😆
          </div>
        </div>
        <button className={styles.addButton}>+</button>
      </div>

      {/* 메인 탭 (선물 / 이벤트기록) */}
      <div className={styles.tabMenu}>
        <div
          className={mainTab === "gift" ? `${styles.tab} ${styles.activeTab}` : styles.tab}
          onClick={() => setMainTab("gift")}
        >
          선물
        </div>
        <div className={`${styles.tab} ${styles.disabledTab}`}>이벤트 기록</div>
      </div>

      {/* 선물 탭 선택 시에만 하위 탭 */}
      {mainTab === "gift" && (
        <>
          <div className={styles.subTabMenu}>
            <div
              className={giftTab === "want" ? `${styles.subTab} ${styles.activeSubTab}` : styles.subTab}
              onClick={() => setGiftTab("want")}
            >
              받고 싶은
            </div>
            <div
              className={giftTab === "notwant" ? `${styles.subTab} ${styles.activeSubTab}` : styles.subTab}
              onClick={() => setGiftTab("notwant")}
            >
              받고 싶지 않은
            </div>
            <div
              className={giftTab === "received" ? `${styles.subTab} ${styles.activeSubTab}` : styles.subTab}
              onClick={() => setGiftTab("received")}
            >
              받은
            </div>
          </div>

          {/* 선물 목록 */}
          <div className={styles.itemList}>
            {currentGiftList.map((item) => (
              <GiftItem
                key={item.id}
                type={item.type}
                title={item.title}
                description={item.description}
                image={item.image}
                percent={item.percent}
                onClick={() => setSelectedGift(item)}
              />
            ))}
          </div>
        </>
      )}

      {/* 미리보기 모달 */}
      {selectedGift && <GiftPreview gift={selectedGift} onClose={() => setSelectedGift(null)} />}
    </div>
  );
}

export default EventView;
