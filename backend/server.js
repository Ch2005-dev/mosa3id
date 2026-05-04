const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();

// 1. إعداد الاتصال بقاعدة البيانات (تم تعديل الاسم بناءً على صورتك)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',     
    password: '',     
    database: 'mosa3idsignlog_db' // هذا الاسم يطابق صورتك تماماً
});

db.connect((err) => {
    if (err) {
        console.error('❌ فشل الاتصال بالمخزن: ' + err.message);
        return;
    }
    console.log('✅ تم الاتصال بقاعدة بيانات مساعد بنجاح!');
});

// 2. إعدادات السيرفر
app.use(express.static(__dirname));
app.use(express.json());           
app.use(express.urlencoded({ extended: true }));

// 3. روابط التنقل (Routes)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'mosa3idhome.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'signlogin.html')));
app.get('/addservices', (req, res) => res.sendFile(path.join(__dirname, 'addservices.html')));
app.get('/getservices', (req, res) => res.sendFile(path.join(__dirname, 'getservice.html')));

// 4. كود إنشاء حساب جديد (مع فحص دقيق للأخطاء)
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
   
    // مراقب للبيانات في الترمينال
    console.log("📥 محاولة تسجيل جديدة:", { username, email });

    const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(query, [username, email, password], (err, result) => {
        if (err) {
            console.error("❌ خطأ برمجبي في قاعدة البيانات:", err.sqlMessage);
            return res.status(500).send("فشل في الحفظ: " + err.sqlMessage);
        }
        console.log("✅ تمت إضافة البيانات إلى الجدول بنجاح!");
        res.send("تم إنشاء حسابك بنجاح!");
    });
});

// 5. كود تسجيل الدخول
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(query, [email, password], (err, results) => {
        if (err) return res.status(500).send("خطأ في السيرفر");
       
        if (results.length > 0) {
            res.send("تم تسجيل الدخول بنجاح! مرحباً بك في مساعد");
        } else {
            res.send("البريد أو كلمة المرور غير صحيحة");
        }
    });
});

// 6. تشغيل السيرفر
app.listen(3000, () => {
    console.log(`🚀 سيرفر مساعد يعمل الآن على http://localhost:3000`);
});