import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Confetti.module.css';

const Confetti = ({ trigger = false, duration = 3000 }) => {
    const [particles, setParticles] = useState([]);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (trigger && !isActive) {
            setIsActive(true);
            const newParticles = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: -10,
                color: ['#ff6b9d', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][
                    Math.floor(Math.random() * 6)
                ],
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360,
                delay: Math.random() * 0.5,
            }));
            setParticles(newParticles);

            setTimeout(() => {
                setIsActive(false);
                setParticles([]);
            }, duration);
        }
    }, [trigger, duration, isActive]);

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    className={styles.container}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {particles.map((particle) => (
                        <motion.div
                            key={particle.id}
                            className={styles.particle}
                            style={{
                                left: `${particle.x}%`,
                                backgroundColor: particle.color,
                                width: `${particle.size}px`,
                                height: `${particle.size}px`,
                            }}
                            initial={{
                                y: particle.y,
                                x: particle.x,
                                rotate: particle.rotation,
                                scale: 0,
                            }}
                            animate={{
                                y: [particle.y, 110],
                                x: [particle.x, particle.x + (Math.random() - 0.5) * 20],
                                rotate: [particle.rotation, particle.rotation + 360],
                                scale: [0, 1, 0.8, 0],
                            }}
                            transition={{
                                duration: 2,
                                delay: particle.delay,
                                ease: 'easeOut',
                            }}
                        />
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Confetti;
