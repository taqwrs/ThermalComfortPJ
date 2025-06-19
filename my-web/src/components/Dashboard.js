"use client";
import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser, faInfoCircle, faHistory, faHeartbeat, faMeh, faFrown, faSadTear, faSmile, faGrinBeam, faWind,
    faSearch, faEdit, faThermometerHalf, faTint, faPlus
} from '@fortawesome/free-solid-svg-icons';

// ประกาศคอมโพเนนต์ Dashboard
export default function Dashboard({ selectedHN, setSelectedHN, setCurrentView }) {
    // ใช้ useState เพื่อสร้าง state ต่าง ๆ
    const [dashboardData, setDashboardData] = useState(null); // เก็บข้อมูล dashboard
    const [loading, setLoading] = useState(false); // เก็บสถานะ loading
    const [error, setError] = useState(''); // เก็บข้อความ error
    const [currentDateTime, setCurrentDateTime] = useState(''); // เก็บวันที่และเวลาปัจจุบัน
    const [showAllPredictions, setShowAllPredictions] = useState(false); // เก็บสถานะการแสดงประวัติทั้งหมด

    // useEffect สำหรับอัปเดตวันที่และเวลาปัจจุบันทุกวินาที
    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date(); // สร้าง object Date สำหรับเวลาปัจจุบัน
            const formattedDateTime = now.toLocaleString('en-GB', { // จัดรูปแบบวันที่และเวลา
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
            setCurrentDateTime(formattedDateTime); // อัปเดต state currentDateTime
        };

        updateDateTime(); // เรียกฟังก์ชัน updateDateTime ทันทีเมื่อ component เรนเดอร์
        const interval = setInterval(updateDateTime, 1000); // ตั้ง interval ให้เรียกฟังก์ชันทุก 1 วินาที

        return () => clearInterval(interval); // ลบ interval เมื่อ component ถูกลบออกจาก DOM
    }, []); // ไม่มี dependencies ดังนั้นจะทำงานเพียงครั้งเดียวเมื่อ component เรนเดอร์

    // ฟังก์ชันสำหรับดึงข้อมูล dashboard จาก API
    const fetchDashboardData = useCallback(async () => {
        if (!selectedHN) return; // ถ้าไม่มี selectedHN ให้หยุดการทำงาน

        console.log("Fetching data for HN:", selectedHN); // แสดง log สำหรับ debug

        setLoading(true); // ตั้งค่า loading เป็น true
        setError(''); // ล้างข้อความ error

        try {
            const response = await fetch(`http://localhost:8000/dashboard?HN=${selectedHN}`); // ส่ง request ไปยัง API
            if (!response.ok) { // ถ้า response ไม่สำเร็จ
                if (response.status === 404) { // ถ้าไม่พบข้อมูล
                    setError("Patient not found. Please check the HN and try again.");
                } else {
                    setError(`HTTP error! status: ${response.status}`);
                }
                return;
            }
            const data = await response.json(); // แปลง response เป็น JSON
            console.log("Fetched data:", data); // แสดง log สำหรับ debug
            setDashboardData(data); // อัปเดต state dashboardData
        } catch (error) {
            console.error("Error fetching dashboard data:", error); // แสดง error ใน console
            setError("Failed to fetch dashboard data. Please try again."); // อัปเดต state error
        } finally {
            setLoading(false); // ตั้งค่า loading เป็น false เมื่อเสร็จสิ้น
        }
    }, [selectedHN]); // ฟังก์ชันนี้จะทำงานเมื่อ selectedHN เปลี่ยนแปลง

    // useEffect สำหรับเรียก fetchDashboardData เมื่อ selectedHN เปลี่ยนแปลง
    useEffect(() => {
        if (selectedHN) {
            fetchDashboardData(); // เรียกฟังก์ชัน fetchDashboardData
        }
    }, [selectedHN, fetchDashboardData]); // ทำงานเมื่อ selectedHN หรือ fetchDashboardData เปลี่ยนแปลง

    // ฟังก์ชันสำหรับกำหนดสีตามระดับความสบาย
    const getPredictionColor = (prediction) => {
        switch (prediction) {
            case 0: return "bg-yellow-400"; // Neutral
            case 1: return "bg-red-800"; // Very Uncomfortable
            case 2: return "bg-red-500"; // Uncomfortable
            case 3: return "bg-green-400"; // Comfortable
            case 4: return "bg-green-600"; // Very Comfortable
            default: return "bg-gray-200"; // Default color
        }
    };

    // ฟังก์ชันสำหรับกำหนดไอคอนตามระดับความสบาย
    const getPredictionIcon = (prediction) => {
        switch (prediction) {
            case 0: return <FontAwesomeIcon icon={faMeh} size="3x" />; // Neutral
            case 1: return <FontAwesomeIcon icon={faFrown} size="3x" />; // Very Uncomfortable
            case 2: return <FontAwesomeIcon icon={faSadTear} size="3x" />; // Uncomfortable
            case 3: return <FontAwesomeIcon icon={faSmile} size="3x" />; // Comfortable
            case 4: return <FontAwesomeIcon icon={faGrinBeam} size="3x" />; // Very Comfortable
            default: return null; // ไม่มีไอคอน
        }
    };

    // ฟังก์ชันสำหรับกำหนดข้อความตามระดับความสบาย
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

    // ฟังก์ชันสำหรับกำหนดข้อความตามระดับความสบาย (เหมือนกับ getComfortLevelLabel)
    const getPredictionText = (prediction) => {
        switch (prediction) {
            case 0: return "Neutral";
            case 1: return "Very Uncomfortable";
            case 2: return "Uncomfortable";
            case 3: return "Comfortable";
            case 4: return "Very Comfortable";
            default: return "Unknown";
        }
    };

    // ฟังก์ชันสำหรับกำหนดคำแนะนำตามระดับความสบาย
    const getRecommendation = (prediction) => {
        switch (prediction) {
            case 0: return "Maintain your current conditions for continued comfort.";
            case 1: return "Consider adjusting the environment, such as using a fan or cooling measures.";
            case 2: return "Increase airflow or lower the temperature to improve comfort.";
            case 3: return "Your comfort level is good, continue your current environment.";
            case 4: return "You are in an ideal comfort state, no changes needed.";
            default: return "No recommendation available.";
        }
    };

    // ฟังก์ชันสำหรับกำหนด gradient สีตามระดับความสบาย
    const getPredictionGradient = (prediction) => {
        switch (prediction) {
            case 0: return "bg-gradient-to-b from-white to-yellow-200"; // Neutral
            case 1: return "bg-gradient-to-b from-white to-red-500"; // Very Uncomfortable
            case 2: return "bg-gradient-to-b from-white to-red-300"; // Uncomfortable
            case 3: return "bg-gradient-to-b from-white to-green-300"; // Comfortable
            case 4: return "bg-gradient-to-b from-white to-green-400"; // Very Comfortable
            default: return "bg-gradient-to-b from-white to-gray-200"; // Unknown
        }
    };

    // ฟังก์ชันสำหรับคำนวณเวลาที่ผ่านมา
    const timeSince = (date) => {
        const now = new Date(); // เวลาปัจจุบัน
        const past = new Date(date); // เวลาในอดีต
        const seconds = Math.floor((now - past) / 1000); // คำนวณเวลาที่ผ่านมาเป็นวินาที

        let interval = seconds / 31536000; // คำนวณเป็นปี
        if (interval > 1) {
            return Math.floor(interval) + " years ago";
        }
        interval = seconds / 2592000; // คำนวณเป็นเดือน
        if (interval > 1) {
            return Math.floor(interval) + " months ago";
        }
        interval = seconds / 86400; // คำนวณเป็นวัน
        if (interval > 1) {
            return Math.floor(interval) + " days ago";
        }
        interval = seconds / 3600; // คำนวณเป็นชั่วโมง
        if (interval > 1) {
            return Math.floor(interval) + " hours ago";
        }
        interval = seconds / 60; // คำนวณเป็นนาที
        if (interval > 1) {
            return Math.floor(interval) + " minutes ago";
        }
        return Math.floor(seconds) + " seconds ago"; // คืนค่าเป็นวินาที
    };

    // ฟังก์ชันสำหรับสลับการแสดงประวัติทั้งหมด
    const toggleShowAllPredictions = () => {
        setShowAllPredictions(!showAllPredictions); // สลับค่า showAllPredictions
    };

    // JSX สำหรับการเรนเดอร์ component
    return (
        <div className="p-6 bg-white min-h-screen pb-20">
            <header className="text-center mb-4">
                <h1 className="text-4xl font-bold mb-12 pt-8 text-center text-emerald-600">Preventive Medicine - Dashboard</h1>
            </header>
            <div className="mb-6">
                {/* วันที่และเวลา */}
                <p className="text-gray-600 mb-2 text-right">{currentDateTime}</p>

                {/* HN Selector */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faSearch} className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition duration-200 text-gray-800 placeholder-gray-400"
                        value={selectedHN}
                        onChange={(e) => setSelectedHN(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                fetchDashboardData(); // เรียกใช้ฟังก์ชันเมื่อกด Enter
                            }
                        }}
                        placeholder="Select HN"
                    />
                </div>
            </div>

            {loading && <div className="text-center mt-10 text-gray-600">Loading...</div>}
            {error && <div className="text-center mt-10 text-red-600 font-semibold">{error}</div>}

            {dashboardData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Block 1: Patient Details and Block 2: Prediction History */}
                    <div className="col-span-2 flex flex-col gap-6">
                        {/* Block 1: Patient Details */}
                        <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full">
                            <h2 className="text-2xl font-semibold text-emerald-600 mb-4">
                                <FontAwesomeIcon icon={faUser} className="mr-2" />
                                Personal Information
                            </h2>
                            <div className="flex items-center space-x-6">
                                <div className="flex-shrink-0">
                                    <img
                                        src={
                                            dashboardData.patient.Gender === "Female"
                                                ? "/img/Female.png"
                                                : "/img/Male.png"
                                        }
                                        alt="Profile"
                                        className="w-24 h-24 rounded-full object-cover border-4 border-emerald-200"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                                    <p><strong>HN:</strong> {dashboardData.patient.HN}</p>
                                    <p><strong>Room Number:</strong> {dashboardData.patient.RoomNumber}</p>
                                    <p><strong>Name:</strong> {dashboardData.patient.FirstName} {dashboardData.patient.LastName}</p>
                                    <p><strong>Gender:</strong> {dashboardData.patient.Gender}</p>
                                    <p><strong>Height:</strong> {dashboardData.patient.Height} cm</p>
                                    <p><strong>Weight:</strong> {dashboardData.patient.Weight} kg</p>
                                    <p><strong>Age:</strong> {dashboardData.patient.Age}</p>
                                </div>
                            </div>
                        </div>

                        {/* Block 2: Prediction History */}
                        <div className="bg-gray-100 p-4 rounded-lg shadow-lg h-[350px] overflow-y-auto">
                            <h2 className="text-2xl font-semibold text-emerald-600 mb-4">
                                <FontAwesomeIcon icon={faHistory} className="mr-2" />
                                Prediction History
                            </h2>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comfort Level</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-100 divide-y divide-gray-200">
                                    {dashboardData.predictions.slice(0, 3).map((prediction, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(prediction.Timestamp).toLocaleString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                    hour12: true
                                                })}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center space-x-2">
                                                    <div className={`w-64 h-12 flex items-center justify-center rounded-lg ${getPredictionColor(prediction.PredictedComfortLevel)}`}>
                                                        <p className="text-white font-semibold text-sm text-center">
                                                            {getPredictionText(prediction.PredictedComfortLevel)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-4 flex justify-left">
                                <button
                                    onClick={() => setCurrentView('visualization')}
                                    className="text-emerald-600 hover:text-emerald-800 font-semibold transition duration-200"
                                >
                                    View Full History
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Block 4: Comfort Level Status and Latest Prediction Inputs */}
                    <div className="col-span-1 flex flex-col gap-6">
                        {/* Comfort Level Status */}
                        <div className={`p-6 rounded-lg shadow-lg ${getPredictionGradient(dashboardData.latest_prediction.PredictedComfortLevel)} w-full h-[240px]`}>
                            <h2 className="text-2xl font-semibold text-emerald-600 mb-4">
                                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                                Comfort Level Status
                            </h2>
                            {dashboardData.latest_prediction ? (
                                <div className="text-center">
                                    <div className="flex justify-center">
                                        <div
                                            className={`p-8 rounded-xl flex items-center justify-center ${getPredictionColor(dashboardData.latest_prediction.PredictedComfortLevel)}`}
                                            style={{ width: '350px', height: '60px' }}
                                        >
                                            <p className="text-xl font-bold text-white">
                                                {getPredictionText(dashboardData.latest_prediction.PredictedComfortLevel)}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-gray-800">
                                        {getRecommendation(dashboardData.latest_prediction.PredictedComfortLevel)}
                                    </p>
                                    <p className="mt-2 text-gray-500">
                                        Last updated: {timeSince(dashboardData.latest_prediction.Timestamp)}
                                    </p>
                                </div>
                            ) : (
                                <p>No comfort level data available.</p>
                            )}
                        </div>

                        {/* Latest Prediction Inputs */}
                        <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full h-[350px]">
                            <h2 className="text-2xl font-semibold text-emerald-600 mb-4">
                                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                Latest Prediction Inputs
                            </h2>
                            {dashboardData.latest_prediction ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-2 rounded-lg shadow-md">
                                        <FontAwesomeIcon icon={faWind} className="text-emerald-600 text-2xl mb-2" />
                                        <h3 className="text-lg font-semibold mb-1">Wind</h3>
                                        <p className="text-gray-600">{dashboardData.latest_prediction.Wind || 'N/A'} m/s</p>
                                    </div>
                                    <div className="bg-white p-2 rounded-lg shadow-md">
                                        <FontAwesomeIcon icon={faThermometerHalf} className="text-emerald-600 text-2xl mb-2" />
                                        <h3 className="text-lg font-semibold mb-1">Skin Temperature</h3>
                                        <p className="text-gray-600">{dashboardData.latest_prediction.SkinTemp || 'N/A'} °C</p>
                                    </div>
                                    <div className="bg-white p-2 rounded-lg shadow-md">
                                        <FontAwesomeIcon icon={faTint} className="text-emerald-600 text-2xl mb-2" />
                                        <h3 className="text-lg font-semibold mb-1">Tonic</h3>
                                        <p className="text-gray-600">{dashboardData.latest_prediction.Tonic || 'N/A'} µS</p>
                                    </div>
                                    <div className="bg-white p-2 rounded-lg shadow-md">
                                        <FontAwesomeIcon icon={faHeartbeat} className="text-emerald-600 text-2xl mb-2" />
                                        <h3 className="text-lg font-semibold mb-1">LFHF</h3>
                                        <p className="text-gray-600">{dashboardData.latest_prediction.LFHF || 'N/A'} µS</p>
                                    </div>
                                </div>
                            ) : (
                                <p>No latest prediction inputs available.</p>
                            )}

                            {/* Add Data for Predict Button */}
                            <div className="mt-2 flex justify-center">
                                <button
                                    onClick={() => setCurrentView('predict')}
                                    className="text-emerald-600 hover:text-emerald-800 font-semibold transition duration-200"
                                >
                                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                    Add Data for Predict
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}