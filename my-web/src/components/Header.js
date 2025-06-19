"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // นำเข้า FontAwesomeIcon สำหรับแสดงไอคอน
import { faUser, faChartLine, faSignInAlt, faChartPie, faChartArea } from '@fortawesome/free-solid-svg-icons'; // นำเข้าไอคอนต่าง ๆ จาก FontAwesome

export default function Header({ onNavClick, isLoggedIn, onLogout, showVisualizationButton }) {
    return (
        <header className="bg-emerald-600 text-white py-4 px-2 w-full shadow-md fixed top-0 left-0 right-0 z-50">
            {/* Container สำหรับจัดวางเนื้อหา */}
            <div className="max-w-8xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
                    {/* ส่วนซ้าย: Logo และชื่อแอปพลิเคชัน */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={() => onNavClick('home')} // คลิกเพื่อกลับไปหน้า Home
                            className="flex items-center gap-3 hover:opacity-80 transition-opacity transform hover:scale-105"
                        >
                            <img src="/img/Logo.png" alt="Logo" className="w-16 h-16 md:w-12 md:h-12" /> {/* แสดงโลโก้ */}
                            <h1 className="text-xl md:text-2xl font-bold text-white"> Preventive Medicine - Based Application </h1> {/* ชื่อแอปพลิเคชัน */}
                        </button>
                    </div>

                    {/* ส่วนขวา: เมนูนำทาง */}
                    <nav className="flex flex-row gap-4">
                        {/* ปุ่ม Dashboard */}
                        <button
                            onClick={() => onNavClick('dashboard')} // คลิกเพื่อไปหน้า Dashboard
                            className="flex items-center gap-2 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-all transform hover:scale-105 hover:shadow-md"
                        >
                            <FontAwesomeIcon icon={faChartPie} className="w-5 h-5" /> {/* ไอคอน Dashboard */}
                            <span className="text-sm md:text-base">Dashboard</span> {/* ข้อความ Dashboard */}
                        </button>

                        {/* ปุ่ม Patients */}
                        <button
                            onClick={() => onNavClick('patients')} // คลิกเพื่อไปหน้า Patients
                            className="flex items-center gap-2 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-all transform hover:scale-105 hover:shadow-md"
                        >
                            <FontAwesomeIcon icon={faUser} className="w-5 h-5" /> {/* ไอคอน Patients */}
                            <span className="text-sm md:text-base">Patients</span> {/* ข้อความ Patients */}
                        </button>

                        {/* ปุ่ม Prediction */}
                        <button
                            onClick={() => onNavClick('predict')} // คลิกเพื่อไปหน้า Prediction
                            className="flex items-center gap-2 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-all transform hover:scale-105 hover:shadow-md"
                        >
                            <FontAwesomeIcon icon={faChartLine} className="w-5 h-5" /> {/* ไอคอน Prediction */}
                            <span className="text-sm md:text-base">Prediction</span> {/* ข้อความ Prediction */}
                        </button>

                        {/* ปุ่ม Visualization (แสดงเฉพาะเมื่อ showVisualizationButton เป็น true) */}
                        {showVisualizationButton && (
                            <button
                                onClick={() => onNavClick('visualization')} // คลิกเพื่อไปหน้า Visualization
                                className="flex items-center gap-2 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-all transform hover:scale-105 hover:shadow-md"
                            >
                                <FontAwesomeIcon icon={faChartArea} className="w-5 h-5" /> {/* ไอคอน Visualization */}
                                <span className="text-sm md:text-base">Visualization</span> {/* ข้อความ Visualization */}
                            </button>
                        )}

                        {/* แสดง UI แตกต่างกันตามสถานะการล็อกอิน */}
                        {isLoggedIn ? (
                            // ถ้าเข้าสู่ระบบแล้ว แสดงรูปโปรไฟล์ที่คลิกแล้วล็อกเอาท์
                            <div className="flex items-center gap-2">
                                <img
                                    src="/img/profile.png"
                                    alt="User Profile"
                                    className="w-10 h-10 rounded-full cursor-pointer transition-opacity transform hover:scale-110 shadow-md"
                                    onClick={onLogout}
                                    title="Click to logout" // เพิ่ม title เพื่อแสดง tooltip เมื่อนำเมาส์ไปวาง
                                    aria-label="Logout" // เพิ่ม aria-label สำหรับการเข้าถึง
                                />
                            </div>
                        ) : (
                            // ถ้ายังไม่เข้าสู่ระบบ แสดงปุ่ม Login
                            <button
                                onClick={() => onNavClick('login')} // คลิกเพื่อไปหน้า Login
                                className="flex items-center gap-2 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-all transform hover:scale-105 hover:shadow-md"
                            >
                                <FontAwesomeIcon icon={faSignInAlt} className="w-5 h-5" /> {/* ไอคอน Login */}
                                <span className="text-sm md:text-base">Login</span> {/* ข้อความ Login */}
                            </button>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}