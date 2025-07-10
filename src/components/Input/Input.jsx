import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import styles from './Input.module.css';

const Input = forwardRef(
    (
        {
            label,
            error,
            helperText,
            size = 'medium',
            fullWidth = false,
            disabled = false,
            required = false,
            className = '',
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
        const messageId = `${inputId}-message`;
        const hasMessage = error || helperText;

        const inputClasses = [
            styles.input,
            styles[size],
            error && styles.error,
            disabled && styles.disabled,
            fullWidth && styles.fullWidth,
            className,
        ]
            .filter(Boolean)
            .join(' ');

        const containerClasses = [styles.container, fullWidth && styles.fullWidth].filter(Boolean).join(' ');

        return (
            <div className={containerClasses}>
                {label && (
                    <label htmlFor={inputId} className={styles.label}>
                        {label}
                        {required && <span className={styles.required}>*</span>}
                    </label>
                )}
                <motion.div className={styles.inputWrapper} whileFocus={{ scale: 1.01 }} transition={{ duration: 0.1 }}>
                    <input
                        ref={ref}
                        id={inputId}
                        className={inputClasses}
                        disabled={disabled}
                        required={required}
                        aria-describedby={hasMessage ? messageId : undefined}
                        {...props}
                    />
                </motion.div>
                {hasMessage && (
                    <div
                        id={messageId}
                        className={`${styles.message} ${error ? styles.error : styles.helper}`}
                        role={error ? 'alert' : undefined}
                    >
                        {error || helperText}
                    </div>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
