// src/pages/EventView/EventView.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/Header/Header";
import GiftItem from "../../components/GiftItem/GiftItem";
import GiftPreview from "../../components/GiftPreview/GiftPreview";
import styles from "./EventView.module.css";
import shareIcon from "./shareIcon.svg";
import defaultEventImg from "./defaultEventImg.png";
import editButtonImg from "./editButton.png";

import { useAuth } from "../../context/AuthContext";

const giftItemVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05, transition: { duration: 0.5 } },
};

export default function EventView() {
  const { user, checking } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const eventData = location.state || {};

  const [gifts, setGifts] = useState([]);
  const [mainTab, setMainTab] = useState("gift");
  const [giftTab, setGiftTab] = useState("want");
  const [selectedGift, setSelectedGift] = useState(null);
  const [userMode, setUserMode] = useState("owner");

  useEffect(() => {
    if (!checking) {
      if (!user) {
        navigate("/login");
      } else {
        if (user.id === eventData.creator_id || user.id === eventData.creatorId) {
          setUserMode("owner");
        } else {
          setUserMode("giver");
        }
      }
    }
  }, [user, checking, eventData]);

  // 1) 로컬스토리지에서 이벤트별 선물 및 피드백 불러오기
  useEffect(() => {
    if (!eventData.id) return;
    const all = JSON.parse(localStorage.getItem("gifts")) || [];
    const eventGifts = all
      .filter((g) => g.eventId === eventData.id)
      .map((g) => ({ ...g, feedbacks: g.feedbacks || [] }));
    setGifts(eventGifts);
  }, [eventData]);

  // 2) 펀딩 100% 달성 시 'want' → 'done'
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("gifts")) || [];
    let changed = false;
    const updated = stored.map((g) => {
      const pct = typeof g.percent === "string" ? parseInt(g.percent, 10) : g.percent;
      if (g.selectedType === "fund" && g.receiveStatus === "want" && pct >= 100) {
        changed = true;
        return { ...g, receiveStatus: "done" };
      }
      return g;
    });
    if (changed) {
      localStorage.setItem("gifts", JSON.stringify(updated));
      setGifts(updated.filter((g) => g.eventId === eventData.id).map((g) => ({ ...g, feedbacks: g.feedbacks || [] })));
    }
  }, [gifts, eventData.id]);

  const handleUserModeToggle = () => {
    setUserMode((prev) => (prev === "owner" ? "giver" : "owner"));
    setSelectedGift(null);
  };

  const handleAdd = () => navigate("/giftenroll", { state: eventData });

  const handleEdit = () => {
    if (!eventData.id) {
      const stored = JSON.parse(localStorage.getItem("events")) || [];
      const found = stored.find((e) => e.eventName === eventData.eventName && e.eventDate === eventData.eventDate);
      if (found) {
        navigate("/addEventLog", { state: { ...found, mode: "edit" } });
      } else {
        alert("수정할 이벤트 데이터를 찾을 수 없습니다.");
      }
    } else {
      navigate("/addEventLog", { state: { ...eventData, mode: "edit" } });
    }
  };

  const handleDeleteGift = (giftId, e) => {
    e.stopPropagation();
    const all = JSON.parse(localStorage.getItem("gifts")) || [];
    const updatedAll = all.filter((g) => g.id !== giftId);
    localStorage.setItem("gifts", JSON.stringify(updatedAll));
    setGifts(updatedAll.filter((g) => g.eventId === eventData.id));
  };

  const handleGiftAction = () => {
    if (!selectedGift) return;
    const toSend = selectedGift;
    setGifts((prev) => prev.filter((g) => g.id !== toSend.id));
    setSelectedGift(null);
    setTimeout(() => {
      navigate("/fundsend", { state: { eventData, gift: toSend } });
    }, 800);
  };

  // 3) 피드백 수락/완료 처리
  const handleAcceptFeedback = (feedbackId) => {
    const all = JSON.parse(localStorage.getItem("gifts")) || [];
    const updatedAll = all.map((g) => {
      if (g.id !== selectedGift.id) return g;
      // 해당 feedback 찾기
      const fb = (g.feedbacks || []).find((x) => x.id === feedbackId);
      if (g.selectedType === "fund" && fb) {
        const newCur = (g.currentAmount || 0) + fb.amount;
        const tgt = g.targetAmount || 1000000;
        const newPct = Math.min(100, (newCur / tgt) * 100).toFixed(0) + "%";
        return {
          ...g,
          currentAmount: newCur,
          percent: newPct,
          feedbacks: g.feedbacks.filter((x) => x.id !== feedbackId),
        };
      } else {
        // gift: 'want' → 'done'
        return {
          ...g,
          receiveStatus: "done",
          feedbacks: [],
        };
      }
    });
    localStorage.setItem("gifts", JSON.stringify(updatedAll));
    setGifts(updatedAll.filter((g) => g.eventId === eventData.id).map((g) => ({ ...g, feedbacks: g.feedbacks || [] })));
    setSelectedGift((prev) => {
      if (!prev) return null;
      return { ...updatedAll.find((g) => g.id === prev.id) };
    });
  };
  const handleRejectFeedback = (feedbackId) => {
    const all = JSON.parse(localStorage.getItem("gifts")) || [];
    const updatedAll = all.map((g) => {
      if (g.id !== selectedGift.id) return g;
      return {
        ...g,
        feedbacks: (g.feedbacks || []).filter((f) => f.id !== feedbackId),
      };
    });
    localStorage.setItem("gifts", JSON.stringify(updatedAll));
    setGifts(updatedAll.filter((g) => g.eventId === eventData.id).map((g) => ({ ...g, feedbacks: g.feedbacks || [] })));
    setSelectedGift((prev) => {
      if (!prev) return null;
      return { ...updatedAll.find((g) => g.id === prev.id) };
    });
  };

  const currentList = gifts.filter((g) => {
    if (giftTab === "want") return g.receiveStatus === "want";
    if (giftTab === "notwant") return g.receiveStatus === "unwant";
    if (giftTab === "received") return g.receiveStatus === "done";
    return false;
  });

  return (
    <div className={styles.container}>
      <Header title="이벤트 보기" subTitle="상세 정보" rightButton={shareIcon} />

      <div className={styles.userModeToggle}>
        <button className={styles.toggleButton} onClick={handleUserModeToggle}>
          {userMode === "owner" ? "등록자 (내가 등록함)" : "선물 주는 사람"}
        </button>
      </div>

      <div className={styles.eventInfo}>
        <img src={eventData.eventImg || defaultEventImg} alt="이벤트" className={styles.eventImage} />
        <div className={styles.eventTextBox}>
          <div className={styles.hostName}>{eventData.hostName || "주최자"}</div>
          <div className={styles.eventDate}>{eventData.eventDate || "날짜 정보 없음"}</div>
          <div className={styles.eventTitle}>{eventData.eventName || "이벤트 제목"}</div>
          <div className={styles.eventDescription}>
            {eventData.eventDescription || "이벤트 설명이 여기에 표시됩니다."}
          </div>
        </div>

        {userMode === "owner" && (
          <div className={styles.buttonGroup}>
            <button className={styles.addButton} onClick={handleAdd}>
              +
            </button>
            <button className={styles.editButton} onClick={handleEdit}>
              <img src={editButtonImg} alt="이벤트 수정" className={styles.editButtonImg} />
            </button>
          </div>
        )}
      </div>

      <div className={styles.tabMenu}>
        <div
          className={`${styles.tab} ${mainTab === "gift" ? styles.activeTab : ""}`}
          onClick={() => setMainTab("gift")}
        >
          선물
        </div>
        <div
          className={`${styles.tab} ${mainTab === "record" ? styles.activeTab : ""}`}
          onClick={() => setMainTab("record")}
        >
          이벤트 기록
        </div>
      </div>

      {mainTab === "gift" ? (
        <>
          <div className={styles.subTabMenu}>
            {["want", "notwant", "received"].map((tabType) => (
              <div
                key={tabType}
                className={`${styles.subTab} ${giftTab === tabType ? styles.activeSubTab : ""}`}
                onClick={() => setGiftTab(tabType)}
              >
                {tabType === "want" ? "받고 싶은" : tabType === "notwant" ? "받기 싫은" : "받은"}
              </div>
            ))}
          </div>

          <div className={styles.itemList}>
            <AnimatePresence>
              {currentList.length > 0 ? (
                currentList.map((item) => (
                  <motion.div
                    key={item.id}
                    className={styles.giftItemWrapper}
                    variants={giftItemVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    onClick={() => setSelectedGift(item)}
                  >
                    <GiftItem
                      type={item.selectedType === "fund" ? "펀딩" : "선물"}
                      title={item.giftName}
                      description={item.giftDescription}
                      image={item.imageUrl}
                      percent={item.selectedType === "fund" ? item.percent : null}
                      onClick={() => setSelectedGift(item)}
                    />
                    {userMode === "owner" && giftTab !== "received" && (
                      <button className={styles.deleteButton} onClick={(e) => handleDeleteGift(item.id, e)}>
                        삭제
                      </button>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.icon}>🎁</div>
                  <div className={styles.text}>
                    아직 등록된 선물이 없어요.
                    <br />⊕ 버튼으로 새로 추가해 보세요!
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
          feedbacks={selectedGift.feedbacks}
          onAccept={handleAcceptFeedback}
          onReject={handleRejectFeedback}
          onClose={() => setSelectedGift(null)}
          onGiftAction={userMode === "giver" ? handleGiftAction : null}
        />
      )}
    </div>
  );
}
