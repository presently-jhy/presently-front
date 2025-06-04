import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Breadcrumb.module.css';

const Breadcrumb = ({ paths }) => (
    <nav aria-label="breadcrumb" className={styles.breadcrumb}>
        {paths.map((p, idx) => (
            <span key={idx} className={styles.segment}>
                {p.to ? <Link to={p.to}>{p.label}</Link> : <span>{p.label}</span>}
                {idx < paths.length - 1 && <span className={styles.separator}>/</span>}
            </span>
        ))}
    </nav>
);
export default Breadcrumb;
