// src/components/AmountDial/AmountDialSimple.jsx

import React, { useState, useEffect } from 'react';
import styles from './AmountDial.module.css';

export default function AmountDialSimple({ value, setValue, maxValue = 100_000, disabled = false }) {
    // 실제 화면에 보일 문자열
    const [display, setDisplay] = useState(format(value));
    // 포커스 상태
    const [isFocused, setIsFocused] = useState(false);

    // value가 바뀌었을 때, 포커스가 없으면 포맷팅된 값을 display에 동기화
    useEffect(() => {
        if (!isFocused) {
            setDisplay(format(value));
        }
    }, [value, isFocused]);

    // 숫자 → 포맷팅된 문자열 (빈값인 경우 '')
    function format(num) {
        return num > 0 ? num.toLocaleString() : '';
    }

    // 화면 입력을 숫자로 파싱 (빈값 → 0, 최대값 클램핑)
    function parse(rawStr) {
        const digits = rawStr.replace(/[^\d]/g, '');
        if (digits === '') return 0;
        const n = parseInt(digits, 10);
        return n > maxValue ? maxValue : n;
    }

    const onFocus = () => {
        setIsFocused(true);
        // 포커스 들어올 때는 날것 숫자만 보여 주기
        setDisplay(value > 0 ? String(value) : '');
    };

    const onChange = (e) => {
        const input = e.target.value;
        // raw 숫자로 파싱
        const n = parse(input);
        setValue(n);
        // 포커스 중에는 포맷 없이 날것 숫자만 보여 줌
        setDisplay(input.replace(/[^\d]/g, ''));
    };

    const onBlur = () => {
        setIsFocused(false);
        // 최종적으로 클램핑 후 포맷 적용
        const n = parse(display);
        setValue(n);
        setDisplay(format(n));
    };

    return (
        <div className={`${styles.wrapper} ${disabled ? styles.disabled : ''}`}>
            <span className={styles.currency}>₩</span>
            <input
                type="text"
                inputMode="numeric"
                className={styles.input}
                value={display}
                onFocus={onFocus}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="0"
                disabled={disabled}
                aria-label="금액 입력"
            />
        </div>
    );
}
