// src/components/AmountDial/AmountDial.jsx

import React, { useState, useMemo, useEffect } from 'react';
import styles from './AmountDial.module.css';

export default function AmountDial({
    value,
    setValue,
    maxValue = 2000000, // 기본 최대 200만원
}) {
    // “편집 모드” 상태
    const [editing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState('');

    // 보여줄 금액 포맷 (쉼표 + 원)
    const formatted = useMemo(() => `${value.toLocaleString()}원`, [value]);

    // 슬라이더 변경
    const onSliderChange = (e) => {
        setValue(Number(e.target.value));
    };

    // 빠른 선택 버튼값
    const quicks = [100000, 500000, 1000000, maxValue];

    // 숫자 클릭 → 편집 모드
    const enterEdit = () => {
        setInputValue((value / 10000).toFixed(1)); // “만원” 단위
        setEditing(true);
    };

    // 입력 완료
    const commitEdit = () => {
        let num = parseFloat(inputValue) || 0;
        num = Math.max(0, Math.min(maxValue / 10000, num));
        const final = Math.round(num * 10000);
        setValue(final);
        setEditing(false);
    };

    // esc 누르면 편집 취소
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape' && editing) setEditing(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [editing]);

    return (
        <div className={styles.container}>
            {/* 1. 현재 값 표시 / 편집 */}
            <div className={styles.display} onClick={enterEdit}>
                {editing ? (
                    <div className={styles.editWrapper}>
                        <input
                            type="number"
                            inputMode="decimal"
                            min="0"
                            max={maxValue / 10000}
                            step="0.1"
                            className={styles.editInput}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            autoFocus
                        />
                        <span className={styles.unit}>만원</span>
                        <button className={styles.confirmButton} onClick={commitEdit}>
                            확인
                        </button>
                    </div>
                ) : (
                    <span className={styles.valueText}>{formatted}</span>
                )}
            </div>

            {/* 2. 슬라이더 */}
            <input
                type="range"
                className={styles.slider}
                min="0"
                max={maxValue}
                step="10000"
                value={value}
                onChange={onSliderChange}
            />

            {/* 3. 빠른 선택 버튼 */}
            <div className={styles.quickSelect}>
                {quicks.map((v, i) => (
                    <button key={i} className={styles.quickButton} onClick={() => setValue(v)}>
                        {v === maxValue ? '최대' : `${(v / 10000).toFixed(0)}만`}
                    </button>
                ))}
            </div>
        </div>
    );
}
