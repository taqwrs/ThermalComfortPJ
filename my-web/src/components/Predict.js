// src/components/predict.js
"use client";
import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMeh, faFrown, faSadTear, faSmile, faGrinBeam } from '@fortawesome/free-solid-svg-icons';

const PredictPage = () => {
  // ใช้ useSearchParams เพื่อดึง query parameters จาก URL
  const searchParams = useSearchParams();
  const hn = searchParams.get('hn');

  // สร้าง state สำหรับเก็บข้อมูลฟอร์ม, ผลลัพธ์การทำนาย, ข้อผิดพลาด, และสถานะการโหลด
  const [formData, setFormData] = useState({
    HN: hn || "",
    SkinTemp: "",
    Wind: "",
    Tonic: "",
    LFHF: "",
    BMI: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // สถานะการโหลด

  // ฟังก์ชันสำหรับอัปเดต state เมื่อผู้ใช้กรอกข้อมูลในฟอร์ม
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ฟังก์ชันสำหรับดึงข้อมูลผู้ป่วยจาก API โดยใช้ HN
  const fetchPatientData = async (HN) => {
    try {
      const response = await axios.get(`http://localhost:8000/patient/${HN}`); // เรียก API เพื่อดึงข้อมูลผู้ป่วย
      const { weight, height } = response.data;
      const calculatedBMI = weight / ((height / 100) ** 2); // คำนวณ BMI
      setFormData((prevData) => ({ ...prevData, BMI: calculatedBMI.toFixed(2) })); // อัปเดต BMI ใน formData
    } catch (err) {
      setError("Failed to fetch patient data. Please check the HN."); // แสดงข้อผิดพลาดหากดึงข้อมูลไม่สำเร็จ
    }
  };

  // ฟังก์ชันสำหรับส่งข้อมูลฟอร์มไปทำนายผล
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);

    // ตรวจสอบว่าข้อมูลทั้งหมดถูกกรอกและเป็นตัวเลข
    const { SkinTemp, Wind, Tonic, LFHF, BMI } = formData;
    if (!SkinTemp || !Wind || !Tonic || !LFHF || !BMI) {
      setError("All fields are required.");
      return;
    }

    if (isNaN(SkinTemp) || isNaN(Wind) || isNaN(Tonic) || isNaN(LFHF) || isNaN(BMI)) {
      setError("All fields must be valid numbers.");
      return;
    }

    setLoading(true); // ตั้งค่าสถานะการโหลดเป็น true

    try {
      const response = await axios.post("http://localhost:8000/predict", formData); // ส่งข้อมูลไปทำนายผล
      setPrediction(response.data.prediction); // อัปเดตผลลัพธ์การทำนาย
    } catch (err) {
      setError("Prediction failed. Please try again."); // แสดงข้อผิดพลาดหากทำนายไม่สำเร็จ
    } finally {
      setLoading(false); // ตั้งค่าสถานะการโหลดเป็น false
    }
  };

  // ใช้ useEffect เพื่อเรียก fetchPatientData เมื่อ formData.HN เปลี่ยนแปลง
  useEffect(() => {
    if (formData.HN) {
      fetchPatientData(formData.HN);
    }
  }, [formData.HN]);

  // ฟังก์ชันสำหรับกำหนดสีตามผลลัพธ์การทำนาย
  const getPredictionColor = (prediction) => {
    switch (prediction) {
      case 0:
        return "bg-yellow-300"; // Neutral
      case 1:
        return "bg-red-800"; // Very Uncomfortable
      case 2:
        return "bg-red-500"; // Uncomfortable
      case 3:
        return "bg-green-200"; // Comfortable
      case 4:
        return "bg-green-600"; // Very Comfortable
      default:
        return "bg-gray-200"; // Default color
    }
  };

  // ฟังก์ชันสำหรับกำหนดไอคอนตามผลลัพธ์การทำนาย
  const getPredictionIcon = (prediction) => {
    switch (prediction) {
      case 0:
        return <FontAwesomeIcon icon={faMeh} size="3x" />;
      case 1:
        return <FontAwesomeIcon icon={faFrown} size="3x" />;
      case 2:
        return <FontAwesomeIcon icon={faSadTear} size="3x" />;
      case 3:
        return <FontAwesomeIcon icon={faSmile} size="3x" />;
      case 4:
        return <FontAwesomeIcon icon={faGrinBeam} size="3x" />;
      default:
        return null;
    }
  };

  // ฟังก์ชันสำหรับกำหนดข้อความตามผลลัพธ์การทำนาย
  const getPredictionText = (prediction) => {
    switch (prediction) {
      case 0:
        return "Neutral";
      case 1:
        return "Very Uncomfortable";
      case 2:
        return "Uncomfortable";
      case 3:
        return "Comfortable";
      case 4:
        return "Very Comfortable";
      default:
        return "Unknown";
    }
  };

  // ฟังก์ชันสำหรับกำหนดคำแนะนำตามผลลัพธ์การทำนาย
  const getRecommendation = (prediction) => {
    switch (prediction) {
      case 0:
        return "Maintain your current conditions for continued comfort.";
      case 1:
        return "Consider adjusting the environment, such as using a fan or cooling measures.";
      case 2:
        return "Increase airflow or lower the temperature to improve comfort.";
      case 3:
        return "Your comfort level is good, continue your current environment.";
      case 4:
        return "You are in an ideal comfort state, no changes needed.";
      default:
        return "No recommendation available.";
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl pb-20">
      <header className="text-center mb-4">
        <h1 className="text-4xl font-bold mb-12 pt-8 text-center text-emerald-600">Thermal Comfort Prediction</h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Block: Form and BMI */}
        <div className="bg-gray-100 shadow-md rounded-lg px-8 pt-8 pb-8 flex flex-col border-t-4 border-b-4 border-emerald-500">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="HN">
                  HN
                </label>
                <input
                  type="text"
                  name="HN"
                  value={formData.HN}
                  onChange={handleChange}
                  placeholder="HN e.g. HN001"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="SkinTemp">
                  Skin Temperature (°C)
                </label>
                <input
                  type="text"
                  name="SkinTemp"
                  value={formData.SkinTemp}
                  onChange={handleChange}
                  placeholder="SkinTemp e.g. 36.20 °C"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Wind">
                  Wind (m/s)
                </label>
                <input
                  type="text"
                  name="Wind"
                  value={formData.Wind}
                  onChange={handleChange}
                  placeholder="Wind e.g. 1.20 m/s"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Tonic">
                  Tonic (µS)
                </label>
                <input
                  type="text"
                  name="Tonic"
                  value={formData.Tonic}
                  onChange={handleChange}
                  placeholder="Tonic e.g. 30.20 µS"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="LFHF">
                  LFHF (µS)
                </label>
                <input
                  type="text"
                  name="LFHF"
                  value={formData.LFHF}
                  onChange={handleChange}
                  placeholder="LFHF e.g. 0.85 µS"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="BMI">
                  BMI
                </label>
                <input
                  type="text"
                  name="BMI"
                  value={formData.BMI}
                  onChange={handleChange}
                  placeholder="BMI e.g. 20.25"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-6">
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading} // ปุ่มจะถูก disabled ขณะโหลด
              >
                {loading ? "Predicting..." : "Predict"}
              </button>
            </div>
          </form>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>

        {/* Right Block: Prediction Result */}
        <div className="bg-gray-100 shadow-md rounded-lg px-8 pt-8 pb-8 flex flex-col items-center justify-center border-t-4 border-b-4 border-emerald-500">
          <p className="text-2xl font-bold text-gray-600 mb-10">
            Thermal Comfort Level
          </p>
          {prediction !== null ? (
            <div className="flex flex-col items-center space-y-6">
              <div
                className={`p-8 rounded-full shadow-lg ${getPredictionColor(prediction)} flex items-center justify-center`}
                style={{ width: '150px', height: '150px' }}
              >
                <div className="text-white">
                  {getPredictionIcon(prediction)}
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800 mb-2">
                  {getPredictionText(prediction)}
                </p>
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-md">
                  <p className="text-3xl text-gray-700 font-bold text-lg mt-2">
                    Recommendation:
                  </p>
                  <p className="text-3xl text-gray-600 text-lg mt-2">
                    {getRecommendation(prediction)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="p-8 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-center text-lg">
                Prediction result will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictPage;