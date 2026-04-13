import React, { useState } from 'react';
import { Card, Typography, DatePicker, Button, Space, Spin } from 'antd';
import {
    LineChartOutlined,
    BarChartOutlined,
    FilterOutlined,
    InfoCircleOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';


import { getMonthRevenueAPI, getDayRevenueAPI } from '../../service/dashboard/api';

const { Text } = Typography;

// --- COMPONENT CUSTOM TRỤC X CHO THÁNG (Tên tuần & Ngày tháng) ---
const CustomMonthXAxisTick = (props) => {
    const { x, y, payload, data } = props;
    const item = data.find(d => d.name === payload.value);

    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={16} textAnchor="middle" fill="#475569" fontSize={12} fontWeight={600}>
                {payload.value}
            </text>
            {item?.startDate && item?.endDate && (
                <text x={0} y={0} dy={34} textAnchor="middle" fill="#94a3b8" fontSize={11}>
                    ({dayjs(item.startDate).format('DD/MM')} - {dayjs(item.endDate).format('DD/MM')})
                </text>
            )}
        </g>
    );
};

// --- COMPONENT CUSTOM TRỤC X CHO TUẦN (Ngày & Thứ trong tuần) ---
const CustomWeekXAxisTick = (props) => {
    const { x, y, payload, data } = props;
    const item = data.find(d => d.name === payload.value);

    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={16} textAnchor="middle" fill="#475569" fontSize={12} fontWeight={600}>
                {payload.value}
            </text>
            {item?.dayOfWeek && (
                <text x={0} y={0} dy={34} textAnchor="middle" fill="#94a3b8" fontSize={11}>
                    ({item.dayOfWeek})
                </text>
            )}
        </g>
    );
};

const DashboardCharts = ({
    revenueData,
    selectedYear,
    onYearChange,
    onFilterClick,
    formatCurrency
}) => {
    const [activeMonth, setActiveMonth] = useState(null);
    const [activeMonthNumber, setActiveMonthNumber] = useState(null);
    const [activeWeek, setActiveWeek] = useState(null);
    const [activeWeekRange, setActiveWeekRange] = useState(null);

    const [monthData, setMonthData] = useState([]);
    const [weekData, setWeekData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [yearCursor, setYearCursor] = useState('not-allowed');
    const [monthCursor, setMonthCursor] = useState('not-allowed');

    const handleYearClick = async (monthName) => {
        if (!monthName) return;
        const monthNumber = parseInt(monthName.replace(/\D/g, ''));

        setActiveMonth(monthName);
        setActiveMonthNumber(monthNumber);
        setActiveWeek(null);
        setActiveWeekRange(null);
        setIsLoading(true);

        try {
            const res = await getMonthRevenueAPI(selectedYear, monthNumber);
            if (res?.status === 200 && res.data?.totalRevenueWeek) {
                const mappedMonthData = res.data.totalRevenueWeek.map(item => ({
                    name: `Tuần ${item.week}`,
                    revenue: item.totalRevenue,
                    rawWeek: item.week,
                    startDate: item.startDate,
                    endDate: item.endDate
                }));
                setMonthData(mappedMonthData);
            } else {
                setMonthData([]);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu tháng:", error);
        }
        setIsLoading(false);
    };

    const handleMonthClick = async (weekName, rawWeekNumber, startDate, endDate) => {
        if (!weekName || !rawWeekNumber) return;
        setActiveWeek(weekName);
        setActiveWeekRange({ start: startDate, end: endDate });
        setIsLoading(true);

        try {
            const res = await getDayRevenueAPI(selectedYear, activeMonthNumber, rawWeekNumber);
            if (res?.status === 200 && res.data?.totalRevenueDay) {
                const mappedWeekData = res.data.totalRevenueDay.map(item => {
                    const dateString = `${selectedYear}-${String(activeMonthNumber).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`;
                    const dayIndex = dayjs(dateString).day();

                    const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
                    const dayName = daysOfWeek[dayIndex];

                    return {
                        name: `Ngày ${item.day}`,
                        dayOfWeek: dayName,
                        revenue: item.totalRevenue,
                        fullName: `Ngày ${item.day} (${dayName})`
                    };
                });
                setWeekData(mappedWeekData);
            } else {
                setWeekData([]);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu tuần:", error);
        }
        setIsLoading(false);
    };

    const handleBackToYear = () => {
        setActiveMonth(null);
        setActiveMonthNumber(null);
        setActiveWeek(null);
        setActiveWeekRange(null);
        setYearCursor('not-allowed');
    };

    const handleBackToMonth = () => {
        setActiveWeek(null);
        setActiveWeekRange(null);
        setMonthCursor('not-allowed');
    };

    const renderCustomDot = (props) => {
        const { cx, cy, index } = props;
        return (
            <circle
                key={`dot-${index}`}
                cx={cx}
                cy={cy}
                r={6}
                fill="#3b82f6"
                stroke="#fff"
                strokeWidth={2}
            />
        );
    };

    const CustomMonthTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div style={{ backgroundColor: '#fff', padding: '12px', border: '1px solid #f1f5f9', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}>
                        {label}
                    </div>
                    {data.startDate && data.endDate && (
                        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                            ({dayjs(data.startDate).format('DD/MM/YYYY')} - {dayjs(data.endDate).format('DD/MM/YYYY')})
                        </div>
                    )}
                    <div style={{ color: '#10b981', fontWeight: 600, fontSize: '14px' }}>
                        Doanh thu: {formatCurrency(data.revenue)}
                    </div>
                </div>
            );
        }
        return null;
    };

    const CustomWeekTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div style={{ backgroundColor: '#fff', padding: '12px', border: '1px solid #f1f5f9', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>
                        {data.fullName}
                    </div>
                    <div style={{ color: '#f59e0b', fontWeight: 600, fontSize: '14px' }}>
                        Doanh thu: {formatCurrency(data.revenue)}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ marginTop: 20 }}>
            <Spin spinning={isLoading} tip="Đang tải dữ liệu...">

                {/* --- CẤP 1: BIỂU ĐỒ THEO NĂM --- */}
                {!activeMonth && !activeWeek && (
                    <Card
                        title={<Space><LineChartOutlined style={{ color: '#3b82f6' }} /><Text strong style={{ fontSize: '16px' }}>Doanh Thu Năm {selectedYear}</Text></Space>}
                        style={{ borderRadius: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: 'none', width: '100%' }}
                        extra={
                            <Space>
                                <Text type="secondary" style={{ fontSize: '13px', marginRight: '16px' }}><InfoCircleOutlined /> Nhấp trực tiếp vào biểu đồ để xem chi tiết tháng</Text>
                                <DatePicker picker="year" value={dayjs().year(selectedYear)} allowClear={false} onChange={(d) => d && onYearChange(d.year())} />
                                <Button type="primary" icon={<FilterOutlined />} onClick={onFilterClick}>Lọc</Button>
                            </Space>
                        }
                    >
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <LineChart
                                    data={revenueData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                    style={{ cursor: yearCursor }}
                                    onMouseMove={(state) => {
                                        if (state?.isTooltipActive) {
                                            setYearCursor('pointer');
                                        } else {
                                            setYearCursor('not-allowed');
                                        }
                                    }}
                                    onMouseLeave={() => setYearCursor('not-allowed')}
                                    onClick={(state) => {
                                        if (state?.activeLabel) {
                                            handleYearClick(state.activeLabel);
                                        }
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `${v / 1e6}Tr`} />
                                    <RechartsTooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }} />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        name="Doanh thu"
                                        stroke="#3b82f6"
                                        strokeWidth={4}
                                        dot={renderCustomDot}
                                        activeDot={{ r: 8, strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                )}

                {/* --- CẤP 2: BIỂU ĐỒ THEO THÁNG --- */}
                {activeMonth && !activeWeek && (
                    <Card
                        title={
                            <Space>
                                <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleBackToYear} style={{ marginRight: 8 }} />
                                <BarChartOutlined style={{ color: '#10b981' }} />
                                <Text strong style={{ fontSize: '16px' }}>Doanh Thu Tháng {activeMonthNumber} Năm {selectedYear}</Text>
                            </Space>
                        }
                        style={{ borderRadius: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: 'none', width: '100%', borderTop: '4px solid #10b981' }}
                        extra={<Text type="secondary" style={{ fontSize: '12px' }}>Nhấp vào cột để xem chi tiết tuần</Text>}
                    >
                        <div style={{ width: '100%', height: 320 }}>
                            <ResponsiveContainer>
                                <BarChart 
                                    data={monthData} 
                                    margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                                    style={{ cursor: monthCursor }} 
                                    onMouseMove={(state) => {
                                        // Chỉ cần tooltip đang active (chuột ở vùng có dữ liệu) là hiển thị pointer
                                        if (state?.isTooltipActive) {
                                            setMonthCursor('pointer');
                                        } else {
                                            setMonthCursor('not-allowed');
                                        }
                                    }}
                                    onMouseLeave={() => setMonthCursor('not-allowed')}
                                    onClick={(state) => {
                                        // Áp dụng giải pháp CỰC ĐỈNH của bạn: lấy theo Index cột dọc
                                        if (!state || !state.activeCoordinate) return;

                                        const index = Math.round(state.activeTooltipIndex ?? -1);
                                        const data = monthData[index];
                                        
                                        if (data) {
                                            handleMonthClick(
                                                data.name,
                                                data.rawWeek,
                                                data.startDate,
                                                data.endDate
                                            );
                                        }
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        height={60}
                                        tick={<CustomMonthXAxisTick data={monthData} />}
                                    />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `${v / 1e6}Tr`} />
                                    <RechartsTooltip content={<CustomMonthTooltip />} cursor={{ fill: '#f8fafc' }} />
                                    <Bar dataKey="revenue" name="Doanh thu" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={60}>
                                        {monthData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill="#10b981" />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                )}

                {/* --- CẤP 3: BIỂU ĐỒ THEO TUẦN --- */}
                {activeWeek && (
                    <Card
                        title={
                            <Space>
                                <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleBackToMonth} style={{ marginRight: 8 }} />
                                <BarChartOutlined style={{ color: '#f59e0b' }} />
                                <Text strong style={{ fontSize: '16px' }}>
                                    Doanh Thu {activeWeek} Tháng {activeMonthNumber}
                                    {activeWeekRange?.start && activeWeekRange?.end &&
                                        ` (${dayjs(activeWeekRange.start).format('D/M')} - ${dayjs(activeWeekRange.end).format('D/M')})`
                                    }
                                </Text>
                            </Space>
                        }
                        style={{ borderRadius: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: 'none', width: '100%', borderTop: '4px solid #f59e0b' }}
                    >
                        <div style={{ width: '100%', height: 320 }}>
                            <ResponsiveContainer>
                                <BarChart data={weekData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        height={60}
                                        tick={<CustomWeekXAxisTick data={weekData} />}
                                    />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `${v / 1e6}Tr`} />
                                    <RechartsTooltip content={<CustomWeekTooltip />} cursor={{ fill: '#f8fafc' }} />
                                    <Bar dataKey="revenue" name="Doanh thu" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={60} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                )}

            </Spin>
        </div>
    );
};

export default DashboardCharts;