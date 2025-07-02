import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Sparkles, Gift } from 'lucide-react';
import Confetti from '../Confetti/Confetti';
import styles from './EasterEgg.module.css';

const EasterEgg = () => {
    const [showEasterEgg, setShowEasterEgg] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [triggerConfetti, setTriggerConfetti] = useState(false);
    const [messages] = useState([
        '🎉 당신은 특별한 사람이에요!',
        '✨ 마법 같은 순간을 만들어주세요!',
        '💝 사랑이 가득한 하루 되세요!',
        '🌟 당신의 꿈이 이루어지길 바라요!',
        '🎁 오늘도 행복한 하루 보내세요!',
        '💫 당신은 이미 완벽해요!',
        '🌈 무지개 같은 미래가 기다리고 있어요!',
        '🎪 마법의 순간을 경험해보세요!',
        '💖 당신의 마음이 가장 아름다워요!',
        '🎊 축하해요! 당신은 정말 멋져요!',
    ]);

    useEffect(() => {
        const handleKonami = (e) => {
            // Konami Code: ↑↑↓↓←→←→BA
            const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
            let konamiIndex = 0;

            if (e.keyCode === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    triggerEasterEgg();
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        };

        window.addEventListener('keydown', handleKonami);
        return () => window.removeEventListener('keydown', handleKonami);
    }, []);

    const triggerEasterEgg = () => {
        setShowEasterEgg(true);
        setTriggerConfetti(true);
        setTimeout(() => setTriggerConfetti(false), 100);

        setTimeout(() => {
            setShowEasterEgg(false);
        }, 5000);
    };

    const handleSecretClick = () => {
        setClickCount((prev) => prev + 1);
        if (clickCount >= 4) {
            triggerEasterEgg();
            setClickCount(0);
        }
    };

    return (
        <>
            {/* 숨겨진 클릭 영역 */}
            <div className={styles.secretArea} onClick={handleSecretClick} title="🤫" />

            {/* 이스터에그 모달 */}
            <AnimatePresence>
                {showEasterEgg && (
                    <motion.div
                        className={styles.overlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowEasterEgg(false)}
                    >
                        <motion.div
                            className={styles.modal}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.div
                                className={styles.content}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <motion.div
                                    className={styles.icons}
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Heart className={styles.icon} size={32} />
                                    <Star className={styles.icon} size={32} />
                                    <Sparkles className={styles.icon} size={32} />
                                    <Gift className={styles.icon} size={32} />
                                </motion.div>

                                <motion.h2
                                    className={styles.title}
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                >
                                    🎉 이스터에그 발견! 🎉
                                </motion.h2>

                                <motion.p
                                    className={styles.message}
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    {messages[Math.floor(Math.random() * messages.length)]}
                                </motion.p>

                                <motion.button
                                    className={styles.closeButton}
                                    onClick={() => setShowEasterEgg(false)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    감사해요! 💖
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 폭죽 효과 */}
            <Confetti trigger={triggerConfetti} />
        </>
    );
};

export default EasterEgg;
