import React, { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Calendar, TrendingUp, BarChart3, Activity, RefreshCw } from "lucide-react";
import { useRevenueAnalytics } from "../../../hooks/usePartnerDashboard";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const RevenueChart = () => {
    const [chartType, setChartType] = useState("bar");
    const [timeRange, setTimeRange] = useState("monthly");
    
    // Get current date for default values
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth() + 1);

    // Fetch revenue analytics data
    const {
        data: revenueResponse,
        isLoading,
        error,
        refetch,
        isFetching
    } = useRevenueAnalytics({ 
        timeRange, 
        year, 
        month: timeRange === 'yearly' ? undefined : month 
    });

    const revenueData = revenueResponse?.data;

    const createGradient = (ctx, area) => {
        const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
        gradient.addColorStop(0, 'rgba(137, 37, 128, 0.1)');
        gradient.addColorStop(0.5, 'rgba(137, 37, 128, 0.3)');
        gradient.addColorStop(1, 'rgba(137, 37, 128, 0.8)');
        return gradient;
    };

    // Use API data or fallback to empty arrays
    const labels = revenueData?.labels || [];
    const revenue = revenueData?.revenue || [];

    const barData = {
        labels,
        datasets: [
            {
                label: "Revenue",
                data: revenue,
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return null;
                    return createGradient(ctx, chartArea);
                },
                borderColor: "#892580",
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
                hoverBackgroundColor: "#a32d96",
                hoverBorderColor: "#711f68",
                hoverBorderWidth: 3,
            },
        ],
    };

    const lineData = {
        labels,
        datasets: [
            {
                label: "Revenue",
                data: revenue,
                borderColor: "#892580",
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return null;
                    return createGradient(ctx, chartArea);
                },
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "#892580",
                pointBorderColor: "#ffffff",
                pointBorderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: "#a32d96",
                pointHoverBorderColor: "#ffffff",
                pointHoverBorderWidth: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index',
        },
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart',
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#892580',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    title: function (tooltipItems) {
                        const label = tooltipItems[0].label;
                        return `${label}`;
                    },
                    label: function (tooltipItem) {
                        return `Revenue: ₹${tooltipItem.raw.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 12,
                        weight: '500',
                    },
                },
                title: {
                    display: true,
                    text: revenueData?.period || "Data",
                    color: '#374151',
                    font: {
                        size: 14,
                        weight: '600',
                    },
                    padding: 20,
                },
            },
            y: {
                grid: {
                    color: 'rgba(107, 114, 128, 0.1)',
                    drawBorder: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 12,
                        weight: '500',
                    },
                    callback: (value) => `₹${(value/1000).toFixed(0)}K`,
                    padding: 10,
                },
                title: {
                    display: true,
                    text: "Revenue (₹)",
                    color: '#374151',
                    font: {
                        size: 14,
                        weight: '600',
                    },
                    padding: 20,
                },
            },
        },
    };

    const chartTypeOptions = [
        { id: "bar", label: "Bar Chart", icon: BarChart3 },
        { id: "line", label: "Line Chart", icon: Activity },
    ];

    const timeRangeOptions = [
        { id: "weekly", label: "Weekly" },
        { id: "monthly", label: "Monthly" },
        { id: "yearly", label: "Yearly" },
    ];

    const handleTimeRangeChange = (newTimeRange) => {
        setTimeRange(newTimeRange);
    };

    const handleYearChange = (newYear) => {
        setYear(parseInt(newYear));
    };

    const handleMonthChange = (newMonth) => {
        setMonth(parseInt(newMonth));
    };

    // Generate year options (current year ± 5 years)
    const yearOptions = Array.from({ length: 11 }, (_, i) => now.getFullYear() - 5 + i);
    
    // Month options
    const monthOptions = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' },
    ];

    if (error) {
        return (
            <div className="w-full space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-700 mb-4">Error loading revenue data: {error.message}</p>
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            {/* Chart Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                {/* Chart Type Selector */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Chart Type:</span>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        {chartTypeOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => setChartType(option.id)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                                    chartType === option.id
                                        ? "bg-white text-[#892580] shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                <option.icon size={16} />
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time Range and Date Selectors */}
                <div className="flex items-center gap-2 flex-wrap">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Period:</span>
                    
                    {/* Time Range Selector */}
                    <select
                        value={timeRange}
                        onChange={(e) => handleTimeRangeChange(e.target.value)}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#892580] focus:border-transparent bg-white"
                    >
                        {timeRangeOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {/* Year Selector */}
                    <select
                        value={year}
                        onChange={(e) => handleYearChange(e.target.value)}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#892580] focus:border-transparent bg-white"
                    >
                        {yearOptions.map((yearOption) => (
                            <option key={yearOption} value={yearOption}>
                                {yearOption}
                            </option>
                        ))}
                    </select>

                    {/* Month Selector (only for weekly and monthly) */}
                    {timeRange !== 'yearly' && (
                        <select
                            value={month}
                            onChange={(e) => handleMonthChange(e.target.value)}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#892580] focus:border-transparent bg-white"
                        >
                            {monthOptions.map((monthOption) => (
                                <option key={monthOption.value} value={monthOption.value}>
                                    {monthOption.label}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Refresh Button */}
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#892580] bg-purple-50 rounded-lg hover:bg-purple-100 disabled:opacity-50 transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                        {isFetching ? 'Loading...' : 'Refresh'}
                    </button>
                </div>
            </div>

            {/* Chart Container */}
            <div className="relative w-full h-96 bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm">
                {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                            <RefreshCw className="w-8 h-8 animate-spin text-[#892580] mx-auto mb-2" />
                            <p className="text-gray-600">Loading chart data...</p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full">
                        {revenue.length > 0 ? (
                            chartType === "bar" ? (
                                <Bar data={barData} options={options} />
                            ) : (
                                <Line data={lineData} options={options} />
                            )
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p className="text-lg font-medium">No revenue data available</p>
                                    <p className="text-sm">Data will appear here when available</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RevenueChart;