import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Dashboard.module.css";
import Eventbox from "../../components/eventbox/Eventbox";
import userButton from "./userButton.png";
import sortEventDate from "./sortEventDate.png";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabaseClient"; // 경로 수정 주의

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const { user, checking } = useAuth();

  useEffect(() => {
    if (!checking && user) {
      console.log("✅ 로그인 완료:", user.email);
    }
    if (!checking && !user) {
      navigate("/");
    }
  }, [user, checking, navigate]);

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events"));
    if (storedEvents && storedEvents.length > 0) {
      setEvents(storedEvents);
    } else {
      fetch("/data/events.json")
        .then((res) => res.json())
        .then((data) => setEvents(data))
        .catch((err) => {
          console.error("이벤트 불러오기 실패:", err);
          setEvents([]);
        });
    }
  }, []);

  const sortByNewest = () => {
    const sortedEvents = [...events].sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
    setEvents(sortedEvents);
  };

  const handleDelete = (indexToDelete, e) => {
    e.stopPropagation();
    const updatedEvents = events.filter((_, index) => index !== indexToDelete);
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  const handleEventClick = (event) => {
    navigate("/eventview", { state: event });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    console.log("🚪 로그아웃 완료");
    navigate("/");
  };

  if (checking) return <div>로그인 확인 중...</div>;

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>이벤트 목록</h1>
        <Link to="/setting" className={styles.userButton}>
          <img src={userButton} alt="User Page" />
        </Link>
        {/* ✅ 로그아웃 버튼 */}
        <span onClick={handleLogout} style={{ cursor: "pointer", marginLeft: "16px", fontWeight: "bold" }}>
          로그아웃
        </span>
      </header>

      <div className={styles.sortButtonWrapper} onClick={sortByNewest}>
        <img src={sortEventDate} alt="Sort by Newest" className={styles.sortButton} />
        <div className={styles.sortButtonText}>최신순</div>
      </div>

      <div className={styles.eventList}>
        {events.map((event, index) => {
          const isOwner = event.ownerId === user?.id;
          const computedEventView = event.eventView || 0;
          const receivedGiftCount = event.eventPresent || 0;

          return (
            <div key={index} onClick={() => handleEventClick(event)} className={styles.eventLinkWrapper}>
              <Eventbox
                {...event}
                eventView={computedEventView}
                eventPresent={receivedGiftCount}
                isOwner={isOwner}
                onDelete={(e) => handleDelete(index, e)}
              />
            </div>
          );
        })}
      </div>

      <div className={styles.buttonWrapper}>
        <Link to="/addEvent" className={styles.button}>
          이벤트 추가하기
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
