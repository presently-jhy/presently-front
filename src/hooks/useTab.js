// src/hooks/useTab.js
import { useState } from 'react';
export function useTab(initial = 'gift') {
    const [tab, setTab] = useState(initial);
    const onSelect = (t) => setTab(t);
    return { tab, onSelect };
}
