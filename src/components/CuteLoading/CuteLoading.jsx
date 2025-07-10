import React from 'react';
import { motion } from 'framer-motion';
import styles from './CuteLoading.module.css';

const CuteLoading = ({ message = '선물을 준비하고 있어요...' }) => {
    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
        >
            <div className={styles.giftBox}>
                <motion.div
                    className={styles.box}
                    animate={{
                        rotateY: [0, 10, -10, 0],
                        rotateX: [0, 5, -5, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <div className={styles.boxTop}></div>
                    <div className={styles.boxFront}></div>
                    <div className={styles.boxBack}></div>
                    <div className={styles.boxLeft}></div>
                    <div className={styles.boxRight}></div>
                    <div className={styles.boxBottom}></div>
                </motion.div>

                <motion.div
                    className={styles.ribbon}
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <div className={styles.ribbonVertical}></div>
                    <div className={styles.ribbonHorizontal}></div>
                    <div className={styles.bow}>
                        <div className={styles.bowLeft}></div>
                        <div className={styles.bowRight}></div>
                        <div className={styles.bowCenter}></div>
                    </div>
                </motion.div>
            </div>

            <motion.p
                className={styles.message}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                {message}
            </motion.p>

            <motion.div
                className={styles.sparkles}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={styles.sparkle}
                        style={{
                            left: `${20 + i * 15}%`,
                            top: `${10 + (i % 2) * 80}%`,
                        }}
                        animate={{
                            scale: [0, 1, 0],
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </motion.div>
        </motion.div>
    );
};

export default CuteLoading;
