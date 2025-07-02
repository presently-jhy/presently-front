import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CuteCursor.module.css';

const CuteCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);
        const handleMouseLeave = () => setIsVisible(false);

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <>
            {/* 메인 커서 */}
            <motion.div
                className={styles.cursor}
                animate={{
                    x: mousePosition.x - 10,
                    y: mousePosition.y - 10,
                    scale: isClicking ? 0.8 : 1,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                style={{ opacity: isVisible ? 1 : 0 }}
            >
                <div className={styles.cursorInner} />
            </motion.div>

            {/* 트레일 효과 */}
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    className={styles.trail}
                    animate={{
                        x: mousePosition.x - 5,
                        y: mousePosition.y - 5,
                        scale: isClicking ? 0.6 : 0.8,
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                        delay: i * 0.05,
                    }}
                    style={{ opacity: isVisible ? 0.3 - i * 0.1 : 0 }}
                />
            ))}

            {/* 클릭 효과 */}
            <AnimatePresence>
                {isClicking && (
                    <motion.div
                        className={styles.clickEffect}
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            left: mousePosition.x - 10,
                            top: mousePosition.y - 10,
                        }}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default CuteCursor;
