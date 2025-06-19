from fastapi import FastAPI, HTTPException, Query  # นำเข้า FastAPI และ HTTPException สำหรับสร้าง API และจัดการข้อผิดพลาด
from fastapi.middleware.cors import CORSMiddleware  # นำเข้า CORSMiddleware เพื่อจัดการการเข้าถึงข้ามโดเมน
import mysql.connector  # นำเข้า MySQL connector สำหรับเชื่อมต่อฐานข้อมูล MySQL
import pickle  # นำเข้า pickle สำหรับโหลดโมเดล Machine Learning
import numpy as np  # นำเข้า numpy สำหรับการคำนวณทางคณิตศาสตร์
import logging  # นำเข้า logging สำหรับบันทึกข้อความ log
from pydantic import BaseModel  # นำเข้า BaseModel จาก Pydantic สำหรับสร้างโมเดลข้อมูล
from typing import Optional  # นำเข้า Optional สำหรับระบุฟิลด์ที่สามารถเป็นค่า None ได้

app = FastAPI()  # สร้าง instance ของ FastAPI

# ตั้งค่า logging
logging.basicConfig(level=logging.INFO)  # กำหนดระดับ logging เป็น INFO
logger = logging.getLogger(__name__)  # สร้าง logger สำหรับบันทึกข้อความ log

# ตั้งค่า CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # อนุญาตให้ frontend ที่รันบน localhost:3000 เข้าถึง API
    allow_credentials=True,  # อนุญาตให้ส่ง credentials (เช่น cookies)
    allow_methods=["GET", "POST"],  # อนุญาตให้ใช้ HTTP methods GET และ POST
    allow_headers=["*"],  # อนุญาตให้ใช้ headers ใดก็ได้
)

# ฟังก์ชันสำหรับเชื่อมต่อฐานข้อมูล
def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host='localhost',  # โฮสต์ของฐานข้อมูล
            port=3306,  # พอร์ตของฐานข้อมูล
            database='ThermalData',  # ชื่อฐานข้อมูล
            user='root',  # ชื่อผู้ใช้ฐานข้อมูล
            password='mysql'  # รหัสผ่านฐานข้อมูล
        )
        return conn  # ส่งคืนการเชื่อมต่อฐานข้อมูล
    except mysql.connector.Error as err:
        logger.error(f"Database connection error: {str(err)}")  # บันทึกข้อความ error หากเชื่อมต่อฐานข้อมูลไม่สำเร็จ
        raise HTTPException(status_code=500, detail="Database connection failed.")  # ส่งข้อผิดพลาดกลับไปยัง client

# โหลดโมเดล LightGBM
model_path = r"D:\project\FromDataCenter\CV10_LightGBM.pkl"  # กำหนด path ของโมเดล
try:
    with open(model_path, "rb") as f:  # เปิดไฟล์โมเดลในโหมดอ่านไบนารี
        model = pickle.load(f)  # โหลดโมเดลจากไฟล์
    logger.info("Model loaded successfully.")  # บันทึกข้อความ log เมื่อโหลดโมเดลสำเร็จ
except Exception as e:
    logger.error(f"Failed to load model: {str(e)}")  # บันทึกข้อความ error หากโหลดโมเดลไม่สำเร็จ
    raise HTTPException(status_code=500, detail="Failed to load the prediction model.")  # ส่งข้อผิดพลาดกลับไปยัง client

# Pydantic model สำหรับข้อมูล input ของการทำนาย
class PredictionInput(BaseModel):
    BMI: float  # ค่า BMI
    SkinTemp: float  # อุณหภูมิผิวหนัง
    Wind: float  # ความเร็วลม
    Tonic: float  # ค่า Tonic
    LFHF: float  # ค่า LFHF
    HN: Optional[str] = "Unknown"  # รหัสผู้ป่วย (สามารถเป็นค่า None ได้)

# Endpoint สำหรับการทำนาย
@app.post("/predict")
async def predict(data: PredictionInput):
    # ตรวจสอบข้อมูล input
    if not all([data.HN, data.BMI, data.SkinTemp, data.Wind, data.Tonic, data.LFHF]):
        raise HTTPException(status_code=400, detail="All fields are required.")  # ส่งข้อความผิดพลาดหากข้อมูลไม่ครบ

    try:
        # แปลงข้อมูล input เป็น numpy array
        input_data = np.array([[data.BMI, data.SkinTemp, data.Wind, data.Tonic, data.LFHF]])

        # ทำนายผล
        prediction = model.predict(input_data)[0]

        # คำนวณความมั่นใจ (confidence)
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(input_data)
            confidence = float(np.max(probs))
        else:
            confidence = 1.0

        # บันทึกผลการทำนายลงฐานข้อมูล
        conn = get_db_connection()
        cursor = conn.cursor()

        # เตรียมคำสั่ง SQL
        sql = """
        INSERT INTO PredictionHistory (HN, BMI, SkinTemp, Wind, Tonic, LFHF, PredictedComfortLevel, Confidence, ModelUsed)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (data.HN, data.BMI, data.SkinTemp, data.Wind, data.Tonic, data.LFHF, int(prediction), confidence, "LightGBM"))

        conn.commit()
        cursor.close()
        conn.close()

        return {
            "prediction": int(prediction),
            "confidence": confidence
        }

    except ValueError as ve:
        logger.error(f"Value error: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except mysql.connector.Error as db_err:
        logger.error(f"Database error: {str(db_err)}")
        raise HTTPException(status_code=500, detail="Database error occurred.")
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail="Prediction error: " + str(e))

# Endpoint สำหรับดึงข้อมูลผู้ป่วย
@app.get("/patient/{HN}")
async def get_patient(HN: str):
    try:
        # ตรวจสอบ HN
        if not HN or not HN.strip():  # ตรวจสอบว่า HN ไม่เป็นค่าว่าง
            raise HTTPException(status_code=400, detail="HN cannot be empty.")  # ส่งข้อผิดพลาดกลับไปยัง client

        # เชื่อมต่อฐานข้อมูล
        conn = get_db_connection()  # เชื่อมต่อฐานข้อมูล
        cursor = conn.cursor(dictionary=True)  # สร้าง cursor ที่ return ผลลัพธ์เป็น dictionary

        # Query เพื่อดึงข้อมูลผู้ป่วย
        cursor.execute("SELECT weight, height FROM Patients WHERE HN = %s", (HN,))  # execute คำสั่ง SQL
        patient_data = cursor.fetchone()  # ดึงข้อมูลผู้ป่วย

        cursor.close()  # ปิด cursor
        conn.close()  # ปิดการเชื่อมต่อฐานข้อมูล

        if patient_data:
            return patient_data  # ส่งข้อมูลผู้ป่วยกลับไปยัง client
        else:
            raise HTTPException(status_code=404, detail="Patient not found")  # ส่งข้อผิดพลาดหากไม่พบผู้ป่วย
    except mysql.connector.Error as db_err:
        logger.error(f"Database error: {str(db_err)}")  # บันทึกข้อความ error หากเกิดข้อผิดพลาดฐานข้อมูล
        raise HTTPException(status_code=500, detail="Database error occurred.")  # ส่งข้อผิดพลาดกลับไปยัง client
    except Exception as e:
        logger.error(f"Error fetching patient data: {str(e)}")  # บันทึกข้อความ error หากเกิดข้อผิดพลาดอื่น ๆ
        raise HTTPException(status_code=500, detail="Error fetching patient data.")  # ส่งข้อผิดพลาดกลับไปยัง client

# Endpoint สำหรับดึงข้อมูลแดชบอร์ด
@app.get("/dashboard")
async def get_dashboard(HN: str):
    try:
        # ตรวจสอบ HN
        if not HN or not HN.strip():  # ตรวจสอบว่า HN ไม่เป็นค่าว่าง
            raise HTTPException(status_code=400, detail="HN cannot be empty.")  # ส่งข้อผิดพลาดกลับไปยัง client

        # เชื่อมต่อฐานข้อมูล
        conn = get_db_connection()  # เชื่อมต่อฐานข้อมูล
        cursor = conn.cursor(dictionary=True)  # สร้าง cursor ที่ return ผลลัพธ์เป็น dictionary

        # Query เพื่อดึงข้อมูลผู้ป่วยจากตาราง Patients
        cursor.execute("SELECT * FROM Patients WHERE HN = %s", (HN,))  # execute คำสั่ง SQL
        patient_data = cursor.fetchone()  # ดึงข้อมูลผู้ป่วย

        if not patient_data:
            raise HTTPException(status_code=404, detail="Patient not found")  # ส่งข้อผิดพลาดหากไม่พบผู้ป่วย

        # ดึงการทำนายล่าสุด
        cursor.execute("SELECT * FROM PredictionHistory WHERE HN = %s ORDER BY Timestamp DESC LIMIT 1", (HN,))  # execute คำสั่ง SQL
        latest_prediction = cursor.fetchone()  # ดึงการทำนายล่าสุด

        # ดึงประวัติการทำนายทั้งหมด
        cursor.execute("SELECT * FROM PredictionHistory WHERE HN = %s ORDER BY Timestamp DESC", (HN,))  # execute คำสั่ง SQL
        predictions = cursor.fetchall()  # ดึงประวัติการทำนายทั้งหมด

        cursor.close()  # ปิด cursor
        conn.close()  # ปิดการเชื่อมต่อฐานข้อมูล

        # เตรียมข้อมูลสำหรับ response
        response_data = {
            "patient": patient_data,  # ข้อมูลผู้ป่วย
            "latest_prediction": latest_prediction,  # การทำนายล่าสุด
            "predictions": predictions  # ประวัติการทำนายทั้งหมด
        }

        return response_data  # ส่งข้อมูลแดชบอร์ดกลับไปยัง client

    except mysql.connector.Error as db_err:
        logger.error(f"Database error: {str(db_err)}")  # บันทึกข้อความ error หากเกิดข้อผิดพลาดฐานข้อมูล
        raise HTTPException(status_code=500, detail="Database error occurred.")  # ส่งข้อผิดพลาดกลับไปยัง client
    except Exception as e:
        logger.error(f"Error fetching dashboard data: {str(e)}")  # บันทึกข้อความ error หากเกิดข้อผิดพลาดอื่น ๆ
        raise HTTPException(status_code=500, detail="Error fetching dashboard data.")  # ส่งข้อผิดพลาดกลับไปยัง client

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the Preventive Medicine API!"}  # ส่งข้อความต้อนรับกลับไปยัง client