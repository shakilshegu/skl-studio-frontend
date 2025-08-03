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
import { Calendar, TrendingUp, BarChart3, Activity } from "lucide-react";

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

    // Sample data - replace with your actual data
    const revenueData = [
        589.12, 203.00, 896.00, 920.12, 882.00, 398.00, 390.00, 400.01, 589.12,
        203.00, 896.00, 920.12, 882.00, 398.00, 390.00, 400.01, 589.12, 203.00,
        896.00, 920.12, 882.00, 398.00, 390.00, 400.01, 589.12, 896.00, 589.12,
        896.00, 400.01, 203.00, 400.00,
    ];

    const getLabels = () => {
        if (timeRange === "weekly") {
            return ["Week 1", "Week 2", "Week 3", "Week 4"];
        } else if (timeRange === "yearly") {
            return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        }
        return Array.from({ length: 31 }, (_, i) => i + 1);
    };

    const getData = () => {
        let data = revenueData;
        if (timeRange === "weekly") {
            data = [15420, 18650, 14230, 19840]; // Sample weekly data
        } else if (timeRange === "yearly") {
            data = [45230, 52140, 48650, 58920, 62340, 55780, 59640, 67890, 71200, 68450, 72340, 75680]; // Sample yearly data
        }

        return data;
    };

    const createGradient = (ctx, area) => {
        const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
        gradient.addColorStop(0, 'rgba(137, 37, 128, 0.1)');
        gradient.addColorStop(0.5, 'rgba(137, 37, 128, 0.3)');
        gradient.addColorStop(1, 'rgba(137, 37, 128, 0.8)');
        return gradient;
    };

    const barData = {
        labels: getLabels(),
        datasets: [
            {
                label: "Revenue",
                data: getData(),
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return null;
                    return createGradient(ctx, chartArea);
                },
                borderColor: "#2563EB",
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
        labels: getLabels(),
        datasets: [
            {
                label: "Revenue",
                data: getData(),
                borderColor: "#2563EB",
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return null;
                    return createGradient(ctx, chartArea);
                },
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "#2563EB",
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
                borderColor: '#2563EB',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    title: function (tooltipItems) {
                        const label = tooltipItems[0].label;
                        if (timeRange === "monthly") {
                            return `Day ${label}, January 2024`;
                        } else if (timeRange === "weekly") {
                            return `${label}, January 2024`;
                        } else {
                            return `${label} 2024`;
                        }
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
                    text: timeRange === "monthly" ? "January 2024" : timeRange === "weekly" ? "Weeks in January 2024" : "Months in 2024",
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
                                        ? "bg-white text-[#2563EB] shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                <option.icon size={16} />
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time Range Selector */}
                <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Period:</span>
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white"
                    >
                        {timeRangeOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Chart Container */}
            <div className="relative w-full h-96 bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="w-full h-full">
                    {chartType === "bar" ? (
                        <Bar data={barData} options={options} />
                    ) : (
                        <Line data={lineData} options={options} />
                    )}
                </div>
            </div>

        </div>
    );
};

export default RevenueChart;