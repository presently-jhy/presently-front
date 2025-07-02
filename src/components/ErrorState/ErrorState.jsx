import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import styles from './ErrorState.module.css';

const ErrorState = ({
    title = '오류가 발생했습니다',
    message = '잠시 후 다시 시도해주세요.',
    onRetry,
    variant = 'default',
}) => {
    return (
        <motion.div
            className={`${styles.container} ${styles[variant]}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className={styles.icon}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            >
                <AlertCircle size={48} />
            </motion.div>

            <motion.h3
                className={styles.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                {title}
            </motion.h3>

            <motion.p
                className={styles.message}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                {message}
            </motion.p>

            {onRetry && (
                <motion.button
                    className={styles.retryButton}
                    onClick={onRetry}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <RefreshCw size={16} />
                    다시 시도
                </motion.button>
            )}
        </motion.div>
    );
};

export default ErrorState;
