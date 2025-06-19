"use client";
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faThermometerHalf, faWind, faHeartbeat, faTachometerAlt, faWeight, faRulerVertical, faChartLine, faLightbulb, faUserMd, faHospital
} from '@fortawesome/free-solid-svg-icons';

export default function Body() {
    const [currentSection, setCurrentSection] = useState(0); // 0 = Why Choose Us, 1 = How It Works, 2 = Key Features

    const handleNext = () => {
        if (currentSection === 2) {
            alert("You've viewed all sections. Redirecting to Login...");
            // ทำการ redirect ไปหน้า Login หรือทำ action อื่น ๆ
            // เช่น router.push('/login');
        } else {
            setCurrentSection((prev) => prev + 1); // ไปยัง section ถัดไป
        }
    };

    const handleBack = () => {
        if (currentSection > 0) {
            setCurrentSection((prev) => prev - 1); // ย้อนกลับไป section ก่อนหน้า
        }
    };

    return (
        <div className="bg-gradient-to-b from-white to-gray-50">
            {/* Why Choose Us Section */}
            {currentSection === 0 && (
                <div className="bg-white py-20">
                    <div className="container max-w-7xl mx-auto px-6">
                        <div className="text-center">
                            <span className="bg-emerald-100 text-emerald-700 text-sm font-medium py-1 px-3 rounded-full">Our Value</span>
                            <h2 className="text-4xl font-bold text-gray-800 mt-4 mb-6">
                                Why Choose Us?
                            </h2>
                            <p className="text-xl text-gray-600 mb-16 max-w-4xl mx-auto">
                                Our system is designed with cutting-edge technology to ensure the best care for your patients.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                            {/* Card 1 */}
                            <div className="bg-gray-100 rounded-xl p-8 shadow-lg border-t-4 border-emerald-500 transform transition duration-500 hover:scale-105 hover:shadow-xl">
                                <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                                    <FontAwesomeIcon icon={faChartLine} className="text-3xl text-emerald-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Advanced Analytics</h3>
                                <p className="text-gray-600 text-lg leading-relaxed">Utilize advanced analytics to predict and optimize thermal comfort for better patient outcomes.</p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-gray-100 rounded-xl p-8 shadow-lg border-t-4 border-emerald-500 transform transition duration-500 hover:scale-105 hover:shadow-xl">
                                <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                                    <FontAwesomeIcon icon={faHeartbeat} className="text-3xl text-emerald-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Patient-Centric</h3>
                                <p className="text-gray-600 text-lg leading-relaxed">Focus on patient well-being with continuous monitoring and adaptive adjustments.</p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-gray-100 rounded-xl p-8 shadow-lg border-t-4 border-emerald-500 transform transition duration-500 hover:scale-105 hover:shadow-xl">
                                <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                                    <FontAwesomeIcon icon={faTachometerAlt} className="text-3xl text-emerald-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Highly Efficient</h3>
                                <p className="text-gray-600 text-lg leading-relaxed">Streamline your workflow with automated systems and intelligent alerts.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* How It Works Section */}
            {currentSection === 1 && (
                <div className="container max-w-7xl mx-auto py-20 px-6 ">
                    <div className="text-center">
                        <span className="bg-emerald-100 text-emerald-700 text-sm font-medium py-1 px-3 rounded-full">How It Works</span>
                        <h2 className="text-4xl font-bold text-gray-800 mt-4 mb-6">
                            System Operation
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                            The system analyzes sensor data and patient physiological information
                            to assess thermal comfort. Key factors include skin temperature, HRV ratio,
                            air movement, and physiological responses.
                        </p>
                    </div>

                    {/* กล่องรายการ */}
                    <div className="flex justify-center">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 w-fit">
                            {/* กล่อง 1 */}
                            <div className="bg-gray-100 rounded-xl shadow-md p-4 border-t-4 border-emerald-500 transform transition duration-300 hover:scale-105">
                                <div className="flex items-start mb-4">
                                    <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1">
                                        <FontAwesomeIcon icon={faThermometerHalf} className="text-emerald-600 text-sm" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">Machine Learning Analysis</h3>
                                </div>
                                <p className="text-gray-600">Utilizes machine learning to analyze thermal comfort based on patient data.</p>
                            </div>

                            {/* กล่อง 2 */}
                            <div className="bg-gray-100 rounded-xl shadow-md p-4 border-t-4 border-emerald-500 transform transition duration-300 hover:scale-105">
                                <div className="flex items-start mb-4">
                                    <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1">
                                        <FontAwesomeIcon icon={faHeartbeat} className="text-emerald-600 text-sm" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">Physiological Data</h3>
                                </div>
                                <p className="text-gray-600">Uses physiological and environmental data for accurate processing.</p>
                            </div>

                            {/* กล่อง 3 */}
                            <div className="bg-gray-100 rounded-xl shadow-md p-4 border-t-4 border-emerald-500 transform transition duration-300 hover:scale-105">
                                <div className="flex items-start mb-4">
                                    <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1">
                                        <FontAwesomeIcon icon={faTachometerAlt} className="text-emerald-600 text-sm" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">Environment Optimization</h3>
                                </div>
                                <p className="text-gray-600">Helps medical professionals optimize patient environments.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Key Features Section */}
            {currentSection === 2 && (
                <div className="bg-gray-50 py-20">
                    <div className="container max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <span className="bg-emerald-100 text-emerald-700 text-sm font-medium py-1 px-3 rounded-full">Key Features</span>
                            <h2 className="text-4xl font-bold text-gray-800 mt-4 mb-6">
                                System Highlights
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                A comprehensive system with features designed for efficient patient care.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
                            {/* Feature 1 */}
                            <div className="bg-gray-100 rounded-xl shadow-md p-6 border-t-4 border-emerald-500 transform transition duration-300 hover:scale-105">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                                        <FontAwesomeIcon icon={faWeight} className="text-xl text-emerald-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">Automatic BMI Calculation</h3>
                                </div>
                                <p className="text-gray-600">Automatically calculates BMI from patient height and weight.</p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-gray-100 rounded-xl shadow-md p-6 border-t-4 border-emerald-500 transform transition duration-300 hover:scale-105">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                                        <FontAwesomeIcon icon={faThermometerHalf} className="text-xl text-emerald-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">Skin Temperature Monitoring</h3>
                                </div>
                                <p className="text-gray-600">Continuously monitors and tracks skin temperature (ST).</p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-gray-100 rounded-xl shadow-md p-6 border-t-4 border-emerald-500 transform transition duration-300 hover:scale-105">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                                        <FontAwesomeIcon icon={faWind} className="text-xl text-emerald-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">Air Flow Detection</h3>
                                </div>
                                <p className="text-gray-600">Detects air velocity around the patient (Wind) to adjust environment.</p>
                            </div>

                            {/* Feature 4 */}
                            <div className="bg-gray-100 rounded-xl shadow-md p-6 border-t-4 border-emerald-500 transform transition duration-300 hover:scale-105">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                                        <FontAwesomeIcon icon={faTachometerAlt} className="text-xl text-emerald-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">Electrodermal Activity</h3>
                                </div>
                                <p className="text-gray-600">Measures electrodermal activity (Tonic) to assess patient condition.</p>
                            </div>

                            {/* Feature 5 */}
                            <div className="bg-gray-100 rounded-xl shadow-md p-6 border-t-4 border-emerald-500 transform transition duration-300 hover:scale-105">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                                        <FontAwesomeIcon icon={faHeartbeat} className="text-xl text-emerald-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">HRV Ratio Analysis</h3>
                                </div>
                                <p className="text-gray-600">Analyzes HRV ratio (LFHF) to evaluate stress and relaxation.</p>
                            </div>

                            {/* Feature 6 */}
                            <div className="bg-gray-100 rounded-xl shadow-md p-6 border-t-4 border-emerald-500 transform transition duration-300 hover:scale-105">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                                        <FontAwesomeIcon icon={faLightbulb} className="text-xl text-emerald-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">Intelligent Alert System</h3>
                                </div>
                                <p className="text-gray-600">Notifies medical team when important changes in patient status occur.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ปุ่ม Next และ Back */}
            <div className="flex justify-center gap-4 mt-2 pb-24"> {/* เพิ่ม gap-4 เพื่อเพิ่มระยะห่างระหว่างปุ่ม */}
                {currentSection > 0 && ( // แสดงปุ่ม Back เฉพาะเมื่อไม่ใช่ section แรก
                    <button
                        onClick={handleBack}
                        className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition duration-200"
                    >
                        Back to {currentSection === 1 ? "Why Choose Us" : "How It Works"}
                    </button>
                )}
                <button
                    onClick={handleNext}
                    className="bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-md hover:bg-emerald-700 transition duration-200"
                >
                    {currentSection === 2 ? "Finish" : "Next Section"}
                </button>
            </div>
        </div>
    );
}