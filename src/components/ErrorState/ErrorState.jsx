import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import styles from './ErrorState.module.css';

const ErrorState = ({
    title = 'Something went wrong',
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
                >
                    <RefreshCw size={16} />
                    Try Again
                </motion.button>
            )}
        </motion.div>
    );
};

export default ErrorState;
