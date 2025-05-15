/* 1. Updated AmountDial.jsx: larger touch area, useMemo/useCallback for compute functions */
import React, { useState, useRef, useMemo, useCallback } from 'react';
import styles from './AmountDial.module.css';

const AmountDial = ({ value, setValue, maxValue }) => {
    const dialRef = useRef(null);
    const [angle, setAngle] = useState(0);
    const [dialActive, setDialActive] = useState(false);
    const center = { x: 50, y: 50 };
    const radius = 40;

    const formatValueInManwon = (v) => {
        const manValue = v / 10000;
        return manValue % 1 === 0 ? `${manValue.toFixed(0)}만원` : `${manValue.toFixed(1)}만원`;
    };

    const computeArcPath = useMemo(() => {
        const startX = center.x + radius * Math.cos((-90 * Math.PI) / 180);
        const startY = center.y + radius * Math.sin((-90 * Math.PI) / 180);
        const endX = center.x + radius * Math.cos(((angle - 90) * Math.PI) / 180);
        const endY = center.y + radius * Math.sin(((angle - 90) * Math.PI) / 180);
        const largeArcFlag = angle > 180 ? 1 : 0;
        return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
    }, [angle, center, radius]);

    const { knobX, knobY } = useMemo(() => {
        const kx = center.x + radius * Math.cos(((angle - 90) * Math.PI) / 180);
        const ky = center.y + radius * Math.sin(((angle - 90) * Math.PI) / 180);
        return { knobX: kx, knobY: ky };
    }, [angle, center, radius]);

    const updateAngle = useCallback(
        (clientX, clientY) => {
            const el = dialRef.current;
            if (!el) return;
            const { left, top, width, height } = el.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;
            let newAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
            newAngle = (newAngle + 360) % 360;
            setAngle(newAngle);
            const raw = (newAngle / 360) * maxValue;
            const quantized = Math.round(raw / 1000) * 1000;
            setValue(quantized);
        },
        [maxValue, setValue]
    );

    const handlePointerDownKnob = (e) => {
        e.preventDefault();
        setDialActive(true);
        const onPointerMove = (ev) => updateAngle(ev.clientX, ev.clientY);
        const onPointerUp = () => {
            setDialActive(false);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
    };

    return (
        <div className={styles.dialContainer}>
            <svg ref={dialRef} className={`${styles.dial} ${dialActive ? styles.active : ''}`} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="2" fill="none" />
                <circle cx="50" cy="50" r="40" stroke="#ddd" strokeWidth="8" fill="none" />
                {angle > 0 && <path d={computeArcPath} className={styles.progressArc} />}
                {/* Increase hit area by wrapping knob with larger transparent circle */}
                <circle
                    cx={knobX}
                    cy={knobY}
                    r="10"
                    fill="transparent"
                    onPointerDown={handlePointerDownKnob}
                    style={{ cursor: 'grab' }}
                />
                <circle cx={knobX} cy={knobY} r="4" className={styles.knob} />
                <text x="50" y="55" textAnchor="middle" className={styles.dialText}>
                    {formatValueInManwon(value)}
                </text>
            </svg>
        </div>
    );
};

export default AmountDial;
