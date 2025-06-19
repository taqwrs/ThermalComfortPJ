const express = require('express'); // นำเข้า Express framework เพื่อสร้างเซิร์ฟเวอร์
const cors = require('cors'); // นำเข้า CORS middleware เพื่อจัดการการเข้าถึงข้ามโดเมน
const mysql = require('mysql2/promise'); // นำเข้า MySQL2 สำหรับการเชื่อมต่อฐานข้อมูล MySQL
const config = require('./config'); // นำเข้าไฟล์ config ที่เก็บการตั้งค่าฐานข้อมูลและเซิร์ฟเวอร์
const app = express(); // สร้าง instance ของ Express
const port = config.express.port; // กำหนดพอร์ตจากไฟล์ config

// สร้าง connection pool เพื่อเชื่อมต่อกับฐานข้อมูล
const con = mysql.createPool({
    host: config.mysql.host, // โฮสต์ของฐานข้อมูล
    port: config.mysql.port, // พอร์ตของฐานข้อมูล
    database: config.mysql.database, // ชื่อฐานข้อมูล
    user: config.mysql.user, // ชื่อผู้ใช้ฐานข้อมูล
    password: config.mysql.password // รหัสผ่านฐานข้อมูล
});

// ตั้งค่า CORS เพื่ออนุญาตให้ frontend ที่รันบน localhost:3000 เข้าถึง API
app.use(cors({
    origin: 'http://localhost:3000', // อนุญาตเฉพาะ frontend ที่รันบน localhost:3000
    credentials: true // อนุญาตให้ส่ง credentials (เช่น cookies)
}));

app.use(express.json()); // ตั้งค่าให้ Express รับข้อมูลในรูปแบบ JSON

// ฟังก์ชันสำหรับเชื่อมต่อฐานข้อมูล
const connectDB = async () => {
    try {
        await con.getConnection(); // พยายามเชื่อมต่อฐานข้อมูล
        console.log('Database connected successfully!'); // แสดงข้อความเมื่อเชื่อมต่อสำเร็จ
    } catch (err) {
        console.error('Database connection error:', err); // แสดงข้อความผิดพลาดเมื่อเชื่อมต่อไม่สำเร็จ
        process.exit(1); // ออกจากกระบวนการด้วยรหัสข้อผิดพลาด
    }
};
connectDB(); // เรียกใช้ฟังก์ชันเชื่อมต่อฐานข้อมูล

// Route หลักสำหรับแสดงข้อความต้อนรับ
app.get('/', (req, res) => {
    res.send('Welcome to the API!'); // ส่งข้อความ "Welcome to the API!" กลับไปยัง client
});

// ฟังก์ชันสำหรับบันทึกการกระทำของผู้ใช้
const logAction = async (userId, action) => {
    const query = 'INSERT INTO Logs (UserID, Action) VALUES (?, ?)'; // คำสั่ง SQL สำหรับเพิ่มข้อมูลลงในตาราง Logs
    const params = [userId, action]; // พารามิเตอร์สำหรับคำสั่ง SQL
    try {
        await con.query(query, params); // ทำการ query ฐานข้อมูล
    } catch (err) {
        console.error('Logging error:', err); // แสดงข้อความผิดพลาดหาก query ไม่สำเร็จ
    }
};

// API สำหรับการล็อกอิน
app.post('/login', async (req, res) => {
    const { username, password } = req.body; // รับข้อมูล username และ password จาก request body

    console.log('Login request received with:', { username }); // แสดงข้อมูล username ใน console

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' }); // ส่งข้อความผิดพลาดหากไม่มี username หรือ password
    }

    try {
        // ค้นหาผู้ใช้ในฐานข้อมูล
        const [users] = await con.query(
            'SELECT * FROM Users WHERE Username = ?',
            [username]
        );

        console.log('Users found:', users); // แสดงข้อมูลผู้ใช้ที่พบใน console

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' }); // ส่งข้อความผิดพลาดหากไม่พบผู้ใช้
        }

        const user = users[0]; // กำหนดผู้ใช้ที่พบเป็นตัวแปร user

        // ตรวจสอบรหัสผ่าน
        if (user.Password !== password) {
            return res.status(401).json({ error: 'Invalid password' }); // ส่งข้อความผิดพลาดหากรหัสผ่านไม่ถูกต้อง
        }

        // บันทึกการล็อกอินสำเร็จ
        await logAction(user.UserID, 'User logged in');

        // ส่งข้อมูลผู้ใช้กลับไปยัง client
        res.json({
            message: 'Login successful',
            user: {
                username: user.Username,
                name: user.FullName,
                email: user.Email,
                role: user.Role // ส่ง role ของผู้ใช้กลับไปด้วย
            }
        });
    } catch (err) {
        console.error('Login error:', err); // แสดงข้อความผิดพลาดหากเกิดข้อผิดพลาด
        res.status(500).json({ error: 'Database query error' }); // ส่งข้อความผิดพลาดกลับไปยัง client
    }
});

// API สำหรับดึงข้อมูลผู้ป่วยทั้งหมด (พร้อมการค้นหา)
app.get('/patients', async (req, res) => {
    const search = req.query.search; // รับคำค้นหาจาก query parameter
    let query = 'SELECT * FROM Patients'; // คำสั่ง SQL สำหรับดึงข้อมูลผู้ป่วย
    let params = []; // พารามิเตอร์สำหรับคำสั่ง SQL

    if (search) {
        query += ' WHERE HN LIKE ? OR FirstName LIKE ? OR LastName LIKE ?'; // เพิ่มเงื่อนไขการค้นหา
        params = [`%${search}%`, `%${search}%`, `%${search}%`]; // กำหนดพารามิเตอร์สำหรับการค้นหา
    }

    try {
        const [results] = await con.query(query, params); // ทำการ query ฐานข้อมูล
        res.json(results); // ส่งผลลัพธ์กลับไปยัง client
    } catch (err) {
        return res.status(500).json({ error: 'Database query error' }); // ส่งข้อความผิดพลาดหาก query ไม่สำเร็จ
    }
});

// API สำหรับเพิ่มผู้ป่วยใหม่
app.post('/patients', async (req, res) => {
    const { HN, RoomNumber, FirstName, LastName, Age, Gender, Height, Weight, DoctorName, userId } = req.body; // รับข้อมูลผู้ป่วยจาก request body
    const query = 'INSERT INTO Patients (HN, RoomNumber, FirstName, LastName, Age, Gender, Height, Weight, DoctorName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'; // คำสั่ง SQL สำหรับเพิ่มผู้ป่วย
    const params = [HN, RoomNumber, FirstName, LastName, Age, Gender, Height, Weight, DoctorName]; // พารามิเตอร์สำหรับคำสั่ง SQL

    try {
        const [result] = await con.query(query, params); // ทำการ query ฐานข้อมูล
        await logAction(userId, `Added patient with HN: ${HN}`); // บันทึกการเพิ่มผู้ป่วย
        res.json({ message: 'Patient added successfully', insertedId: result.insertId }); // ส่งข้อความสำเร็จกลับไปยัง client
    } catch (err) {
        return res.status(500).json({ error: 'Database insert error' }); // ส่งข้อความผิดพลาดหาก query ไม่สำเร็จ
    }
});

// API สำหรับอัปเดตข้อมูลผู้ป่วย
app.put('/patients/:HN', async (req, res) => {
    const HN = req.params.HN; // รับ HN จาก URL parameter
    const { RoomNumber, FirstName, LastName, Age, Gender, Height, Weight, DoctorName, userId } = req.body; // รับข้อมูลผู้ป่วยจาก request body
    const query = 'UPDATE Patients SET RoomNumber=?, FirstName=?, LastName=?, Age=?, Gender=?, Height=?, Weight=?, DoctorName=? WHERE HN=?'; // คำสั่ง SQL สำหรับอัปเดตผู้ป่วย
    const params = [RoomNumber, FirstName, LastName, Age, Gender, Height, Weight, DoctorName, HN]; // พารามิเตอร์สำหรับคำสั่ง SQL

    try {
        await con.query(query, params); // ทำการ query ฐานข้อมูล
        await logAction(userId, `Updated patient with HN: ${HN}`); // บันทึกการอัปเดตผู้ป่วย
        res.json({ message: 'Patient updated successfully' }); // ส่งข้อความสำเร็จกลับไปยัง client
    } catch (err) {
        return res.status(500).json({ error: 'Database update error' }); // ส่งข้อความผิดพลาดหาก query ไม่สำเร็จ
    }
});

// API สำหรับลบผู้ป่วย
app.delete('/patients/:HN', async (req, res) => {
    const HN = req.params.HN; // รับ HN จาก URL parameter
    const query = 'DELETE FROM Patients WHERE HN=?'; // คำสั่ง SQL สำหรับลบผู้ป่วย

    try {
        await con.query(query, [HN]); // ทำการ query ฐานข้อมูล
        await logAction(null, `Deleted patient with HN: ${HN}`); // บันทึกการลบผู้ป่วย
        res.json({ message: 'Patient deleted successfully' }); // ส่งข้อความสำเร็จกลับไปยัง client
    } catch (err) {
        return res.status(500).json({ error: 'Database delete error' }); // ส่งข้อความผิดพลาดหาก query ไม่สำเร็จ
    }
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`); // แสดงข้อความเมื่อเซิร์ฟเวอร์เริ่มทำงาน
});