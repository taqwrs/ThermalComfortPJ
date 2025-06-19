"use client";
import { useState, useEffect } from 'react';

export default function Login({ onLoginSuccess, onLogout }) {
    const [username, setUsername] = useState(''); // เก็บชื่อผู้ใช้
    const [password, setPassword] = useState(''); // เก็บรหัสผ่าน
    const [error, setError] = useState(''); // เก็บข้อความผิดพลาด
    const [isLoading, setIsLoading] = useState(false); // เก็บสถานะการโหลด
    const [showPassword, setShowPassword] = useState(false); // เก็บสถานะการแสดงรหัสผ่าน
    const [rememberMe, setRememberMe] = useState(false); // เก็บสถานะการจำชื่อผู้ใช้

    useEffect(() => {
        const savedUsername = localStorage.getItem('rememberedUsername'); // ดึงชื่อผู้ใช้จาก localStorage
        if (savedUsername) {
            setUsername(savedUsername); // ตั้งค่า username จาก localStorage
            setRememberMe(true); // ตั้งค่า rememberMe เป็น true
        }
    }, []); // เรียกใช้เพียงครั้งเดียวเมื่อ component ถูกโหลด

    const handleLogin = async (e) => {
        e.preventDefault(); // ป้องกันการรีเฟรชหน้าเว็บ
        setIsLoading(true); // ตั้งค่า isLoading เป็น true เพื่อแสดงสถานะการโหลด
        setError(''); // ล้างข้อความผิดพลาด

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }), // ส่ง username และ password
            });

            const data = await response.json(); // แปลงข้อมูลตอบกลับเป็น JSON

            if (response.ok) {
                if (rememberMe) {
                    localStorage.setItem('rememberedUsername', username); // บันทึกชื่อผู้ใช้ใน localStorage
                } else {
                    localStorage.removeItem('rememberedUsername'); // ลบชื่อผู้ใช้จาก localStorage
                }
                localStorage.setItem('isLoggedIn', 'true'); // บันทึกสถานะการล็อกอิน
                localStorage.setItem('role', data.role); // บันทึกบทบาทของผู้ใช้
                onLoginSuccess(); // เรียกฟังก์ชัน onLoginSuccess
            } else {
                setError(data.error || 'Login error occurred'); // แสดงข้อความผิดพลาด
            }
        } catch (error) {
            console.error('Login error:', error); // แสดงข้อผิดพลาดใน console
            setError('Unable to connect to server. Please try again.'); // แสดงข้อความผิดพลาดให้ผู้ใช้
        } finally {
            setIsLoading(false); // ตั้งค่า isLoading เป็น false เมื่อการร้องขอเสร็จสิ้น
        }
    };

    // ฟังก์ชันสำหรับแสดงรหัสผ่าน
    const showPasswordHandler = () => {
        setShowPassword(true); // ตั้งค่า showPassword เป็น true
    };

    // ฟังก์ชันสำหรับซ่อนรหัสผ่าน
    const hidePasswordHandler = () => {
        setShowPassword(false); // ตั้งค่า showPassword เป็น false
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="w-full max-w-md p-8 bg-gray-100 rounded-xl shadow-xl border border-gray-200">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-emerald-800">Login</h2>
                    <p className="text-gray-600 mt-2">Welcome back</p>
                </div>
                
                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-center border-l-4 border-red-500 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)} // อัปเดตค่า username
                                required
                                minLength={3}
                                className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                placeholder="Enter username"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </span>
                            <input
                                type={showPassword ? "text" : "password"} // สลับประเภท input ระหว่าง text และ password
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} // อัปเดตค่า password
                                required
                                minLength={6}
                                className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                placeholder="Enter password"
                            />
                            {/* ปุ่มสำหรับแสดงหรือซ่อนรหัสผ่าน */}
                            <button 
                                type="button"
                                onClick={showPassword ? showPasswordHandler :hidePasswordHandler } // เรียกฟังก์ชันตามสถานะ showPassword
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? ( // สลับไอคอนตามสถานะ showPassword
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)} // อัปเดตค่า rememberMe
                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>
                        <div className="text-sm">
                            <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
                                Forgot password?
                            </a>
                        </div>
                    </div>
                    
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={isLoading} // ปุ่มจะถูก disabled เมื่อ isLoading เป็น true
                            className="flex-1 py-3 px-4 bg-emerald-600 text-white font-medium rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Logging in...
                                </span>
                            ) : "Login"}
                        </button>
                        
                        <button
                            onClick={onLogout} // เรียกฟังก์ชัน onLogout เมื่อคลิก
                            type="button" 
                            className="py-3 px-4 bg-gray-200 text-gray-800 font-medium rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all transform hover:scale-105"
                        >
                            Logout
                        </button>
                    </div>
                </form>
                
                <div className="mt-8 text-center text-sm">
                    <p className="text-gray-600">
                        Don't have an account? <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">Register here</a>
                    </p>
                </div>
            </div>
        </div>
    );
}