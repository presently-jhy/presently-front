import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import styles from './Toast.module.css';

const Toast = ({ id, type = 'info', title, message, duration = 5000, onClose }) => {
    const icons = {
        success: CheckCircle,
        error: XCircle,
        warning: AlertCircle,
        info: Info,
    };

    const Icon = icons[type];

    React.useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose(id);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, id, onClose]);

    return (
        <motion.div
            className={`${styles.toast} ${styles[type]}`}
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            layout
        >
            <div className={styles.icon}>
                <Icon size={20} />
            </div>
            <div className={styles.content}>
                {title && <div className={styles.title}>{title}</div>}
                {message && <div className={styles.message}>{message}</div>}
            </div>
            <button className={styles.closeButton} onClick={() => onClose(id)} aria-label="Close notification">
                <X size={16} />
            </button>
        </motion.div>
    );
};

const ToastContainer = ({ toasts, onClose }) => {
    return (
        <div className={styles.container}>
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} onClose={onClose} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export { Toast, ToastContainer };
