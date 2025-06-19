"use client";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

// Component สำหรับแสดงข้อมูลผู้ป่วยแต่ละคนในตาราง
function RetrievePatients({ patient, index, onEdit, onDelete }) {
    var no = index + 1;
    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="py-3 px-4 border-b border-gray-200 text-center">{no}</td>
            <td className="py-3 px-4 border-b border-gray-200 text-center">{patient.HN}</td>
            <td className="py-3 px-4 border-b border-gray-200 text-left">{patient.FirstName} {patient.LastName}</td>
            <td className="py-3 px-4 border-b border-gray-200 text-center">{patient.Age}</td>
            <td className="py-3 px-4 border-b border-gray-200 text-center">{patient.Gender}</td>
            <td className="py-3 px-4 border-b border-gray-200 text-right">{patient.Height} cm</td>
            <td className="py-3 px-4 border-b border-gray-200 text-right">{patient.Weight} kg</td>
            <td className="py-3 px-4 border-b border-gray-200 text-center">{patient.RoomNumber}</td>
            <td className="py-3 px-4 border-b border-gray-200 text-center">
                <div className="flex justify-center space-x-4">
                    {/* ปุ่มแก้ไขข้อมูลผู้ป่วย */}
                    <button onClick={() => onEdit(patient)} className="text-emerald-500 hover:text-emerald-700 transition-colors">
                        <FontAwesomeIcon icon={faPenToSquare} className="w-5 h-5" />
                    </button>
                    {/* ปุ่มลบข้อมูลผู้ป่วย */}
                    <button onClick={() => onDelete(patient.HN)} className="text-red-500 hover:text-red-700 transition-colors">
                        <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default function Patients() {
    // State สำหรับเก็บข้อมูลผู้ป่วย
    const [patients, setPatients] = useState([]);
    // State สำหรับตรวจสอบสถานะการโหลดข้อมูล
    const [loading, setLoading] = useState(true);
    // State สำหรับเก็บคำค้นหา
    const [search, setSearch] = useState("");
    // State สำหรับเก็บข้อมูลผู้ป่วยที่เลือกเพื่อแก้ไข
    const [selectedPatient, setSelectedPatient] = useState(null);
    // State สำหรับตรวจสอบสถานะการเปิด modal แก้ไขข้อมูล
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // State สำหรับตรวจสอบสถานะการเปิด modal เพิ่มข้อมูล
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    // State สำหรับเก็บข้อมูลผู้ป่วยใหม่
    const [newPatient, setNewPatient] = useState({
        HN: '',
        FirstName: '',
        LastName: '',
        Age: '',
        Gender: 'Male',
        Height: '',
        Weight: '',
        RoomNumber: ''
    });

    // useEffect สำหรับดึงข้อมูลผู้ป่วยจากเซิร์ฟเวอร์เมื่อ component render ครั้งแรก
    useEffect(() => {
        fetchPatients();
    }, []);

    // useEffect สำหรับดึงข้อมูลผู้ป่วยเมื่อมีการเปลี่ยนแปลงคำค้นหา
    useEffect(() => {
        fetchPatients();
    }, [search]);

    // Function สำหรับดึงข้อมูลผู้ป่วยจากเซิร์ฟเวอร์
    const fetchPatients = async () => {
        try {
            const response = await fetch(`http://localhost:3001/patients?search=${search}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setPatients(data);
            setLoading(false);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    // Function สำหรับเปิด modal แก้ไขข้อมูลผู้ป่วย
    const handleEditClick = (patient) => {
        setSelectedPatient(patient);
        setIsEditModalOpen(true);
    };

    // Function สำหรับปิด modal แก้ไขข้อมูลผู้ป่วย
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };

    // Function สำหรับส่งข้อมูลผู้ป่วยที่แก้ไขแล้วไปยังเซิร์ฟเวอร์
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3001/patients/${selectedPatient.HN}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedPatient)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await fetchPatients();
        } catch (err) {
            console.error('Fetch error:', err);
        }
        setIsEditModalOpen(false);
    };

    // Function สำหรับลบข้อมูลผู้ป่วยจากเซิร์ฟเวอร์
    const handleDelete = async (HN) => {
        try {
            const response = await fetch(`http://localhost:3001/patients/${HN}`, {
                method: "DELETE"
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await fetchPatients();
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    // Function สำหรับส่งข้อมูลผู้ป่วยใหม่ไปยังเซิร์ฟเวอร์
    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3001/patients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPatient)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await fetchPatients();
            setNewPatient({
                HN: '',
                FirstName: '',
                LastName: '',
                Age: '',
                Gender: 'Male',
                Height: '',
                Weight: '',
                RoomNumber: ''
            });
            setIsCreateModalOpen(false);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    // แสดงข้อความ "Loading..." หากกำลังโหลดข้อมูล
    if (loading) {
        return (
            <div className="container mx-auto px-4 pt-8 mt-8">
                <div className="text-center text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="container max-w-7xl mx-auto px-4 pt-8 mt-0 my-20 pb-20">
            <header className="text-center mb-4">
            <h1 className="text-4xl font-bold mb-12 pt-8 text-center text-emerald-600">Patients Data</h1>
            </header>
            <div className="flex flex-row mb-6">
                {/* ช่องค้นหาข้อมูลผู้ป่วย */}
                <input
                    type="text"
                    className="w-96 border-2 border-emerald-500 p-2 rounded-lg focus:outline-none focus:border-emerald-700 transition-colors"
                    placeholder="Search by HN or Name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {/* ปุ่มเพิ่มผู้ป่วยใหม่ */}
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg ml-2 transition-colors flex items-center"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Patient
                </button>
            </div>
            <div className="bg-gray-100 rounded-lg shadow-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-emerald-500 text-white">
                        <tr>
                            <th className="py-3 px-4 border-b border-gray-200 w-12">No</th>
                            <th className="py-3 px-4 border-b border-gray-200 w-24">HN</th>
                            <th className="py-3 px-4 border-b border-gray-200 w-48">Name</th>
                            <th className="py-3 px-4 border-b border-gray-200 w-16">Age</th>
                            <th className="py-3 px-4 border-b border-gray-200 w-24">Gender</th>
                            <th className="py-3 px-4 border-b border-gray-200 w-24">Height</th>
                            <th className="py-3 px-4 border-b border-gray-200 w-24">Weight</th>
                            <th className="py-3 px-4 border-b border-gray-200 w-32">Room Number</th>
                            <th className="py-3 px-4 border-b border-gray-200 w-32">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* แสดงข้อมูลผู้ป่วยแต่ละคน */}
                        {patients.map((patient, index) => (
                            <RetrievePatients key={index} patient={patient} index={index} onEdit={handleEditClick} onDelete={handleDelete} />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal สำหรับแก้ไขข้อมูลผู้ป่วย */}
            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-gray-100 rounded-lg p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4 text-emerald-600">Edit Patient</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hn">HN</label>
                                <input
                                    type="text"
                                    id="hn"
                                    value={selectedPatient.HN}
                                    onChange={(e) => setSelectedPatient({ ...selectedPatient, HN: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                    disabled
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    value={selectedPatient.FirstName}
                                    onChange={(e) => setSelectedPatient({ ...selectedPatient, FirstName: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    value={selectedPatient.LastName}
                                    onChange={(e) => setSelectedPatient({ ...selectedPatient, LastName: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">Age</label>
                                <input
                                    type="number"
                                    id="age"
                                    value={selectedPatient.Age}
                                    onChange={(e) => setSelectedPatient({ ...selectedPatient, Age: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">Gender</label>
                                <select
                                    id="gender"
                                    value={selectedPatient.Gender}
                                    onChange={(e) => setSelectedPatient({ ...selectedPatient, Gender: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="height">Height (cm)</label>
                                <input
                                    type="number"
                                    id="height"
                                    value={selectedPatient.Height}
                                    onChange={(e) => setSelectedPatient({ ...selectedPatient, Height: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="weight">Weight (kg)</label>
                                <input
                                    type="number"
                                    id="weight"
                                    value={selectedPatient.Weight}
                                    onChange={(e) => setSelectedPatient({ ...selectedPatient, Weight: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="roomNumber">Room Number</label>
                                <input
                                    type="text"
                                    id="roomNumber"
                                    value={selectedPatient.RoomNumber}
                                    onChange={(e) => setSelectedPatient({ ...selectedPatient, RoomNumber: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseEditModal}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal สำหรับเพิ่มผู้ป่วยใหม่ */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-gray-100 rounded-lg p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4 text-emerald-600">Add New Patient</h2>
                        <form onSubmit={handleCreateSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newHN">HN</label>
                                <input
                                    type="text"
                                    id="newHN"
                                    value={newPatient.HN}
                                    onChange={(e) => setNewPatient({ ...newPatient, HN: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newFirstName">First Name</label>
                                <input
                                    type="text"
                                    id="newFirstName"
                                    value={newPatient.FirstName}
                                    onChange={(e) => setNewPatient({ ...newPatient, FirstName: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newLastName">Last Name</label>
                                <input
                                    type="text"
                                    id="newLastName"
                                    value={newPatient.LastName}
                                    onChange={(e) => setNewPatient({ ...newPatient, LastName: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newAge">Age</label>
                                <input
                                    type="number"
                                    id="newAge"
                                    value={newPatient.Age}
                                    onChange={(e) => setNewPatient({ ...newPatient, Age: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newGender">Gender</label>
                                <select
                                    id="newGender"
                                    value={newPatient.Gender}
                                    onChange={(e) => setNewPatient({ ...newPatient, Gender: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newHeight">Height (cm)</label>
                                <input
                                    type="number"
                                    id="newHeight"
                                    value={newPatient.Height}
                                    onChange={(e) => setNewPatient({ ...newPatient, Height: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newWeight">Weight (kg)</label>
                                <input
                                    type="number"
                                    id="newWeight"
                                    value={newPatient.Weight}
                                    onChange={(e) => setNewPatient({ ...newPatient, Weight: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newRoomNumber">Room Number</label>
                                <input
                                    type="text"
                                    id="newRoomNumber"
                                    value={newPatient.RoomNumber}
                                    onChange={(e) => setNewPatient({ ...newPatient, RoomNumber: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                                >
                                    Add
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}