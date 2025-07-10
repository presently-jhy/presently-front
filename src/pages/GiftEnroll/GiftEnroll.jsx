import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./GiftEnroll.module.css";
import arrowIcon from "./arrowIcon.png";
import fundExampleImg from "./fundExample.png";
import giftExampleImg from "./giftExample.png";
import cameraIcon from "./cameraIcon.png";
import AmountDial from "../../components/AmountDial/AmountDial";
import { ENDPOINTS } from "../../api/config";
import { useAuth } from "../../context/AuthContext";

export default function GiftEnroll() {
  const navigate = useNavigate();
  const location = useLocation();
  const eventData = location.state;
  const { accessToken } = useAuth();

  // 타입(gift|fund) & 수신 상태(want|unwant|done)
  const [selectedType, setSelectedType] = useState("gift");
  const [receiveStatus, setReceiveStatus] = useState("want");

  useEffect(() => {
    if (eventData?.eventType) {
      setSelectedType(eventData.eventType);
    }
  }, [eventData?.eventType]);

  // 폼 state
  const [imageFile, setImageFile] = useState(null);
  const [giftName, setGiftName] = useState("");
  const [giftDescription, setGiftDescription] = useState("");
  const [giftAmount, setGiftAmount] = useState("0");
  const [giftLink, setGiftLink] = useState("");

  const namePlaceholder = selectedType === "gift" ? "선물 이름 (필수)" : "펀드 이름 (필수)";
  const descriptionPlaceholder = selectedType === "gift" ? "선물 설명" : "펀드 설명";

  // 뒤로가기
  const handleBack = () => navigate(-1);

  // 타입 탭 클릭 (receiveStatus는 건드리지 않음)
  const handleSelectFund = () => setSelectedType("fund");
  const handleSelectGift = () => setSelectedType("gift");

  // 수신 상태 변경
  const handleSelectWant = () => {
    setReceiveStatus("want");
    console.log("set to want");
  };
  const handleSelectUnwant = () => {
    setReceiveStatus("unwant");
    console.log("set to unwant");
  };
  const handleSelectDone = () => {
    setReceiveStatus("done");
    console.log("set to done");
  };

  // 이미지 업로드
  const handleImageChange = (e) => {
    if (!e.target.files?.[0]) return;
    const reader = new FileReader();
    reader.onloadend = () => setImageFile(reader.result);
    reader.readAsDataURL(e.target.files[0]);
  };
  const getExampleImage = () => (selectedType === "fund" ? fundExampleImg : giftExampleImg);
  const previewImage = imageFile || getExampleImage();

  const receiveStatusRef = useRef(receiveStatus);

  useEffect(() => {
    receiveStatusRef.current = receiveStatus;
  }, [receiveStatus]);

  // 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit receiveStatus:", receiveStatusRef.current);
    if (!giftName.trim()) {
      alert(`${selectedType === "gift" ? "선물" : "펀드"} 이름은 필수입니다.`);
      return;
    }
    if (receiveStatus === "want") {
      const amt = parseFloat(giftAmount);
      if (!amt || isNaN(amt)) {
        alert(`${selectedType === "gift" ? "선물" : "펀드"} 금액을 정확히 입력해주세요.`);
        return;
      }
    }

    try {
      const amountValue = parseFloat(giftAmount) || 0;

      const giftData = {
        event_id: eventData?.id,
        type: selectedType.toUpperCase(),
        name: giftName.trim(),
        description: giftDescription.trim(),
        image_url: previewImage,
        receive_status: receiveStatusRef.current,
      };
      console.log("등록 giftData:", giftData);

      if (selectedType === "fund") {
        giftData.target_amount = amountValue;
      } else {
        giftData.price = amountValue;
      }

      const response = await fetch(ENDPOINTS.createGiftOption, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(giftData),
      });

      if (response.ok) {
        navigate(`/eventview/${eventData?.id}`);
      } else {
        const errorData = await response.json();
        alert(`선물 등록 실패: ${errorData.error || "알 수 없는 오류"}`);
      }
    } catch (error) {
      console.error("선물 등록 에러:", error);
      alert("선물 등록 중 오류가 발생했습니다.");
    }
  };

  // 디버깅용
  useEffect(() => {
    console.log("receiveStatus:", receiveStatus);
  }, [receiveStatus]);

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <img src={arrowIcon} alt="뒤로가기" />
        </button>
        <h2 className={styles.title}>{selectedType === "gift" ? "선물 등록" : "펀드 등록"}</h2>
      </header>

      {/* 이벤트명 */}
      <div className={styles.eventName}>{eventData?.eventName || "이벤트명"}</div>

      {/* 펀드/선물 탭 (want 모드에서만 활성) */}
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${selectedType === "fund" ? styles.activeTab : ""}`}
          onClick={handleSelectFund}
        >
          펀드
        </button>
        <button
          className={`${styles.tabButton} ${selectedType === "gift" ? styles.activeTab : ""}`}
          onClick={handleSelectGift}
        >
          선물
        </button>
      </div>

      {/* 받고 싶은 / 받기 싫은 / 받은 */}
      <div className={styles.receiveContainer}>
        <button
          className={`${styles.receiveButton} ${receiveStatus === "want" ? styles.receiveActive : ""}`}
          onClick={handleSelectWant}
        >
          받고 싶은
        </button>
        <button
          className={`${styles.receiveButton} ${receiveStatus === "unwant" ? styles.receiveActive : ""}`}
          onClick={handleSelectUnwant}
        >
          받기 싫은
        </button>
        <button
          className={`${styles.receiveButton} ${receiveStatus === "done" ? styles.receiveActive : ""}`}
          onClick={handleSelectDone}
        >
          받은
        </button>
      </div>

      {/* 이미지 업로드 */}
      <div className={styles.imageContainer}>
        <img src={previewImage} alt="예시" className={styles.exampleImage} />
        <label htmlFor="imageFile" className={styles.cameraLabel}>
          <img src={cameraIcon} alt="카메라" />
        </label>
        <input type="file" id="imageFile" accept="image/*" onChange={handleImageChange} className={styles.imageInput} />
      </div>

      {/* 입력 폼 */}
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* 이름 */}
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={giftName}
            onChange={(e) => setGiftName(e.target.value)}
            maxLength={30}
            placeholder={namePlaceholder}
            className={styles.textInput}
          />
          <span className={styles.charCount}>{giftName.length}/30</span>
        </div>

        {/* 설명 */}
        <div className={styles.inputGroup}>
          <textarea
            value={giftDescription}
            onChange={(e) => setGiftDescription(e.target.value)}
            maxLength={100}
            rows="2"
            placeholder={descriptionPlaceholder}
            className={styles.textArea}
          />
          <span className={styles.charCount}>{giftDescription.length}/100</span>
        </div>

        {/* 링크 (옵션) */}
        <div className={styles.inputGroup}>
          <input
            type="url"
            value={giftLink}
            onChange={(e) => setGiftLink(e.target.value)}
            placeholder="상품 URL (옵션)"
            className={styles.textInput}
          />
        </div>

        {/* 금액 다이얼 */}
        <div className={`${styles.amountDialWrapper} ${receiveStatus !== "want" ? styles.disabledDial : ""}`}>
          <AmountDial
            value={Number(giftAmount)}
            setValue={(v) => setGiftAmount(String(v))}
            maxValue={10000000}
            disabled={receiveStatus !== "want"}
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          완료하기
        </button>
      </form>
    </div>
  );
}
