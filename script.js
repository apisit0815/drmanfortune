// 🚨 นำ Web App URL ของ Google Apps Script มาใส่ในเครื่องหมายคำพูดนี้
const GAS_WEB_APP_URL = "ใส่_URL_ของ_GOOGLE_APPS_SCRIPT_ตรงนี้_ครับ";

// ฟังก์ชันสลับหน้าจอ
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// ฟังก์ชันรีเซ็ตแอปเพื่อดูดวงใหม่
function resetApp() {
    document.getElementById('fortune-form').reset();
    document.getElementById('prediction-state').classList.add('hidden');
    document.getElementById('loading-state').classList.remove('hidden');
    showScreen('screen-welcome');
}

// จัดการเมื่อกดปุ่ม Submit ฟอร์ม
document.getElementById('fortune-form').addEventListener('submit', async function(e) {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้าเว็บ

    // เช็คว่าใส่ URL หรือยัง
    if (GAS_WEB_APP_URL.includes("ใส่_URL")) {
        alert("❌ ลืมใส่ URL ของ Google Apps Script ในไฟล์ script.js ครับ!");
        return;
    }

    // 1. ดึงข้อมูลจากฟอร์ม
    const userData = {
        nickname: document.getElementById('nickname').value,
        birthdate: document.getElementById('birthdate').value,
        hand: document.getElementById('hand').value,
        leg: document.getElementById('leg').value,
        category: document.getElementById('category').value
    };

    // 2. เปลี่ยนหน้าจอเป็นสถานะกำลังโหลด
    showScreen('screen-result');

    try {
        // 3. ส่งข้อมูลไปที่ Google Apps Script
        const response = await fetch(GAS_WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8', // ใช้ text/plain เลี่ยงปัญหา CORS
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        // เช็ค Error จาก OpenAI
        if (data.error) throw new Error(data.error.message || data.error);

        // 4. แสดงผลคำทำนาย
        const predictionText = data.choices[0].message.content;
        
        // แปลง \n ให้เป็น <br> เพื่อให้ขึ้นบรรทัดใหม่สวยงามใน HTML
        document.getElementById('prediction-text').innerHTML = predictionText.replace(/\n/g, '<br>');
        
        // ซ่อนหน้าโหลด โชว์หน้าผลลัพธ์
        document.getElementById('loading-state').classList.add('hidden');
        document.getElementById('prediction-state').classList.remove('hidden');

    } catch (error) {
        console.error("Error:", error);
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับจักรวาล (หมอแมนกำลังพักผ่อน) โปรดลองใหม่ภายหลัง");
        showScreen('screen-form'); // กลับไปหน้าฟอร์ม
    }
});
