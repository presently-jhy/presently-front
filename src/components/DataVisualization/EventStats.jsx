import React from 'react';
import { motion } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from 'recharts';
import { Calendar, Gift, Users, TrendingUp } from 'lucide-react';
import styles from './EventStats.module.css';

const EventStats = ({ events, gifts }) => {
    // 이벤트 타입별 통계
    const eventTypeStats =
        events?.reduce((acc, event) => {
            const type = event.eventType || '기타';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {}) || {};

    const eventTypeData = Object.entries(eventTypeStats).map(([type, count]) => ({
        name: type,
        value: count,
    }));

    // 월별 이벤트 통계
    const monthlyStats =
        events?.reduce((acc, event) => {
            const month = new Date(event.eventDate).getMonth();
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {}) || {};

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
        month: `${i + 1}월`,
        events: monthlyStats[i] || 0,
    }));

    // 선물 타입별 통계
    const giftTypeStats =
        gifts?.reduce((acc, gift) => {
            const type = gift.giftType || '기타';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {}) || {};

    const giftTypeData = Object.entries(giftTypeStats).map(([type, count]) => ({
        name: type,
        value: count,
    }));

    // 선물 가격대별 통계
    const priceRangeStats =
        gifts?.reduce((acc, gift) => {
            const price = gift.giftPrice || 0;
            let range = '기타';
            if (price < 10000) range = '1만원 미만';
            else if (price < 50000) range = '1-5만원';
            else if (price < 100000) range = '5-10만원';
            else if (price < 200000) range = '10-20만원';
            else range = '20만원 이상';

            acc[range] = (acc[range] || 0) + 1;
            return acc;
        }, {}) || {};

    const priceRangeData = Object.entries(priceRangeStats).map(([range, count]) => ({
        range,
        count,
    }));

    const COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={styles.tooltip}>
                    <p className={styles.tooltipLabel}>{label}</p>
                    <p className={styles.tooltipValue}>
                        {payload[0].name === 'events' ? '이벤트' : '선물'}: {payload[0].value}개
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div className={styles.container} variants={containerVariants} initial="hidden" animate="visible">
            <motion.h2 className={styles.title} variants={itemVariants}>
                <TrendingUp size={24} />
                이벤트 통계
            </motion.h2>

            <div className={styles.statsGrid}>
                {/* 이벤트 타입별 파이 차트 */}
                <motion.div className={styles.chartCard} variants={itemVariants}>
                    <div className={styles.chartHeader}>
                        <Calendar size={20} />
                        <h3>이벤트 타입별 분포</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={eventTypeData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {eventTypeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* 월별 이벤트 바 차트 */}
                <motion.div className={styles.chartCard} variants={itemVariants}>
                    <div className={styles.chartHeader}>
                        <Calendar size={20} />
                        <h3>월별 이벤트 수</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="events" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* 선물 타입별 파이 차트 */}
                <motion.div className={styles.chartCard} variants={itemVariants}>
                    <div className={styles.chartHeader}>
                        <Gift size={20} />
                        <h3>선물 타입별 분포</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={giftTypeData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {giftTypeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* 선물 가격대별 바 차트 */}
                <motion.div className={styles.chartCard} variants={itemVariants}>
                    <div className={styles.chartHeader}>
                        <Gift size={20} />
                        <h3>선물 가격대별 분포</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={priceRangeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="range" angle={-45} textAnchor="end" height={80} />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* 요약 통계 */}
            <motion.div className={styles.summaryStats} variants={itemVariants}>
                <div className={styles.summaryCard}>
                    <Calendar size={24} />
                    <div>
                        <h4>총 이벤트</h4>
                        <p>{events?.length || 0}개</p>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <Gift size={24} />
                    <div>
                        <h4>총 선물</h4>
                        <p>{gifts?.length || 0}개</p>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <Users size={24} />
                    <div>
                        <h4>참여자</h4>
                        <p>{new Set(gifts?.map((g) => g.userId)).size || 0}명</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default EventStats;
