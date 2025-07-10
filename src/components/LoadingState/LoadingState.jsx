import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import styles from './LoadingState.module.css';

const LoadingState = ({ message = '로딩 중...', size = 'medium', showSpinner = true, variant = 'default' }) => {
    const sizeMap = {
        small: 16,
        medium: 24,
        large: 32,
    };

    const spinnerSize = sizeMap[size] || 24;

    return (
        <motion.div
            className={`${styles.container} ${styles[variant]}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
        >
            {showSpinner && (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Loader2 size={spinnerSize} className={styles.spinner} />
                </motion.div>
            )}
            {message && (
                <motion.p
                    className={styles.message}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {message}
                </motion.p>
            )}
        </motion.div>
    );
};

export default LoadingState;
