// src/components/Spinner/Spinner.jsx

import React from 'react';
import styles from './Spinner.module.css';

export default function Spinner({ size = 24 }) {
    return <div className={styles.spinner} style={{ width: size, height: size }} aria-label="로딩 중" />;
}
