const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const crypto = require('crypto');
const { fork } = require('child_process');
const nodemailer = require('nodemailer');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 5000;

// === MA'LUMOTLAR BAZASI (SQLite) ===
const db = new sqlite3.Database(path.join(__dirname, 'prohair.db'));

db.serialize(() => {
    // PROHAIR 2027 va umumiy dastlabki arizalar
    db.run(`CREATE TABLE IF NOT EXISTS pre_registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        full_name TEXT,
        phone TEXT,
        email TEXT,
        country TEXT,
        role TEXT,
        comment TEXT,
        event TEXT DEFAULT 'PROHAIR 2027',
        status TEXT DEFAULT 'new'
    )`);

    // Sayt tashriflari analitikasi
    db.run(`CREATE TABLE IF NOT EXISTS analytics_pageviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT,
        date TEXT,
        path TEXT,
        referrer TEXT,
        device_type TEXT,
        browser TEXT,
        session_id TEXT
    )`);

    // Kongress arizalari (2026 va oldingi)
    db.run(`CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY,
        date TEXT,
        full_name TEXT,
        email TEXT,
        phone TEXT,
        country TEXT,
        address TEXT,
        subscription TEXT,
        price_usd TEXT,
        price_uzs INTEGER,
        payment_method TEXT,
        status TEXT DEFAULT 'new',
        payment_id TEXT,
        comment TEXT
    )`);
    
    // Kurs arizalari
    db.run(`CREATE TABLE IF NOT EXISTS course_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        name TEXT,
        phone TEXT,
        email TEXT,
        course TEXT,
        status TEXT DEFAULT 'new'
    )`);

    // Aloqa xabarlari
    db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        name TEXT,
        phone TEXT,
        email TEXT,
        message TEXT,
        status TEXT DEFAULT 'new'
    )`);

    // Assotsiatsiya a'zolari
    db.run(`CREATE TABLE IF NOT EXISTS association_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        full_name TEXT,
        phone TEXT,
        email TEXT,
        specialty TEXT,
        city TEXT,
        workplace TEXT,
        comment TEXT,
        status TEXT DEFAULT 'new'
    )`);

    // Migratsiyalar: Agar mavjud bazalarda status ustuni bo'lmasa
    db.run(`ALTER TABLE course_applications ADD COLUMN status TEXT DEFAULT 'new'`, () => {});
    db.run(`ALTER TABLE contact_messages ADD COLUMN status TEXT DEFAULT 'new'`, () => {});
    db.run(`ALTER TABLE association_members ADD COLUMN status TEXT DEFAULT 'new'`, () => {});
    db.run(`ALTER TABLE submissions ADD COLUMN status TEXT DEFAULT 'new'`, () => {});

    // Spikerlar, Hamkorlar, Jadval va FAQ
    db.run(`CREATE TABLE IF NOT EXISTS speakers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, role TEXT, image TEXT, label TEXT, description TEXT, sort_order INTEGER DEFAULT 0)`);
    db.run(`CREATE TABLE IF NOT EXISTS partners (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, image TEXT, type TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS pricing (id INTEGER PRIMARY KEY AUTOINCREMENT, tab_id TEXT, title TEXT, price TEXT, url TEXT, features TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS faqs (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT, answer TEXT, video_url TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS schedule_days (id INTEGER PRIMARY KEY, title TEXT, sort_order INTEGER)`);
    db.run(`CREATE TABLE IF NOT EXISTS schedule_events (id INTEGER PRIMARY KEY AUTOINCREMENT, day_id INTEGER, time TEXT, title TEXT, speaker TEXT, sub_events TEXT, sort_order INTEGER)`);
});

// === SOZLAMALAR ===
const settingsFile = path.join(__dirname, 'settings.json');
let settings = { 
    dollarRate: 12100, 
    adminUser: 'admin@prohair.uz',
    adminUsername: 'admin',
    adminPassword: 'prohair2027!',
    adminSecret: 'prohair_admin_secret_key_2027'
};
try {
    if (fs.existsSync(settingsFile)) {
        const fileSettings = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
        settings = { ...settings, ...fileSettings };
    }
} catch (e) {}

// === TOKEN GENERATSIYA VA TEKSHIRISH ===
function generateToken(username) {
    const secret = settings.adminSecret || 'prohair_admin_secret_key_2027';
    const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 kun
    const payload = `${username}:${expiry}`;
    const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return Buffer.from(`${payload}:${hash}`).toString('base64');
}

function verifyToken(token) {
    try {
        if (!token) return false;
        const secret = settings.adminSecret || 'prohair_admin_secret_key_2027';
        const decoded = Buffer.from(token, 'base64').toString('utf8');
        const [username, expiry, hash] = decoded.split(':');
        if (!username || !expiry || !hash) return false;
        if (Date.now() > Number(expiry)) return false;
        const expectedHash = crypto.createHmac('sha256', secret).update(`${username}:${expiry}`).digest('hex');
        return hash === expectedHash ? username : false;
    } catch {
        return false;
    }
}

function requireAdminAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : (req.query.token || req.headers['x-admin-token']);
    const user = verifyToken(token);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Avtorizatsiyadan o‘tilmagan yoki token eskirgan.' });
    }
    req.adminUser = user;
    next();
}

// === EMAIL VA TELEGRAM SOZLAMALARI ===
const EMAIL_CONFIG = {
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
        user: 'info@prohair.uz',
        pass: '~uycNwuKB3'
    }
};
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

const TELEGRAM_BOT_TOKEN = '8803100014:AAHK8VJq5LIa8SbqkiK2BWrglsj8siOaC_g';
const TELEGRAM_CHAT_ID = '-5392622711';

function sendTelegramNotification(text) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

    const data = JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: 'HTML'
    });

    const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    const req = https.request(options, (res) => {
        res.on('data', () => {});
    });

    req.on('error', (e) => {
        console.error('Telegram API error:', e.message);
    });

    req.write(data);
    req.end();
}

// === MIDDLEWARE ===
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Statik fayllar: Rasmlar va Brendlar
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(uploadsDir));

const prohairUploadsDir = path.join(__dirname, 'public', 'uploads');
if (fs.existsSync(prohairUploadsDir)) {
    app.use('/uploads', express.static(prohairUploadsDir));
}

const brandsDir = path.join(__dirname, 'public', 'brands');
if (fs.existsSync(brandsDir)) {
    app.use('/brands', express.static(brandsDir));
}

// Nitro build qilingan statik aktivlar (.output/public)
const nitroPublicDir = path.join(__dirname, '.output', 'public');
if (fs.existsSync(nitroPublicDir)) {
    app.use(express.static(nitroPublicDir, { maxAge: '7d' }));
}

// Favicon va logo statik marshrutlari
const prohairFaviconPng = path.join(__dirname, 'public', 'favicon.png');
app.get(['/favicon.png', '/favicon.ico', '/apple-touch-icon.png'], (req, res) => {
    if (fs.existsSync(prohairFaviconPng)) {
        res.setHeader('Content-Type', 'image/png');
        return res.sendFile(prohairFaviconPng);
    }
    res.status(404).end();
});

const prohairLogoSvg = path.join(__dirname, 'public', 'logo2222222222.svg');
app.get(['/logo2222222222.svg', '/logo.svg'], (req, res) => {
    if (fs.existsSync(prohairLogoSvg)) {
        res.setHeader('Content-Type', 'image/svg+xml');
        return res.sendFile(prohairLogoSvg);
    }
    res.status(404).end();
});

// === API ROUTELAR ===

// 1. Kongressga ro'yxatdan o'tish
app.post('/api/register', (req, res) => {
    const { fullName, phone, email, country, address, planTitle, priceUsd, priceUzs, comment } = req.body;

    if (!fullName || !phone) {
        return res.status(400).json({ success: false, message: 'Ism va telefon raqami kiritilishi shart.' });
    }

    const sub = {
        id: Date.now(),
        date: new Date().toISOString(),
        full_name: fullName,
        email: email || '',
        phone: phone,
        country: country || 'Узбекистан',
        address: address || '',
        subscription: planTitle || 'PROHAIR 2026',
        price_usd: String(priceUsd || '150'),
        price_uzs: priceUzs || Math.round(parseFloat(priceUsd || 150) * settings.dollarRate),
        payment_method: 'Application',
        status: 'Pending',
        payment_id: null,
        comment: comment || ''
    };

    db.run(
        `INSERT INTO submissions (id, date, full_name, email, phone, country, address, subscription, price_usd, price_uzs, payment_method, status, payment_id, comment) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [sub.id, sub.date, sub.full_name, sub.email, sub.phone, sub.country, sub.address, sub.subscription, sub.price_usd, sub.price_uzs, sub.payment_method, sub.status, sub.payment_id, sub.comment],
        (err) => {
            if (err) {
                console.error('DB Insert Error:', err);
                return res.status(500).json({ success: false, message: 'Bazaga yozishda xatolik yuz berdi.' });
            }

            // Telegram bot xabarnomasi
            const tgMsg = `
🆕 <b>ЯНГИ АРИЗА: PROHAIR 2026 КОНГРЕСС</b>
👤 <b>Исм:</b> ${sub.full_name}
📞 <b>Телефон:</b> ${sub.phone}
📧 <b>Email:</b> ${sub.email || '-'}
🌍 <b>Давлат:</b> ${sub.country}
📍 <b>Шаҳар / Манзил:</b> ${sub.address || '-'}

💳 <b>Тариф:</b> ${sub.subscription}
💵 <b>Нарх:</b> $${sub.price_usd} (≈ ${new Intl.NumberFormat('uz-UZ').format(sub.price_uzs)} сўм)
📝 <b>Изоҳ:</b> ${sub.comment || '-'}
⏰ <b>Вақт:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })}
`;
            sendTelegramNotification(tgMsg);

            // Email xabarnomasi
            if (sub.email) {
                transporter.sendMail({
                    from: '"PROHAIR CONGRESS" <info@prohair.uz>',
                    to: sub.email,
                    subject: 'Заявка на участие принята — PROHAIR 2026',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e0e5f2; border-radius: 16px; padding: 25px; background: #ffffff;">
                            <h2 style="color: #0b1162; margin-top: 0;">Здравствуйте, ${sub.full_name}!</h2>
                            <p style="color: #444; line-height: 1.6;">
                                Спасибо за регистрацию на <strong>II Международный конгресс PROHAIR 2026</strong> (4–5 сентября, Самарканд, Mövenpick Hotel).
                            </p>
                            <div style="background: #f4f7fe; padding: 15px; border-radius: 12px; margin: 20px 0;">
                                <p style="margin: 5px 0;"><strong>Выбранный тариф:</strong> ${sub.subscription}</p>
                                <p style="margin: 5px 0;"><strong>Стоимость:</strong> $${sub.price_usd}</p>
                                <p style="margin: 5px 0;"><strong>Ваш телефон:</strong> ${sub.phone}</p>
                            </div>
                            <p style="color: #666; font-size: 14px; line-height: 1.6;">
                                Наш оргкомитет свяжется с вами в ближайшее время для подтверждения участия.
                            </p>
                            <p style="color: #999; font-size: 12px; margin-top: 25px; border-top: 1px solid #eee; padding-top: 15px;">
                                Оргкомитет PROHAIR: +998 77 300 30 80 | info@prohair.uz
                            </p>
                        </div>
                    `
                }).catch((e) => console.error('Email confirmation error:', e.message));
            }

            res.json({ success: true, orderId: sub.id });
        }
    );
});

// 2. Kurslar va Ta'lim uchun ariza
app.post('/api/course-application', (req, res) => {
    const { name, phone, email, course } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ success: false, message: 'Ism va telefon raqami kiritilishi shart.' });
    }

    const date = new Date().toISOString();
    db.run(
        `INSERT INTO course_applications (date, name, phone, email, course) VALUES (?, ?, ?, ?, ?)`,
        [date, name, phone, email || '', course || ''],
        (err) => {
            if (err) console.error('Course DB Error:', err);

            const courseNames = {
                course: 'Практическая трихоскопия (Очный курс)',
                webinar: 'Клинические разборы O‘zSTTA (Вебинар)',
                lecture: 'Лекции по трихологии'
            };
            const courseTitle = courseNames[course] || course || 'Курс O‘zSTTA';

            const tgMsg = `
🎓 <b>ЯНГИ АРИЗА: ТАЪЛИМ / КУРС</b>
👤 <b>Исм:</b> ${name}
📞 <b>Телефон:</b> ${phone}
📧 <b>Email:</b> ${email || '-'}
📚 <b>Курс:</b> ${courseTitle}
⏰ <b>Вақт:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })}
`;
            sendTelegramNotification(tgMsg);

            res.json({ success: true });
        }
    );
});

// 3. Bog'lanish (Kontakt) shakli
app.post('/api/contact', (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ success: false, message: 'Ism va telefon raqami kiritilishi shart.' });
    }

    const date = new Date().toISOString();
    db.run(
        `INSERT INTO contact_messages (date, name, phone, email, message) VALUES (?, ?, ?, ?, ?)`,
        [date, name, phone, email || '', message || ''],
        (err) => {
            if (err) console.error('Contact DB Error:', err);

            const tgMsg = `
📩 <b>ЯНГИ МУРОЖААТ (КОНТАКТ ФОРМА)</b>
👤 <b>Исм:</b> ${name}
📞 <b>Телефон:</b> ${phone}
📧 <b>Email:</b> ${email || '-'}
💬 <b>Хабар:</b>
${message || '<i>Хабар ёзилмаган</i>'}
⏰ <b>Вақт:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })}
`;
            sendTelegramNotification(tgMsg);

            // Admin emailiga xabar nusxasi
            transporter.sendMail({
                from: '"PROHAIR Website" <info@prohair.uz>',
                to: 'info@prohair.uz',
                subject: `Новое обращение от ${name}`,
                html: `
                    <p><strong>Имя:</strong> ${name}</p>
                    <p><strong>Телефон:</strong> ${phone}</p>
                    <p><strong>Email:</strong> ${email || '-'}</p>
                    <p><strong>Сообщение:</strong><br>${message ? message.replace(/\n/g, '<br>') : '-'}</p>
                `
            }).catch(() => {});

            res.json({ success: true });
        }
    );
});

// 4. Assotsiatsiyaga a'zo bo'lish arizasi
app.post('/api/association-register', (req, res) => {
    const { fullName, phone, email, specialty, city, workplace, comment } = req.body;

    if (!fullName || !phone) {
        return res.status(400).json({ success: false, message: 'Ism va telefon raqami kiritilishi shart.' });
    }

    const date = new Date().toISOString();

    db.run(
        `INSERT INTO association_members (date, full_name, phone, email, specialty, city, workplace, comment)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [date, fullName, phone, email || '', specialty || '', city || '', workplace || '', comment || ''],
        function (err) {
            if (err) {
                console.error('Assotsiatsiya arizasini saqlashda xato:', err.message);
                return res.status(500).json({ success: false, message: 'Bazaga saqlashda xatolik yuz berdi.' });
            }

            const specialtyMap = {
                trichologist: 'Trixolog',
                dermatologist: 'Dermatovenerolog',
                cosmetologist: 'Shifokor-kosmetolog',
                surgeon: 'Soch transplantologi / Jarroh',
                clinic_head: 'Klinika rahbari',
                other: 'Boshqa'
            };
            const specLabel = specialtyMap[specialty] || specialty || 'Ko‘rsatilmagan';

            const tgMessage = 
`🏛 <b>ЯНГИ АССОЦИАЦИЯ АЪЗОЛИГИ УЧУН АРИЗА</b>
👤 <b>Ф.И.Ш:</b> ${fullName}
📞 <b>Телефон:</b> ${phone}
📧 <b>Email:</b> ${email || 'Кўрсатилмаган'}
🩺 <b>Мутахассислик:</b> ${specLabel}
🏙 <b>Шаҳар:</b> ${city || 'Кўрсатилмаган'}
🏥 <b>Иш жойи:</b> ${workplace || 'Кўрсатилмаган'}
💬 <b>Изоҳ:</b> ${comment || 'Йўқ'}
⏰ <b>Вақт:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })}`;

            sendTelegramNotification(tgMessage);

            if (email && email.includes('@')) {
                transporter.sendMail({
                    from: '"O‘zSTTA Assotsiatsiyasi" <info@prohair.uz>',
                    to: email,
                    subject: "O‘zSTTA assotsiatsiyasiga a'zo bo'lish arizasi qabul qilindi",
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                            <h2 style="color: #2b5329; margin-top: 0;">Hurmatli ${fullName}!</h2>
                            <p>O‘zSTTA — O‘zbekiston trixologiya assotsiatsiyasiga a'zo bo'lish uchun arizangiz muvaffaqiyatli qabul qilindi.</p>
                            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
                                <p style="margin: 5px 0;"><b>Telefon:</b> ${phone}</p>
                                <p style="margin: 5px 0;"><b>Mutaxassislik:</b> ${specLabel}</p>
                                <p style="margin: 5px 0;"><b>Ish joyi:</b> ${workplace || '-'}</p>
                            </div>
                            <p>Assotsiatsiya vakili tez orada siz bilan bog'lanib, a'zolikni tasdiqlash jarayoni bo'yicha ma'lumot beradi.</p>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                            <p style="font-size: 12px; color: #777;">O‘zSTTA Assotsiatsiyasi | info@prohair.uz | prohair.uz</p>
                        </div>
                    `
                }).catch(e => console.error('Email yuborish xatosi:', e.message));
            }

            res.json({ success: true });
        }
    );
});

// 5. Kontent API lari
app.get('/api/speakers', (req, res) => {
    db.all("SELECT * FROM speakers ORDER BY sort_order ASC, id ASC", (err, rows) => {
        if (err || !rows || rows.length === 0) {
            // Fallback to JSON if DB table is empty
            const jsonPath = path.join(__dirname, 'api', 'speakers.json');
            if (fs.existsSync(jsonPath)) {
                return res.sendFile(jsonPath);
            }
        }
        res.json(rows || []);
    });
});

app.get('/api/schedule', (req, res) => {
    db.all("SELECT * FROM schedule_days ORDER BY sort_order ASC", (err, days) => {
        if (err || !days || days.length === 0) {
            const jsonPath = path.join(__dirname, 'api', 'schedule_events.json');
            if (fs.existsSync(jsonPath)) return res.sendFile(jsonPath);
        }
        db.all("SELECT * FROM schedule_events ORDER BY day_id ASC, sort_order ASC", (err2, events) => {
            res.json({ days: days || [], events: events || [] });
        });
    });
});

app.get('/api/pricing', (req, res) => {
    db.all("SELECT * FROM pricing", (err, rows) => {
        if (err || !rows || rows.length === 0) {
            const jsonPath = path.join(__dirname, 'api', 'pricing.json');
            if (fs.existsSync(jsonPath)) return res.sendFile(jsonPath);
        }
        res.json(rows || []);
    });
});

app.get('/api/faqs', (req, res) => {
    db.all("SELECT * FROM faqs", (err, rows) => {
        if (err || !rows || rows.length === 0) {
            const jsonPath = path.join(__dirname, 'api', 'faqs.json');
            if (fs.existsSync(jsonPath)) return res.sendFile(jsonPath);
        }
        res.json(rows || []);
    });
});

app.get('/api/partners', (req, res) => {
    db.all("SELECT * FROM partners ORDER BY CASE WHEN type = 'general' THEN 0 ELSE 1 END, id ASC", (err, rows) => {
        if (err || !rows || rows.length === 0) {
            const jsonPath = path.join(__dirname, 'api', 'partners.json');
            if (fs.existsSync(jsonPath)) return res.sendFile(jsonPath);
        }
        res.json(rows || []);
    });
});

app.get('/api/get-rate', (req, res) => {
    res.json({ rate: settings.dollarRate || 12100 });
});

// 5. Arizalarni ko'rish API (zarur bo'lganda tekshirish uchun)
app.get('/api/submissions', (req, res) => {
    db.all("SELECT * FROM submissions ORDER BY id DESC", (err, rows) => {
        res.json(rows || []);
    });
});

// 6. Dastlabki ro'yxatdan o'tish (PROHAIR 2027 va boshqa tadbirlar)
app.post('/api/pre-register', (req, res) => {
    const { fullName, phone, email, country, role, comment, event } = req.body;

    if (!fullName || !phone) {
        return res.status(400).json({ success: false, message: 'Ism va telefon raqami kiritilishi shart.' });
    }

    const date = new Date().toISOString();
    const eventName = event || 'PROHAIR 2027';

    db.run(
        `INSERT INTO pre_registrations (date, full_name, phone, email, country, role, comment, event, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')`,
        [date, fullName, phone, email || '', country || 'Узбекистан', role || 'Врач', comment || '', eventName],
        function (err) {
            if (err) {
                console.error('Pre-register DB error:', err);
                return res.status(500).json({ success: false, message: 'Bazaga yozishda xatolik yuz berdi.' });
            }

            const tgMsg = `
🌟 <b>ЯНГИ ДАСТЛАБКИ АРИЗА: ${eventName}</b>
👤 <b>Исм:</b> ${fullName}
📞 <b>Телефон:</b> ${phone}
📧 <b>Email:</b> ${email || '-'}
🌍 <b>Давлат:</b> ${country || 'Узбекистан'}
💼 <b>Йўналиш:</b> ${role || 'Врач'}
📝 <b>Изоҳ:</b> ${comment || '-'}
⏰ <b>Вақт:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })}
`;
            sendTelegramNotification(tgMsg);

            res.json({ success: true, id: this.lastID });
        }
    );
});

// 7. Sayt tashriflarini qayd qilish (Analitika)
app.post('/api/analytics/track', (req, res) => {
    const { path: pagePath, referrer, deviceType, browser, sessionId } = req.body;
    if (!pagePath || pagePath.startsWith('/admin') || pagePath.startsWith('/api')) {
        return res.json({ success: true });
    }

    const now = new Date();
    const timestamp = now.toISOString();
    const dateStr = now.toISOString().split('T')[0];
    const cleanPath = pagePath.split('?')[0] || '/';

    db.run(
        `INSERT INTO analytics_pageviews (timestamp, date, path, referrer, device_type, browser, session_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [timestamp, dateStr, cleanPath, referrer || 'Direct', deviceType || 'desktop', browser || 'Other', sessionId || 'anon'],
        (err) => {
            if (err) console.error('Analytics track error:', err.message);
            res.json({ success: true });
        }
    );
});

// === ADMIN AUTENTIFIKATSIYA ===
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    const validUsers = [settings.adminUsername, settings.adminUser, 'admin'].filter(Boolean);
    const validPasses = [settings.adminPassword, settings.adminCode, 'prohair2027!'].filter(Boolean);

    if (validUsers.includes(username) && validPasses.includes(password)) {
        const token = generateToken(username);
        return res.json({ success: true, token, user: { username } });
    }

    return res.status(401).json({ success: false, message: 'Login yoki parol noto‘g‘ri.' });
});

app.get('/api/admin/verify', requireAdminAuth, (req, res) => {
    res.json({ success: true, user: { username: req.adminUser } });
});

app.post('/api/admin/change-password', requireAdminAuth, (req, res) => {
    const { oldPassword, newUsername, newPassword } = req.body;
    const currentPass = settings.adminPassword || 'prohair2027!';
    const validOldPasses = [currentPass, settings.adminCode].filter(Boolean);

    if (!validOldPasses.includes(oldPassword)) {
        return res.status(400).json({ success: false, message: 'Eski parol noto‘g‘ri.' });
    }

    if (newUsername && newUsername.trim()) settings.adminUsername = newUsername.trim();
    if (newPassword && newPassword.length >= 6) settings.adminPassword = newPassword.trim();

    try {
        fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf8');
        res.json({ success: true, message: 'Admin ma‘lumotlari muvaffaqiyatli yangilandi.' });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Sozlamalarni saqlashda xatolik.' });
    }
});

// === ADMIN ARIZALAR BOSHQARUVI ===
app.get('/api/admin/applications', requireAdminAuth, (req, res) => {
    const { type, status, search } = req.query;

    const queries = [
        // 1. pre_registrations (PROHAIR 2027)
        new Promise((resolve) => {
            db.all("SELECT id, date, full_name, phone, email, country, role, comment, event, COALESCE(status, 'new') as status, 'pre_registration' as type FROM pre_registrations", (err, rows) => resolve(rows || []));
        }),
        // 2. association_members
        new Promise((resolve) => {
            db.all("SELECT id, date, full_name, phone, email, city as country, specialty as role, comment, workplace, COALESCE(status, 'new') as status, 'association' as type FROM association_members", (err, rows) => resolve(rows || []));
        }),
        // 3. course_applications
        new Promise((resolve) => {
            db.all("SELECT id, date, name as full_name, phone, email, '' as country, course as role, '' as comment, '' as workplace, COALESCE(status, 'new') as status, 'course' as type FROM course_applications", (err, rows) => resolve(rows || []));
        }),
        // 4. contact_messages
        new Promise((resolve) => {
            db.all("SELECT id, date, name as full_name, phone, email, '' as country, 'Aloqa' as role, message as comment, '' as workplace, COALESCE(status, 'new') as status, 'contact' as type FROM contact_messages", (err, rows) => resolve(rows || []));
        }),
        // 5. submissions (Kongress 2026)
        new Promise((resolve) => {
            db.all("SELECT id, date, full_name, phone, email, country, subscription as role, comment, price_usd, price_uzs, COALESCE(status, 'new') as status, 'submission_2026' as type FROM submissions", (err, rows) => resolve(rows || []));
        })
    ];

    Promise.all(queries).then(([preRegs, assoc, courses, contacts, subs]) => {
        let all = [...preRegs, ...assoc, ...courses, ...contacts, ...subs];

        if (type && type !== 'all') {
            all = all.filter(item => item.type === type);
        }

        if (status && status !== 'all') {
            all = all.filter(item => item.status === status);
        }

        if (search && search.trim()) {
            const q = search.toLowerCase().trim();
            all = all.filter(item => 
                (item.full_name && item.full_name.toLowerCase().includes(q)) ||
                (item.phone && item.phone.toLowerCase().includes(q)) ||
                (item.email && item.email.toLowerCase().includes(q)) ||
                (item.role && item.role.toLowerCase().includes(q)) ||
                (item.country && item.country.toLowerCase().includes(q))
            );
        }

        all.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

        res.json({
            success: true,
            total: all.length,
            counts: {
                all: preRegs.length + assoc.length + courses.length + contacts.length + subs.length,
                pre_registration: preRegs.length,
                association: assoc.length,
                course: courses.length,
                contact: contacts.length,
                submission_2026: subs.length,
            },
            data: all
        });
    }).catch(err => {
        console.error('Applications error:', err);
        res.status(500).json({ success: false, message: 'Arizalarni yuklashda xatolik yuz berdi.' });
    });
});

app.patch('/api/admin/applications/:type/:id/status', requireAdminAuth, (req, res) => {
    const { type, id } = req.params;
    const { status } = req.body;

    const tableMap = {
        pre_registration: 'pre_registrations',
        association: 'association_members',
        course: 'course_applications',
        contact: 'contact_messages',
        submission_2026: 'submissions'
    };

    const tableName = tableMap[type];
    if (!tableName) return res.status(400).json({ success: false, message: 'Noto‘g‘ri ariza turi.' });

    db.run(`UPDATE ${tableName} SET status = ? WHERE id = ?`, [status, id], function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Status yangilandi.' });
    });
});

app.delete('/api/admin/applications/:type/:id', requireAdminAuth, (req, res) => {
    const { type, id } = req.params;
    const tableMap = {
        pre_registration: 'pre_registrations',
        association: 'association_members',
        course: 'course_applications',
        contact: 'contact_messages',
        submission_2026: 'submissions'
    };

    const tableName = tableMap[type];
    if (!tableName) return res.status(400).json({ success: false, message: 'Noto‘g‘ri ariza turi.' });

    db.run(`DELETE FROM ${tableName} WHERE id = ?`, [id], function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Ariza o‘chirildi.' });
    });
});

// === ADMIN ANALITIKA BOSHQARUVI ===
app.get('/api/admin/analytics/overview', requireAdminAuth, (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    
    db.get("SELECT COUNT(*) as total_views, COUNT(DISTINCT session_id) as total_unique FROM analytics_pageviews", (err, total) => {
        db.get("SELECT COUNT(*) as today_views, COUNT(DISTINCT session_id) as today_unique FROM analytics_pageviews WHERE date = ?", [today], (err2, todayStats) => {
            res.json({
                success: true,
                totalViews: total ? total.total_views : 0,
                totalUnique: total ? total.total_unique : 0,
                todayViews: todayStats ? todayStats.today_views : 0,
                todayUnique: todayStats ? todayStats.today_unique : 0,
            });
        });
    });
});

app.get('/api/admin/analytics/daily', requireAdminAuth, (req, res) => {
    const days = parseInt(req.query.days) || 14;
    
    db.all(`
        SELECT date, COUNT(*) as views, COUNT(DISTINCT session_id) as visitors
        FROM analytics_pageviews
        WHERE date >= date('now', '-' || ? || ' days')
        GROUP BY date
        ORDER BY date ASC
    `, [days], (err, rows) => {
        res.json({ success: true, data: rows || [] });
    });
});

app.get('/api/admin/analytics/pages', requireAdminAuth, (req, res) => {
    db.all(`
        SELECT path, COUNT(*) as views, COUNT(DISTINCT session_id) as visitors
        FROM analytics_pageviews
        GROUP BY path
        ORDER BY views DESC
        LIMIT 10
    `, (err, rows) => {
        res.json({ success: true, data: rows || [] });
    });
});

app.get('/api/admin/analytics/devices', requireAdminAuth, (req, res) => {
    db.all(`
        SELECT COALESCE(device_type, 'desktop') as name, COUNT(*) as value
        FROM analytics_pageviews
        GROUP BY device_type
    `, (err, devices) => {
        db.all(`
            SELECT COALESCE(browser, 'Other') as name, COUNT(*) as value
            FROM analytics_pageviews
            GROUP BY browser
            ORDER BY value DESC
            LIMIT 5
        `, (err2, browsers) => {
            res.json({ success: true, devices: devices || [], browsers: browsers || [] });
        });
    });
});

app.get('/api/admin/analytics/sources', requireAdminAuth, (req, res) => {
    db.all(`
        SELECT 
            CASE 
                WHEN referrer LIKE '%t.me%' OR referrer LIKE '%telegram%' THEN 'Telegram'
                WHEN referrer LIKE '%instagram%' THEN 'Instagram'
                WHEN referrer LIKE '%google%' THEN 'Google'
                WHEN referrer LIKE '%yandex%' THEN 'Yandex'
                WHEN referrer = 'Direct' OR referrer = '' OR referrer IS NULL THEN 'To‘g‘ridan-to‘g‘ri (Direct)'
                ELSE 'Boshqa saytlar'
            END as source,
            COUNT(*) as count
        FROM analytics_pageviews
        GROUP BY source
        ORDER BY count DESC
    `, (err, rows) => {
        res.json({ success: true, data: rows || [] });
    });
});

// === NITRO SSR VA SAHIFA MARSHRUTIZATSIYASI ===
const NITRO_PORT = process.env.NITRO_PORT || (Number(PORT) === 5000 ? 5055 : (Number(PORT) + 50));
const nitroServerEntry = path.join(__dirname, '.output', 'server', 'index.mjs');
let nitroChild = null;

function killProcessOnPort(port) {
    try {
        const { execSync } = require('child_process');
        if (process.platform === 'linux' || process.platform === 'darwin') {
            const pids = execSync(`lsof -t -i:${port} 2>/dev/null`).toString().trim();
            if (pids) {
                const pidList = pids.split(/\s+/).filter(p => p && p !== String(process.pid));
                if (pidList.length > 0) {
                    console.log(`[Nitro SSR] Port ${port} dagi eski jarayonlar to'xtatilmoqda (PID: ${pidList.join(', ')})`);
                    execSync(`kill -9 ${pidList.join(' ')} 2>/dev/null || true`);
                }
            }
        }
    } catch (e) {}
}

function startNitroServer() {
    if (!fs.existsSync(nitroServerEntry)) {
        console.warn('[Nitro SSR] Server fayli hali topilmadi. Avval prohair-new da build qiling.');
        return;
    }

    if (nitroChild) {
        nitroChild.removeAllListeners('exit');
        try { nitroChild.kill('SIGKILL'); } catch (e) {}
        nitroChild = null;
    }
    killProcessOnPort(NITRO_PORT);

    try {
        nitroChild = fork(nitroServerEntry, [], {
            env: {
                ...process.env,
                PORT: String(NITRO_PORT),
                HOST: '127.0.0.1'
            },
            stdio: 'inherit'
        });
        console.log(`[Nitro SSR] Jarayon ishga tushirildi: port ${NITRO_PORT}`);

        nitroChild.on('exit', (code) => {
            console.warn(`[Nitro SSR] Jarayon to'xtadi (kod: ${code}). 3 soniyadan so'ng qayta ishga tushiriladi...`);
            setTimeout(startNitroServer, 3000);
        });
    } catch (err) {
        console.error('[Nitro SSR] Xatolik:', err.message);
    }
}

// Jarayonni toza tugatish
function cleanExit() {
    if (nitroChild) {
        nitroChild.removeAllListeners('exit');
        try { nitroChild.kill('SIGKILL'); } catch (e) {}
        nitroChild = null;
    }
    killProcessOnPort(NITRO_PORT);
}

process.on('exit', cleanExit);
process.on('SIGINT', () => {
    cleanExit();
    process.exit(0);
});
process.on('SIGTERM', () => {
    cleanExit();
    process.exit(0);
});

// Barcha sahifalarni Nitro SSR orqali ochish (Express 5 moslik)
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'Bunday API mavjud emas' });
    }

    const options = {
        hostname: '127.0.0.1',
        port: NITRO_PORT,
        path: req.originalUrl || req.url,
        method: req.method,
        headers: {
            ...req.headers,
            host: `127.0.0.1:${NITRO_PORT}`,
            'x-forwarded-host': req.headers.host || `localhost:${PORT}`,
            'x-forwarded-proto': req.protocol
        }
    };

    const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
        // Zaxira: Agar Nitro hali tayyor bo'lmasa
        const oldIndexPath = path.join(__dirname, '.output', 'public', 'index.html');
        if (fs.existsSync(oldIndexPath)) {
            return res.sendFile(oldIndexPath);
        }
        res.status(502).send('Sayt yuklanmoqda... Iltimos, bir ozdan so‘ng yangilang.');
    });

    if (req.body && Object.keys(req.body).length > 0 && req.method !== 'GET' && req.method !== 'HEAD') {
        const bodyData = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
        proxyReq.end();
    } else {
        req.pipe(proxyReq, { end: true });
    }
});

// Serverni tinglash
app.listen(PORT, '0.0.0.0', () => {
    console.log(`========================================`);
    console.log(`PROHAIR server ishga tushdi: port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    console.log(`========================================`);
    
    // Nitro SSR serverini ishga tushiramiz
    startNitroServer();
});
