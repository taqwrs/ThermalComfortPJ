// src/app/page.js
"use client"; // ระบุว่าไฟล์นี้เป็น Client Component ใน Next.js
import { useState } from 'react'; // นำเข้า hook useState จาก React เพื่อจัดการ state
import Body from "@/components/Body"; // นำเข้า component Body
import Footer from "@/components/Footer"; // นำเข้า component Footer
import Header from "@/components/Header"; // นำเข้า component Header
import Patients from "@/components/Patients"; // นำเข้า component Patients
import Predict from "@/components/Predict"; // นำเข้า component Predict
import Login from "@/components/Login"; // นำเข้า component Login
import Dashboard from '@/components/Dashboard'; // นำเข้า component Dashboard
import Visualization from '@/components/visualization'; // นำเข้า component Visualization

export default function Home() {
  const [currentView, setCurrentView] = useState('home'); // สร้าง state currentView เพื่อเก็บ view ปัจจุบัน และ setCurrentView เพื่ออัปเดต state
  const [isLoggedIn, setIsLoggedIn] = useState(false); // สร้าง state isLoggedIn เพื่อเก็บสถานะการล็อกอิน และ setIsLoggedIn เพื่ออัปเดต state
  const [selectedHN, setSelectedHN] = useState('HN001'); // สร้าง state selectedHN เพื่อเก็บ HN ที่เลือก และ setSelectedHN เพื่ออัปเดต state
  
  const handleNavClick = (view) => {
    // ฟังก์ชันจัดการการคลิกที่ navigation
    if (['patients', 'predict', 'dashboard', 'visualization'].includes(view) && !isLoggedIn) {
      // ตรวจสอบว่าถ้า view ต้องการการล็อกอินและผู้ใช้ยังไม่ได้ล็อกอิน
      alert('Please login to access this page.'); // แสดง alert แจ้งให้ล็อกอิน
      setCurrentView('home'); // ตั้งค่า currentView เป็น 'home'
      return;
    }
    setCurrentView(view); // อัปเดต currentView เป็น view ที่เลือก
  };

  const handleLoginSuccess = () => {
    // ฟังก์ชันจัดการเมื่อล็อกอินสำเร็จ
    console.log('Login successful!'); // แสดงข้อความใน console
    setIsLoggedIn(true); // ตั้งค่า isLoggedIn เป็น true
    localStorage.setItem('isLoggedIn', 'true'); // บันทึกสถานะการล็อกอินใน localStorage
    setCurrentView('patients'); // เปลี่ยน currentView เป็น 'patients'
  };

  const handleLogout = () => {
    // ฟังก์ชันจัดการการล็อกเอาท์
    setIsLoggedIn(false); // ตั้งค่า isLoggedIn เป็น false
    localStorage.removeItem('isLoggedIn'); // ลบสถานะการล็อกอินจาก localStorage
    setCurrentView('home'); // เปลี่ยน currentView เป็น 'home'
  };

  const renderView = () => {
    // ฟังก์ชันสำหรับ render view ตาม currentView
    switch (currentView) {
      case 'home':
        return <Body />; // Render component Body ถ้า currentView เป็น 'home'
      case 'patients':
        return <Patients />; // Render component Patients ถ้า currentView เป็น 'patients'
      case 'predict':
        return <Predict selectedHN={selectedHN} setCurrentView={setCurrentView} />; // Render component Predict และส่ง props selectedHN และ setCurrentView
      case 'dashboard':
        return <Dashboard selectedHN={selectedHN} setSelectedHN={setSelectedHN} setCurrentView={setCurrentView} />; // Render component Dashboard และส่ง props selectedHN, setSelectedHN, และ setCurrentView
      case 'login':
        return <Login onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} />; // Render component Login และส่ง props onLoginSuccess และ onLogout
      case 'visualization':
        return <Visualization selectedHN={selectedHN} setCurrentView={setCurrentView} />; // Render component Visualization และส่ง props selectedHN และ setCurrentView
      default:
        return <Body />; // Render component Body เป็นค่า default
    }
  };

  return (
    <div className="flex min-h-screen font-sans">
      {/* Render component Header และส่ง props onNavClick, isLoggedIn, และ onLogout */}
      <Header
        onNavClick={handleNavClick}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <main className="flex-grow pt-16">
        {renderView()} {/* Render view ตาม currentView */}
      </main>
      <Footer /> {/* Render component Footer */}
    </div>
  );
}