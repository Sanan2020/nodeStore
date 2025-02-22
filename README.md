# 🛒 Online Store Project

**เว็บไซต์ร้านค้าออนไลน์** ที่ผมพัฒนาเป็นโปรเจ็กต์ส่วนตัว  
ลูกค้าสามารถ:
- 🔍 เรียกดูสินค้า  
- 🛍 เพิ่มสินค้าลงในตะกร้า  
- 💳 ทำการชำระเงินออนไลน์ผ่าน **Stripe (Test Mode)** ได้อย่างปลอดภัย  

## 🚀 เทคโนโลยีที่ใช้
- **Frontend:** HTML, CSS, JavaScript (EJS)  
- **Backend:** Node.js, Express  
- **Database:** MongoDB Atlas
- **Payment Gateway:** Stripe API (Test Mode)  
- **Deployment:** Render  

## 🎛 ฟีเจอร์หลังบ้าน (Admin Panel)
✅ **ดูรายการสินค้า**  
✅ **เพิ่มสินค้าใหม่**  
✅ **แก้ไขข้อมูลสินค้า**  
✅ **ลบสินค้าออกจากระบบ**  
✅ **ดูใบคำสั่งซื้อของลูกค้าได้**  

🔐 **หมายเหตุ:**  
- ต้องเป็น **Admin** เท่านั้นจึงสามารถเข้าถึงหลังบ้านได้  
- สามารถจัดการสินค้าได้ผ่าน **Dashboard Admin**  


ℹ️ **ข้อมูลทดสอบการชำระเงิน**  
โปรเจ็กต์นี้ใช้ **Stripe ในโหมดทดสอบ (Test Mode)**  
การชำระเงินยังไม่สามารถใช้กับบัตรจริงได้  
ใช้หมายเลขบัตร **4242 4242 4242 4242** สำหรับทดสอบ  


# ตัวอย่างในส่วนลูกค้า
- เรียกดูสินค้า เพิ่มสินค้าลงตระกร้า(ต้องล็อกอินก่อน)
  
![image](https://github.com/user-attachments/assets/393fe5d5-e769-494a-9162-363e9b57e61a)

- ดูสินค้าในตระกร้า เพิ่มลดจำนวนสินค้าในตระกร้าได้
  
![image](https://github.com/user-attachments/assets/95d62e47-8369-4173-9105-ddf84e96493e)

- หน้าการสั่งซื้อ ป้อนข้อมูลการจัดส่ง(หากเคยป้อนข้อมูลแล้ว ระบบจะป้อนข้อมูลให้เอง)

![image](https://github.com/user-attachments/assets/c79dfc38-8d97-43de-bd26-b74895e56289)

- หน้าชำระเงิน ด้วย Payment Stripe API (โหมดทดสอบ) 

![image](https://github.com/user-attachments/assets/8aa44043-bc92-4ed1-bb34-a1321ac4a4ca)

- หน้าแสดงหมายเลขออเดอร์ เมื่อใช้ข้อมูลทดสอบการชำระเงิน

![image](https://github.com/user-attachments/assets/702663a1-387c-4911-9f12-c48354a1a948)


# ตัวอย่างในส่วน Admin
- หน้าจัดการสินค้า: สามารถดู เพิ่ม ลบ แก้ไขสินค้าได้

![image](https://github.com/user-attachments/assets/f8056ebe-11de-476d-90df-0e948f14944c)

- หน้าดูคำสั่งซื้อของลูกค้า

![image](https://github.com/user-attachments/assets/61398763-e785-4c2d-a44f-644feff8a20e)

