// src/components/SkeletonCard/SkeletonCard.jsx

import React from 'react';
import styles from './SkeletonCard.module.css';

export default function SkeletonCard({ count = 3 }) {
    return (
        <div className={styles.wrapper}>
            {Array.from({ length: count }).map((_, idx) => (
                <div key={idx} className={styles.card}>
                    <div className={styles.imagePlaceholder} />
                    <div className={styles.textPlaceholder}>
                        <div className={`${styles.line} ${styles.short}`} />
                        <div className={`${styles.line} ${styles.long}`} />
                    </div>
                </div>
            ))}
        </div>
    );
}
