// src/pages/FundSend/FundSend.jsx

import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import styles from "./FundSend.module.css";
import watchImg from "./watch.png";
import Spinner from "../../components/Spinner/Spinner";
import { ENDPOINTS } from "../../api/config";
import { useAuth } from "../../context/AuthContext";

const defaultEventData = {
  id: 0,
  eventTitle: "애플워치 울트라",
  eventName: "2025 나의 생일",
  eventDate: "2025-06-15",
  eventImg: watchImg,
  eventType: "gift",
  eventDescription: "행복한 추억",
  eventView: 0,
  eventPresent: 0,
  nickname: "",
  targetAmount: 1000000,
};

export default function FundSend() {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useAuth();

  const passed = location.state || {};
  const initialEventData = passed.eventData || passed || defaultEventData;
  const giftData = passed.gift || null;
  const isFundMode = giftData ? giftData.selectedType === "fund" : initialEventData.eventType === "fund";

  const [eventData] = useState(initialEventData);
  const [amount, setAmount] = useState("");
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  // 총액 계산
  const totalAmount = useMemo(() => {
    if (giftData) {
      return giftData.selectedType === "fund" ? giftData.targetAmount || 0 : giftData.price || 0;
    }
    return eventData.targetAmount || 0;
  }, [giftData, eventData]);

  // 닉네임 유효성 검사
  const validateNickname = (val) => {
    const v = val.trim();
    if (!v) {
      setNicknameError("닉네임을 입력해 주세요.");
    } else {
      setNicknameError("");
    }
  };

  // 금액 유효성 검사 및 표시
  const formattedAmount = useMemo(() => {
    if (!amount) return "";
    const num = Number(amount.replace(/[^ -9]/g, ""));
    return isNaN(num) ? "" : num.toLocaleString();
  }, [amount]);

  const handleAmountChange = (e) => {
    let num = Number(e.target.value.replace(/[^\d]/g, "")) || 0;
    if (totalAmount && num > totalAmount) {
      num = totalAmount;
      setAmountError(`최대 ${totalAmount.toLocaleString()}원 이하로 입력해 주세요.`);
    } else if (isFundMode && num > 0 && num < 1000) {
      setAmountError("1,000원 이상 입력해 주세요.");
    } else {
      setAmountError("");
    }
    setAmount(String(num));
  };

  const handleBack = () => navigate(-1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    validateNickname(nickname);
    if (!nickname.trim()) return;
    if (isFundMode) {
      if (!amount || Number(amount) < 1000) {
        setAmountError("1,000원 이상 입력해 주세요.");
        return;
      }
      if (totalAmount && Number(amount) > totalAmount) {
        setAmountError(`최대 ${totalAmount.toLocaleString()}원 이하로 입력해 주세요.`);
        return;
      }
    }
    if (nicknameError || amountError) return;
    setSubmitting(true);
    try {
      // 서버에 선물/펀드 요청 생성
      const requestData = {
        gift_option_id: giftData?.id,
        amount: isFundMode ? Number(amount) : undefined,
        message: message.trim(),
        nickname: nickname.trim(),
      };
      const response = await fetch(ENDPOINTS.createGiftRequest, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      if (response.ok) {
        navigate(`/eventview/${eventData?.id}`);
      } else {
        const errorData = await response.json();
        setApiError(`펀드 전송 실패: ${errorData.error || "알 수 없는 오류"}`);
      }
    } catch {
      setApiError("펀드 전송 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`${styles.container} ${isFundMode ? styles.fundMode : styles.giftMode}`}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <ArrowLeft size={24} />
        </button>
        <h2 className={styles.pageTitle}>{eventData.eventName}</h2>
      </header>
      <div className={styles.eventInfo}>
        <h4 className={styles.eventTitle}>{eventData.eventTitle}</h4>
        <p className={styles.eventDate}>{eventData.eventDate}</p>
      </div>
      <div className={styles.imageWrapper}>
        <img src={eventData.eventImg} alt="이벤트 이미지" className={styles.eventImg} />
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        {isFundMode && (
          <div className={styles.amountContainer}>
            <label htmlFor="amountInput" className={styles.amountLabel}>
              금액
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="amountInput"
                type="text"
                className={styles.amountInput}
                placeholder=""
                value={formattedAmount}
                onChange={handleAmountChange}
                inputMode="numeric"
              />
              <span className={styles.currency}>원</span>
            </div>
            {amountError && <div className={styles.fieldError}>{amountError}</div>}
            <div className={styles.hint}>최소 1,000원 이상, 최대 {totalAmount.toLocaleString() || "제한 없음"}원</div>
            {totalAmount > 0 && (
              <div className={styles.remaining}>남은 금액: {(totalAmount - Number(amount)).toLocaleString()}원</div>
            )}
          </div>
        )}
        <textarea
          className={styles.messageTextarea}
          placeholder="방명록 작성하기"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className={styles.nicknameContainer}>
          <input
            type="text"
            className={styles.nicknameInput}
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              validateNickname(e.target.value);
            }}
          />
          <span className={styles.nicknameSuffix}>이/가</span>
        </div>
        {nicknameError && <div className={styles.fieldError}>{nicknameError}</div>}
        {apiError && <div className={styles.errorMessage}>{apiError}</div>}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={submitting || nicknameError !== "" || amountError !== ""}
        >
          {submitting ? <Spinner /> : isFundMode ? "펀드 보내기" : "선물 보내기"}
        </button>
      </form>
    </div>
  );
}
