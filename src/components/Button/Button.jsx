import React from 'react';
import { motion } from 'framer-motion';
import styles from './Button.module.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    fullWidth = false,
    onClick,
    type = 'button',
    className = '',
    ...props
}) => {
    const buttonClasses = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        loading && styles.loading,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <motion.button
            className={buttonClasses}
            onClick={onClick}
            type={type}
            disabled={disabled || loading}
            whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
            whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
            transition={{ duration: 0.1 }}
            {...props}
        >
            {loading && (
                <div className={styles.spinner}>
                    <div className={styles.spinnerInner}></div>
                </div>
            )}
            <span className={loading ? styles.hidden : ''}>{children}</span>
        </motion.button>
    );
};

export default Button;
