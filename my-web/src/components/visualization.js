"use client";

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faWind, faThermometerHalf, faTint, faHeartbeat, faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons';

// กำหนดสีสำหรับแต่ละ comfort level ใน Pie Chart
const COLORS = ["#A31D1D", "#DC2626", "#FFD95F", "#9DC08B", "#3A7D44"];

export default function Visualization({ selectedHN, setCurrentView }) {
    // State สำหรับเก็บข้อมูลการทำนาย
    const [predictionData, setPredictionData] = useState([]);
    // State สำหรับเก็บค่าเฉลี่ยของข้อมูล
    const [averageData, setAverageData] = useState({});
    // State สำหรับเก็บประวัติการทำนาย
    const [predictionHistory, setPredictionHistory] = useState([]);
    // State สำหรับจัดการสถานะการโหลดข้อมูล
    const [loading, setLoading] = useState(true);
    // State สำหรับจัดการข้อผิดพลาด
    const [error, setError] = useState('');
    // State สำหรับจัดการการกรองข้อมูลตามเวลา
    const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'day', 'week', 'month'

    // ใช้ useEffect เพื่อ fetch ข้อมูลเมื่อ selectedHN หรือ timeFilter เปลี่ยนแปลง
    useEffect(() => {
        if (!selectedHN) {
            setError("HN parameter is missing.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch ข้อมูลจาก API
                const response = await fetch(`http://localhost:8000/dashboard?HN=${selectedHN}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // จัดรูปแบบข้อมูลการทำนาย
                const formattedData = formatPredictionData(data.predictions);
                setPredictionData(formattedData);
                // เก็บประวัติการทำนาย
                setPredictionHistory(data.predictions);
                // คำนวณค่าเฉลี่ยของข้อมูล
                calculateAverages(data.predictions);
            } catch (error) {
                console.error("Error fetching prediction data:", error);
                setError("Failed to fetch prediction data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedHN, timeFilter]);

    // ฟังก์ชันสำหรับจัดรูปแบบข้อมูลการทำนายให้อยู่ในรูปแบบที่เหมาะสมสำหรับ Pie Chart
    const formatPredictionData = (predictions) => {
        if (!predictions || predictions.length === 0) {
            return [];
        }

        // กำหนด object เพื่อนับจำนวนการทำนายแต่ละ comfort level
        const comfortLevels = {
            "Very Uncomfortable": 0,
            "Uncomfortable": 0,
            "Neutral": 0,
            "Comfortable": 0,
            "Very Comfortable": 0,
        };

        // นับจำนวนการทำนายแต่ละ comfort level
        predictions.forEach((prediction) => {
            const level = getComfortLevelLabel(prediction.PredictedComfortLevel);
            comfortLevels[level]++;
        });

        const totalPredictions = predictions.length;

        // แปลงจำนวนการทำนายเป็นเปอร์เซ็นต์
        return Object.keys(comfortLevels).map((level) => ({
            name: level,
            value: comfortLevels[level] > 0
                ? parseFloat(((comfortLevels[level] / totalPredictions) * 100).toFixed(2))
                : 0,
            count: comfortLevels[level] // เก็บจำนวนการทำนายไว้สำหรับอ้างอิง
        }));
    };

    // ฟังก์ชันสำหรับคำนวณค่าเฉลี่ยของข้อมูล
    const calculateAverages = (predictions) => {
        const averages = {
            "Very Uncomfortable": { Wind: 0, SkinTemp: 0, Tonic: 0, LFHF: 0, count: 0 },
            "Uncomfortable": { Wind: 0, SkinTemp: 0, Tonic: 0, LFHF: 0, count: 0 },
            "Neutral": { Wind: 0, SkinTemp: 0, Tonic: 0, LFHF: 0, count: 0 },
            "Comfortable": { Wind: 0, SkinTemp: 0, Tonic: 0, LFHF: 0, count: 0 },
            "Very Comfortable": { Wind: 0, SkinTemp: 0, Tonic: 0, LFHF: 0, count: 0 },
        };

        // คำนวณผลรวมของข้อมูลแต่ละ comfort level
        predictions.forEach((prediction) => {
            const level = getComfortLevelLabel(prediction.PredictedComfortLevel);
            averages[level].Wind += prediction.Wind || 0;
            averages[level].SkinTemp += prediction.SkinTemp || 0;
            averages[level].Tonic += prediction.Tonic || 0;
            averages[level].LFHF += prediction.LFHF || 0;
            averages[level].count++;
        });

        // คำนวณค่าเฉลี่ย
        Object.keys(averages).forEach((level) => {
            if (averages[level].count > 0) {
                averages[level].Wind = (averages[level].Wind / averages[level].count).toFixed(2);
                averages[level].SkinTemp = (averages[level].SkinTemp / averages[level].count).toFixed(2);
                averages[level].Tonic = (averages[level].Tonic / averages[level].count).toFixed(2);
                averages[level].LFHF = (averages[level].LFHF / averages[level].count).toFixed(2);
            }
        });

        setAverageData(averages);
    };

    // ฟังก์ชันสำหรับแปลงค่าตัวเลขของ comfort level เป็นข้อความ
    const getComfortLevelLabel = (prediction) => {
        switch (prediction) {
            case 0: return "Neutral";
            case 1: return "Very Uncomfortable";
            case 2: return "Uncomfortable";
            case 3: return "Comfortable";
            case 4: return "Very Comfortable";
            default: return "Unknown";
        }
    };

    // ฟังก์ชันสำหรับกำหนดสีของแต่ละ comfort level
    const getPredictionColor = (level) => {
        switch (level) {
            case "Very Uncomfortable": return "bg-red-800";
            case "Uncomfortable": return "bg-red-500";
            case "Neutral": return "bg-yellow-400";
            case "Comfortable": return "bg-green-400";
            case "Very Comfortable": return "bg-green-600";
            default: return "bg-gray-200";
        }
    };

    // ฟังก์ชันสำหรับกลับไปยังหน้า Dashboard
    const handleBackToDashboard = () => {
        setCurrentView('dashboard');
    };

    // ฟังก์ชันสำหรับกรองข้อมูลตามช่วงเวลา
    const filterDataByTime = (predictions) => {
        const now = new Date();
        switch (timeFilter) {
            case 'day':
                return predictions.filter((prediction) => {
                    const predictionDate = new Date(prediction.Timestamp);
                    return predictionDate.toDateString() === now.toDateString();
                });
            case 'week':
                return predictions.filter((prediction) => {
                    const predictionDate = new Date(prediction.Timestamp);
                    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                    return predictionDate >= startOfWeek;
                });
            case 'month':
                return predictions.filter((prediction) => {
                    const predictionDate = new Date(prediction.Timestamp);
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                    return predictionDate >= startOfMonth;
                });
            default:
                return predictions;
        }
    };

    // กรองข้อมูลการทำนายตามช่วงเวลาที่เลือก
    const filteredPredictions = filterDataByTime(predictionHistory);
    const filteredPredictionData = formatPredictionData(filteredPredictions);

    // Custom Tooltip สำหรับ Pie Chart
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length > 0 && payload[0].value > 0) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
                    <p className="font-semibold text-gray-900">{payload[0].name}</p>
                    <p className="text-gray-700">{`${payload[0].value}% (${payload[0].payload.count} records)`}</p>
                </div>
            );
        }
        return null;
    };

    // แสดง loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
                    <p className="mt-4 text-gray-600">Loading prediction data...</p>
                </div>
            </div>
        );
    }

    // แสดง error state
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <p className="text-red-600 font-semibold">{error}</p>
                    <button
                        onClick={handleBackToDashboard}
                        className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition duration-200"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Render หน้า Visualization
    return (
        <div className="p-6 bg-white min-h-screen pb-24">
            <button
                onClick={handleBackToDashboard}
                className="mb-6 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition duration-200"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back to Dashboard
            </button>

            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-emerald-600 mb-2">Prediction History Visualization</h1>
                <p className="text-gray-600">Distribution of comfort levels based on historical predictions.</p>
            </div>

            <div className="mb-6 flex justify-center space-x-4">
                {['all', 'day', 'week', 'month'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setTimeFilter(filter)}
                        className={`px-4 py-2 rounded-lg ${timeFilter === filter ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        {filter === 'all' ? 'All Time' : `Last ${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* ส่วนของ Pie Chart */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-emerald-600 mb-4">Comfort Level Distribution (%)</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart margin={{ top: 20 }}>
                            <Pie
                                data={filteredPredictionData}
                                cx="50%"
                                cy="50%"
                                outerRadius={150}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ value, payload }) => `${value}% (${payload.count})`}
                            >
                                {filteredPredictionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                wrapperStyle={{
                                    paddingTop: '20px',
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* ส่วนของประวัติการทำนาย */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-emerald-600 mb-4">Prediction History</h2>
                    <div className="max-h-[500px] overflow-y-auto">
                        {filteredPredictions.map((prediction, index) => (
                            <div key={index} className="bg-white p-4 mb-4 rounded-lg border border-gray-200">
                                <div className="flex items-center space-x-4">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500" />
                                    <p className="text-gray-700">{new Date(prediction.Timestamp).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center space-x-4 mt-2">
                                    <FontAwesomeIcon icon={faClock} className="text-gray-500" />
                                    <p className="text-gray-700">{new Date(prediction.Timestamp).toLocaleTimeString()}</p>
                                </div>
                                <div className="mt-4">
                                    <p className="text-gray-900 font-semibold">Comfort Level: {getComfortLevelLabel(prediction.PredictedComfortLevel)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg shadow-lg mt-8">
                <h2 className="text-2xl font-semibold text-emerald-600 mb-6 text-center">
                    Average Metrics Influencing Patient Comfort Levels
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {filteredPredictionData.map((entry, index) => (
                        <div key={index} className={`p-4 rounded-lg shadow-lg border border-gray-200 ${getPredictionColor(entry.name)} min-w-[200px]`}>
                            <div className="flex justify-center mb-4">
                                <div className="bg-white bg-opacity-90 px-4 py-2 rounded-lg shadow-sm">
                                    <p className="text-xl font-semibold text-gray-900 text-center">{entry.name}</p>
                                </div>
                            </div>
                            <p className="text-white font-medium mb-4 text-center">{entry.count} records</p>
                            <div className="space-y-2">
                                <div className="bg-white bg-opacity-80 p-3 rounded-lg shadow-sm flex items-center space-x-3">
                                    <FontAwesomeIcon icon={faWind} className="text-gray-500" />
                                    <p className="text-gray-900">Wind: {averageData[entry.name]?.Wind || 0} m/s</p>
                                </div>
                                <div className="bg-white bg-opacity-80 p-3 rounded-lg shadow-sm flex items-center space-x-3">
                                    <FontAwesomeIcon icon={faThermometerHalf} className="text-gray-500" />
                                    <p className="text-gray-900">Skin Temp: {averageData[entry.name]?.SkinTemp || 0} °C</p>
                                </div>
                                <div className="bg-white bg-opacity-80 p-3 rounded-lg shadow-sm flex items-center space-x-3">
                                    <FontAwesomeIcon icon={faTint} className="text-gray-500" />
                                    <p className="text-gray-900">Tonic: {averageData[entry.name]?.Tonic || 0} µS</p>
                                </div>
                                <div className="bg-white bg-opacity-80 p-3 rounded-lg shadow-sm flex items-center space-x-3">
                                    <FontAwesomeIcon icon={faHeartbeat} className="text-gray-500" />
                                    <p className="text-gray-900">LFHF: {averageData[entry.name]?.LFHF || 0} µS</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}