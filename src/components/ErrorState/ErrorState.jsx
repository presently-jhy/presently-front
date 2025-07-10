import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import styles from './ErrorState.module.css';

const ErrorState = ({
    title = '오류가 발생했습니다',
    message,
    onRetry,
    showRetry = true,
    size = 'medium',
    className = '',
}) => {
    return (
        <motion.div
            className={`${styles.container} ${styles[size]} ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            role="alert"
        >
            <div className={styles.icon}>
                <AlertTriangle size={size === 'small' ? 32 : size === 'large' ? 64 : 48} />
            </div>
            <h3 className={styles.title}>{title}</h3>
            {message && <p className={styles.message}>{message}</p>}
            {showRetry && onRetry && (
                <motion.button
                    className={styles.retryButton}
                    onClick={onRetry}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    aria-label="다시 시도"
                >
                    <RefreshCw size={16} />
                    다시 시도
                </motion.button>
            )}
        </motion.div>
    );
};

export default ErrorState;
