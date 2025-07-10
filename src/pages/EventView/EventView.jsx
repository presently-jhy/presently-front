// src/pages/EventView/EventView.jsx

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Share2 } from "lucide-react";
import Header from "../../components/Header/Header";
import GiftItem from "../../components/GiftItem/GiftItem";
import GiftPreview from "../../components/GiftPreview/GiftPreview";
import InviteFriends from "../../components/InviteFriends/InviteFriends";
import { useAuth } from "../../context/AuthContext";
import styles from "./EventView.module.css";
import defaultEventImg from "./defaultEventImg.png";
import editButtonImg from "./editButton.png";
import SkeletonCard from "../../components/SkeletonCard/SkeletonCard";
import Spinner from "../../components/Spinner/Spinner";
import { ENDPOINTS } from "../../api/config";
import GiftFeedback from "../../components/GiftFeedback/GiftFeedback";

const giftItemVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05, transition: { duration: 0.5 } },
};

// 서버 데이터 매핑 함수
function mapEventData(raw) {
  return {
    ...raw,
    eventName: raw.title,
    eventDescription: raw.description,
    eventDate: raw.event_datetime ? raw.event_datetime.split("T")[0] : "",
    eventImg: raw.image_url,
    creatorId: raw.creator_id,
    gift_options: raw.gift_options ? raw.gift_options.map(mapGift) : [],
  };
}
function mapGift(g) {
  return {
    ...g,
    giftName: g.name,
    giftDescription: g.description,
    imageUrl: g.image_url,
    selectedType: g.type?.toLowerCase(),
    receiveStatus: g.receive_status,
    acceptedFeedbacks: g.acceptedFeedbacks || [],
    feedbacks: g.feedbacks || [],
  };
}

export default function EventView() {
  const { user, checking, accessToken } = useAuth();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [userMode, setUserMode] = useState("giver");
  const [gifts, setGifts] = useState([]);
  const [mainTab, setMainTab] = useState("gift");
  const [giftTab, setGiftTab] = useState("want");
  const [selectedGift, setSelectedGift] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. 서버에서 이벤트 상세 정보 fetch (accessToken 필요 X)
  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    const headers = {};
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
    fetch(`${ENDPOINTS.getUserEventDetail}?id=${eventId}`, { headers })
      .then((res) => res.json())
      .then((raw) => {
        const mapped = mapEventData(raw);
        setEventData(mapped);
        setGifts(mapped.gift_options || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [eventId, accessToken]);

  // 2. 로그인 및 owner 판별
  useEffect(() => {
    if (!checking && user && eventData) {
      setUserMode(user.id === (eventData.creatorId || eventData.creator_id) ? "owner" : "giver");
    }
  }, [user, checking, eventData]);

  // 탭별 필터
  const currentList = gifts.filter((g) => {
    if (giftTab === "want") return g.receiveStatus === "want";
    if (giftTab === "notwant") return g.receiveStatus === "unwant";
    if (giftTab === "received") return g.receiveStatus === "done";
    return false;
  });

  // 로그인 필요시 이동하는 헬퍼
  const requireLogin = useCallback(() => {
    if (!user) {
      if (window.confirm("로그인이 필요합니다. 로그인 하시겠습니까?")) {
        navigate("/login", { state: { from: `/eventview/${eventId}` } });
      }
      return true;
    }
    return false;
  }, [user, navigate, eventId]);

  // 핸들러 (모든 useCallback은 여기서 선언)
  const handleAdd = useCallback(() => {
    if (requireLogin()) return;
    navigate("/giftenroll", { state: eventData });
  }, [navigate, eventData, requireLogin]);

  const handleEdit = useCallback(() => {
    if (requireLogin()) return;
    navigate("/addEventLog", { state: { ...eventData, mode: "edit" } });
  }, [navigate, eventData, requireLogin]);

  const handleDeleteGift = useCallback(
    async (giftId, e) => {
      e.stopPropagation();
      if (!window.confirm("정말 이 선물을 삭제하시겠습니까?")) return;
      try {
        const response = await fetch(ENDPOINTS.deleteGiftOption, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ gift_option_id: giftId }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          alert(`삭제 실패: ${errorData.error || "알 수 없는 오류"}`);
          return;
        }
        // 삭제 성공 시, 이벤트 상세 정보 다시 fetch
        const headers = {};
        if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
        const res = await fetch(`${ENDPOINTS.getUserEventDetail}?id=${eventId}`, { headers });
        const raw = await res.json();
        const mapped = mapEventData(raw);
        setEventData(mapped);
        setGifts(mapped.gift_options || []);
        if (selectedGift?.id === giftId) setSelectedGift(null);
      } catch {
        alert("삭제 중 오류가 발생했습니다.");
      }
    },
    [eventId, accessToken, selectedGift]
  );

  // 피드백 관련 핸들러 (서버 기반이면 필요시 구현)
  const handleAcceptFeedback = useCallback(() => {}, []);
  const handleRejectFeedback = useCallback(() => {}, []);
  const handleGiftAction = useCallback(() => {}, []);

  // Preview props
  const previewFeedbacks = selectedGift
    ? giftTab === "received"
      ? selectedGift.acceptedFeedbacks
      : selectedGift.feedbacks
    : [];
  const previewOnAccept = giftTab !== "received" ? handleAcceptFeedback : undefined;
  const previewOnReject = giftTab !== "received" ? handleRejectFeedback : undefined;
  const previewOnGiftAction = userMode === "giver" && giftTab === "want" ? handleGiftAction : undefined;

  return (
    <div className={styles.container}>
      <Header
        title="이벤트 보기"
        subTitle="상세 정보"
        rightButton={
          loading ? (
            <Spinner size={20} />
          ) : eventData && eventData.id ? (
            <button className={styles.shareButton} onClick={() => setShowInviteModal(true)} title="친구 초대하기">
              <Share2 size={20} />
            </button>
          ) : null
        }
      />

      {/* 이벤트 정보 */}
      <div className={styles.eventInfo}>
        <img src={eventData?.eventImg || defaultEventImg} alt="이벤트" className={styles.eventImage} />
        <div className={styles.eventTextBox}>
          <div className={styles.hostName}>{eventData?.hostName || "주최자"}</div>
          <div className={styles.eventDate}>{eventData?.eventDate || "날짜 정보 없음"}</div>
          <div className={styles.eventTitle}>{eventData?.eventName || "이벤트 제목"}</div>
          <div className={styles.eventDescription}>
            {eventData?.eventDescription || "이벤트 설명이 여기에 표시됩니다."}
          </div>
        </div>
        {userMode === "owner" && (
          <div className={styles.buttonGroup}>
            <button className={styles.addButton} onClick={handleAdd} disabled={loading}>
              {loading ? <Spinner size={16} /> : "＋"}
            </button>
            <button className={styles.editButton} onClick={handleEdit} disabled={loading}>
              {loading ? <Spinner size={16} /> : <img src={editButtonImg} alt="이벤트 수정" />}
            </button>
          </div>
        )}
      </div>

      {/* 메인 탭 */}
      <div className={styles.tabMenu}>
        {["gift", "record"].map((tab) => (
          <div
            key={tab}
            className={`${styles.tab} ${mainTab === tab ? styles.activeTab : ""}`}
            onClick={() => {
              if (loading) return;
              setMainTab(tab);
              setSelectedGift(null);
            }}
          >
            {tab === "gift" ? "선물" : "이벤트 기록"}
          </div>
        ))}
      </div>

      {mainTab === "gift" ? (
        <>
          <div className={styles.subTabMenu}>
            {["want", "notwant", "received"].map((t) => (
              <div
                key={t}
                className={`${styles.subTab} ${giftTab === t ? styles.activeSubTab : ""}`}
                onClick={() => {
                  setGiftTab(t);
                  setSelectedGift(null);
                }}
              >
                {t === "want" ? "받고 싶은" : t === "notwant" ? "받기 싫은" : "받은"}
              </div>
            ))}
          </div>

          <div className={styles.itemList}>
            <AnimatePresence>
              {loading ? (
                <SkeletonCard count={3} />
              ) : currentList.length > 0 ? (
                currentList.map((item) => (
                  <motion.div
                    key={item.id}
                    className={styles.giftItemWrapper}
                    variants={giftItemVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <GiftItem
                      type={item.selectedType === "fund" ? "펀딩" : "선물"}
                      title={item.giftName}
                      description={item.giftDescription}
                      image={item.imageUrl}
                      percent={item.selectedType === "fund" ? item.percent : null}
                      feedbackCount={giftTab === "received" ? item.acceptedFeedbacks?.length : 0}
                      onClick={() => {
                        if (requireLogin()) return;
                        setSelectedGift(item);
                      }}
                      onDelete={
                        userMode === "owner" && giftTab !== "received" ? (e) => handleDeleteGift(item.id, e) : undefined
                      }
                    />
                    {/* 받은 탭에서 GiftFeedback 리스트 표시 */}
                    {giftTab === "received" && item.acceptedFeedbacks?.length > 0 && (
                      <details className={styles.feedbackFolder}>
                        <summary>피드백 {item.acceptedFeedbacks.length}개 보기</summary>
                        <div className={styles.feedbackHistory}>
                          {item.acceptedFeedbacks.map((fb) => (
                            <GiftFeedback key={fb.id} feedback={fb} type="received" />
                          ))}
                        </div>
                      </details>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.icon}>🎁</div>
                  <div className={styles.text}>
                    아직 등록된 선물이 없어요.
                    <br />⊕ 버튼으로 추가해 보세요!
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </>
      ) : (
        <div className={`${styles.recordArea} ${styles.emptyState}`}>
          <div className={styles.icon}>📝</div>
          <div className={styles.text}>
            아직 남긴 기록이 없어요.
            <br />
            이벤트를 즐기고 기록해 보세요!
          </div>
        </div>
      )}

      {selectedGift && (
        <GiftPreview
          gift={selectedGift}
          feedbacks={previewFeedbacks}
          feedbackType={giftTab === "received" ? "received" : "pending"}
          onAccept={previewOnAccept}
          onReject={previewOnReject}
          onClose={() => setSelectedGift(null)}
          onGiftAction={
            user
              ? previewOnGiftAction
              : () => {
                  if (window.confirm("로그인이 필요합니다. 로그인 하시겠습니까?")) {
                    navigate("/login", { state: { from: `/eventview/${eventId}` } });
                  }
                }
          }
        />
      )}

      {/* 친구 초대 모달 */}
      <AnimatePresence>
        {showInviteModal && eventData && eventData.id && (
          <InviteFriends eventData={eventData} onClose={() => setShowInviteModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
