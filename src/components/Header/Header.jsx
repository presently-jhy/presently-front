import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import backButtonIcon from './BackButtonIcon.svg';
import { useState } from 'react';
import shareIcon from './shareIcon.svg';

const Header = ({ backLink = null, title, subTitle, rightButton = null }) => {
    const navigate = useNavigate();
    const [copySuccess, setCopySuccess] = useState('');

    const handleBack = () => {
        if (backLink) {
            navigate(backLink);
        } else {
            window.history.back();
        }
    };

    {
        /* 링크 공유 기능. */
    }
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: '공유할 제목',
                    text: '이 링크를 공유합니다.',
                    url: window.location.href,
                });
                console.log('공유 성공!');
            } catch (error) {
                console.error('공유 취소 또는 오류:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                setCopySuccess('링크가 클립보드에 복사되었습니다!');
                setTimeout(() => setCopySuccess(''), 2000);
            } catch (error) {
                console.error('복사 실패:', error);
                setCopySuccess('복사 실패!');
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
