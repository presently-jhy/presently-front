import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import backButtonIcon from "./BackButtonIcon.svg";
// import { useState } from "react"; // 미사용이므로 제거

const Header = ({ backLink = null, title, subTitle, rightButton = null }) => {
  const navigate = useNavigate();
  // const [copySuccess, setCopySuccess] = useState(""); // 미사용이므로 제거

  const handleBack = () => {
    if (backLink) {
      navigate(backLink);
    } else {
      navigate(-1);
    }
  };

  // 링크 공유 기능
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch {
        // 공유 취소 또는 오류 무시
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch {
        // 복사 실패 시 별도 처리 없음
      }
    }
  };
  return (
    <header className={styles.container}>
      <div className={styles.backDiv}>
        <img src={backButtonIcon} onClick={handleBack} alt="Back" />
      </div>
      <div className={styles.titleDiv}>
        <div className={styles.title}>{title}</div>
        <div className={styles.subtitle}>{subTitle}</div>
      </div>
      <div className={styles.rightButtonDiv}>{rightButton}</div>
    </header>
  );
};

export default Header;
