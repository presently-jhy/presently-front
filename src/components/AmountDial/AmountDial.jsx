import React, { useState, useRef } from 'react';
import styles from './AmountDial.module.css';

const AmountDial = ({ value, setValue, maxValue }) => {
    const dialRef = useRef(null);
    const [angle, setAngle] = useState(0);
    const [dialActive, setDialActive] = useState(false);
    const center = { x: 50, y: 50 };
    const radius = 40; // 진행 아크 및 노브가 위치할 원의 반지름

    // value(원)를 만원 단위 문자열로 변환하는 함수
    const formatValueInManwon = (value) => {
        const manValue = value / 10000;
        // 소수점 이하가 0이면 정수, 그렇지 않으면 한 자리 소수
        const formatted = manValue % 1 === 0 ? manValue.toFixed(0) : manValue.toFixed(1);
        return `${formatted}만원`;
    };

    // 현재 angle에 따른 아크 경로 계산
    const computeArcPath = () => {
        const startX = center.x + radius * Math.cos((-90 * Math.PI) / 180);
        const startY = center.y + radius * Math.sin((-90 * Math.PI) / 180);
        const endX = center.x + radius * Math.cos(((angle - 90) * Math.PI) / 180);
        const endY = center.y + radius * Math.sin(((angle - 90) * Math.PI) / 180);
        const largeArcFlag = angle > 180 ? 1 : 0;
        return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
    };

    // 노브의 위치 계산
    const computeKnobPosition = () => {
        const knobX = center.x + radius * Math.cos(((angle - 90) * Math.PI) / 180);
        const knobY = center.y + radius * Math.sin(((angle - 90) * Math.PI) / 180);
        return { knobX, knobY };
    };

    // 포인터 위치에 따라 각도를 업데이트하고, 1000원 단위로 quantize하여 값 업데이트
    const updateAngle = (clientX, clientY) => {
        const rect = dialRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const newAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
        const normalizedAngle = (newAngle + 360) % 360;
        setAngle(normalizedAngle);
        const rawValue = (normalizedAngle / 360) * maxValue;
        const quantizedValue = Math.round(rawValue / 1000) * 1000;
        setValue(quantizedValue);
    };

    // 노브에만 포인터 이벤트 처리: 누를 때만 값이 변경되고, 다이얼은 커지도록 처리
    const handlePointerDownKnob = (e) => {
        e.preventDefault();
        setDialActive(true);
        const pointerMove = (e) => {
            updateAngle(e.clientX, e.clientY);
        };
        const pointerUp = () => {
            setDialActive(false);
            window.removeEventListener('pointermove', pointerMove);
            window.removeEventListener('pointerup', pointerUp);
        };
        window.addEventListener('pointermove', pointerMove);
        window.addEventListener('pointerup', pointerUp);
    };

    const arcPath = computeArcPath();
    const { knobX, knobY } = computeKnobPosition();

    return (
        <div className={styles.dialContainer}>
            <svg ref={dialRef} className={`${styles.dial} ${dialActive ? styles.active : ''}`} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="2" fill="none" />
                <circle cx="50" cy="50" r="40" stroke="#ddd" strokeWidth="8" fill="none" />
                {angle > 0 && <path d={arcPath} className={styles.progressArc} />}
                <circle cx={knobX} cy={knobY} r="4" className={styles.knob} onPointerDown={handlePointerDownKnob} />
                <text x="50" y="55" textAnchor="middle" className={styles.dialText}>
                    {formatValueInManwon(value)}
                </text>
            </svg>
        </div>
    );
};

export default AmountDial;
